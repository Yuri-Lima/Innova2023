import cluster from 'cluster';
import express from 'express';
import { randomUUID } from 'node:crypto';
import { OrdersModel } from '../../db/models/wc.orders.model';
// import fs from 'fs';
// import app from '../app';

/**
 * Description: This is the code to save the order created in the database.
 * @param _req Request
 * @param res Response
 * @returns response
 */
async function httpPublishOrderCreated(_req: express.Request, res: express.Response): Promise<express.Response | void> {
    const responseId = randomUUID();
    try {
        const orderData =  await OrdersModel.create({ orderCreated: _req.body });

        if (orderData === null) {
            console.error("httpPublishOrderCreated: ", "Error save order");
            return res.status(400).json({
                message: 'Error saving order Message',
                type: "critical",
                responseId
            });
        }
        // For testing purposes creates a sample file with the order data
        // fs.writeFileSync("orderCreatedForbidden.json", JSON.stringify(_req.body, null, 4));
        console.log("httpPublishOrderCreated: ", "Order created saved");
        console.log("Cluster ID Created: ", cluster.worker?.id);
        return res.status(200).json({message: "Order saved", responseId});
    } catch (error:any) {
        console.error("http_Order_Created: ", error.message);
        res.status(201).json({error: error.message, responseId})
    }
}

/**
 * Description: This is the code to save the order updated in the database.
 * @param _req Request
 * @param res Response
 * @returns response
 */
async function httpPublishOrderUpdated(_req: express.Request, res: express.Response): Promise<express.Response | void> {
    const responseId = randomUUID();
    try {
        const orderData =  await OrdersModel.create({ orderUpdated: _req.body });

        if (orderData === null) {
            console.error("httpPublishOrderUpdated: ", "Error save order");
            return res.status(400).json({
                message: 'Error saving order Message',
                type: "critical",
                responseId
            });
        }
        // For testing purposes creates a sample file with the order data
        // fs.writeFileSync("orderUpdated.json", JSON.stringify(_req.body, null, 4));
        console.log("http_Order_Updated: ", "Order updated saved");
        console.log("Cluster ID Updated: ", cluster.worker?.id);
        return res.status(200).json({message: "Order updated", responseId});
    } catch (error:any) {
        console.error("http_Order_Updated: ", error.message);
        return res.status(201).json({error: error.message, responseId})
    }
}

/**
 * Description: Get all the orders sent by WooCommerce Webhook from the database.
 * @param _req Request
 * @param res Response
 * @returns response
 */
async function httpGetOrderCreated(_req: express.Request, res: express.Response): Promise<express.Response | void> {
    const responseId = randomUUID();
    try {
        const orderData =  await OrdersModel.find(
            { orderCreated: { $exists : true } },
        );

        if (orderData === null) {
            console.error("httpGetOrderCreated: ", "Error get order or tehre are no orders");
            return res.status(400).json({
                message: 'Error getting order Message or tehre are no orders',
                responseId
            });
        }
        console.log("httpGetOrderCreated: ", "Order created getted");
        console.log("Cluster ID Created: ", cluster.worker?.id);
        return res.status(200).json({orderData, responseId});
    } catch (error:any) {
        console.error("httpGetOrderCreated: ", error.message);
        return res.status(201).json({error: error.message, responseId})
    }
}

/**
 * Description: Delete all the orders sent by WooCommerce Webhook from the database.
 */
async function httpDeleteOrderCreated(_req: express.Request, res: express.Response): Promise<express.Response | void> {
    const responseId = randomUUID();
    try {
        let orderData = null;
        if(_req.params.msg_id !== undefined || _req.query.msg_id !== undefined) {
            orderData =  await OrdersModel.deleteOne(
                { orderCreated: { $exists : true } },
                { _id: _req.params.msg_id }
            );
        } else {
            orderData =  await OrdersModel.deleteMany(
                { orderCreated: { $exists : true } },
            );
        }

        if (orderData === null) {
            console.error("httpDeleteOrderCreated: ", "Error delete order or tehre are no orders");
            return res.status(400).json({
                message: 'Error deleting order Message or tehre are no orders',
                responseId
            });
        }
        console.log("httpDeleteOrderCreated: ", "Order created deleted");
        console.log("Cluster ID Created: ", cluster.worker?.id);
        return res.status(200).json({orderData, responseId});
    } catch (error:any) {
        console.error("httpDeleteOrderCreated: ", error.message);
        return res.status(201).json({error: error.message, responseId})
    }
}


/**
 * Description: Get all the orders sent by WooCommerce Webhook from the database.
 * @param _req Request
 * @param res Response
 * @returns response
 */
