import { prop, getModelForClass, Severity, modelOptions, Ref } from '@typegoose/typegoose';
import { Address, Location } from './wc.address.model';
import { Phone } from './wc.contact.model';

/**
 * Model Options
 */
@modelOptions({
    options: {
      allowMixed: Severity.ALLOW, // Allow mixed types in the schema (default: Severity.ALLOW). Main reason was on the Orders model which has two properties with different types
    }
})

/**
 * @class Logo
 * @description Logo Schema Class - MongoDB
 */
class Logo {
    @prop({ required: false, unique: false })
    public name!: string;

    @prop({ required: false, unique: false })
    public url!: string;

    @prop({ required: false, unique: false })
    public status!: boolean; // Active
}

/**
 * @class Company
 * @description Company Schema Class - MongoDB
 */
class Company {
    @prop({ required: false, unique: false })
    public name!: string;

    @prop({ required: false, ref : () => Address })
    public address!: Array<Ref<Address>>;

    @prop({ required: false, ref : () => Phone })
    public phone!: Array<Ref<Phone>>;

    @prop({ required: false, unique: false })
    public email!: string;

    @prop({ required: false, unique: false })
    public website!: string;

    @prop({ required: false, ref : () => Logo })
    public logo!: Ref<Logo>;

    @prop({ required: false, ref : () => Location })
    public location!: Ref<Location>;

    @prop({ required: false, unique: false })
    public openhours!: {
        monday: {
            open: Date,
            close: Date
        },
        tuesday: {
            open: Date,
            close: Date
        },
        wednesday: {
            open: Date,
            close: Date
        },
        thursday: {
            open: Date,
            close: Date
        },
        friday: {
            open: Date,
            close: Date
        },
        saturday: {
            open: Date,
            close: Date
        },
        sunday: {
            open: Date,
            close: Date
        }
    }

    @prop({ required: false })
    public status!: boolean; // status
}
const CompanyModel = getModelForClass(Company, {
    schemaOptions: {
        timestamps: true,
    },
    options: {
        customName: 'Company'
    }
});

export {
    CompanyModel,
    Company, // has been used in the User model users.mongo.ts
}

