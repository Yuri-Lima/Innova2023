import express, { Router } from 'express';
import {
    httpUatizMsgAdd,
    httpUatizMsgGetById,
    httpUatizMsgGetAll,
    httpUatizMsgSavebyId,
    httpUatizMsgDeletebyId,
    httpUatizMsgDeleteAll
} from '../../controllers/wc/wc.uatiz.msg.controllers';

const router:Router = express.Router();

router.post('/uatiz/messages/add-msg', httpUatizMsgAdd);
router.get('/uatiz/messages/get-msg', httpUatizMsgGetById); // Query
router.get('/uatiz/messages/get-msg/:msg_id', httpUatizMsgGetById); // Params
router.get('/uatiz/messages/get-all-msg', httpUatizMsgGetAll); // Query
router.put('/uatiz/messages/save-msg', httpUatizMsgSavebyId); // Query
router.put('/uatiz/messages/save-msg/:msg_id', httpUatizMsgSavebyId); // Params
router.delete('/uatiz/messages/delete-msg', httpUatizMsgDeletebyId); // Query
router.delete('/uatiz/messages/delete-msg/:msg_id', httpUatizMsgDeletebyId); // Params
router.delete('/uatiz/messages/delete-all-msg', httpUatizMsgDeleteAll);

export default router;