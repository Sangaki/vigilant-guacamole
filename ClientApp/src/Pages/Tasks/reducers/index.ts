import { TaskI } from '../../../shared/types/Tasks';
import { TASKS_FAIL, TASKS_SUCCESS, TASKS_LOADING, TasksDispatchTypes } from '../actions/types';

export interface TasksStateI {
    loading: boolean;
    error: boolean;
    content: TaskI[];
    wasLoaded: boolean;
}

const defaultState: TasksStateI = {
    loading: false,
    error: false,
    content: [],
    wasLoaded: false,
};

export default (state: TasksStateI = defaultState, action: TasksDispatchTypes): TasksStateI => {
    switch (action.type) {
        case TASKS_FAIL:
            return {
                ...state,
                loading: false,
                error: true,
                wasLoaded: true,
            };
        case TASKS_LOADING:
            return {
                ...state,
                loading: true,
                error: false,
            };
        case TASKS_SUCCESS:
            return {
                ...state,
                loading: false,
                error: false,
                wasLoaded: true,
                content: action.payload,
            };
        default:
            return state;
    }
};
