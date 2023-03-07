import { prop, getModelForClass, Severity, modelOptions } from '@typegoose/typegoose';

const campaignTypeList = ['cashback', 'cashback-reminder'];

/**
 * Model Options
 */
@modelOptions({
    options: {
      allowMixed: Severity.ALLOW, // Allow mixed types in the schema (default: Severity.ALLOW). Main reason was on the Orders model which has two properties with different types
    },
})

/**
 * @class Campaign
 * @description Campaign Schema Class - MongoDB
 */
class Campaign {
    @prop({ required: true, unique: true })
    public name!: string;

    @prop({ required: true, unique: true })
    public description!: string;

    @prop({ required: true, unique: false })
    public start_date!: Date;

    @prop({ required: true, unique: false })
    public end_date!: Date;

    @prop({ required: true, enum: campaignTypeList })
    public type!: string;

    /**
     * @description To do: Not sure yet how to implement this
    */
    @prop({ required: false})
    public reminders!: Array<string>; // One to Many

    @prop({ required: false, unique: false })
    public status!: boolean; // Active
}
const CampaignModel = getModelForClass(Campaign, {
    schemaOptions: {
        timestamps: true,
    },
    options: {
        customName: 'Campaign'
    }
});

export {
    CampaignModel,
    Campaign, // has been used by users.mongo.ts
}