async function httpGetOrderUpdated(_req: express.Request, res: express.Response): Promise<express.Response | void> {
    const responseId = randomUUID();
    try {
        const orderData =  await OrdersModel.find(
            { orderUpdated: { $exists : true } },
        );

        if (orderData === null) {
            console.error("httpGetOrderUpdated: ", "Error get order or tehre are no orders");
            return res.status(400).json({
                message: 'Error getting order Message or tehre are no orders',
                responseId
            });
        }
        console.log("httpGetOrderUpdated: ", "Order updated getted");
        console.log("Cluster ID Updated: ", cluster.worker?.id);
        return res.status(200).json({orderData, responseId});
    } catch (error:any) {
        console.error("httpGetOrderUpdated: ", error.message);
        return res.status(201).json({error: error.message, responseId})
    }
}

/**
 * Description: Delete all the orders sent by WooCommerce Webhook from the database.
 */
async function httpDeleteOrderUpdated(_req: express.Request, res: express.Response): Promise<express.Response | void> {
    const responseId = randomUUID();
    try {
        let orderData = null;
        if(_req.params.msg_id !== undefined || _req.query.msg_id !== undefined) {
            orderData =  await OrdersModel.deleteOne(
                { orderUpdated: { $exists : true } },
                { _id: _req.params.msg_id }
            );
        } else {
            orderData =  await OrdersModel.deleteMany(
                { orderUpdated: { $exists : true } },
            );
        }

        if (orderData === null) {
            console.error("httpDeleteOrderUpdated: ", "Error delete order or tehre are no orders");
            return res.status(400).json({
                message: 'Error deleting order Message or tehre are no orders',
                responseId
            });
        }
        console.log("httpDeleteOrderUpdated: ", "Order updated deleted");
        console.log("Cluster ID Updated: ", cluster.worker?.id);
        return res.status(200).json({orderData, responseId});
    } catch (error:any) {
        console.error("httpDeleteOrderUpdated: ", error.message);
        return res.status(201).json({error: error.message, responseId})
    }
}

/**
 * Description: This is the code to publish the order in the RabbitMQ exchange.
 * @deprecated This code is deprecated because the order is saved in the database instead of being published in the exchange
 */
// async function httpPublishOrderCreated2(_req: express.Request, res: express.Response) {
//     try {
//         const exchangeDefault = process.env.WC_ORDERS_EXCHANGENAME || "wc";
//         const routingKeyDefaultCreated = process.env.WC_ORDERS_CREATED_ROUTINGKEY || "wc.orders.created";
//         rabbitMQ.publishInExchange(exchangeDefault, routingKeyDefaultCreated, _req.body,{
//             persistent: true, // if true, the message will be persisted to disk
//             mandatory: true, // if true, the message will be returned if it cannot be routed to a queue
//             contentType: "application/json" // MIME type
//         });
        
//         if (orderData === null) {
//             console.error("httpPublishOrderCreated: ", "Error save order");
//             return res.status(400).json({
//                 message: 'Error saving order Message',
//                 type: "critical"
//             });
//         }
//         // For testing purposes creates a sample file with the order data
//         // fs.writeFileSync("orderCreatedForbidden.json", JSON.stringify(_req.body, null, 4));
//         console.log("httpPublishOrderCreated: ", "Order saved");
//         console.log("Cluster ID Created: ", cluster.worker?.id);
//         res.status(200).json({message: "Order saved"});
//     } catch (error:any) {
//         console.error("http_Order_Created: ", error.message);
//         res.status(201).json({error: error.message})
//     }
// }

/**
 * Description: This is the code to publish the order in the RabbitMQ exchange.
 * @deprecated This code is deprecated because the order is saved in the database instead of being published in the exchange
 */
// async function httpPublishOrderUpdated(_req: express.Request, res: express.Response): Promise<express.Response | void> {
//     try {
//         const exchangeDefault = process.env.WC_ORDERS_EXCHANGENAME || "wc";
//         const routingKeyDefaultUpdated = process.env.WC_ORDERS_UPDATED_ROUTINGKEY || "wc.orders.updated";
//         rabbitMQ.publishInExchange(exchangeDefault, routingKeyDefaultUpdated, _req.body,{
//             persistent: true, // if true, the message will be persisted to disk
//             mandatory: true, // if true, the message will be returned if it cannot be routed to a queue
//             contentType: "application/json" // MIME type
//         });
//         // For testing purposes creates a sample file with the order data
//         // fs.writeFileSync("orderUpdated.json", JSON.stringify(_req.body, null, 4));
//         console.log("http_Order_Updated: ", "Order updated");
//         console.log("Cluster ID Updated: ", cluster.worker?.id);
//         return res.status(200).json({message: "Order updated"});
//     } catch (error:any) {
//         console.error("http_Order_Updated: ", error.message);
//         return res.status(201).json({error: error.message})
//     }
// }
 
export {
    httpPublishOrderCreated,
    httpGetOrderCreated,
    httpDeleteOrderCreated,
    httpPublishOrderUpdated,
    httpGetOrderUpdated,
    httpDeleteOrderUpdated
};