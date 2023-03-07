import path from 'node:path';
import log from '../Utils/logger';
import uatizDB from '../uatizBD.json';
import { Client, DefaultOptions, LocalAuth } from 'whatsapp-web.js';

// Etends Client class
export interface Session extends Client {
    id: number | string;
    checkMessages: any;
}

// Sessions array extends Client class
const clientSessions: Session[] = [];

/**
 * @description Minimal args for puppeteer
 */
const minimal_args = [
    "--autoplay-policy=user-gesture-required",
    "--disable-background-networking",
    "--disable-background-timer-throttling",
    "--disable-backgrounding-occluded-windows",
    "--disable-breakpad",
    "--disable-client-side-phishing-detection",
    "--disable-component-update",
    "--disable-default-apps",
    "--disable-dev-shm-usage",
    "--disable-domain-reliability",
    "--disable-extensions",
    "--disable-features=AudioServiceOutOfProcess",
    "--disable-gpu",
    "--disable-hang-monitor",
    "--disable-ipc-flooding-protection",
    "--disable-notifications",
    "--disable-offer-store-unmasked-wallet-cards",
    "--disable-popup-blocking",
    "--disable-print-preview",
    "--disable-prompt-on-repost",
    "--disable-renderer-backgrounding",
    "--disable-setuid-sandbox",
    "--disable-speech-api",
    "--disable-sync",
    "--hide-scrollbars",
    "--ignore-gpu-blacklist",
    "--metrics-recording-only",
    "--mute-audio",
    "--no-default-browser-check",
    "--no-first-run",
    "--no-pings",
    "--no-sandbox",
    "--no-zygote",
    "--password-store=basic",
    "--use-gl=swiftshader",
    "--use-mock-keychain"
];

/**
 * @description Path where the session data will be stored
 */
const clientPath = path.join(__dirname, '..', '..', '..', '.wwebjs_auth'); // Path where the session data will be stored
console.log('clientPath: ', clientPath);

let countCreateClientUatiz = 0;
let countStartEachClientUatiz = 0;
let countGetClientUatiz = 0;
let countGetUatizeDB = 0;

/**
 * @description Create each client for Uatiz from the DB
 * @param data Array of clients data
 */
export async function startEachClientUatiz(data: Array<[any]>): Promise<Session[]> {
    log.info(`Counter startEachClientUatiz ${countStartEachClientUatiz++}}`);
    data.forEach((clientData: any, _index: number) => {
        clientSessions.push(createClientUatiz(clientData));
    });
    return clientSessions;
    // clients[0].initialize();

    // clients[0].on('qr', async (qr: string) => {
    //     // NOTE: This event will not be fired if a session is specified.
    //     qrcodeTerminal.generate(qr, { small: true });
    // });

    // clients[0].on('authenticated', async (session: string) => {
    //     // Save session values to the file upon successful auth
    //     console.log('AUTHENTICATED', session);
    // });

    // clients[0].on('ready', async () => {
    //     console.log('READY');
    // });
    

    // // const clients = await Promise.all([startClients()]);
    // // const client = await getClient(uatizdb[1]);
    // console.log('Client->', clients.length);
    // console.log('Client->', clients[0].id);
}

/**
 * @description Create a client for Uatiz
 * @param clientData { wid: string, status:string}
 * @returns Session
 */
export function createClientUatiz(clientData: { wid: string, status:string }): Session {
    log.info(`Counter createClientUatiz ${countCreateClientUatiz++}}`);
    const client = new Client({
        authStrategy: new LocalAuth({
            clientId: clientData.wid,
            dataPath: clientPath,
        }),
        puppeteer: {
            executablePath: '/usr/bin/google-chrome',
            headless: true,
            args: [`--user-agent=${DefaultOptions.userAgent}`, ...minimal_args]
        },
        authTimeoutMs: 60 * 15000, // 15 minutes
        qrMaxRetries: 30, // 1 try is 20 seoconds, 30 tries is 10 minutes
        takeoverOnConflict: true, // false by default
        takeoverTimeoutMs: 0, // 0 by default
        ffmpegPath: '/usr/bin/ffmpeg',
    }) as Session;
    client.id = clientData.wid;
    return client;
}

/**
 * @description Get a specific client for Uatiz
 * @param clientData { wid: string, status:string}
 * @returns Promise<Session>
 */
export async function getClientUatiz(clientData: { wid: string, status:string , actived:boolean}): Promise<Session> {
    log.info(`Counter getClientUatiz ${countGetClientUatiz++}}`);
    const client = clientSessions.find((session) => session.id === clientData.wid);
    if (client) {
        console.log('client1', client);
        return client;
    }
    return createClientUatiz(clientData);
}

/**
 * @description Get the Uatiz DB
 * @returns Promise<any>
 */
export async function getUatizeDB(): Promise<any> {
    log.info(`Counter getUatizeDB ${countGetUatizeDB++}}`);
    return await JSON.parse(JSON.stringify(uatizDB));
}