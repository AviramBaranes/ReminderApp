import { Server, Socket } from 'socket.io';
import { EVENTS } from './EVENTS';

export const isTimeValid = (
  name: string,
  time: number,
  io: Server,
  socket: Socket
) => {
  if (name.length < 2) {
    io.to(socket.id).emit(EVENTS.SERVER.ERROR, {
      message: "Reminder's name is too short",
    });
    return false;
  }
  if (name.length > 15) {
    io.to(socket.id).emit(EVENTS.SERVER.ERROR, {
      message: "Reminder's name is too long",
    });
    return false;
  }
  if (time > 86_400) {
    io.to(socket.id).emit(EVENTS.SERVER.ERROR, {
      message: 'Timer is too long',
    });
    return false;
  }

  return true;
};
