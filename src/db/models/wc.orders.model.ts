import { prop, getModelForClass, Severity, modelOptions } from '@typegoose/typegoose';

/**
 * Model Options
 */
@modelOptions({
    options: {
      allowMixed: Severity.ALLOW, // Allow mixed types in the schema (default: Severity.ALLOW). Main reason was on the Orders model which has two properties with different types
    },
})

/**
 * @class Orders
 * @description Takes all the orders from WooCommerce
 * @property {string} order - Order
 */
class Orders {
    @prop({ required: false, unique: false })
    public orderCreated!: object; // Mixed type

    @prop({ required: false, unique: false })
    public orderUpdated!: object; // Mixed type
}
const OrdersModel = getModelForClass(Orders,{
    schemaOptions: {
        timestamps: true,
    },
    options: {
        customName: 'Orders'
    }
});

/**
 * @class OrderCreatedMsg
 * @description Saves the messages for the order created
 * @property {string} msg_id - Message ID
 * @property {string} msgClient - Message to the client
 * @property {string} mobileMsgClient - Message to the client mobile
 * @property {string} msgClientDestination - Message to the client destination
 * @property {string} mobileMsgClientDestination - Message to the client destination mobile
 * @property {string} msgAdmin - Message to the admin
 * @property {string} mobileMsgAdmin - Message to the admin mobile
 * @property {string} active_msgClient - Active message to the client
 * @property {string} active_msgClientDestination - Active message to the client destination
 * @property {string} active_msgAdmin - Active message to the admin
 */
class OrderCreatedMsg{
    @prop({ required: true, unique: true })
    public msg_id!: number;

    @prop({ required: false })
    public msgClient!: string;

    @prop({ required: false })
    public mobileMsgClient!: string;

    @prop({ required: false })
    public msgClientDestination!: string;

    @prop({ required: false })
    public mobileMsgClientDestination!: string;
    
    @prop({ required: false })
    public msgAdmin!: string;

    @prop({ required: false })
    public mobileMsgAdmin!: string;

    @prop({ required: true })
    public active_msgClient!: boolean;

    @prop({ required: true })
    public active_msgClientDestination!: boolean;
    
    @prop({ required: true })
    public active_msgAdmin!: boolean;
}
const OrderCreatedMsgModel = getModelForClass(OrderCreatedMsg,{
    schemaOptions: {
        timestamps: true,
    }
});

/**
 * @class OrderConcludedMsg
 * @description Saves the messages for the order concluded
 * @property {string} msg_id - Message ID
 * @property {string} msgClient - Message to the client
 * @property {string} mobileMsgClient - Message to the client mobile
 * @property {string} msgClientDestination - Message to the client destination
 * @property {string} mobileMsgClientDestination - Message to the client destination mobile
 * @property {string} msgAdmin - Message to the admin
 * @property {string} mobileMsgAdmin - Message to the admin mobile
 * @property {string} active_msgClient - Active message to the client
 * @property {string} active_msgClientDestination - Active message to the client destination
 * @property {string} active_msgAdmin - Active message to the admin
 */
class OrderConcludedMsg {
    @prop({ required: true, unique: true })
    public msg_id!: number;

    @prop({ required: false })
    public msgClient!: string;

    @prop({ required: false })
    public mobileMsgClient!: string;

    @prop({ required: false })
    public msgClientDestination!: string;

    @prop({ required: false })
    public mobileMsgClientDestination!: string;
    
    @prop({ required: false })
    public msgAdmin!: string;

    @prop({ required: false })
    public mobileMsgAdmin!: string;

    @prop({ required: true })
    public active_msgClient!: boolean;

    @prop({ required: true })
    public active_msgClientDestination!: boolean;
    
    @prop({ required: true })
    public active_msgAdmin!: boolean;
}
const OrderConcludedMsgModel = getModelForClass(OrderConcludedMsg,{
    schemaOptions: {
        timestamps: true,
    }
});

/**
 * @class OrderProductionMsg
 * @description Saves the messages for the order production
 * @property {string} msg_id - Message ID
 * @property {string} msgClient - Message to the client
 * @property {string} mobileMsgClient - Message to the client mobile
 * @property {string} msgClientDestination - Message to the client destination
 * @property {string} mobileMsgClientDestination - Message to the client destination mobile
 * @property {string} msgAdmin - Message to the admin
 * @property {string} mobileMsgAdmin - Message to the admin mobile
 * @property {string} active_msgClient - Active message to the client
 * @property {string} active_msgClientDestination - Active message to the client destination
 * @property {string} active_msgAdmin - Active message to the admin
 */
class OrderProductionMsg{
    @prop({ required: true, unique: true })
    public msg_id!: number;

    @prop({ required: false })
    public msgClient!: string;

    @prop({ required: false })
    public mobileMsgClient!: string;

    @prop({ required: false })
    public msgClientDestination!: string;

    @prop({ required: false })
    public mobileMsgClientDestination!: string;
    
    @prop({ required: false })
    public msgAdmin!: string;

    @prop({ required: false })
    public mobileMsgAdmin!: string;

    @prop({ required: true })
    public active_msgClient!: boolean;

