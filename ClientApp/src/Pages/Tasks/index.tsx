import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import {
  Button,
  Collapse,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Modal,
  ModalBody, ModalFooter,
  ModalHeader
} from 'reactstrap';
import DatePicker from 'react-date-picker';
import TimePicker from 'react-time-picker';
import { RootStateI } from 'src/store';
import { DropdownPriorities } from 'src/shared/enums/priority';
import { NewTaskI, TaskI } from 'src/shared/types/Tasks';
import { TasksContainer } from 'src/Components/TasksContainer';
import { CustomDropdown } from 'src/Components/CustomDropdown';
import { logoutUser } from '../Login/reducer';
import { completeTask, createNewTask, fetchTasksWithFilter, updateTask } from './reducer';
import './index.scss';

const tasksSelector = (store: RootStateI): TaskI[] => store.tasks.tasks;

export const Tasks: React.FunctionComponent = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const tasksState = useSelector(tasksSelector);
  const [mappedTasks, setMappedTasks] = useState<TaskI[]>([]);
    
  const [collapseSidebar, setCollapseSidebar] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);

  const [selectedFilter, setSelectedFilter] = useState<string>('');

  const [newTaskHeader, setNewTaskHeader] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [newTaskDate, setNewTaskDate] = useState<Date>(new Date());
  const [newTaskTime, setNewTaskTime] = useState('10:00');
  const [newTaskCompiledDate, setNewTaskCompiledDate] = useState<Date>(new Date());
  const [newTaskPriority, setNewTaskPriority] = useState<number|string>(-1);
    
  const [newTaskHeaderError, setNewTaskHeaderError] = useState(false);

  const [completeModal, setCompleteModal] = useState(false);
  const [completingTaskId, setCompletingTaskId] = useState('');

  const toggleModal = useCallback(() => {
    setCompleteModal(!completeModal);
  }, [setCompleteModal, completeModal]);
  const toggleSidebar = useCallback(() => {
    setCollapseSidebar(!collapseSidebar);
  }, [setCollapseSidebar, collapseSidebar]);
  const toggleMenu = useCallback(() => {
    setMenuOpen(!menuOpen);
  }, [setMenuOpen, menuOpen]);
    
  const signOut = useCallback(async () => {
    await dispatch(logoutUser());
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
      priority: newTaskPriority === -1 ? 0 : parseInt(newTaskPriority.toString(), 10),
    };

    dispatch(createNewTask(newTask));
  }, [
    dispatch,
    newTaskHeader,
    newTaskDescription,
    newTaskPriority,
    newTaskCompiledDate,
    setNewTaskHeaderError,
  ]);

  const onTaskUpdate = useCallback((updatedTask: TaskI) => {
    dispatch(updateTask(updatedTask));
  }, [dispatch]);

  const onTaskComplete = useCallback((id: string) => {
    setCompletingTaskId(id);
    toggleModal();
  }, [toggleModal]);

  const onTaskCompleteConfirm = useCallback(() => {
    toggleModal();
    dispatch(completeTask(completingTaskId));
    setCompletingTaskId('');
  }, [dispatch, toggleModal, completingTaskId]);

  const onTaskCompleteCancel = useCallback(() => {
    toggleModal();
    setCompletingTaskId('');
  }, [toggleModal]);

  useEffect(() => {
    dispatch(fetchTasksWithFilter(selectedFilter));
  }, [dispatch, selectedFilter]);
    
  useEffect(() => {
    const compiledDate = newTaskDate;
    if (newTaskTime) {
      const time = newTaskTime.split(':');
      compiledDate.setUTCHours(Number(time[0]));
      compiledDate.setMinutes(Number(time[1]));
      setNewTaskCompiledDate(compiledDate);
    }
  }, [newTaskDate, newTaskTime, setNewTaskCompiledDate]);

  useEffect(() => {
    setMappedTasks(tasksState.slice().sort((a, b) => {
      if (a.dateTime <= b.dateTime) {
        return -1;
      } 
      return 1;
    }));
  }, [tasksState]);

  return (
    <div className="tasks-wrapper">
      <div className="row no-gutters">
        <div className="col tasks-sidebar">
          <div className="logo">
            <img src="/images/logo.png" alt="" />
          </div>
          <div className="priority">
            <Button 
              onClick={toggleSidebar} 
              className={`priority-toggle-button ${!collapseSidebar ? 'collapsed' : ''}`}
            >Priority
            </Button>
            <Collapse isOpen={collapseSidebar}>
              <span
                className={`priority-point${selectedFilter === '' ? ' active' : ''}`}
                onClick={() => setSelectedFilter('')}
                onKeyDown={() => {}}
                role="button"
              >All
              </span><br />
              {
                DropdownPriorities.map(p => {
                  return (
                    <>
                      <span
                        className={`priority-point${
                          selectedFilter === p.value.toString()
                            ? ' active' 
                            : ''
                        }`}
                        onClick={() => setSelectedFilter(p.value.toString())}
                        onKeyDown={() => {}}
                        role="button"
                      >
                        {p.label.split(' ')[0]}
                      </span>
                      <br />
                    </>
                  );
                })
              }
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
                    {/* TODO: Add change password page */}
                    <DropdownItem>Change Password</DropdownItem>
                    <DropdownItem onClick={signOut}>Sign Out</DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              </div>
              <TasksContainer
                tasks={mappedTasks}
                onTaskUpdate={onTaskUpdate}
                onCompleteTask={onTaskComplete}
              />
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
              <CustomDropdown options={DropdownPriorities} onSelect={(val: string) => setNewTaskPriority(val)} />
              <Button 
                className="task-create__submit"
                onClick={initSendNewTask}
              >Send
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div>
        <Modal isOpen={completeModal} toggle={toggleModal}>
          <ModalHeader toggle={toggleModal}>Close this task?</ModalHeader>
          <ModalBody>
            This action cannot be undone.
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={onTaskCompleteConfirm}>Yes, i'm sure!</Button>{' '}
            <Button color="secondary" onClick={onTaskCompleteCancel}>Cancel</Button>
          </ModalFooter>
        </Modal>
      </div>
    </div>
  );
};