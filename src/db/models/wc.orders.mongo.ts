import {
    OrderCreatedMsgModel,
    OrderConcludedMsgModel,
    OrderProductionMsgModel,
    OrderOnHoldMsgModel,
    OrderProcessingMsgModel,
    OrderNotSuccessMsgModel
} from './wc.orders.model';

type orderTypes = typeof OrderCreatedMsgModel | typeof OrderConcludedMsgModel | typeof OrderProductionMsgModel | typeof OrderOnHoldMsgModel | typeof OrderProcessingMsgModel | typeof OrderNotSuccessMsgModel | typeof OrderNotSuccessMsgModel;
const DEFAUL_ORDER_MSG_ID:number = 0;
/**
 * Description: Get the latest msg_id from the database
 * Default value is 0
 * @param func  OrderCreatedMsgModel | OrderConcludedMsgModel | OrderProductionMsgModel | OrderOnHoldMsgModel | OrderProcessingMsgModel | OrderNotSuccessMsgModel
 */
export async function getLatestMsgId(func: orderTypes): Promise<number> {
    const latestMsgId = await func.findOne().sort('-msg_id');
    if(latestMsgId === null || !latestMsgId){
        return DEFAUL_ORDER_MSG_ID;   
    }
    return latestMsgId.msg_id;
}