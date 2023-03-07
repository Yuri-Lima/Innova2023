import { Request, Response } from 'express';
import { getLatestMsgId } from '../../db/models/wc.orders.mongo';
import {
    OrderOnHoldMsgModel
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
const httpOrderOnHoldMsg = async (req: Request, res: Response): Promise<any> => {
    try {
        const body = req.body;
        const msg_id = await getLatestMsgId(OrderOnHoldMsgModel);
        body.msg_id = msg_id + 1;
        const msgData = await OrderOnHoldMsgModel.create(body);

        if (msgData === null) {
            return res.status(400).json({
                message: 'Error creating order OnHold Message'
            });
        }

        console.log('httpOrderOnHoldMsg', msgData);

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
const httpOrderOnHoldGetMsgbyId = async (req: Request, res: Response): Promise<any> => {
    try {
        if (req.params.msg_id === undefined) {
            console.error('httpOrderOnHoldGetMsgbyId - msg_id undefined on the request params');
            return res.status(400).json({
                message: 'Order Created Message ID Not Found'
            });
        }
        const msgData = await OrderOnHoldMsgModel.findOne(
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
        console.log('httpOrderOnHoldGetMsgbyId', msgData);
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
const httpOrderOnHoldGetAllMsg = async (_req: Request, res: Response): Promise<any> => {
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

        const msgData = await OrderOnHoldMsgModel.find(
            {}, // empty object to get all the data,
            { _id: 0, __v: 0 }, // remove the _id and __v from the response
            { 
                sort: { msg_id: order==='asc'? 1: -1 }, // sort by msg_id
                skip: skip, // skip the first n documents
                limit: limit // limit the number of documents returned
            },
        );
        console.log('httpOrderOnHoldGetAllMsg', msgData);
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
const httpOrderOnHoldSaveMsg = async (req: Request, res: Response): Promise<any> => {
    try {
        const body = req.body;
        if (body.msg_id === undefined) {
            console.error('httpOrderOnHoldSaveMsg ID is undefined', body);
            return res.status(400).json({
                message: 'Must provie ID msg'
            });
        }
        const msgData = await OrderOnHoldMsgModel.updateOne(
            {
                msg_id: body.msg_id // if the msg_id exists, update it.
            },
                body, // new data that will be updated.
            {
                upsert: false, // if the document doesn't exist, do not create it.
            }
        );
        if (msgData === null) {
            console.error('httpOrderOnHoldSaveMsg msgData is null', msgData);
            return res.status(400).json({
                message: 'Something went wrong'
            });
        }
        if (msgData.matchedCount === 0) {
            console.error('httpOrderOnHoldSaveMsg ID does not match any', msgData);
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

        console.log('httpOrderOnHoldSaveMsg', req.body);
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
const httpOrderOnHoldDeleteMsg = async (req: Request, res: Response): Promise<any> => {
    try {
        if (req.params.msg_id === undefined) {
            console.error('httpOrderOnHoldDeleteMsg - msg_id undefined on the request params');
            return res.status(400).json({
                message: 'Must provie ID msg'
            });
        }

        const msgData = await OrderOnHoldMsgModel.deleteOne( // deleteOne() returns the number of deleted documents
            {
                msg_id: req.params.msg_id
            }
        );
        if (msgData === null) {
            console.error('httpOrderOnHoldDeleteMsg null', msgData);
            return res.status(400).json({
                message: 'Something went wrong'
            });
        }
        if (msgData.deletedCount === 0) {  
            console.error('httpOrderOnHoldDeleteMsg deletedCount', msgData); 
            return res.status(400).json({
                message: 'Does not match any ID'
            });
        }
        console.log('httpOrderOnHoldDeleteMsg', msgData);
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
const httpOrderOnHoldDeleteAllMsg = async (_req: Request, res: Response ): Promise<any> => {
    try {
        const msgData = await OrderOnHoldMsgModel.deleteMany( // deleteMany() returns the number of deleted documents
            {}
        );
        if (msgData === null) {
            console.error('httpOrderOnHoldDeleteAllMsg null', msgData);
            return res.status(400).json({
                message: 'Something went wrong'
            });
        }
        if (msgData.deletedCount === 0) {
            console.error('httpOrderOnHoldDeleteAllMsg deletedCount', msgData);
            return res.status(400).json({
                message: 'Does not match any ID'
            });
        }
        console.log('httpOrderOnHoldDeleteAllMsg', msgData);
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
    httpOrderOnHoldMsg,
    httpOrderOnHoldGetMsgbyId,
    httpOrderOnHoldGetAllMsg,
    httpOrderOnHoldSaveMsg,
    httpOrderOnHoldDeleteMsg,
    httpOrderOnHoldDeleteAllMsg
}
