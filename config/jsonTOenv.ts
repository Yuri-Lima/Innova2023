import path from "node:path"; 
import JsonToEnv from "dynamic.envs";

const set =  new JsonToEnv({
    readFileFrom: path.join(__dirname, "..", "env.json"),
    saveFileTo: path.join(__dirname,"..", ".env")
},
{
    overWrite_Original_Env: true,
    createEnvFile: true,
    createJsonFile: true,
    log: true
});

// Set Environment Variables
set.setEnv();