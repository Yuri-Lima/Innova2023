import path from 'node:path';
import qrcodeTerminal from 'qrcode-terminal'
import { Client, DefaultOptions, LocalAuth, Message, ClientSession } from 'whatsapp-web.js';

interface Session extends Client {
    id: number | string;
    checkMessages: any;
  }
  
  const sessions: Session[] = [];
  
//   const checking: any = {};

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

const clientPath = path.join(__dirname, '..', '..', '..', '.wwebjs_auth'); // Path where the session data will be stored
console.log('clientPath: ', clientPath);

async function createClient(clientData: { wid: string, status:string }): Promise<Session> {
    return new Promise(async(resolve, reject) => {
        try {
            const client =  new Client({
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
                qrMaxRetries: 5, // 5 by default
                takeoverOnConflict: true, // false by default
                takeoverTimeoutMs: 0, // 0 by default
                ffmpegPath: '/usr/bin/ffmpeg',
            }) as Session;
            client.id = clientData.wid;
            
            client.initialize();
            // await client.getState().then((state: WAState) => {
            //     console.log('STATE', state);
            // }).catch((err: any) => {
            //     console.error('ERROR', err);
            // });

            client.on('loading_screen', async (percent:any, message:Message) => {
                console.log('LOADING SCREEN', percent, message);
            });
            client.on('qr', async (qr: string) => {
                clientData.status = 'DESCONECTED';
                // NOTE: This event will not be fired if a session is specified.
                console.log('clientData', clientData);
                qrcodeTerminal.generate(qr, { small: true });
            });
            client.on('authenticated', async (session: ClientSession) => {
                console.log('AUTHENTICATED', session);
            });
            client.on('auth_failure', async (msg: Message) => {
                // Fired if session restore was unsuccessfull
                console.error('AUTHENTICATION FAILURE', msg);
                reject(new Error('AUTHENTICATION FAILURE'));
            });
            client.on('ready', async () => {
                console.log('READY');
                clientData.status = 'CONNECTED';
            });
            client.on('disconnected', async (reason: string) => {
                console.log('DISCONNECTED', reason);
                clientData.status = 'DESCONECTED';
                await client.destroy();
                sessions.splice(sessions.indexOf(client), 1); // remove client from sessions
                await createClient(clientData);
            });
            client.on('message_create', async (msg: Message) => {
                console.log('MESSAGE CREATE', msg);
            });
            client.on('message', async (msg: Message) => {
                if (msg.body === 'reset') {
                    msg.reply('👋 Uatiz reseted!');
                    client.initialize();
                }
            });
            client.on('message', async (msg: Message) => {
                if(msg.from === '353834191605@c.us') {
                    if (msg.body === 'Hi') {
                        msg.reply('👋 Hello from Uatiz! Number: 353834191605');
                    }
                }
            });
            client.on('message', async (msg:Message) => {
                if(msg.from === '558596859001@c.us') {
                    if (msg.body === 'Oi2') {
                        msg.reply('👋 Hello from Uatiz! Number: 558596859001');
                    }
                }
            });
            sessions.push(client);
            console.log('Session Size: ', sessions.length);
            resolve(client);
        } catch (error:any) {
            console.error('getClient', error);
            return error;        
        }
    });
}

async function getClient(clientData: { wid: string, status:string , actived:boolean}): Promise<Session> {
    const client = sessions.find((session) => session.id === clientData.wid);
    if (client) {
        console.log('client1', client);
        return client;
    }
    return createClient(clientData);
}

export { 
    createClient,
    getClient
};