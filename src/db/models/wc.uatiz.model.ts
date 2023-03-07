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
 * @class UatizMsg
 * @description UatizMsg Model
 * @property {object} uatizMsg - Mixed type
 */
class UatizMsg {
    @prop({ required: false, unique: false })
    public uatizMsg!: object; // Mixed type
}
const UatizMsgModel = getModelForClass(UatizMsg,{
    schemaOptions: {
        timestamps: true,
    },
    options: {
        customName: 'UatizMsg'
    }
});

/**
 * @class Uatiz
 * @description Uatiz Model
 * @property {string} wid - Uatiz ID
 * @property {string} id_name - Uatiz ID Name
 * @property {string} description - Uatiz Description
 * @property {boolean} status - Uatiz Status
 * @property {string} number_status - Uatiz Number Status
 * @property {boolean} activated - Uatiz Activated
 */
export class Uatiz {
    
    @prop({ required: false, unique: false })
    public wid!: string;

    @prop({ required: true, unique: true, trim: true })
    public id_name!: string;

    @prop({ required: true, unique: false, trim: true })
    public description!: string;

    @prop({ required: false })
    public status!: boolean;

    @prop({ required: false, unique: false, trim: true })
    public number_status!: string;

    @prop({ required: false, unique: false})
    public activated!: boolean;
}
const UatizModel = getModelForClass(Uatiz,{
    schemaOptions: {
        timestamps: true,
    },
    options: {
        customName: 'Uatiz'
    }
});

export {
    UatizMsgModel,
    UatizModel,
}

