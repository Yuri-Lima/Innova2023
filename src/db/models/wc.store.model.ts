import { prop, getModelForClass, Severity, modelOptions, Ref } from '@typegoose/typegoose';
import { Campaign } from './wc.campaign.model';
import { Company } from './wc.company.model';
import { Phone } from './wc.contact.model';

/**
 * Model Options
 */
@modelOptions({
    options: {
      allowMixed: Severity.ALLOW, // Allow mixed types in the schema (default: Severity.ALLOW). Main reason was on the Orders model which has two properties with different types
    },
})

/**
 * @class Store
 * @description Store Schema Class - MongoDB
 */
class Store {
    @prop({ required: true, unique: true })
    public name!: string;

    @prop({ required: true, ref: () => Phone })
    public phone!: Ref<Phone>

    @prop({ required: true, unique: false })
    public authentication!: {
        url: string,
        consumer_key: string,
        consumer_secret: string,
        status: boolean
    };
    
    @prop({ required: true, ref: () => Company })
    public company!: Ref<Company>;

    @prop({ required: true, ref: () => Campaign })
    public campaigns!: Array<Ref<Campaign>>;

    @prop({ required: false, unique: false })
    public status!: boolean; // Active
}
const StoreModel = getModelForClass(Store, {
    schemaOptions: {
        timestamps: true,
    },
    options: {
        customName: 'Store'
    }
});

export {
    StoreModel,
    Store, // has been used by users.mongo.ts
}

