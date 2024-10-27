import { Task } from '@/types/types';
import React from 'react';

interface TaskCardProps {
  task: Task;
  onDelete: (task: Task) => void;
  onEdit: (task: Task) => void;
  onStatusChange: (task: Task) => void;
  
}

const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onDelete,
  onStatusChange,
  onEdit
}) => {


  return (
    <div key={task.id}>
      <li>
        <div className='flex space-x-4 justify-between items-center'>
        <button onClick={() => onDelete(task)} className='bg-red-500'> Delete</button>
        <button onClick={() => onEdit(task)} className='bg-blue-500'> Update</button>
        <strong className='task-span text-center'>{task.name}</strong> 
        <span className='task-span text-center'>{task.tag ? `#${task.tag}` : '\u00A0'}</span>
        <span className='task-span text-center'>{task.status ? task.status : "No status"}</span>
        <span className='task-span text-center'>{task.datePlanned ? task.datePlanned : "Not scheduled"}</span>
        <span className='task-span text-center'>{task.dateDone ? task.dateDone : "Not completed"}</span>

         <input
          type="checkbox"
          checked={task.status === 'Done'}
          onChange={() => onStatusChange(task)}
        />         
        </div>
          <br/>
      </li>
    </div>
  );
};


export default TaskCard;
