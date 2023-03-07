/**
 * @fileoverview This file contains all the cron jobs endpoints
 */
import express from 'express';
import { UatizMsgModel } from '../../db/models/wc.uatiz.model';

/**
 * Description: Endpoint to add a massage to the database
 * @param _req Request
 * @param res Response
 * @returns response
 */

async function httpUatizMsgAdd(_req: express.Request, res: express.Response): Promise<any> {
    try {
        if (_req.body === undefined) return res.status(400).json({error: "body is required"});
        if (typeof _req.body !== "object"){
            _req.body = JSON.parse(_req.body);
        }
        const uatizMsg = await UatizMsgModel.create(_req.body);
        return res.status(200).json(uatizMsg);
    } catch (error:any) {
        console.error("httpUatizMsgAdd: ", error.message);
        return res.status(201).json({error: error.message})
    }
}

/**
 * Description: Endpoint to get a massage by id from the database
 * @param _req Request
 * @param res Response
 * @returns response
 */

async function httpUatizMsgGetById(_req: express.Request, res: express.Response): Promise<any> {
    try {
        const msg_id = _req.query.msg_id || _req.params.msg_id;
        if (msg_id === undefined) return res.status(400).json({error: "msg_id is required"});
        const uatizMsg = await UatizMsgModel.findOne(
            { _id: msg_id }, // empty object to get all the data,
            { __v: 0 }, // remove the _id and __v from the response
        );
        return res.status(200).json(uatizMsg);
    } catch (error:any) {
        console.error("httpUatizMsgGetById: ", error.message);
        return res.status(201).json({error: error.message})
    }
}

/**
 * Description: Endpoint to get all massages from the database
 * @param _req Request
 * @param res Response
 * @returns response
 */
async function httpUatizMsgGetAll(_req: express.Request, res: express.Response): Promise<any> {
    try {
        const uatizMsg = await UatizMsgModel.find(
            {}, // empty object to get all the data,
            { __v: 0 }, // remove the _id and __v from the response
            { 
                sort: { createdAt: 1 }, // sort by createdAt in ascending order
                limit: 30 // limit the number of documents returned
            },
        );
        return res.status(200).json(uatizMsg);
    } catch (error:any) {
        console.error("httpUatizMsgGetAll: ", error.message);
        return res.status(201).json({error: error.message})
    }
}

/**
 * Description: Endpoint to save a massage by id from the database
 * @param _req Request
 * @param res Response
 * @returns response
 */
async function httpUatizMsgSavebyId(_req: express.Request, res: express.Response): Promise<any> {
    try {
        const msg_id = _req.query.msg_id || _req.params.msg_id;
        if (!msg_id) return res.status(400).json({error: "msg_id is required"});
        if (_req.body === undefined) return res.status(400).json({error: "body is required"});
        if (typeof _req.body !== "object"){
            _req.body = JSON.parse(_req.body);
        }
        const uatizMsg = await UatizMsgModel.findOneAndUpdate(
            { _id: msg_id }, // find the document by id
            { $set: { uatizMsg: _req.body } }, // update the message
            { new: true }, // return the updated document
        );
        return res.status(200).json(uatizMsg);
    } catch (error:any) {
        console.error("httpUatizMsgSavebyId: ", error.message);
        return res.status(201).json({error: error.message})
    }
}

/**
 * Description: Endpoint to delete a massage by id from the database
 * @param _req Request
 * @param res Response
 * @returns response
 */

async function httpUatizMsgDeletebyId(_req: express.Request, res: express.Response): Promise<any> {
    try {
        const msg_id = _req.query.msg_id || _req.params.msg_id;
        if (!msg_id) return res.status(400).json({error: "msg_id is required"});
        const uatizMsg = await UatizMsgModel.findOneAndDelete(
            { _id: msg_id }, // find the document by id
        );
        return res.status(200).json(uatizMsg);
    } catch (error:any) {
        console.error("httpUatizMsgDeletebyId: ", error.message);
        return res.status(201).json({error: error.message})
    }
}

/**
 * Description: Endpoint to delete all massages from the database
 * @param _req Request
 * @param res Response
 * @returns response
 */
async function httpUatizMsgDeleteAll(_req: express.Request, res: express.Response): Promise<any> {
    try {
        const uatizMsg = await UatizMsgModel.deleteMany({});
        return res.status(200).json(uatizMsg);
    } catch (error:any) {
        console.error("httpUatizMsgDeleteAll: ", error.message);
        return res.status(201).json({error: error.message})
    }
}

export {
    httpUatizMsgAdd,
    httpUatizMsgGetById,
    httpUatizMsgGetAll,
    httpUatizMsgSavebyId,
    httpUatizMsgDeletebyId,
    httpUatizMsgDeleteAll,
}