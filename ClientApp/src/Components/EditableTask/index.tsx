import React, { useCallback, useState } from 'react';
import { TaskI } from '../../shared/types/Tasks';
import { Priority } from '../../shared/enums/priority';
import { getFormattedTimeFromString } from '../../shared/helpers/date';
import './index.scss';

interface Props {
  task: TaskI;
}

export const EditableTask: React.FunctionComponent<Props> = (props) => {
  const { task } = props;

  const [editHeader, setEditHeader] = useState(false);
  const [newHeader, setNewHeader] = useState(task.name);
  const [editDescription, setEditDescription] = useState(false);
  const [newDescription, setNewDescription] = useState(task.description);

  const taskTime = getFormattedTimeFromString(task.dateTime);

  const updateHeader = useCallback(() => {
    setEditHeader(false);
  }, [setEditHeader]);

  const onHeaderInputChange = useCallback((e) => {
    setNewHeader(e.target.value);
    if (e.keyCode === 13) {
      setEditHeader(false);
    }
  }, [setNewHeader, setEditHeader]);

  const updateDescription = useCallback(() => {
    setEditDescription(false);
  }, [setEditDescription]);

  const onDescriptionInputChange = useCallback((e) => {
    setNewDescription(e.target.value);
    if (e.keyCode === 13) {
      setEditDescription(false);
    }
  }, [setNewDescription, setEditDescription]);

  const customHeaderListener = useCallback(() => {
    setEditHeader(false);
    updateHeader();
    document.removeEventListener('focusout', customHeaderListener);
  }, [setEditHeader, updateHeader]);

  const startEditHeader = useCallback(() => {
    setEditHeader(true);
    setTimeout(() => {
      return document.getElementById(`header_${task.taskId}`)?.focus();
    }, 200);
    document.addEventListener('focusout', customHeaderListener);
  }, [setEditHeader, customHeaderListener, task.taskId]);

  const customDescriptionListener = useCallback(() => {
    setEditDescription(false);
    updateDescription();
    document.removeEventListener('focusout', customDescriptionListener);
  }, [setEditDescription, updateDescription]);

  const startEditDescription = useCallback(() => {
    setEditDescription(true);
    setTimeout(() => {
      return document.getElementById(`description_${task.taskId}`)?.focus();
    }, 200);
    document.addEventListener('focusout', customDescriptionListener);
  }, [setEditDescription, customDescriptionListener, task.taskId]);

  return (
    <div className="task-block">
      <div className="task-confirm">
        <input type="checkbox" />
      </div>
      <div className="task-fields">
        <div className={`task-header ${editHeader ? 'edit' : ''}`}>
          <span
            className="non-edit-header"
            onClick={startEditHeader}
            role="button"
            onKeyDown={() => {}}
          >{task.name}
          </span>
          <input
            id={`header_${task.taskId}`}
            className="edit-header-input"
            type="text"
            defaultValue={newHeader}
            onKeyDown={onHeaderInputChange}
          />
        </div>
        <div className={`task-description ${editDescription ? 'edit' : ''}`}>
          <span
            className="non-edit-description"
            onClick={startEditDescription}
            role="button"
            onKeyDown={() => {}}
          >{task.description || 'Enter description...'}
          </span>
          <input
            id={`description_${task.taskId}`}
            className="edit-description-input"
            type="text"
            defaultValue={newDescription}
            onKeyDown={onDescriptionInputChange}
          />
        </div>
        <div className={`task-priority priority-${task.priority}`}>
          <span>{Priority[task.priority]}</span>
        </div>
        <div className="task-time">
          <span>{taskTime}</span>
        </div>
      </div>
    </div>);
};