    @prop({ required: true })
    public active_msgClientDestination!: boolean;
    
    @prop({ required: true })
    public active_msgAdmin!: boolean;
}
const OrderProductionMsgModel = getModelForClass(OrderProductionMsg,{
    schemaOptions: {
        timestamps: true,
    }
});

/**
 * @class OrderOnHoldMsg
 * @description Saves the messages for the order on hold
 * @property {string} msg_id - Message ID
 * @property {string} msgClient - Message to the client
 * @property {string} mobileMsgClient - Message to the client mobile
 * @property {string} msgClientDestination - Message to the client destination
 * @property {string} mobileMsgClientDestination - Message to the client destination mobile
 * @property {string} msgAdmin - Message to the admin
 * @property {string} mobileMsgAdmin - Message to the admin mobile
 * @property {string} active_msgClient - Active message to the client
 * @property {string} active_msgClientDestination - Active message to the client destination
 * @property {string} active_msgAdmin - Active message to the admin
 */
class OrderOnHoldMsg{
    @prop({ required: true, unique: true })
    public msg_id!: number;

    @prop({ required: false })
    public msgClient!: string;

    @prop({ required: false })
    public mobileMsgClient!: string;

    @prop({ required: false })
    public msgClientDestination!: string;

    @prop({ required: false })
    public mobileMsgClientDestination!: string;
    
    @prop({ required: false })
    public msgAdmin!: string;

    @prop({ required: false })
    public mobileMsgAdmin!: string;

    @prop({ required: true })
    public active_msgClient!: boolean;

    @prop({ required: true })
    public active_msgClientDestination!: boolean;
    
    @prop({ required: true })
    public active_msgAdmin!: boolean;
}
const OrderOnHoldMsgModel = getModelForClass(OrderOnHoldMsg,{
    schemaOptions: {
        timestamps: true,
    }
});

/**
 * @class OrderProcessingMsg
 * @description Saves the messages for the order processing
 * @property {string} msg_id - Message ID
 * @property {string} msgClient - Message to the client
 * @property {string} mobileMsgClient - Message to the client mobile
 * @property {string} msgClientDestination - Message to the client destination
 * @property {string} mobileMsgClientDestination - Message to the client destination mobile
 * @property {string} msgAdmin - Message to the admin
 * @property {string} mobileMsgAdmin - Message to the admin mobile
 * @property {string} active_msgClient - Active message to the client
 * @property {string} active_msgClientDestination - Active message to the client destination
 * @property {string} active_msgAdmin - Active message to the admin
 */
class OrderProcessingMsg{
    @prop({ required: true, unique: true })
    public msg_id!: number;

    @prop({ required: false })
    public msgClient!: string;

    @prop({ required: false })
    public mobileMsgClient!: string;

    @prop({ required: false })
    public msgClientDestination!: string;

    @prop({ required: false })
    public mobileMsgClientDestination!: string;
    
    @prop({ required: false })
    public msgAdmin!: string;

    @prop({ required: false })
    public mobileMsgAdmin!: string;

    @prop({ required: true })
    public active_msgClient!: boolean;

    @prop({ required: true })
    public active_msgClientDestination!: boolean;
    
    @prop({ required: true })
    public active_msgAdmin!: boolean;
}
const OrderProcessingMsgModel = getModelForClass(OrderProcessingMsg,{
    schemaOptions: {
        timestamps: true,
    },
});

/**
 * @class OrderNotSuccessMsg
 * @description Saves the messages for the order not success
 * @property {string} msg_id - Message ID
 * @property {string} msgClient - Message to the client
 * @property {string} mobileMsgClient - Message to the client mobile
 * @property {string} msgClientDestination - Message to the client destination
 * @property {string} mobileMsgClientDestination - Message to the client destination mobile
 * @property {string} msgAdmin - Message to the admin
 * @property {string} mobileMsgAdmin - Message to the admin mobile
 * @property {string} active_msgClient - Active message to the client
 * @property {string} active_msgClientDestination - Active message to the client destination
 * @property {string} active_msgAdmin - Active message to the admin
 */
class OrderNotSuccessMsg{
    @prop({ required: true, unique: true })
    public msg_id!: number;

    @prop({ required: false })
    public msgClient!: string;

    @prop({ required: false })
    public mobileMsgClient!: string;

    @prop({ required: false })
    public msgClientDestination!: string;

    @prop({ required: false })
    public mobileMsgClientDestination!: string;
    
    @prop({ required: false })
    public msgAdmin!: string;

    @prop({ required: false })
    public mobileMsgAdmin!: string;

    @prop({ required: true })
    public active_msgClient!: boolean;

    @prop({ required: true })
    public active_msgClientDestination!: boolean;
    
    @prop({ required: true })
    public active_msgAdmin!: boolean;
}
const OrderNotSuccessMsgModel = getModelForClass(OrderNotSuccessMsg,{
    schemaOptions: {
        timestamps: true,
    }
});

export {
    OrdersModel,
    OrderCreatedMsgModel,
    OrderConcludedMsgModel,
    OrderProductionMsgModel,
    OrderOnHoldMsgModel,
    OrderProcessingMsgModel,
    OrderNotSuccessMsgModel
}

