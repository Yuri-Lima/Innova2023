import { Request, Response } from 'express';
import { getLatestMsgId } from '../../db/models/wc.orders.mongo';
import {
    OrderProductionMsgModel
} from '../../db/models/wc.orders.model';
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
const httpOrderProductionMsg = async (req: Request, res: Response): Promise<any> => {
    try {
        const body = req.body;
        const msg_id = await getLatestMsgId(OrderProductionMsgModel);
        body.msg_id = msg_id + 1;
        const msgData = await OrderProductionMsgModel.create(body);

        if (msgData === null) {
            return res.status(400).json({
                message: 'Error creating order Production Message'
            });
        }

        console.log('httpOrderProductionMsg', msgData);

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
const httpOrderProductionGetMsgbyId = async (req: Request, res: Response): Promise<any> => {
    try {
        if (req.params.msg_id === undefined) {
            console.error('httpOrderProductionGetMsgbyId - msg_id undefined on the request params');
            return res.status(400).json({
                message: 'Order Created Message ID Not Found'
            });
        }
        const msgData = await OrderProductionMsgModel.findOne(
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
        console.log('httpOrderProductionGetMsgbyId', msgData);
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
const httpOrderProductionGetAllMsg = async (_req: Request, res: Response): Promise<any> => {
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

        const msgData = await OrderProductionMsgModel.find(
            {}, // empty object to get all the data,
            { _id: 0, __v: 0 }, // remove the _id and __v from the response
            { 
                sort: { msg_id: order==='asc'? 1: -1 }, // sort by msg_id
                skip: skip, // skip the first n documents
                limit: limit // limit the number of documents returned
            },
        );
        console.log('httpOrderProductionGetAllMsg', msgData);
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
const httpOrderProductionSaveMsg = async (req: Request, res: Response): Promise<any> => {
    try {
        const body = req.body;
        if (body.msg_id === undefined) {
            console.error('httpOrderProductionSaveMsg ID is undefined', body);
            return res.status(400).json({
                message: 'Must provie ID msg'
            });
        }
        const msgData = await OrderProductionMsgModel.updateOne(
            {
                msg_id: body.msg_id // if the msg_id exists, update it.
            },
                body, // new data that will be updated.
            {
                upsert: false, // if the document doesn't exist, do not create it.
            }
        );
        if (msgData === null) {
            console.error('httpOrderProductionSaveMsg msgData is null', msgData);
            return res.status(400).json({
                message: 'Something went wrong'
            });
        }
        if (msgData.matchedCount === 0) {
            console.error('httpOrderProductionSaveMsg ID does not match any', msgData);
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

        console.log('httpOrderProductionSaveMsg', req.body);
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
const httpOrderProductionDeleteMsg = async (req: Request, res: Response): Promise<any> => {
    try {
        if (req.params.msg_id === undefined) {
            console.error('httpOrderProductionDeleteMsg - msg_id undefined on the request params');
            return res.status(400).json({
                message: 'Must provie ID msg'
            });
        }

        const msgData = await OrderProductionMsgModel.deleteOne( // deleteOne() returns the number of deleted documents
            {
                msg_id: req.params.msg_id
            }
        );
        if (msgData === null) {
            console.error('httpOrderProductionDeleteMsg null', msgData);
            return res.status(400).json({
                message: 'Something went wrong'
            });
        }
        if (msgData.deletedCount === 0) {  
            console.error('httpOrderProductionDeleteMsg deletedCount', msgData); 
            return res.status(400).json({
                message: 'Does not match any ID'
            });
        }
        console.log('httpOrderProductionDeleteMsg', msgData);
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
const httpOrderProductionDeleteAllMsg = async (_req: Request, res: Response ): Promise<any> => {
    try {
        const msgData = await OrderProductionMsgModel.deleteMany( // deleteMany() returns the number of deleted documents
            {}
        );
        if (msgData === null) {
            console.error('httpOrderProductionDeleteAllMsg null', msgData);
            return res.status(400).json({
                message: 'Something went wrong'
            });
        }
        if (msgData.deletedCount === 0) {
            console.error('httpOrderProductionDeleteAllMsg deletedCount', msgData);
            return res.status(400).json({
                message: 'Does not match any ID'
            });
        }
        console.log('httpOrderProductionDeleteAllMsg', msgData);
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
    httpOrderProductionMsg,
    httpOrderProductionGetMsgbyId,
    httpOrderProductionGetAllMsg,
    httpOrderProductionSaveMsg,
    httpOrderProductionDeleteMsg,
    httpOrderProductionDeleteAllMsg
}
