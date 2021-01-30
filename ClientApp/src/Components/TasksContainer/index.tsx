import React, { useEffect, useState } from 'react';
import { TaskI } from '../../shared/types/Tasks';
import { EditableTask } from '../EditableTask';
import { GroupedTasksByDateI, groupTasksByDate } from '../../shared/helpers/tasks';
import './index.scss';

interface Props {
  tasks: TaskI[],
}

export const TasksContainer: React.FunctionComponent<Props> = (props) => {
  const { tasks } = props;

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
                  return <EditableTask task={t} key={t.taskId} />;
                })
            }
          </div>);
      })}
    </div>);
};