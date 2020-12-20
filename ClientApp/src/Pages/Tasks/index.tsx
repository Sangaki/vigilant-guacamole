import React, {useEffect, useState} from "react";
import {RouteComponentProps} from "react-router";
import {useDispatch, useSelector} from "react-redux";
import {RootStateI} from "../../store";
import {TasksStateI} from "./reducers";
import {getTasks} from "./actions";

const getTasksState = (state: RootStateI): TasksStateI => {
    return state.tasks;
};

export const Tasks: React.FunctionComponent<{}> = () => {
    const dispatch = useDispatch();
    const tasksState = useSelector(getTasksState);
    const [mappedTasks, setMappedTasks] = useState<JSX.Element[]>([]);
    
    useEffect(() => {
        dispatch(getTasks());
    }, [dispatch, tasksState.content.length]);
    
    useEffect(() => {
        const m = tasksState.content.map(t => {
            return(
                <tr>
                    <td>{t.name}</td>
                    <td>{t.description}</td>
                    <td>{t.dateTime}</td>
                    <td>{t.priority}</td>
                    <td>{t.taskId}</td>
                </tr>
            );
        });
        setMappedTasks(m);
    }, [tasksState.content]);
    
    return(
        <div className="tasks-wrapper">
            <div className="row">
                <div className="col tasks-sidebar">
                    
                </div>
                <div className="col tasks-content">
                    
                </div>
            </div>
            <table>
                <tbody>{mappedTasks}</tbody>
            </table>
        </div>
        
    );
}