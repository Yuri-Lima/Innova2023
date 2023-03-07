import path from "node:path";
import fs from "node:fs/promises";
import { google, Auth } from "googleapis";
import credentials from "../credentials/uatizs-926f3f09d8c7.json";
import cacheStrategyRedis from "../Utils/cacheStrategyRedis";

// If modifying these scopes, delete token.json.
const SCOPES = [
    "https://www.googleapis.com/auth/spreadsheets"
];

type cred = typeof credentials;
type spreadsheet = {
    spreadsheetId:string,
    sheetNameRange:string, 
    majorDimension:string, 
    auth: any,
    valueRenderOption?:string
};

class SpreadSheet {

    protected SCOPES: string[] = SCOPES;
    protected sheets: any;
    protected TOKEN_PATH: string;
    protected cred: cred = {...credentials};

    constructor() {
        /**
         * The file token.json stores the user's access and refresh tokens, 
         * and is created automatically when the authorization flow completes 
         * for the first time.
         */
        this.TOKEN_PATH = path.join(__dirname, "..", "..", "src", "credentials", "token.json");
    }
    /**
     * Reads previously authorized credentials from the save file.
     *
     * @return {Promise<OAuth2Client|null>}
     */
    loadSavedCredentialsIfExist():Auth.JWT|null {
        try {
            return new google.auth.JWT(
                this.cred.client_email, // client_email
                undefined, // keyFile not used for JWT
                this.cred.private_key, // private_key
                this.SCOPES // scopes
            );
        } catch (err:any) {
            console.error("No Token Found", err);
            return null;
        }
    }

    /**
     * Serializes credentials to a file comptible with GoogleAUth.fromJSON.
     *
     * @param {OAuth2Client} client
     * @return {Promise<void>}
     */
    async saveCredentials(client: any): Promise<void> {
        try {
            const payload = JSON.stringify(client.credentials);
            await fs.writeFile(this.TOKEN_PATH, payload);
            console.log('Credentials Token saved to', this.TOKEN_PATH);
        } catch (error:any) {
            console.error("Error saving credentials", error);
        }
    }

    /**
     * Load or request or authorization to call APIs.
     *
     */
    async getAuthorize():Promise<Auth.Credentials|Auth.JWT|undefined> {
        try {
            let client = this.loadSavedCredentialsIfExist();
            const authorized = await client?.authorize();
            if (authorized?.access_token) {
                await this.saveCredentials(client);
                return <Auth.JWT>client;
            }
            return authorized;
        } catch (error:any) {
            console.error("Error authorizing SpreadSheet", error);
        }
    }

    /**
     * Description: Read data from a spreadsheet
     * @param spreadsheetId string example: '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms'
     * @param sheetNameRange string example: 'Class Data!A2:E' "Class Data" is the name and A2:E is the range
     * @param majorDimension string default 'COLUMNS' -> 'COLUMNS' || 'ROWS'
     * @param auth Auth object from googleapis
     * @param valueRenderOption string default 'UNFORMATTED_VALUE' -> 'FORMATTED_VALUE' || 'FORMULA'
     */
    async readSheet({spreadsheetId, sheetNameRange, majorDimension, auth, valueRenderOption}:spreadsheet) {
        try {
            return cacheStrategyRedis(sheetNameRange, async () => {
                const sheets = google.sheets({version: 'v4', auth});
                const options = {
                    spreadsheetId: spreadsheetId || '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms',
                    range: sheetNameRange || 'Class Data!A2:E',
                    majorDimension: majorDimension || 'COLUMNS' || 'ROWS',
                    auth: auth,
                    valueRenderOption: valueRenderOption || 'UNFORMATTED_VALUE' ||'FORMATTED_VALUE' || 'FORMULA',
                }
                const res = await sheets.spreadsheets.values.get(options);
                const rows = res.data.values;
                if (!rows || rows.length === 0) {
                    console.error('No data found.');
                    return;
                }
                return rows;
            },1800); // 30 minutes cache
        } catch (error:any) {
            console.error("The API returned an error: " + error);
        }
    }
}

// (async () => {
//     const spreadSheet = new SpreadSheet();
//     const auth = await spreadSheet.authorize();
//     await spreadSheet.listMajors(auth);
// })();

export default new SpreadSheet();