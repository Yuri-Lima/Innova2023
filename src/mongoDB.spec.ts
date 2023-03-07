// import request from 'supertest';
// import orderCreatedSample from './Utils/wc.samples/order.created.sample';
import { UserModel } from './db/models/user.model';
import { RoleModel } from './db/models/wc.role.model';
import { mongoConnection, mongoDisconnection } from './services/mongo';
// import App from './app';
import { PhoneModel } from './db/models/wc.contact.model';
require('dotenv').config();

describe("MongoDB Tests", () => {
  
  beforeAll(async() => {
    await mongoConnection();
  });

  afterAll(async() => {
    await mongoDisconnection();
  });

  test('Insert/Create Role', async() => {
    const body = [
      {
        name: 'superadmin',
        description: 'Super Administrator',
        status: true
      },
      {
        name: 'admin',
        description: 'Administrator',
        status: true
      },
      {
        name: 'staff',
        description: 'Staff',
        status: true
      },
      {
        name: 'user',
        description: 'User',
        status: true
      },
    ]
    try {
      const res = await RoleModel.insertMany(body); // insertMany is used to insert multiple documents
      console.log('RoleModel Create: ', res);
    } catch (error:any) {
      if (error.code === 11000) {
        console.error('Duplicate Key');
        return error;
      } else {
        error.code = 'role-01';
        console.error('RoleModel Create: ', error);
        return error;
      }
    }
  });

  test('Get All Roles', async() => {
    try {
      const res = await RoleModel.find({});
      console.log('RoleModel Find: ', res);
    } catch (error:any) {
      if (error.code === 11000) {
        console.error('Duplicate Key');
        return error;
      } else {
        console.error('RoleModel Find: ', error);
        error.code = 'role-02';
        return error;
      }
    }
  });


  test('Create User', async() => {
    const body = {
      first_name: 'Test',
      last_name: 'Test',
      email: 'test3@gmail.com',
      password: '123456'
    }

    try {
      const res = await UserModel.create(body);
      console.log('UserModel Create: ', res);
    } catch (error:any) {
      if (error.code === 11000) {
        console.error('Duplicate Key');
        return error;
      } else {
        console.error('UserModel Create: ', error);
        error.code = 'user-01';
        return error;
      }
    }
  });

  test('Fidn User', async() => {
    try {
      const res = await UserModel.findOne({email: 'test3@gmail.com'});
      console.log('UserModel Find: ', res);
    } catch (error:any) {
      if (error.code === 11000) {
        console.error('Duplicate Key');
        return error;
      } else {
        console.error('UserModel Find: ', error);
        error.code = 'user-02';
        return error;
      }
    }
  });

  test('Insert Admin Role To The User', async() => {
    try {
      const user = await UserModel.findOneAndUpdate(
        {
          email: 'test3@gmail.com' // find the user with the email
        },
          {
            $set: {
              role: ['63d1c4eefd4dc40ddf25bee5', '63d1c4eefd4dc40ddf25bee7']
            }
          }
      );
      console.log('Insert Admin Role To The User: ', user);
      // console.log('RoleModel Find: ', getRole);
      // expect(res?.role).toEqual(expect.arrayContaining([roles?._id]));
    } catch (error:any) {
      if (error.code === 11000) {
        console.error('Duplicate Key');
        return error;
      } else {
        console.error('UserModel Update: ', error);
        error.code = 'user-03';
        return error;
      }
    }
  });

  test('Insert Phones', async() => {
    try {
      const phoneList = [
        {
          number: '123456789',
          type: 'Mobile',
          status: true
        },
        {
          number: '123456789',
          type: 'WhatsApp',
          status: true
        },
      ]
      const res = await PhoneModel.insertMany(phoneList); // insertMany is used to insert multiple documents
      console.log('PhoneModel Create: ', res);
    } catch (error:any) {
      if (error.code === 11000) {
        console.error('Duplicate Key');
        return error;
      } else {
        console.error('PhoneModel Create: ', error);
        error.code = 'phone-01';
        return error;
      }
    }
  });

  test.skip('Insert Phone To The User', async() => {
    try {
      const user = await UserModel.findOne({email: 'test3@gmail.com'});
      console.log('UserModel Find: ', user);
      
      // user?.phone?.push(phoneList);
    } catch (error:any) {
      if (error.code === 11000) {
        console.error('Duplicate Key');
      } else {
        console.error('UserModel Update: ', error);
      }
    }
  });
});