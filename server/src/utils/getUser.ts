import { ObjectId } from 'mongoose';
import { Socket, Server } from 'socket.io';

import Users, { User } from '../models/User';
import { createUser } from './createUser';
import { EVENTS } from './EVENTS';

export const getUser = async (userId: string, io: Server, socket: Socket) => {
  let user: User<ObjectId>;
  if (!userId) {
    user = (await createUser()) as User<ObjectId>;
    io.to(socket.id).emit(EVENTS.SERVER.USER_CREATED, {
      userId: user._id,
    });
  } else {
    user = await Users.findById(userId);

    if (!user) {
      //not supposed to happen
      io.to(socket.id).emit(EVENTS.SERVER.ERROR, {
        message: 'Something went wrong :( ... please try to refresh',
      });
      return null;
    }
  }

  return user;
};
