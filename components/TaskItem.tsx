import React from 'react';
import { Task } from '../types';
import { ICONS } from '../constants';

interface TaskItemProps {
    task: Task;
    onSelect: () => void;
    onUpdate: (taskId: string, updatedFields: Partial<Task>) => void;
    isSelected: boolean;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onSelect, onUpdate, isSelected }) => {
    
    const handleToggleComplete = (e: React.MouseEvent) => {
        e.stopPropagation();
        onUpdate(task.id, { completed: !task.completed });
    };

    const handleToggleStarred = (e: React.MouseEvent) => {
        e.stopPropagation();
        onUpdate(task.id, { starred: !task.starred });
    };

    return (
        <div 
            className={`flex items-center p-2 border-b border-gray-200 cursor-pointer group ${isSelected ? 'bg-blue-50' : 'hover:bg-gray-50'}`}
            onClick={onSelect}
        >
            <div className="flex-shrink-0" onClick={handleToggleComplete}>
                {task.completed ? (
                    <ICONS.checkCircle className="h-6 w-6 text-blue-600" />
                ) : (
                    <ICONS.circle className="h-6 w-6 text-gray-400 group-hover:text-blue-600" />
                )}
            </div>
            
            <div className="flex-grow mx-4">
                <p className={`text-gray-800 ${task.completed ? 'line-through text-gray-500' : ''}`}>{task.title}</p>
            </div>
            
            <div className="flex-shrink-0" onClick={handleToggleStarred}>
                {task.starred ? (
                    <ICONS.starFilled className="h-5 w-5 text-blue-600" />
                ) : (
                    <ICONS.star className="h-5 w-5 text-gray-400 opacity-0 group-hover:opacity-100" />
                )}
            </div>
        </div>
    );
};

export default TaskItem;
