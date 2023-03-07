import express, { Router } from 'express';
import { 
    httpOrderCreatedMsg,
    httpOrderCreatedGetMsgbyId,
    httpOrderCreatedGetAllMsg,
    httpOrderCreatedSaveMsg,
    httpOrderCreatedDeleteMsg,
    httpOrderCreatedDeleteAllMsg
} from '../../controllers/wc/wc.order.msg.created.controller';

import {
    httpOrderConcludedMsg,
    httpOrderConcludedGetMsgbyId,
    httpOrderConcludedGetAllMsg,
    httpOderConcludedSaveMsg,
    httpOrderConcludedDeleteMsg,
    httpOrderConcludedDeleteAllMsg
} from '../../controllers/wc/wc.order.msg.concluded.controller';

import {
    httpOrderProductionMsg,
    httpOrderProductionGetMsgbyId,
    httpOrderProductionGetAllMsg,
    httpOrderProductionSaveMsg,
    httpOrderProductionDeleteMsg,
    httpOrderProductionDeleteAllMsg
} from '../../controllers/wc/wc.order.msg.production.controller';

import {
    httpOrderOnHoldMsg,
    httpOrderOnHoldGetMsgbyId,
    httpOrderOnHoldGetAllMsg,
    httpOrderOnHoldSaveMsg,
    httpOrderOnHoldDeleteMsg,
    httpOrderOnHoldDeleteAllMsg
} from '../../controllers/wc/wc.order.msg.onhold.controller';

import {
    httpOrderProcessingMsg,
    httpOrderProcessingGetMsgbyId,
    httpOrderProcessingGetAllMsg,
    httpOrderProcessingSaveMsg,
    httpOrderProcessingDeleteMsg,
    httpOrderProcessingDeleteAllMsg
} from '../../controllers/wc/wc.order.msg.processing.controller';

import {
    httpOrderNotSuccessMsg,
    httpOrderNotSuccessGetMsgbyId,
    httpOrderNotSuccessGetAllMsg,
    httpOrderNotSuccessSaveMsg,
    httpOrderNotSuccessDeleteMsg,
    httpOrderNotSuccessDeleteAllMsg
} from '../../controllers/wc/wc.order.msg.not.success.controller';


const router:Router = express.Router();

/**
 * Order Created Message Routes
 * Description: This is the code to save created order messages in the database.
 */
router.post('/order/created/add-msg', httpOrderCreatedMsg);
router.get('/order/created/get-msg/:msg_id', httpOrderCreatedGetMsgbyId);
router.get('/order/created/get-all-msg', httpOrderCreatedGetAllMsg);
router.put('/order/created/save-msg', httpOrderCreatedSaveMsg);
router.delete('/order/created/delete-msg/:msg_id', httpOrderCreatedDeleteMsg);
router.delete('/order/created/delete-all-msg', httpOrderCreatedDeleteAllMsg);

/**
 * Orcer Completed Message Routes
 * Description: This is the code to save concluded order messages in the database.
 */
router.post('/order/completed/add-msg', httpOrderConcludedMsg);
router.get('/order/completed/get-msg/:msg_id', httpOrderConcludedGetMsgbyId);
router.get('/order/completed/get-all-msg', httpOrderConcludedGetAllMsg);
router.put('/order/completed/save-msg', httpOderConcludedSaveMsg);
router.delete('/order/completed/delete-msg/:msg_id', httpOrderConcludedDeleteMsg);
router.delete('/order/completed/delete-all-msg', httpOrderConcludedDeleteAllMsg);

/**
 * Order Production Message Routes
 * Description: This is the code to save production order messages in the database.
 */
router.post('/order/produzindo/add-msg', httpOrderProductionMsg);
router.get('/order/produzindo/get-msg/:msg_id', httpOrderProductionGetMsgbyId);
router.get('/order/produzindo/get-all-msg', httpOrderProductionGetAllMsg);
router.put('/order/produzindo/save-msg', httpOrderProductionSaveMsg);
router.delete('/order/produzindo/delete-msg/:msg_id', httpOrderProductionDeleteMsg);
router.delete('/order/produzindo/delete-all-msg', httpOrderProductionDeleteAllMsg);

/**
 * Order On Hold Message Routes
 * Description: This is the code to save on hold order messages in the database.
 */
router.post('/order/on-hold/add-msg', httpOrderOnHoldMsg);
router.get('/order/on-hold/get-msg/:msg_id', httpOrderOnHoldGetMsgbyId);
router.get('/order/on-hold/get-all-msg', httpOrderOnHoldGetAllMsg);
router.put('/order/on-hold/save-msg', httpOrderOnHoldSaveMsg);
router.delete('/order/on-hold/delete-msg/:msg_id', httpOrderOnHoldDeleteMsg);
router.delete('/order/on-hold/delete-all-msg', httpOrderOnHoldDeleteAllMsg);

/**
 * Order Processing Message Routes
 * Description: This is the code to save processing order messages in the database.
 */
router.post('/order/processing/add-msg', httpOrderProcessingMsg);
router.get('/order/processing/get-msg/:msg_id', httpOrderProcessingGetMsgbyId);
router.get('/order/processing/get-all-msg', httpOrderProcessingGetAllMsg);
router.put('/order/processing/save-msg', httpOrderProcessingSaveMsg);
router.delete('/order/processing/delete-msg/:msg_id', httpOrderProcessingDeleteMsg);
router.delete('/order/processing/delete-all-msg', httpOrderProcessingDeleteAllMsg);

/**
 * Order Not Success Message Routes
 * Description: This is the code to save not success order messages in the database.
 */
router.post('/order/failed/add-msg', httpOrderNotSuccessMsg);
router.get('/order/failed/get-msg/:msg_id', httpOrderNotSuccessGetMsgbyId);
router.get('/order/failed/get-all-msg', httpOrderNotSuccessGetAllMsg);
router.put('/order/failed/save-msg', httpOrderNotSuccessSaveMsg);
router.delete('/order/failed/delete-msg/:msg_id', httpOrderNotSuccessDeleteMsg);
router.delete('/order/failed/delete-all-msg', httpOrderNotSuccessDeleteAllMsg);

export default router;