import React, { useEffect, useState } from 'react';
import { GroupedTasksByDateI, groupTasksByDate } from 'src/shared/helpers/tasks';
import { TaskI } from 'src/shared/types/Tasks';
import './index.scss';
import { TasksByDateCollapsing } from '../TasksByDateCollapsing';

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
      {
        groupedTasks && Object.keys(groupedTasks).map(gt => {
          return (
            <TasksByDateCollapsing
              key={gt}
              tasks={groupedTasks ? groupedTasks[gt] : undefined}
              date={gt}
              onCompleteTask={onCompleteTask}
              onTaskUpdate={onTaskUpdate}
            />
          );
        })
      }
    </div>);
};