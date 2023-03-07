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
 * @class Store
 * @description Store Schema Class - MongoDB
 */
class Role {
    @prop({ required: false, unique: true, trim: true })
    public name?: string;

    @prop({ required: false, unique: false, trim: true })
    public description?: string;

    @prop({ required: false, default: true })
    public status?: boolean;
}

const RoleModel = getModelForClass(Role, {
    schemaOptions: {
        timestamps: true,
    },
    options: {
        customName: 'Role'
    }
});

export {
    RoleModel,
    Role, // has been used by users.mongo.ts
}

