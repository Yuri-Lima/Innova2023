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
class CashBackMsg {
    @prop({ required: false, unique: false })
    public msgClient!: string;

    @prop({ required: false, unique: false })
    public minOrderValue!: number; // Minimum order value to get cashback

    @prop({ required: false, unique: false })
    public discountValue!: number; // Discount value

    @prop({ required: false, unique: false })
    public discountType!: string; // Discount type

    @prop({ required: false, unique: false })
    public couponCode!: string; // Coupon code

    @prop({ required: false, unique: false })
    public couponDaysExpire!: number; // Coupon days expire

    @prop({ required: false, unique: false })
    public active!: boolean; // Active
}
const CashBackMsgModel = getModelForClass(CashBackMsg, {
    schemaOptions: {
        timestamps: true,
    },
    options: {
        customName: 'CashBackMsg'
    }
});

export {
    CashBackMsgModel,
}

