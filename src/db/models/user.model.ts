// import mongoose from 'mongoose';
import { prop, pre, getModelForClass, modelOptions, Severity, DocumentType, index, Ref } from '@typegoose/typegoose';
import { randomUUID } from 'crypto';
import * as argon2 from "argon2";
// import { Address } from './wc.address.model';
// import { Company } from './wc.company.model';
import { Phone } from './wc.contact.model';
import { Role } from './wc.role.model';
import log from '../../Utils/logger';

// import { Project } from './wc.project.model';
/**
 * @description Omit private fields from user object when the user try to get his/her own profile. Login/Session for example.
 */
const privateFields = [
  'password',
  'isVerified',
  '__v'
]

@pre<User>('save', async function (next) {
  if (!this.isModified('password')) {
      return next();
  }
  // log.info(this.password, 'Hashing password');
  const hash = await argon2.hash(this.password);
  // log.info(hash, 'Hashed password');

  this.password = hash;
  next();
})

@pre<User>('save', async function (next) {
  if (!this.isModified('firstName') && !this.isModified('lastName') && !this.isModified('middleName')) {
      return next();
  }
  // Capitalize first letter of first name
  if(this.firstName) {
      const lenght = this.firstName.split(' ').length;
      if(lenght > 1) {
          this.firstName = this.firstName.split(' ').map((name:string) => name.charAt(0).toUpperCase() + name.slice(1)).join(' ');
      } else {
          this.firstName = this.firstName.charAt(0).toUpperCase() + this.firstName.slice(1);
      }
  }
  // Capitalize first letter of middle name
  if(this.middleName) {
      const lenght = this.middleName.split(' ').length;
      if(lenght > 1) {
          this.middleName = this.middleName.split(' ').map((name:string) => name.charAt(0).toUpperCase() + name.slice(1)).join(' ');
      } else {
          this.middleName = this.middleName.charAt(0).toUpperCase() + this.middleName.slice(1);
      }
  }
  // Capitalize first letter of last name
  if(this.lastName) {
      const lenght = this.lastName.split(' ').length;
      if(lenght > 1) {
          this.lastName = this.lastName.split(' ').map((name:string) => name.charAt(0).toUpperCase() + name.slice(1)).join(' ');
      } else {
          this.lastName = this.lastName.charAt(0).toUpperCase() + this.lastName.slice(1);
      }
  }
})
@index({ email: 1 }) // it means email is unique
@modelOptions(
  {
      schemaOptions: {
          timestamps: true, collection: 'users'
      },
      options: {
          allowMixed: Severity.ALLOW,
          customName: 'User'
      }
  }
)
/**
 * @class User
 * @description User Schema Class - MongoDB
 */
class User {
    @prop({lowercase: true, trim: true, required: true, unique: true})
    public email!: string;
    
    @prop({required: true, trim: true, lowercase: true})
    public firstName!: string;

    @prop({trim: true, lowercase: true})
    public middleName!: string;

    @prop({required: true, trim: true, lowercase: true})
    public lastName!: string;
    
    @prop({required: true, trim: true })
    public password!: string;

    @prop({required: true, trim: true, default: () => randomUUID() })
    public verificationCode!: string;

    @prop()
    public passwordResetCode!: string | null; // when null, no password reset is in progress

    @prop({required: true, default: false })
    public isVerified!: boolean;

    async validatePassword(this:DocumentType<User>, candidatePassword:string): Promise<boolean> {
        const responseID = randomUUID();
        try {
            return await argon2.verify(this.password, candidatePassword);
        } catch (error:any) {
            error.code = responseID;
            log.error(error, 'Error while validating password');
            return false;
        }
    }

    @prop({ required: false, default: false })
    public status!: boolean;

    @prop({ ref: () => Phone, type: () => Object } )
    public phone?:  Ref<Phone>[];

    @prop({ required: false, default: 'https://www.example.com', trim: true })
    public website!: string;

    @prop({ required: false, default: 'Leave your notes here.', trim: true })
    public notes!: string;

    // // One to Many
    @prop({ ref: () => Role })
    public role?: Ref<Role, string>[];

    // @prop({ required: false, ref: () => Staff})
    // public staff!: Array<Ref<Staff>>;

    // @prop({ required: false, ref: () => Address })
    // public address!: Array<Ref<Address>>;

    // @prop({ required: false, ref: () => Company })
    // public company!: Array<Ref<Company>>;

    // @prop({ required: false, ref: () => Project })
    // public projects!: Array<Ref<Project>>;
}

