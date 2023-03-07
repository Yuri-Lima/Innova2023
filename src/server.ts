require("dotenv").config();
// import fs from 'node:fs';
// import path from 'node:path';
// import https from 'node:https';
import http from 'node:http';
import cluster from 'node:cluster';

/**
 * Third party modules
 */
import { Application } from 'express';

/**
 * @see https://socket.io/docs/v4/cluster-adapter/
 * By running Socket.IO with the @socket.io/redis-adapter adapter you can run multiple Socket.IO instances in different processes or servers that can all broadcast and emit events to and from each other.
 */
import { createClient } from 'redis';
import { Server as SocketIO } from 'socket.io';
// // import { createAdapter } from '@socket.io/cluster-adapter';
// import { createAdapter  } from '@socket.io/redis-adapter';

/**
 * Own modules
 */
import App from './app';
import socket from './workers/socket';
import log from './Utils/logger';

// CORS allowed origins (comma separated) from env
const CORS_ALLOWEDORIGINS:Array<string> = process.env.CORS_ALLOWEDORIGINS.split(',') || '';

class Server {
    private app: Application;
    private port: number;
    private host: string;
    private httpServer: http.Server;
    public io!: SocketIO;
    public redis!: typeof createClient;

    constructor() {
        this.app = App.app;
        this.port = Number(process.env.PORT);
        this.host = process.env.LOCALHOST || '0.0.0.0';
        this.httpServer = http.createServer(this.app);
        this.StartSocketIO();
    }

    /**
     * Description: Create a socket.io instance and attach it to the http server instance.
     * @param _httpServer - http server instance
     */
    public StartSocketIO(_httpServer: http.Server = this.httpServer) {
        const io = new SocketIO(_httpServer,
            {
                cors: {
                    origin: CORS_ALLOWEDORIGINS,
                    methods: ["GET", "POST"],
                }
            }
        );
        socket({io});
        // const pubClient = createClient({ 
        //     url: `${process.env.REDIS_URL}:${process.env.REDIS_PORT}`,
        //     password: process.env.REDIS_PASSWORD,
        //     username: process.env.REDIS_USERNAME,
        //     name: process.env.REDIS_NAME
        // });
        // const subClient = pubClient.duplicate();
        // Promise.all([pubClient.connect(), subClient.connect()]).then(() => {
        //     io.adapter(createAdapter(pubClient, subClient));
        //     io.listen(3005)
        // });
        return this.io = io;
    }

    /**
     * Start server
     * @param internalCluster - If true, the server will be started with 2 cluster. If false, the server will be started as a single process
     */
    public Start(internalCluster: boolean = false) {
        this.app.set("port", this.port);
        this.app.set("host", this.host);
        if (internalCluster) {
            if (cluster.isPrimary) {
                for (let i = 0; i < 2; i++) {
                    cluster.fork();
                    console.log(`Worker ${i} started`);
                }
                cluster.on("exit", (worker, code, signal) => {
                    console.log(`worker ${worker.process.pid} died with code ${code} and signal ${signal}`);
                });
                cluster.on("online", (worker) => {
                    console.log(`worker ${worker.process.pid} is online`);
                });
            } else {
                this.httpServer.listen(this.port, () => {
                    console.log(`Server on port ${this.port}`);
                });
            }
        } else {
            this.httpServer.listen(this.port, this.host, () => {
                log.info(`Server on port ${this.port}`);
                // console.log(`Server on port ${this.port}`);
                /**
                 * Used by Pm2 to notify that the server is ready.
                 * @see https://pm2.keymetrics.io/docs/usage/signals-clean-restart/
                 * @see https://pm2.keymetrics.io/docs/usage/signals-clean-restart/#list-of-signals
                 */
                process.send?.("ready");
            }).on("error", (error:any) => {
                console.error("Server Error: ", error);
            });
        }
        
    }

    public stop() {
        this.httpServer.close();
    }

    public getHttpServer() {
        return this.httpServer;
    }
}

/**
 * Create a server instance
 */
const server = new Server();

/**
 * Starts the server
 */
server.Start(false);

/**
 * Exports the server instance
 */
export {
    server
}