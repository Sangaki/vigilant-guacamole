import { AxiosResponse } from 'axios';
import {NewTaskI, TaskI} from '../shared/types/Tasks';
import axios from './index';

export interface FetchTasksResponseParamsI {
    content: TaskI[];
}

export function deleteTaskRequest(id: string): Promise<AxiosResponse<void>> {
    return axios.delete(`tasks/${id}`);
}

export function fetchTasks(): Promise<AxiosResponse<TaskI[]>> {
    return axios.get('/tasks');
}

export function postTask(task: NewTaskI): Promise<AxiosResponse<TaskI>> {
    return axios.post('/tasks', task);
}
