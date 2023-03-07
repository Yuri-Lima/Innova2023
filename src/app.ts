/**
 * Dotenv
 */
require("dotenv").config();

/**
 * Node modules
 */
import path from "node:path";

/**
 *  third party modules
 */
import helmet from 'helmet';
import cors from "cors";
import express from "express";
import cookieSession from "cookie-session";
import passport from "passport";

/**
 * Services
 */
import { mongoConnection, mongoDisconnection } from "./services/mongo";
import RabbitmqServer from "./services/rabbitMQ";
import spreadSheet from "./services/spreadSheet";

/**
 * Routes
 */
import indexRoutes from "./routes/index.routes";
import checkLoggedIn from "./middlewares/checkLoggedIn";
import errorHandler from "./middlewares/errorHandler";
import log from "./Utils/logger";

/**
 * Other
 */
import { accessControlAllow } from "./middlewares/access.control.allow";
import deserializeUser from "./middlewares/user.deserialize";
import { getUatizeDB, startEachClientUatiz } from "./services/create.client.uatiz";

class App {

    public app: express.Application; // express application
    public rabbitMQ!: RabbitmqServer; // rabbitMQ instance

    constructor() {
        this.app = express();
        this.SetAppConfig();
        this.Middleware(passport);
        this.Routes();
        (async () => {
            await this.MongoConnection();
            // await this.SpreadSheetConnection();
            await this.RabbitMQConnection();
            await this.UatizeConnection();
        })();
        // this.MongoConnection();
        // this.MongoDisconnection();
        // this.RabbitMQConnection();
        // this.SpreadSheetConnection();
        // this.UatizeConnection();
    }

    SetAppConfig(): void {
        this.app.set('port', process.env.PORT);
        this.app.set("CLIENT_ID", process.env.CLIENT_ID || '');
        this.app.set("CLIENT_SECRET", process.env.CLIENT_SECRET || '');
        this.app.set("COOKIE_SESSION_KEY_0", process.env.COOKIE_SESSION_KEY_0 || '');
        this.app.set("COOKIE_SESSION_KEY_1", process.env.COOKIE_SESSION_KEY_1 || '');
        this.app.set("CORS_ALLOWEDORIGINS", process.env.CORS_ALLOWEDORIGINS || '');
        this.app.set("AUTH_GOOGLE_CLIENT_ID", process.env.AUTH_GOOGLE_CLIENT_ID || '');
        this.app.set("AUTH_GOOGLE_CLIENT_SECRET", process.env.AUTH_GOOGLE_CLIENT_SECRET || '');
        this.app.set("AUTH_GOOGLE_REDIRECT_URI", process.env.AUTH_GOOGLE_REDIRECT_URI || 'http://localhost:8080/auth/google/callback');
        log.info(`setAppConfig DONE!`)
    }

    Middleware(passport: passport.Authenticator): void {

        /**
         * Save the session to the cookie
         */
        passport.serializeUser((user:any, done) => {
            const { _json } = user; // Just to minimize the data stored in the cookie.
            done(null, _json);
        });

        /**
         * Read the session from the cookie
         */
        passport.deserializeUser((obj: any, done) => {
            done(null, obj);
        });

        // Cors middleware
        const whitelist = this.app.get("CORS_ALLOWEDORIGINS").split(",");
        this.app.use(cors(
            {
                preflightContinue: true, // it means that the server accepts preflight requests
                origin: whitelist,
                allowedHeaders:['Access', 'Content-Type', 'Authorization', 'Acept', 'Origin', 'X-Requested-With', 'XMLHttpRequest'],
                methods:['GET','POST','DELETE','UPDATE','PUT','PATCH', 'OPTIONS'],
                // credentials: true, // it means that the server accepts cookies from the client
                optionsSuccessStatus: 204 // some legacy browsers (IE11, various SmartTVs) choke on 204
            }
        ));

        // Helmet middleware
        this.app.use(
            helmet({
                contentSecurityPolicy: false,
                crossOriginEmbedderPolicy: false,
                crossOriginOpenerPolicy: false,
                crossOriginResourcePolicy: false,
                dnsPrefetchControl: false,
                expectCt: false,
                frameguard: true,
                hidePoweredBy: true,
                hsts: true,
                ieNoOpen: false,
                noSniff: true,
                originAgentCluster: true,
                permittedCrossDomainPolicies: false,
                referrerPolicy: true,
                xssFilter: false
            })
        );

        /**
         * Cookie Session
         * It has to be before the passport middleware
         */
        this.app.use(cookieSession({
            name: "session",
            keys: [this.app.get("COOKIE_SESSION_KEY_0"), this.app.get("COOKIE_SESSION_KEY_1")],
            maxAge: 24 * 60 * 60 * 1000, // 24 hours
        }));

        /**
         * This is a temporary fix for the Passport session issue
         * It has to be after the cookieSession middleware
         * @see https://github.com/jaredhanson/passport/issues/904
         * @see https://github.com/rkusa/koa-passport/pull/187
         */
        // register regenerate & save after the cookieSession middleware initialization
        this.app.use(function(request, _response, next) {
            if (request.session && !request.session.regenerate) {
                request.session.regenerate = (cb:any) => {
                    cb()
                }
            }
            if (request.session && !request.session.save) {
                request.session.save = (cb:any) => {
                    cb()
                }
            }
            next()
        })

        // Passport middleware
        this.app.use(passport.initialize()); // initialize passport
        this.app.use(passport.session()); // persistent login sessions (passport needs this) req.user is available

        // Json Accept middleware
        this.app.use(express.json({
            limit: "50mb", // Limit the size of the request body
        }));
        this.app.use(express.urlencoded({
            extended: false, // Parse URL-encoded bodies
            limit: "100mb", // Limit the size of the request body
        }));

        // Access Control Allow middleware
        this.app.use(accessControlAllow)

        // Deserialize User middleware
        this.app.use(deserializeUser)
        // Static Files middleware
        this.app.use(express.static(path.join(__dirname, "..", "public")));

        // React App middleware
        this.app.use(express.static(path.join(__dirname, "..", "..", "..", "client", "build")));
        // console.log(path.join(__dirname, "..", "..", "..", "client", "build", "index.html"))

        log.info(`middleware DONE!`)
    }

