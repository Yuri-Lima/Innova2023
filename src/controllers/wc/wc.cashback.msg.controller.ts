import { Request, Response } from 'express';
import { CashBackMsgModel } from '../../db/models/wc.cashback.model';
import getPaginatedQuery from '../../Utils/query';

/**
 * Main Description: This file contains all the functions that will be used 
 * to create, update, delete and get messages
 */
//================================================================================================

/**
 * CREATE
 * Description: Save a new cashback message.
 * @param req Request
 * @param res Response
 * @returns {Promise<any>}
 */
const httpCashBackMsgCreate = async (req: Request, res: Response): Promise<any> => {
    try {
        const body = req.body;
        const msgData = await CashBackMsgModel.create(body);

        if (msgData === null) {
            return res.status(400).json({
                message: 'Error saving cashback message'
            });
        }

        console.log('httpCashBackMsg', msgData);

        req.body = msgData; // save the msgData in the request body to be used in the next function
        return res.status(201).json({
            message: 'CashBack Message Saved',
            msgData
        });
    } catch (error: any) {
        return res.status(400).json({
            message: 'Error saving cashback message',
            error
        });
    }
}

/**
 * READ
 * Description: Get cashback message by id
 * @param req Request
 * @param res Response
 * @returns {Promise<any>}
 */
const httpGetCashBackMsg = async (req: Request, res: Response): Promise<any> => {
    try {
        let msgData = null;

        /**
         * Find the message by id.
         * @param req.query.msg_id
         */
        if (req.query?.msg_id !== undefined) {
            msgData = await CashBackMsgModel.find(
                {
                    _id: req.query.msg_id as string
                },
                { __v: 0 } // remove the _id and __v from the response
            );
            if (msgData === null) {
                console.log('httpGetCashBackMsg', msgData);
                return res.status(400).json({
                    message: 'Error getting cashback message by id'
                });
            }
            console.log('httpGetCashBackMsg', msgData);
            return res.status(200).json({
                message: 'CashBack Message Found by id',
                msgData
            });
        }

        /**
         * Find the message by coupon code.
         * @param req.query.couponCode
         */
        else if (req.query?.couponCode !== undefined) {
            msgData = await CashBackMsgModel.find(
                {
                    couponCode: req.query.couponCode as string
                },
                { __v: 0 } // remove the _id and __v from the response
            );
            if (msgData === null) {
                console.log('httpGetCashBackMsg', msgData);
                return res.status(400).json({
                    message: 'Error getting cashback message by coupon code'
                });
            }
            console.log('httpGetCashBackMsg', msgData);
            return res.status(200).json({
                message: 'CashBack Message Found by coupon code',
                msgData
            });
        }

        /**
         * Find the message by active status (true or false).
         * @param req.query.active
         */
        else if (req.query?.active !== undefined) {
            msgData = await CashBackMsgModel.find(
                {
                    active: (req.query.active === 'true' ? true : false) as boolean
                },
                { __v: 0 } // remove the _id and __v from the response
            );
            if (msgData === null) {
                console.log('httpGetCashBackMsg', msgData);
                return res.status(400).json({
                    message: 'Error getting cashback message by active status'
                });
            }
            console.log('httpGetCashBackMsg', msgData);
            return res.status(200).json({
                message: 'CashBack Message Found by active status',
                msgData
            });
        }

        /**
         * Find the message by created date.
         * @info: The date must be in this format: 2021-08-31T00:00:00.000Z
         * @param req.query.created
         */
        else if (req.query?.createdAt !== undefined) {
            msgData = await CashBackMsgModel.find(
                {
                    createdAt: req.query.createdAt as  string
                },
                { __v: 0 } // remove the _id and __v from the response
            );
            if (msgData === null) {
                console.log('httpGetCashBackMsg', msgData);
                return res.status(400).json({
                    message: 'Error getting cashback message by created date'
                });
            }
            console.log('httpGetCashBackMsg', msgData);
            return res.status(200).json({
                message: 'CashBack Message Found by created date',
                msgData
            });
        }

        /**
         * Find the message by updated date.
         * @info: The date must be in this format: 2021-08-31T00:00:00.000Z
         * @param req.query.updatedAt
         */
        else if (req.query?.updatedAt !== undefined) {
            msgData = await CashBackMsgModel.find(
                {
                    updatedAt: req.query.updatedAt as string
                },
                { __v: 0 } // remove the _id and __v from the response
            );
            if (msgData === null) {
                console.log('httpGetCashBackMsg', msgData);
                return res.status(400).json({
                    message: 'Error getting cashback message by updated date'
                });
            }
            console.log('httpGetCashBackMsg', msgData);
            return res.status(200).json({
                message: 'CashBack Message Found by updated date',
                msgData
            });
        }

        return res.status(400).json({
            message: 'No query param found'
        });

    } catch (error: any) {
        return res.status(400).json({
            message: 'Error to find Cashback Message',
            error
        });
    }
}


/**
 * READ
 * Description: Get all cashback messages
 * @param _req Request
 * @param res Response
 * @returns {Promise<any>}
 */
