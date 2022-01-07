import { TimeOutsPointersList } from '../controller/socket';

export const clearGlobalTimeouts = (
  timeOutPointersList: TimeOutsPointersList
) => {
  timeOutPointersList.forEach(
    ({ firstTimeoutPointer, secondTimeOutPointer }) => {
      clearTimeout(firstTimeoutPointer);
      secondTimeOutPointer && clearTimeout(secondTimeOutPointer);
    }
  );

  timeOutPointersList.length = 0;
};