    async MongoConnection(): Promise<any> {
        const conn = await mongoConnection();
        return conn;
    }

    async MongoDisconnection(): Promise<any> {
        await mongoDisconnection();
    }

    async RabbitMQConnection(): Promise<any> {
        try {
            const rabbitMQI = new RabbitmqServer({
                uri: process.env.AMQP_URI || "amqp://localhost:5672",
            });
            this.app.rabbitMQ = rabbitMQI; // App rabbitMQ instance
            global.rabbitMQ = rabbitMQI; // Global rabbitMQ instance
            this.rabbitMQ = rabbitMQI;
            await this.rabbitMQ.start();
            return this.rabbitMQ; // Return rabbitMQ instance
        } catch (error:any) {
            error.source = "RabbitMQConnection"; // Add source to error
            throw new Error(error);
        }
    }

    async SpreadSheetConnection(): Promise<any> {
        try {
                const auth = await spreadSheet.getAuthorize();
                const array =  await spreadSheet.readSheet({
                    spreadsheetId: process.env.WC_SPREADSHEET_0_ID || "",
                    sheetNameRange: process.env.WC_SPREADSHEET_0_NAME || "",
                    majorDimension: process.env.WC_SPREADSHEET_0_MAJOR_DIMENSION || "",
                    auth,
                    valueRenderOption: process.env.WC_SPREADSHEET_0_VALUERENDEROPTION || "",
                });
                console.log(array);
                console.log("Spread Sheet is OK", auth?.scope);
                // global.spreadSheet = auth; // Global spreadSheet instance
                return auth;
        } catch (error:any) {
            error.source = "SpreadSheetConnection"; // Add source to error
            throw new Error(error);
        }
    }

    async UatizeConnection(): Promise<any> {    
        const uatizDB = await getUatizeDB();
        if (uatizDB.length === 0) {
            throw new Error("Uatize DB is empty");
        }
        const clients = await Promise.all([startEachClientUatiz(uatizDB)]);
        log.info(clients, "Uatize clients");
        // log.info(clients[0].find((client:any) => client.id === "number2"), "Uatize client");
        log.info(`UatizeConnection DONE!`)
    }

    Routes(): void {
        /**
         * React App routes
         */
        this.app.get("/", (_req, res) => {
            log.info(path.join(__dirname, "..", "client", "build", "index.html"), "React App routes");
            res.sendFile(path.join(__dirname, "..", "..", "..", "client", "build", "index.html"));
        });
        /**
         * Woocommerce API routes
         */
        this.app.use("/api", indexRoutes);

        /**
         * Catch all other routes and return the index file
         */
        this.app.get("/secret", checkLoggedIn,  (_req, res) => {
            console.log(path.join(__dirname, "..", "..", "src", "public", "html", "index.html"));
            res.sendFile(path.join(__dirname, "..", "..", "src", "public", "html", "index.html"));
        });
        /**
         * Login route for Google oAuth2
         */
        this.app.get("/wc/login", (_req, res) => {
            res.sendFile(path.join(__dirname, "..", "..", "src", "public", "html", "login.html"));
        });

        /**
         * Error handler
         */
        this.app.use(errorHandler);

        log.info(`routes DONE!`)
    }
}

export default new App();