const httpCashBackGetAllMsg = async (_req: Request, res: Response): Promise<any> => {
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

        const msgData = await CashBackMsgModel.find(
            {}, // empty object to get all the data,
            { __v: 0 }, // remove the _id and __v from the response
            { 
                sort: { msg_id: order==='asc'? 1: -1 }, // sort by msg_id
                skip: skip, // skip the first n documents
                limit: limit // limit the number of documents returned
            },
        );
        console.log('httpCashBackGetAllMsg', msgData);
        return res.status(201).json({
            message: 'Cashback Msg Found',
            msgData
        });
    } catch (error: any) {
        return res.status(400).json({
            message: 'Error to Find Cashback Message',
            error
        });
    }
}

/**
 * Description: Delete a cashback message by id or couponCode
 * @param req Request
 * @param res Response
 * @returns {Promise<any>}
 */
const httpCashBackDeleteMsg = async (req: Request, res: Response): Promise<any> => {
    try {
        let msgData = null;
        /**
         * Delete the message by id.
         * @param req.query.msg_id
         */
        if (req.query?.msg_id !== undefined) {
            msgData = await CashBackMsgModel.deleteMany(
                {
                    _id: req.query.msg_id
                }
            );
            if (msgData === null) {
                return res.status(400).json({
                    message: 'Error deleteing cashback message by id'
                });
            }
            console.log('httpCashBackDeleteMsg', msgData);
            return res.status(201).json({
                message: 'Cashback Msg ID Deleted',
                msgData
            });
        }

        /**
         * Delete the message by coupon code.
         * @param req.query.couponCode
         */
        else if(req.query?.couponCode !== undefined) {
            msgData = await CashBackMsgModel.deleteMany(
                {
                    couponCode: req.query.couponCode as string
                }
            );
            if (msgData === null) {
                return res.status(400).json({
                    message: 'Error deleting cashback message by coupon code'
                });
            }
            console.log('httpCashBackDeleteMsg', msgData);
            return res.status(201).json({
                message: 'Cashback Msg Coupon Code Deleted',
                msgData
            });
        }

        /**
         * Delete the message by active status (true or false).
         * @param req.query.active
         */
        else if(req.query?.active !== undefined) {
            msgData = await CashBackMsgModel.deleteMany(
                {
                    active: (req.query.active === 'true' ? true : false) as boolean
                }
            );
            if (msgData === null) {
                console.log('httpCashBackDeleteMsg', msgData);
                return res.status(400).json({
                    message: 'Cashback active Not Found'
                });
            }
            console.log('httpCashBackDeleteMsg', msgData);
            return res.status(201).json({
                message: 'Cashback Msg Active Deleted',
                msgData
            });
        }

        /**
         * Delete the message by created date.
         * @info: The date must be in this format: 2021-08-31T00:00:00.000Z
         * @param req.query.createdAt
         */
        else if(req.query?.createdAt !== undefined) {
            msgData = await CashBackMsgModel.deleteMany(
                {
                    createdAt: req.query.createdAt as string
                }
            );
            if (msgData === null) {
                console.log('httpCashBackDeleteMsg', msgData);
                return res.status(400).json({
                    message: 'Cashback createdAt Not Found'
                });
            }
            console.log('httpCashBackDeleteMsg', msgData);
            return res.status(201).json({
                message: 'Cashback Msg CreatedAt Deleted',
                msgData
            });
        }

        /**
         * Delete the message by updated date.
         * @info: The date must be in this format: 2021-08-31T00:00:00.000Z
         * @param req.query.updatedAt
         */
        else if(req.query?.updatedAt !== undefined) {
            msgData = await CashBackMsgModel.deleteMany(
                {
                    updatedAt: req.query.updatedAt as string
                }
            );
            if (msgData === null) {
                console.log('httpCashBackDeleteMsg', msgData);
                return res.status(400).json({
                    message: 'Cashback updatedAt Not Found'
                });
            }
            console.log('httpCashBackDeleteMsg', msgData);
            return res.status(201).json({
                message: 'Cashback Msg UpdatedAt Deleted',
                msgData
            });
        }

        return res.status(400).json({
            message: 'Cashback Msg Not Found'     
        });
    } catch (error: any) {
        return res.status(400).json({
            message: 'Error to Delete Cashback Message',
            error
        });
    }
}

/**
 * Description: Delete all cashback messages
 * @param _req Request
 * @param res Response
 * @returns {Promise<any>}
 */
const httpCashBackDeleteAllMsg = async (_req: Request, res: Response): Promise<any> => {
    try {
        const msgData = await CashBackMsgModel.deleteMany(
            {} // empty object to delete all the data
        );
        if (msgData === null) {
            return res.status(400).json({
                message: 'Cashback Message ID Not Found'
            });
        }
        console.log('httpCashBackDeleteAllMsg', msgData);
        return res.status(201).json({
            message: 'Cashback Msg ID Deleted',
            msgData
        });
    } catch (error: any) {
        return res.status(400).json({
            message: 'Error to Delete ID Cashback Message',
            error
        });
    }
}

export {
    httpCashBackMsgCreate,
    httpGetCashBackMsg,
    httpCashBackGetAllMsg,
    httpCashBackDeleteMsg,
    httpCashBackDeleteAllMsg
}
