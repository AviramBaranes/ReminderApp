import { Server, Socket } from 'socket.io';
import { clearGlobalTimeouts } from '../utils/clearTimeouts';
import { createReminder } from '../utils/createReminder';
import { EVENTS } from '../utils/EVENTS';

import { getTimers } from '../utils/getTimers';
import { getUser } from '../utils/getUser';
import { isTimeValid } from '../utils/validateTimer';
import { watchTimers } from '../utils/watchTimers';

export type TimeOutsPointersList = {
  firstTimeoutPointer: NodeJS.Timeout;
  secondTimeOutPointer: NodeJS.Timeout | null;
}[];

function socket(io: Server) {
  io.on(EVENTS.connection, async (socket: Socket) => {
    console.log('Socket connected');

    const timeOutPointersList: TimeOutsPointersList = [];

    socket.on('disconnect', () => {
      clearGlobalTimeouts(timeOutPointersList);
    });

    socket.on(EVENTS.CLIENT.CHECK_FOR_FINISHED_TIMERS, async ({ userId }) => {
      if (!userId) {
        io.to(socket.id).emit(EVENTS.SERVER.ERROR, {
          message: 'something went wrong :(',
        });
        return;
      }

      await watchTimers(userId, io, socket, timeOutPointersList);
    });

    let latest_NEW_TIMER_Call: number; //for rate limits

    socket.on(
      EVENTS.CLIENT.NEW_TIMER,
      async ({ userId, name, time, timeStarted, description }) => {
        try {
          if (
            latest_NEW_TIMER_Call &&
            Date.now() - latest_NEW_TIMER_Call < 2000
          ) {
            io.to(socket.id).emit(EVENTS.SERVER.ERROR, {
              message:
                'You need to wait at least 2 seconds between each timer creation',
            });
            return;
          }
          const user = await getUser(userId, io, socket);
          if (!user) return;

          if (!isTimeValid(name, time, io, socket)) return;

          await createReminder(
            user._id,
            name,
            time,
            timeStarted,
            description,
            user
          );

          io.to(socket.id).emit(EVENTS.SERVER.TIMER_CREATED);

          clearGlobalTimeouts(timeOutPointersList); //if not clearing the timeout some reminders will be sent more than once

          await watchTimers(user._id, io, socket, timeOutPointersList);
          latest_NEW_TIMER_Call = Date.now();
        } catch (err) {
          console.log(err);
          io.to(socket.id).emit(EVENTS.SERVER.ERROR, {
            message: 'something went wrong :(',
          });
        }
      }
    );

    socket.on(EVENTS.CLIENT.GET_TIMERS, async ({ userId }) =>
      getTimers(userId, io, socket)
    );
  });
}

export default socket;
