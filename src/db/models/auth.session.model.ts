import { prop, getModelForClass, modelOptions, Ref } from '@typegoose/typegoose';
import { User } from './user.model';

@modelOptions({
    schemaOptions: {
        timestamps: true,
    }
})

class Session {
    @prop({ref: () => User})
    user!: Ref<User>

    @prop({default: true})
    valid!: boolean
}
const SessionModel = getModelForClass(Session, { schemaOptions: { collection: 'sessions' } });

export { 
    Session, 
    SessionModel 
};