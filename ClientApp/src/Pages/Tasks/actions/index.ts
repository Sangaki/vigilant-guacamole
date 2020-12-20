import { Dispatch } from 'redux';
import { fetchTasks } from "../../../api/tasks";
import { TASKS_FAIL, TASKS_SUCCESS, TASKS_LOADING, TasksDispatchTypes } from '../actions/types';

export const getTasks = () => async (dispatch: Dispatch<TasksDispatchTypes>) => {
    try {
        dispatch({
            type: TASKS_LOADING,
        });
        const response = await fetchTasks();
        const payload = response.data;

        dispatch({
            type: TASKS_SUCCESS,
            payload,
        });
    } catch (error) {
        dispatch({
            type: TASKS_FAIL,
        });
    }
};
