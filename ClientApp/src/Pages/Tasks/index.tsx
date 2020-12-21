import React, {useCallback, useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {useHistory} from "react-router";
import {Button, Collapse, Dropdown, DropdownItem, DropdownMenu, DropdownToggle} from "reactstrap";
import DatePicker from 'react-date-picker';
import TimePicker from 'react-time-picker';
import {RootStateI} from "../../store";
import {TasksStateI} from "./reducers";
import {createTask, getTasks} from "./actions";
import {LoginStateI} from "../Login/reducers";
import {LogOutDispatch} from "../Login/actions";
import {getFormattedDateFromString, getFormattedTimeFromString} from "../../shared/helpers/date";
import {Priority} from "../../shared/enums/priority";
import {NewTaskI} from "../../shared/types/Tasks";
import './index.scss';

const getTasksState = (state: RootStateI): TasksStateI => {
    return state.tasks;
};

const getLoginState = (state: RootStateI): LoginStateI => {
    return state.login;
};

export const Tasks: React.FunctionComponent<{}> = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    const tasksState = useSelector(getTasksState);
    const loginState = useSelector(getLoginState);
    const [mappedTasks, setMappedTasks] = useState<JSX.Element[]>([]);
    
    const [collapseSidebar, setCollapseSidebar] = useState(true);
    const [menuOpen, setMenuOpen] = useState(false);
    
    const [newTaskHeader, setNewTaskHeader] = useState('');
    const [newTaskDescription, setNewTaskDescription] = useState('');
    const [newTaskDate, setNewTaskDate] = useState<Date>(new Date());
    const [newTaskTime, setNewTaskTime] = useState('10:00');
    const [newTaskCompiledDate, setNewTaskCompiledDate] = useState<Date>(new Date());
    const [newTaskPriority, setNewTaskPriority] = useState(-1);
    const [newTaskPriorityOpen, setNewTaskPriorityOpen] = useState(false);
    
    const [newTaskHeaderError, setNewTaskHeaderError] = useState(false);
    
    const toggleSidebar = () => setCollapseSidebar(!collapseSidebar);
    const toggleMenu = () => setMenuOpen(!menuOpen);
    const toggleNewTaskPriority = () => setNewTaskPriorityOpen(!newTaskPriorityOpen);
    
    const signOut = useCallback(() => {
        dispatch(LogOutDispatch());
        history.push('/login');
    }, [dispatch, history]);
    
    const onDateChange = useCallback((date) => {
        setNewTaskDate(date);
    }, [setNewTaskDate]);

    const onTimeChange = useCallback((time) => {
        setNewTaskTime(time);
    }, [setNewTaskTime]);
    
    const initSendNewTask = useCallback(() => {
        if (!newTaskHeader) {
            setNewTaskHeaderError(true);
            return;
        }
        
        const newTask: NewTaskI = {
            name: newTaskHeader,
            description: newTaskDescription || '',
            dateTime: newTaskCompiledDate,
            priority: newTaskPriority === -1 ? 0 : newTaskPriority,
        }
        
        dispatch(createTask(newTask));
    }, [
        dispatch, 
        newTaskHeader,
        newTaskDescription,
        newTaskPriority,
        newTaskCompiledDate,
        setNewTaskHeaderError,
    ]);
    
    useEffect(() => {
        dispatch(getTasks());
    }, [dispatch, tasksState.content.length]);
    
    useEffect(() => {
        const compiledDate = newTaskDate;
        if (newTaskTime) {
            const time = newTaskTime.split(':');
            compiledDate.setUTCHours(Number(time[0]));
            compiledDate.setMinutes(Number(time[1]));
            console.log(compiledDate);
            setNewTaskCompiledDate(compiledDate);
        }
    },[newTaskDate, newTaskTime, setNewTaskCompiledDate]);
    
    useEffect(() => {
        // TODO: Refactor for grouping by date
        // TODO: Refactor this to shared components with editable fields
        setMappedTasks(tasksState.content.sort((a, b) => {
            if (a.dateTime <= b.dateTime) {
                return -1;
            } else {
                return 1;
            }
        }).map(t => {
            const date = getFormattedDateFromString(t.dateTime);
            const time = getFormattedTimeFromString(t.dateTime);
            return(
                <div className="task-block" key={t.taskId}>
                    <div className="task-date">
                        {date}
                    </div>
                    <div className="task-confirm">
                        <input type="checkbox"/>
                    </div>
                    <div className="task-fields">
                        <div className="task-header">
                            <span>{t.name}</span>
                        </div>
                        <div className="task-description">
                            <span>{t.description || 'Enter description...'}</span>
                        </div>
                        <div className={`task-priority priority-${t.priority}`}>
                            <span>{Priority[t.priority]}</span>
                        </div>
                        <div className="task-time">
                            <span>{time}</span>
                        </div>
                    </div>
                </div>
            );
        }));
    }, [tasksState.content]);
    
    return(
        <div className="tasks-wrapper">
            <div className="row no-gutters">
                <div className="col tasks-sidebar">
                    <div className="logo">
                        <img src="/images/logo.png" alt=""/>
                    </div>
                    <div className="priority">
                        <Button 
                            onClick={toggleSidebar} 
                            className={`priority-toggle-button ${!collapseSidebar ? 'collapsed' : ''}`}
                        >Priority</Button>
                        {/*TODO: Make filter works*/}
                        <Collapse isOpen={collapseSidebar}>
                            <span className="priority-point active">All</span><br />
                            <span className="priority-point">Urgently</span><br />
                            <span className="priority-point">Important</span><br />
                            <span className="priority-point">Normal</span><br />
                            <span className="priority-point">Neutral</span><br />
                        </Collapse>
                    </div>
                </div>
                <div className="col tasks-content-wrapper">
                    <div className="tasks-delimiter">
                        <div className="tasks-content">
                            <div className="menu">
                                <Dropdown isOpen={menuOpen} toggle={toggleMenu}>
                                    <DropdownToggle />
                                    <DropdownMenu>
                                        {/*TODO: Add change password page*/}
                                        <DropdownItem>Change Password</DropdownItem>
                                        <DropdownItem onClick={signOut}>Sign Out</DropdownItem>
                                    </DropdownMenu>
                                </Dropdown>
                            </div>
                            <div className="tasks-container">
                                {mappedTasks}
                            </div>
                        </div>
                        <div className="task-create">
                            <input 
                                type="text" 
                                className={`task-create__heading ${newTaskHeaderError ? 'input-error' : ''}`}
                                onChange={(e) => {setNewTaskHeaderError(false); setNewTaskHeader(e.target.value);}}
                                placeholder="Enter task Header"
                                required={true}
                            />
                            <input 
                                type="text" 
                                className="task-create__description"
                                onChange={(e) => setNewTaskDescription(e.target.value)}
                                placeholder="Enter task Description"
                            />
                            <DatePicker
                                onChange={onDateChange}
                                value={newTaskDate}
                            />
                            <TimePicker
                                onChange={onTimeChange}
                                value={newTaskTime}
                            />
                            <Dropdown isOpen={newTaskPriorityOpen}>
                                <DropdownToggle onClick={toggleNewTaskPriority}>{newTaskPriority === -1 ? 'Priority' : Priority[newTaskPriority]}</DropdownToggle>
                                <DropdownMenu>
                                    <DropdownItem onClick={() => {
                                        setNewTaskPriority(0);
                                        setNewTaskPriorityOpen(false);
                                    }}>Neutral</DropdownItem>
                                    <DropdownItem onClick={() => {
                                        setNewTaskPriority(1)
                                        setNewTaskPriorityOpen(false);
                                    }}>Normal</DropdownItem>
                                    <DropdownItem onClick={() => {
                                        setNewTaskPriority(2)
                                        setNewTaskPriorityOpen(false);
                                    }}>Important</DropdownItem>
                                    <DropdownItem onClick={() => {
                                        setNewTaskPriority(3)
                                        setNewTaskPriorityOpen(false);
                                    }}>Urgently</DropdownItem>
                                </DropdownMenu>
                            </Dropdown>
                            <Button 
                                className="task-create__submit"
                                onClick={initSendNewTask}
                            >Send</Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}