import { Dispatch } from 'redux';
import { fetchTasks, postTask } from '../../../api/tasks';
import { TASKS_FAIL, TASKS_SUCCESS, TASKS_LOADING, TasksDispatchTypes } from './types';
import { NewTaskI } from '../../../shared/types/Tasks';

export const getTasks = (selectedFilter: string) => async (dispatch: Dispatch<TasksDispatchTypes>) => {
  try {
    dispatch({
      type: TASKS_LOADING,
    });
    const response = await fetchTasks(selectedFilter);
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

export const createTask = (newTask: NewTaskI) => async (dispatch: Dispatch<TasksDispatchTypes>) => {
  try {
    dispatch({
      type: TASKS_LOADING,
    });
    const response = await postTask(newTask);
    const payload = response.data;

    dispatch({
      type: TASKS_SUCCESS,
      payload: [payload],
    });
  } catch (error) {
    dispatch({
      type: TASKS_FAIL,
    });
  }
};
