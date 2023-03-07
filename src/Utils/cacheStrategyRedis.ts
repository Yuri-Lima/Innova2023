import redis from "../services/redis";

/**
     * Description: cache strategy
     * @param key string
     * @param callback function
     * @param expire number default 300 seconds (5 minutes)
     * @returns any
     */
async function cacheStrategy (key:string, callback:Function, expire:number = 300) {
    const cached = await redis.get(key);
    if (cached) {
        console.log("from cache", true);
        return JSON.parse(cached); // It is a blocking operation and should be avoided.
    }
    const result = await callback();

    await redis.set(key , JSON.stringify(result));

    // expire in. Default 5 minutes
    await redis.expire(key, expire);

    console.log("from cache", false);

    return result;
}

export default cacheStrategy;