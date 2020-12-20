import { TaskI } from '../../../shared/types/Tasks';

export const TASKS_LOADING = 'TASKS_LOADING';
export const TASKS_FAIL = 'TASKS_FAIL';
export const TASKS_SUCCESS = 'TASKS_SUCCESS';

export interface TasksLoading {
    type: typeof TASKS_LOADING;
}

export interface TasksSuccess {
    type: typeof TASKS_SUCCESS;
    payload: TaskI[];
}

export interface TasksFail {
    type: typeof TASKS_FAIL;
}

export type TasksDispatchTypes = TasksLoading | TasksSuccess | TasksFail;
