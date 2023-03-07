// server/services/harper-save-message.js
import log from "./logger";
var axios = require('axios');

export type SaveMessage = {
  message: string;
  username: string;
  room: string;
  __createdtime__: number | Date;
};

export type GetMessages = SaveMessage['room'];

/**
 * @description Save message to HarperDB
 * @param param0 
 * @returns 
 */
export function harperSaveMessage({message, username, room, __createdtime__}:SaveMessage) {
  if (!message || !username || !room || !__createdtime__){
    log.error('Missing message, username, room, or __createdtime__ params', 'harperSaveMessage');
    return null;
  }
  const dbUrl = process.env.DB_HARPER_URL;
  const dbPw = process.env.DB_HARPER_KEY;
  if (!dbUrl || !dbPw){
    log.error('No DB_HARPER_URL or DB_HARPER_KEY env vars found', 'harperSaveMessage');
    return null;
  }

  let data = JSON.stringify({
    operation: 'insert',
    schema: 'realtime_chat_app',
    table: 'messages',
    records: [
      {
        message,
        username,
        room,
        __createdtime__,
      },
    ],
  });

  let config = {
    method: 'post',
    url: dbUrl,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Basic ${dbPw}`
    },
    data: data,
  };

  return new Promise((resolve, reject) => {
    axios(config)
      .then(function (response: any) {
        resolve(JSON.stringify(response.data));
      })
      .catch(function (error: any) {
        log.error(error, 'harperSaveMessage');
        reject(error);
      });
  });
}

/**
 * @description Get messages from HarperDB
 * @param param0 
 * @returns 
 */
export function harperGetMessages(room: GetMessages): Promise<string> | null {
  if (!room){
    log.error('Missing room, harperSaveMessage');
    return null;
  }
  const dbUrl = process.env.DB_HARPER_URL;
  const dbPw = process.env.DB_HARPER_KEY;
  if (!dbUrl || !dbPw){
    log.error('No DB_HARPER_URL or DB_HARPER_KEY env vars found', 'harperSaveMessage');
    return null;
  }

  let data = JSON.stringify({
    operation: 'sql',
    sql: `SELECT * FROM realtime_chat_app.messages WHERE room = '${room}' LIMIT 100`,
  });

  var config = {
    method: 'post',
    url: dbUrl,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Basic ${dbPw}`
    },
    data: data,
  };

  return new Promise((resolve, reject) => {
    axios(config)
      .then(function (response: any) {
        resolve(JSON.stringify(response.data));
      })
      .catch(function (error: any) {
        log.error(error, 'harperSaveMessage');
        reject(error);
      });
  });
}

