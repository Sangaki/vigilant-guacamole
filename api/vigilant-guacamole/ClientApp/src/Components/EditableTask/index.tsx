import React, { ChangeEvent, useCallback, useState } from 'react';
import { TaskI } from 'src/shared/types/Tasks';
import { DropdownPriorities } from 'src/shared/enums/priority';
import { getFormattedTimeFromString } from 'src/shared/helpers/date';
import { TaskErrors } from 'src/shared/enums/errors';
import { CustomDropdown } from '../CustomDropdown';
import './index.scss';

interface Props {
  task: TaskI;
  onUpdate: (updatedTask: TaskI) => void,
  onCompleteTask: (id: string) => void,
}

export const EditableTask: React.FunctionComponent<Props> = (props) => {
  const { task, onUpdate, onCompleteTask } = props;

  const [editHeader, setEditHeader] = useState(false);
  const [newHeader, setNewHeader] = useState(task.name);
  const [editDescription, setEditDescription] = useState(false);
  const [newDescription, setNewDescription] = useState(task.description);
  const [newPriority, setNewPriority] = useState(task.priority.toString());

  const taskTime = getFormattedTimeFromString(task.dateTime);

  const updateTask = useCallback((priority: string | undefined) => {
    if (newHeader.replace(' ', '').length === 0) {
      throw new Error(TaskErrors.emptyHeader);
    }
    const taskPriority = priority !== undefined ? parseInt(priority, 10) : parseInt(newPriority, 10);
    const updatedTask: TaskI = {
      ...task,
      name: newHeader,
      description: newDescription,
      priority: taskPriority,
    };
    setEditHeader(false);
    setEditDescription(false);
    onUpdate(updatedTask);
  }, [newHeader, newDescription, onUpdate, task, newPriority]);

  const startEditHeader = useCallback(() => {
    setEditHeader(true);
    setTimeout(() => {
      return document.getElementById(`header_${task.taskId}`)?.focus();
    }, 200);
  }, [setEditHeader, task.taskId]);

  const startEditDescription = useCallback(() => {
    setEditDescription(true);
    setTimeout(() => {
      return document.getElementById(`description_${task.taskId}`)?.focus();
    }, 200);
  }, [setEditDescription, task.taskId]);

  const onEditEnd = useCallback(() => {
    updateTask(undefined);
  }, [updateTask]);

  const onPriorityChange = useCallback((val) => {
    updateTask(val);
    setNewPriority(val);
  }, [setNewPriority, updateTask]);

  const confirmTaskComplete = useCallback(() => {
    onCompleteTask(task.taskId);
  }, [onCompleteTask, task.taskId]);

  return (
    <div className="task-block">
      <div className="task-confirm">
        <input
          type="checkbox"
          checked={false}
          onChange={confirmTaskComplete}
        />
      </div>
      <div className="task-fields">
        <div className={`task-header ${editHeader ? 'edit' : ''}`}>
          <span
            className="non-edit-header"
            onClick={startEditHeader}
            role="button"
            onKeyDown={() => {}}
          >{newHeader || task.name}
          </span>
          <input
            id={`header_${task.taskId}`}
            className="edit-header-input"
            type="text"
            defaultValue={newHeader}
            onChange={(event: ChangeEvent<HTMLInputElement>) => setNewHeader(event.target.value)}
            onBlur={onEditEnd}
          />
        </div>
        <div className={`task-description ${editDescription ? 'edit' : ''}`}>
          <span
            className="non-edit-description"
            onClick={startEditDescription}
            role="button"
            onKeyDown={() => {}}
          >{task.description.replace(' ', '').length > 0 ? task.description : 'Enter description...'}
          </span>
          <input
            id={`description_${task.taskId}`}
            className="edit-description-input"
            type="text"
            defaultValue={newDescription}
            onChange={(event: ChangeEvent<HTMLInputElement>) => setNewDescription(event.target.value)}
            onBlur={onEditEnd}
          />
        </div>
        <div className={`task-priority priority-${task.priority}`}>
          <CustomDropdown
            options={DropdownPriorities}
            onSelect={onPriorityChange}
            selectedOption={newPriority}
          />
        </div>
        <div className="task-time">
          <span>{taskTime}</span>
        </div>
      </div>
    </div>);
};