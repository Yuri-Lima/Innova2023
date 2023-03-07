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
 * @class Address
 * @description Takes all the users addresses
 */
class Address {
    @prop({ required: false, unique: false })
    public address1!: string;

    @prop({ required: false, unique: false })
    public address2!: string;

    @prop({ required: false, unique: false })
    public city!: string;

    @prop({ required: false, unique: false })
    public state!: string;

    @prop({ required: false, unique: false })
    public zip!: string;

    @prop({ required: false, unique: false })
    public country!: string;

    @prop({ required: false, unique: false })
    public status!: boolean; // status
}
const AddressModel = getModelForClass(Address, {
    schemaOptions: {
        timestamps: true,
    },
    options: {
        customName: 'Address'
    }
});

/**
 * @class Location
 * @description Takes Longitude and Latitude
 */
class Location {
    @prop({ required: false, unique: false })
    public longitude!: string;

    @prop({ required: false, unique: false })
    public latitude!: string;
}

const LocationModel = getModelForClass(Location, {
    schemaOptions: {
        timestamps: true,
    },
    options: {
        customName: 'Location'
    }
});

export {
    AddressModel,
    Address, // has been used by users.mongo.ts
    LocationModel,
    Location // has been used by company.mongo.ts
}

