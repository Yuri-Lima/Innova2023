import 'express'

/* eslint-disable no-var */
declare global {
    namespace Express {
        interface Request {
            rabbitMQ: import('../services/rabbitMQ').default
        }
        interface Response {
            rabbitMQ: import('../services/rabbitMQ').default
        }
        interface Application {
            rabbitMQ: import('../services/rabbitMQ').default
        }
    }
    namespace NodeJS {
        type Envs = import('./envs').default
        interface ProcessEnv extends Envs {} // extends process.env
    }
    var rabbitMQ: import('../services/rabbitMQ').default // global variable
    // var spreadSheet: import('../services/spreadSheet').default // global variable
    var io: import('socket.io').Server // global variable
}

export {};