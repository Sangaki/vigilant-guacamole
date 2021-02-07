import React, { useCallback, useState } from 'react';
import { TaskI } from 'src/shared/types/Tasks';
import { EditableTask } from '../EditableTask';
import './index.scss';

interface Props {
  tasks: TaskI[] | undefined,
  date: string,
  onTaskUpdate: (updatedTask: TaskI) => void,
  onCompleteTask: (id: string) => void,
}

export const TasksByDateCollapsing: React.FunctionComponent<Props> = (props) => {
  const { tasks, date, onTaskUpdate, onCompleteTask } = props;

  const [collapsed, setCollapsed] = useState(false);

  const toggleCollapsed = useCallback(() => {
    setCollapsed(!collapsed);
  }, [collapsed, setCollapsed]);

  return (
    <>
      <div className={`task-date-wrapper ${collapsed ? 'collapsed' : ''}`} key={date}>
        <div className="task-date">
          <span
            onClick={toggleCollapsed}
            role="button"
            tabIndex={-1}
            onKeyDown={() => {}}
          >
            {date}
          </span>
        </div>
        <div className="tasks-body">
          {
            tasks && tasks.map(t => {
              return <EditableTask
                task={t}
                key={t.taskId}
                onUpdate={onTaskUpdate}
                onCompleteTask={onCompleteTask}
              />;
            })
          }
        </div>
      </div>
    </>
  );
};