import { NewTaskI, TaskI } from 'src/shared/types/Tasks';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { deleteTask, fetchTasks, postTask, putTask } from 'src/api/tasks';

interface TasksReducerStateI {
  tasks: TaskI[],
}

const tasksInitialState: TasksReducerStateI = {
  tasks: [],
};

export const fetchTasksWithFilter = createAsyncThunk(
  'tasks/fetchWithFilter',
  async (filter: string): Promise<TaskI[]> => {
    const response = await fetchTasks(filter);
    return (response.data);
  }
);

export const updateTask = createAsyncThunk(
  'tasks/updateTask',
  async (task: TaskI): Promise<TaskI> => {
    const response = await putTask(task);
    return (response.data);
  }
);

export const createNewTask = createAsyncThunk(
  'tasks/newTask',
  async (newTask: NewTaskI): Promise<TaskI> => {
    const response = await postTask(newTask);
    return (response.data);
  }
);

export const completeTask = createAsyncThunk(
  'tasks/deleteTask',
  async (id: string): Promise<string> => {
    await deleteTask(id);
    return id;
  }
);

const tasksSlice = createSlice({
  name: 'tasks',
  initialState: tasksInitialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(fetchTasksWithFilter.fulfilled, (state, action: PayloadAction<TaskI[]>) => {
      const syncTasks = action.payload;
      // eslint-disable-next-line no-param-reassign
      state.tasks = [
        ...syncTasks,
      ];
    });
    builder.addCase(createNewTask.fulfilled, (state, action: PayloadAction<TaskI>) => {
      const newTask = action.payload;
      // eslint-disable-next-line no-param-reassign
      state.tasks = [
        ...state.tasks,
        newTask,
      ];
    });
    builder.addCase(updateTask.fulfilled, (state, action: PayloadAction<TaskI>) => {
      const updatedTask = action.payload;
      const oldIdx = state.tasks.indexOf(state.tasks.find(e => e.taskId === action.payload.taskId)!!);
      // eslint-disable-next-line no-param-reassign
      state.tasks[oldIdx] = updatedTask;
    });
    builder.addCase(completeTask.fulfilled, (state, action: PayloadAction<string>) => {
      // eslint-disable-next-line no-param-reassign
      state.tasks = state.tasks.filter(e => e.taskId !== action.payload);
    });
  },
});

export default tasksSlice;