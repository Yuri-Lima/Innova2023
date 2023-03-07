import { Server as SocketIO, Socket } from 'socket.io';
import logger from '../Utils/logger';
import { harperSaveMessage, harperGetMessages, SaveMessage } from '../Utils/harper-save-message';
import log from '../Utils/logger';
import leaveRoom from '../Utils/leave-room';

const EVENTS = {
    CONNECTION: 'connection',
    DISCONNECT: 'disconnect',
};

// let chatRoom: string = '';
let allUsers: any[] = [];

function socket({io}: {io: SocketIO}) {
    
    logger.info('Socket.io enabled');
    io.on(EVENTS.CONNECTION, (socket: Socket) => {
        logger.info(`A user connected with id: ${socket.id}`);
        socket.on('disconnect', () => {
            console.log('user disconnected');
        });
        socket.on('join_room', async (msg:SaveMessage) => {
            const { username, room } = msg;
            socket.join(room);
            let __createdtime__ = Date.now(); // Current timestamp

            // Send msg to all users in room
            socket.to(room).emit('receive_message', {
                message: `User ${username} has joined the room ${room}`,
                username: 'admin',
                __createdtime__,
            });

            // Send welcome msg to user that just joined chat only
            socket.emit('receive_message', {
                message: `Welcome ${username} to room ${room}`,
                username: 'admin',
                __createdtime__,
            });

            // Save the new user to the room
            // chatRoom = room;
            allUsers.push({ id: socket.id, username, room });
            let chatRoomUsers = allUsers.filter((user) => user.room === room);
            socket.to(room).emit('chatroom_users', chatRoomUsers);
            socket.emit('chatroom_users', chatRoomUsers);

            // Get last 100 messages sent in the chat room
            try {
                const last100Messages = await harperGetMessages(room);
                // log.info(res, 'harperGetMessages');
                socket.emit('last_100_messages', last100Messages)
            } catch (error:any) {
                log.error(error);
            }

        });

        // Send msg to all users in room and save to db
        socket.on('send_message', async (data) => {
            const { message, username, room, __createdtime__ } = data;
            io.in(room).emit('receive_message', data); // Send to all users in room, including sender
            try {
                const res = await harperSaveMessage({message, username, room, __createdtime__}); // Save message in db
                console.log(res, 'harperSaveMessage');
            } catch (error:any) {
                log.error(error);    
            }
            });

        // Leave room
        socket.on('leave_room', (data) => {
            const { username, room } = data;
            socket.leave(room);
            const __createdtime__ = Date.now();
            // Remove user from memory
            allUsers = leaveRoom(socket.id, allUsers);
            socket.to(room).emit('chatroom_users', allUsers);
            socket.to(room).emit('receive_message', {
              username: "admin",
              message: `${username} has left the chat`,
              __createdtime__,
            });
            console.log(`${username} has left the chat`);
          });
    });
}

export default socket;