import { Request, Response } from 'express';
import { OrderCreatedMsgModel } from '../../db/models/wc.orders.model';
import { getLatestMsgId } from '../../db/models/wc.orders.mongo';

import getPaginatedQuery from '../../Utils/query';

/**
 * Main Description: This file contains all the functions that will be used 
 * to create, update, delete and get messages
 */
//================================================================================================

/**
 * CREATE
 * Description: Create a new order message
 * @param req Request
 * @param res Response
 * @returns {Promise<any>}
 */
const httpOrderCreatedMsg = async (req: Request, res: Response): Promise<any> => {
    try {
        const body = req.body;
        const msg_id = await getLatestMsgId(OrderCreatedMsgModel);
        body.msg_id = msg_id + 1;
        const msgData = await OrderCreatedMsgModel.create(body);

        if (msgData === null) {
            return res.status(400).json({
                message: 'Error creating order Message'
            });
        }

        console.log('httpOrderCreatedMsg', msgData);

        req.body = msgData; // save the msgData in the request body to be used in the next function
        return res.status(201).json({
            message: 'Order Message Created',
            msgData
        });
    } catch (error: any) {
        return res.status(400).json({
            message: 'Error creating order Message',
            error
        });
    }
}

/**
 * READ
 * Description: Get order created message by id
 * @param req Request
 * @param res Response
 * @returns {Promise<any>}
 */
const httpOrderCreatedGetMsgbyId = async (req: Request, res: Response): Promise<any> => {
    try {
        if (req.params.msg_id === undefined) {
            console.error('httpOrderGetMsgbyId - msg_id undefined on the request params');
            return res.status(400).json({
                message: 'Order Created Message ID Not Found'
            });
        }
        const msgData = await OrderCreatedMsgModel.findOne(
        {
            msg_id: req.params.msg_id
        },
            { _id: 0, __v: 0 } // remove the _id and __v from the response
        );
        if (msgData === null) {
            return res.status(400).json({
                message: 'Order Created Message ID Not Found'
            });
        }
        console.log('httpOrderGetMsgbyId', msgData);
        return res.status(201).json({
            message: 'Msg ID Found',
            msgData
        });
    } catch (error: any) {
        return res.status(400).json({
            message: 'Error to find ID Created Message',
            error
        });
    }
}


/**
 * READ
 * Description: Get all order created messages
 * @param _req Request
 * @param res Response
 * @returns {Promise<any>}
 */
const httpOrderCreatedGetAllMsg = async (_req: Request, res: Response): Promise<any> => {
    try {
        const { skip, limit, order } = getPaginatedQuery(_req.query);

        /**
         * If the skip or limit are undefined, return an error
         * there is a default value for the skip and limit
         * It means thad soulld not be undefined
         */
        if (skip === undefined || limit === undefined) {
            return res.status(400).json({
                message: 'Error to get all the messages - skip or limit undefined'
            });
        }

        const msgData = await OrderCreatedMsgModel.find(
            {}, // empty object to get all the data,
            { _id: 0, __v: 0 }, // remove the _id and __v from the response
            { 
                sort: { msg_id: order==='asc'? 1: -1 }, // sort by msg_id
                skip: skip, // skip the first n documents
                limit: limit // limit the number of documents returned
            },
        );
        console.log('httpOrderGetAllMsg', msgData);
        return res.status(201).json({
            message: 'Msg Order Created Found',
            msgData
        });
    } catch (error: any) {
        return res.status(400).json({
            message: 'Error creating order Message',
            error
        });
    }
}

/**
 * UPDATE
 * Description: Update order created message
 * @param req Request
 * @param res Response
 * @returns {Promise<any>}
 */
const httpOrderCreatedSaveMsg = async (req: Request, res: Response): Promise<any> => {
    try {
        const body = req.body;
        if (body.msg_id === undefined) {
            console.error('httpOderSaveMsg ID is undefined', body);
            return res.status(400).json({
                message: 'Must provie ID msg_id'
            });
        }
        const msgData = await OrderCreatedMsgModel.updateOne(
            {
                msg_id: body.msg_id // if the msg_id exists, update it.
            },
                body, // new data that will be updated.
            {
                upsert: false, // if the document doesn't exist, do not create it.
            }
        );
        if (msgData === null) {
            console.error('httpOderSaveMsg msgData is null', msgData);
            return res.status(400).json({
                message: 'Something went wrong'
            });
        }
        if (msgData.matchedCount === 0) {
            console.error('httpOderSaveMsg ID does not match any', msgData);
            return res.status(400).json({
                message: 'Does not match any ID'
            });
        }
        if (msgData.modifiedCount > 0) {
            return res.status(201).json({
                message: 'Msg Created Order Updated/Modified',
                msgData
            });
        }
        
        req.body = body; // update the body with the new data

        console.log('httpOderSaveMsg', req.body);
        return res.status(203).json({
            message: 'Msg Created Order has not been modified, sent the same data',
            msgData
        });
    } catch (error: any) {
        return res.status(400).json({
            message: 'Error creating order Message',
            error
        });
    }
}

/**
 * DELETE
 * Description: Delete order created message
 * @param req Request
 * @param res Response
 * @returns {Promise<any>}
 */
const httpOrderCreatedDeleteMsg = async (req: Request, res: Response): Promise<any> => {
    try {
        if (req.params.msg_id === undefined) {
            console.error('httpOrderDeleteMsg - msg_id undefined on the request params');
            return res.status(400).json({
                message: 'Must provie ID msg'
            });
        }

        const msgData = await OrderCreatedMsgModel.deleteOne( // deleteOne() returns the number of deleted documents
            {
                msg_id: req.params.msg_id
            }
        );
        if (msgData === null) {
            console.error('httpOrderDeleteMsg null', msgData);
            return res.status(400).json({
                message: 'Something went wrong'
            });
        }
        if (msgData.deletedCount === 0) {  
            console.error('httpOrderDeleteMsg deletedCount', msgData); 
            return res.status(400).json({
                message: 'Does not match any ID'
            });
        }
        console.log('httpOrderDeleteMsg', msgData);
        return res.status(201).json({
            message: 'Msg Created Order Deleted',
            msgData
        });
    } catch (error: any) {
        return res.status(400).json({
            message: 'Error creating order Message',
            error
        });
    }
}

/**
 * Delete/Purge
 * Description: Delete all order created messages
 */
const httpOrderCreatedDeleteAllMsg = async (_req: Request, res: Response ): Promise<any> => {
    try {
        const msgData = await OrderCreatedMsgModel.deleteMany( // deleteMany() returns the number of deleted documents
            {}
        );
        if (msgData === null) {
            console.error('httpOrderDeleteAllMsg null', msgData);
            return res.status(400).json({
                message: 'Something went wrong'
            });
        }
        if (msgData.deletedCount === 0) {
            console.error('httpOrderDeleteAllMsg deletedCount', msgData);
            return res.status(400).json({
                message: 'Does not match any ID'
            });
        }
        console.log('httpOrderDeleteAllMsg', msgData);
        return res.status(201).json({
            message: 'Msg Created Order Deleted',
            msgData
        });
    } catch (error: any) {
        return res.status(400).json({
            message: 'Error creating order Message',
            error
        });
    }
}

export {
    httpOrderCreatedMsg,
    httpOrderCreatedGetMsgbyId,
    httpOrderCreatedGetAllMsg,
    httpOrderCreatedSaveMsg,
    httpOrderCreatedDeleteMsg,
    httpOrderCreatedDeleteAllMsg
}
