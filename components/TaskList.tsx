import React, { useState, useMemo } from 'react';
import { Task, TaskList } from '../types';
import { ICONS } from '../constants';
import TaskItem from './TaskItem';
import AddTask from './AddTask';

interface TaskListComponentProps {
    taskList: TaskList;
    onAddTask: (title: string) => void;
    onSelectTask: (id: string | null) => void;
    onUpdateTask: (taskId: string, updatedFields: Partial<Task>) => void;
    selectedTaskId: string | null;
}

const TaskListComponent: React.FC<TaskListComponentProps> = ({ taskList, onAddTask, onSelectTask, onUpdateTask, selectedTaskId }) => {
    const [showCompleted, setShowCompleted] = useState(true);

    const { completedTasks, incompleteTasks } = useMemo(() => {
        const completed: Task[] = [];
        const incomplete: Task[] = [];
        taskList.tasks.forEach(task => {
            if (task.completed) {
                completed.push(task);
            } else {
                incomplete.push(task);
            }
        });
        return { completedTasks: completed.sort((a,b) => b.createdAt - a.createdAt), incompleteTasks: incomplete.sort((a,b) => b.createdAt - a.createdAt) };
    }, [taskList.tasks]);

    return (
        <div className="h-full flex flex-col bg-white">
            <header className="p-4 sm:p-6 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-800">{taskList.name}</h2>
            </header>
            <div className="flex-grow overflow-y-auto">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 py-4">
                    <AddTask onAddTask={onAddTask} />
                    
                    <div className="mt-6">
                        {incompleteTasks.map(task => (
                            <TaskItem
                                key={task.id}
                                task={task}
                                onSelect={() => onSelectTask(task.id)}
                                onUpdate={onUpdateTask}
                                isSelected={selectedTaskId === task.id}
                            />
                        ))}
                    </div>

                    {completedTasks.length > 0 && (
                        <div className="mt-8">
                            <button 
                                onClick={() => setShowCompleted(!showCompleted)} 
                                className="flex items-center text-sm font-semibold text-gray-600 hover:text-gray-800"
                            >
                                <ICONS.chevronDown className={`h-5 w-5 mr-2 transform transition-transform ${showCompleted ? '' : '-rotate-90'}`} />
                                Completadas ({completedTasks.length})
                            </button>
                            {showCompleted && (
                                <div className="mt-4">
                                    {completedTasks.map(task => (
                                        <TaskItem
                                            key={task.id}
                                            task={task}
                                            onSelect={() => onSelectTask(task.id)}
                                            onUpdate={onUpdateTask}
                                            isSelected={selectedTaskId === task.id}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TaskListComponent;
