import { UserModel, User }  from  '../models/user.model';

/**
 * description: Create a new user
 * @param input User input
 * @returns User
 */
async function createUser(input: Partial<User>){
        return await UserModel.create(input);
}
/**
 * description: Find user by id
 * @param id _id of the user
 * @returns User
 */
async function findUserById(id:string){
    return await UserModel.findById(id);
}

async function findUserByEmail(email:string){
    return await UserModel.findOne({email});
}

export {
    createUser,
    findUserById,
    findUserByEmail
}