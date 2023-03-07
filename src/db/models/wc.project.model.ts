import { prop, getModelForClass, Severity, modelOptions, Ref } from '@typegoose/typegoose';
import { Store } from './wc.store.model';
import { Uatiz } from './wc.uatiz.model';

enum integrationTypeList {
    WooCommerce = 'WooCommerce',
    Shopify = 'Shopify',
}

/**
 * Model Options
 */
@modelOptions({
    options: {
      allowMixed: Severity.ALLOW, // Allow mixed types in the schema (default: Severity.ALLOW). Main reason was on the Orders model which has two properties with different types
    },
})

/**
 * @class Project
 * @description Project Schema Class - MongoDB
 */
class Project {
    @prop({ required: true, unique: true })
    public name!: string;

    @prop({ required: true, enum: integrationTypeList })
    public integrationType!: string;

    @prop({ required: true, ref: () => Store })
    public stores!: Array<Ref<Store>>; // One to Many

    @prop({ required: false, unique: false })
    public status!: boolean; // Active

    @prop({ required: false, ref: () => Uatiz })
    public uatiz!: Array<Ref<Uatiz>>; // One to Many
}
const ProjectModel = getModelForClass(Project, {
    schemaOptions: {
        timestamps: true,
    },
    options: {
        customName: 'Project'
    }
});

export {
    ProjectModel,
    Project,
}

