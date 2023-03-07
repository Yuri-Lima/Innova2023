
export default function leaveRoom ( userSocketId : string , chatRoomUsers : any[] ){
    return chatRoomUsers.filter ( ( user : any ) => user.id !== userSocketId );
}