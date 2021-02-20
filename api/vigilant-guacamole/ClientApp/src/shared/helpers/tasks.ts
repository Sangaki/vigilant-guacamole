import { TaskI } from '../types/Tasks';
import { getFormattedDateFromString } from './date';

export interface GroupedTasksByDateI {
  [key: string]: TaskI[]
}

export function groupTasksByDate(objectArray: TaskI[]) {
  const extAcc: GroupedTasksByDateI = {};
  return objectArray.reduce(function red(acc, obj) {
    const key = getFormattedDateFromString(obj.dateTime);
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(obj);
    return acc;
  }, extAcc);
}