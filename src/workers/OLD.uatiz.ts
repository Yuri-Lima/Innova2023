// import qrcode from 'qrcode'
// import qrcodeTerminal from 'qrcode-terminal'
// import { Message } from 'whatsapp-web.js'
import { createClient, getClient } from '../services/OLD.uatiz';
import uatizDB from '../uatizBD.json';

const uatizdb = JSON.parse(JSON.stringify(uatizDB));

// const ioSocket = io;

async function StartSessions(): Promise<void> {
    new Promise(async (resolve, _reject) => {
        uatizdb.forEach(async(clientData: any, index: number) => {
            console.log('Index', index);
            await createClient(clientData);
        });
        resolve(true);
    });
};

( async () => {
    await StartSessions();
    const client = await getClient(uatizdb[1]);
    console.log('client2', client);
    // if(!client) {
    //     console.log('No client');
    //     return;
    // }
    // if(await client.getState() === 'CONNECTED') {
    //     await client.sendMessage('5585996859001@c.us', 'Hola').then((message: any) => {
    //         console.log('Message', message);
    //     });
    // }
})();