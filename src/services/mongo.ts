import mongoose from 'mongoose';
require("dotenv").config();

const MONOGO_URL = <string>process.env.DB_MONGO_URL;

// Openned connection
mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB ReadyState: ' + mongoose.connection.readyState);
});

// Connected to MongoDB
mongoose.connection.on('connected', () => {
    console.log('MongoDB connected');
});

// Error connection
mongoose.connection.on('error', (err:any) => {
    console.error(err);
    throw new Error('Error in connection to MongoDB');
});

// Disconnected from MongoDB
mongoose.connection.on('disconnected', () => {
    console.log('MongoDB disconnected');
});

async function mongoConnection() {
    try {
        if (mongoose.connection.readyState === 1) {
            console.log('MongoDB Connected Already: ' + mongoose.connection.db.databaseName);
            return mongoose.connection;
        }
        mongoose.set('strictQuery', true); // It will throw an error if you try to query a field that is not in the schema
        const conn = await mongoose.connect(MONOGO_URL, {dbName: 'newinnova'});
        console.log(`MongoDB Connected: ${conn.connection.db.databaseName}`);
        return conn;
    } catch (error:any) {
        error.source = "mongoConnection"; // Add source to error
        throw new Error(error);
    }
}

// Mongo Disconnection
 async function mongoDisconnection() {
    try {
        return await mongoose.disconnect();
    } catch (error:any) {
        error.source = "mongoDisconnection"; // Add source to error
        throw new Error(error);
    }
}

export { mongoConnection, mongoDisconnection };

