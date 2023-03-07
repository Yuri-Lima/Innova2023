import Redis from 'ioredis';
require('dotenv').config();

const redis = new Redis({
    host: process.env.REDIS_URL,
    port: process.env.REDIS_PORT,
    password: process.env.REDIS_PASSWORD,
});


export default redis;