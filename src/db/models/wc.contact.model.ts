import { prop, getModelForClass, Severity, modelOptions } from '@typegoose/typegoose';
// import { Staff, User } from './users.model';
// import mongoose from 'mongoose';

const typePhone = {
    mobile : 'Mobile',
    home : 'Home',
    work : 'Work',
    whatsapp : 'Whatsapp',
    telegram : 'Telegram',
    production : 'Production',
    support : 'Support',
    billing : 'Billing',
    sales : 'Sales',
    marketing : 'Marketing',
    other : 'Other',
} as const;

const countryCodes = {
    Brazil : '+55',
    Ireland : '+353',
} as const;

type TypePhone = typeof typePhone[keyof typeof typePhone];
type CountryCodes = typeof countryCodes[keyof typeof countryCodes];

/**
 * Model Options
 */
@modelOptions({
    options: {
      allowMixed: Severity.ALLOW, // Allow mixed types in the schema (default: Severity.ALLOW). Main reason was on the Orders model which has two properties with different types
    }
})

/**
 * @class Contact
 * @description Contact Schema Class - MongoDB
 */
class Phone {
    @prop({ required: false, unique: false })
    public number?: string;

    @prop({ required: false, unique: false, type: () => String  })
    public type?: TypePhone;

    @prop({ required: false, type: () => String })
    public countryCode?: CountryCodes;

    @prop({ required: false, unique: false })
    public status?: boolean; // Active
}

const PhoneModel = getModelForClass(Phone, {
    schemaOptions: {
        timestamps: true,
    },
    options: {
        customName: 'Phone'
    }
});

export {
    PhoneModel,
    Phone, // has been used in the User model users.mongo.ts
}

