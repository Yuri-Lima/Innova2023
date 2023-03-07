require("dotenv").config();
import express from 'express';
import { Headers } from '../../types/headers';

/**
 *  Check if the request is just a test webhook
 *  Check if the request is a valid order
 *  Check if the request has a valid signature
 */
async function ordersVerify(req: express.Request, _res: express.Response, next: express.NextFunction) {
    if(req.body['webhook_id']){ // if it's a test webhook
        console.debug('Webhook ID: ' + req.body['webhook_id']);
        return _res.status(200).send(); // Webhook ID

    } else if(req.headers['x-wc-webhook-resource'] === 'order'){
        const headers:Headers = {
            'endpoint': req.headers['referer'],
            'ip': <string>req.headers['x-forwarded-for'] || req.connection.remoteAddress,
            'event': <string>req.headers['x-wc-webhook-event'],
            'resource': <string>req.headers['x-wc-webhook-resource'],
            'id': <string>req.headers['x-wc-webhook-id'],
            'topic': <string>req.headers['x-wc-webhook-topic'],
            'signature': <string>req.headers['x-wc-webhook-signature'],
            'source': <string>req.headers['x-wc-webhook-source'],
        }
        req.headers = headers; // set headers to simplify access

        if(<string>headers.signature){
            next();
        }
        else {
            console.error('Signature is not valid');
            return _res.status(201).json({
                status: 201,
                message: 'Signature is not valid',
                error: true,
                data: headers
            });
        }
    } else {
        console.error('Invalid resource', req.headers['x-wc-webhook-resource']);
        return _res.status(201).json({
            status: 201,
            message: 'Invalid resource',
            error: true,
            data: req.headers['x-wc-webhook-resource']
        });
    }
}

export default ordersVerify;