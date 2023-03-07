import redis from './redis';

describe("Redis Tests", () => {
    
    {test('Redis Set', async() => {
        const key:string = 'testKey';
        const value:string = 'testValue';
        const res = await redis.set(key, value);
        console.log("Redis Set: ", res);
        expect(res).toBe('OK');
    });
    test('Redis Has', async() => {
        const key:string = 'testKey';
        const res = await redis.exists(key);
        console.log("Redis Has: ", res);
        expect(res).toBe(1);
    });
    test('Redis Append', async() => {
        const key:string = 'testKey';
        const res = await redis.append(key, 'testValue2');
        console.log("Redis Append: ", res);
        expect(res).toBe(19); // 11 + 8 = 19 characters testValue + testValue2.
    });
    test('Redis Get', async() => {
        const key:string = 'testKey';
        const res = await redis.get(key);
        console.log("Redis Get: ", res);
        expect(res).toBe('testValuetestValue2'); // testValue + testValue2 appended
    });
    test('Redis Del', async() => {
        const key:string = 'testKey'
        const res = await redis.del(key);
        console.log("Redis Del: ", res);
        expect(res).toBe(1);
    });}

});
    