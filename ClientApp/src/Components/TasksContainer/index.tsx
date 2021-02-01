import React, { useEffect, useState } from 'react';
import { GroupedTasksByDateI, groupTasksByDate } from 'src/shared/helpers/tasks';
import { TaskI } from 'src/shared/types/Tasks';
import { EditableTask } from '../EditableTask';
import './index.scss';

interface Props {
  tasks: TaskI[],
  onTaskUpdate: (updatedTask: TaskI) => void,
  onCompleteTask: (id: string) => void,
}

export const TasksContainer: React.FunctionComponent<Props> = (props) => {
  const { tasks, onTaskUpdate, onCompleteTask } = props;

  const [groupedTasks, setGroupedTasks] = useState<GroupedTasksByDateI>();

  useEffect(() => {
    const gr = groupTasksByDate(tasks);
    setGroupedTasks(gr);
  }, [tasks]);

  return (
    <div className="tasks-container">
      {groupedTasks && Object.keys(groupedTasks).map(gt => {
        return (
          <div className="task-date-wrapper" key={gt}>
            <div className="task-date">
              {gt}
            </div>
            {
                groupedTasks[gt].map(t => {
                  return <EditableTask
                    task={t}
                    key={t.taskId}
                    onUpdate={onTaskUpdate}
                    onCompleteTask={onCompleteTask}
                  />;
                })
            }
          </div>);
      })}
    </div>);
};