import { AxiosResponse } from 'axios';
import { NewTaskI, TaskI } from 'src/shared/types/Tasks';
import axios from './index';

export interface FetchTasksResponseParamsI {
  content: TaskI[];
}

export function fetchTasks(selectedFilter: string): Promise<AxiosResponse<TaskI[]>> {
  if (selectedFilter) {
    return axios.get(`/tasks?taskPriority=${selectedFilter}`);
  } 
  return axios.get('/tasks');
}

export function postTask(task: NewTaskI): Promise<AxiosResponse<TaskI>> {
  return axios.post('/tasks', task);
}

export function putTask(task: TaskI): Promise<AxiosResponse<TaskI>> {
  return axios.put('/tasks', task);
}

export function deleteTask(id: string): Promise<AxiosResponse<void>> {
  return axios.delete(`/tasks/${id}`);
}