/**
 * @description User Model
 */
const UserModel = getModelForClass(User);

@index({ email: 1 }) // it means email is unique
@modelOptions(
  {
      schemaOptions: {
          timestamps: true, collection: 'staff'
      },
      options: {
          allowMixed: Severity.ALLOW,
          customName: 'Staff'
      }
  }
)
/**
 * @class Staff
 * @description Staff Schema Class - MongoDB
 */
class Staff {
  // One to One
  @prop({ required: true, trim: true })
  public first_name!: string;

  @prop({ required: true, trim: true })
  public last_name!: string;

  @prop({ required: true, unique: true, trim: true })
  public email!: string;

  @prop({ required: true, trim: true })
  public password!: string;

  @prop({ ref: () => Phone })
  public phone!: Ref<Phone>[];

  @prop({ required: true, ref: () => Role })
  public role!: Ref<Role>;

  @prop({ required: true, default: true })
  public status!: boolean;

}
/**
 * @description User Model
 */
const StaffModel = getModelForClass(Staff);

export { 
    UserModel,
    User,
    Staff,
    StaffModel,
    privateFields
}

/**
 * staff: [
        {
          first_name: 'Test_staff',
          last_name: 'Test_staff',
          email: 'test@gmail.com',
          password: '123456',
          phone: [
            {
              number: '1234567890',
              type: 'mobile',
              countryCode: '+55',
              status: true,
            },
          ],
          role: 'admin',
          status: true,
        },
      ],
      address: [
        {
          address1: '123 Main St',
          address2: 'Apt 1',
          city: 'New York',
          state: 'NY',
          zip: '10001',
          country: 'US',
          status: true,
        },
      ],
      company: [
        {
          name: 'Test Company',
          address: [
            {
              address1: '123 Main St',
              address2: 'Apt 1',
              city: 'New York',
              state: 'NY',
              zip: '10001',
              country: 'US',
            },
          ],
          phone: [
            {
              number: '1234567890',
              type: 'mobile',
              countryCode: '+55',
              status: true,
            },
          ],
          email: 'company@gmail.com',
          website: 'https://www.example.com',
          logo: {
            name: 'logo.png',
            url: 'https://www.example.com',
            status: true,
          },
          location: {
            longitude: '1234567890',
            latitude: '1234567890',
          },
          openhours: {
            monday: {
              open: '09:00',
              close: '17:00'
            },
            tuesday: {
              open: '09:00',
              close: '17:00'
            },
            wednesday: {
              open: '09:00',
              close: '17:00'
            },
            thursday: {
              open: '09:00',
              close: '17:00'
            },
            friday: {
              open: '09:00',
              close: '17:00'
            },
            saturday: {
              open: '09:00',
              close: '17:00'
            },
            sunday: {
              open: '09:00',
              close: '17:00'
            }
          },
          status: true,
        },
      ],
      projects: [
        {
          name: 'Test Project 1',
          integrationType: 'WooCommerce',
          stores: [
            {
              name: 'Test Store 1',
              phone: [
                {
                  number: '1234567890',
                  type: 'mobile',
                  countryCode: '+55',
                  status: true,
                },
              ],
              authentication: {
                url: 'https://www.example.com',
                consumer_key: 'ck_1234567890',
                consumer_secret: 'cs_1234567890',
                status: true,
              },
              company: [
                {
                  name: 'Test Company Store 1',
                  address: [
                    {
                      address1: '123 Main St',
                      address2: 'Apt 1',
                      city: 'New York',
                      state: 'NY',
                      zip: '10001',
                      country: 'US',
                    },
                  ],
                  phone: [
                    {
                      number: '1234567890',
                      type: 'mobile',
                      countryCode: '+55',
                      status: true,
                    },
                  ],
                  email: 'store1@gmail.com',
                  website: 'https://www.example.com',
                  logo: {
                    name: 'logo.png',
                    url: 'https://www.example.com',
                    status: true,
                  },
                  location: {
                    longitude: '123456789',
                    latitude: '123456789',
                  },
                  openhours: {
                    monday: {
                      open: '09:00',
                      close: '17:00'
                    },
                  },
                  status: true,
                }
              ],
              campaigns: [{
                name: 'Test Campaign 1',
                description: 'Test Campaign 1',
                start_date: '2020-01-01',
                end_date: '2020-01-01',
                reminders: ["TODO"],
                type: 'cashback',
              }],
              status: true,
            },
          ],
          status: true,
        },
      ],
 */