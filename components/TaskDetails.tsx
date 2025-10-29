import React, { useState, useEffect } from 'react';
import { Task, Subtask } from '../types';
import { ICONS } from '../constants';

interface TaskDetailsProps {
    task: Task | null;
    onClose: () => void;
    onUpdate: (taskId: string, updatedFields: Partial<Task>) => void;
    onDelete: (taskId: string) => void;
    onAddSubtask: (taskId: string, title: string) => void;
    onUpdateSubtask: (taskId: string, subtaskId: string, updatedFields: Partial<Subtask>) => void;
    onDeleteSubtask: (taskId: string, subtaskId: string) => void;
}

const TaskDetails: React.FC<TaskDetailsProps> = ({ 
    task, onClose, onUpdate, onDelete, 
    onAddSubtask, onUpdateSubtask, onDeleteSubtask
}) => {
    const [title, setTitle] = useState('');
    const [details, setDetails] = useState('');
    const [newSubtaskTitle, setNewSubtaskTitle] = useState('');

    useEffect(() => {
        if (task) {
            setTitle(task.title);
            setDetails(task.details);
        }
    }, [task]);

    if (!task) {
        return null;
    }

    const handleTitleBlur = () => {
        if (title.trim() && title !== task.title) {
            onUpdate(task.id, { title });
        } else {
            setTitle(task.title);
        }
    };
    
    const handleDetailsBlur = () => {
        if (details !== task.details) {
            onUpdate(task.id, { details });
        }
    };

    const handleAddSubtask = (e: React.FormEvent) => {
        e.preventDefault();
        if (newSubtaskTitle.trim()) {
            onAddSubtask(task.id, newSubtaskTitle);
            setNewSubtaskTitle('');
        }
    };

    return (
        <div className={`fixed top-0 right-0 h-full w-full md:w-96 bg-white border-l border-gray-200 shadow-xl transform transition-transform duration-300 ease-in-out z-30 ${task ? 'translate-x-0' : 'translate-x-full'}`}>
            <div className="h-full flex flex-col">
                <header className="flex items-center justify-between p-2 border-b border-gray-200">
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100">
                        <ICONS.arrowLeft className="h-6 w-6 text-gray-600" />
                    </button>
                    <div className="flex items-center">
                        <button onClick={() => onUpdate(task.id, { starred: !task.starred })} className="p-2 rounded-full hover:bg-gray-100">
                           {task.starred ? <ICONS.starFilled className="h-6 w-6 text-blue-600" /> : <ICONS.star className="h-6 w-6 text-gray-600" /> }
                        </button>
                        <button onClick={() => onDelete(task.id)} className="p-2 rounded-full hover:bg-gray-100">
                            <ICONS.trash className="h-6 w-6 text-gray-600" />
                        </button>
                    </div>
                </header>

                <div className="flex-grow overflow-y-auto p-6">
                    <div className="flex items-start space-x-4">
                        <button onClick={() => onUpdate(task.id, { completed: !task.completed })} className="mt-1">
                            {task.completed ? <ICONS.checkCircle className="h-6 w-6 text-blue-600" /> : <ICONS.circle className="h-6 w-6 text-gray-400" />}
                        </button>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            onBlur={handleTitleBlur}
                            className={`w-full text-xl font-semibold bg-transparent focus:outline-none focus:bg-gray-100 p-1 rounded-md ${task.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}
                        />
                    </div>

                    <div className="mt-6 ml-10">
                         <textarea
                            value={details}
                            onChange={(e) => setDetails(e.target.value)}
                            onBlur={handleDetailsBlur}
                            placeholder="Añadir detalles"
                            className="w-full text-sm text-gray-600 bg-transparent resize-none focus:outline-none focus:bg-gray-100 p-2 rounded-md"
                            rows={3}
                        />
                    </div>
                    
                    <div className="mt-8 ml-10">
                        <h3 className="font-semibold text-gray-700">Subtareas</h3>
                        <div className="mt-2 space-y-2">
                             {task.subtasks.map(subtask => (
                                <div key={subtask.id} className="flex items-center group">
                                    <button onClick={() => onUpdateSubtask(task.id, subtask.id, { completed: !subtask.completed })}>
                                        {subtask.completed ? <ICONS.checkCircle className="h-5 w-5 text-blue-500" /> : <ICONS.circle className="h-5 w-5 text-gray-400" />}
                                    </button>
                                    <p className={`flex-grow mx-3 text-sm ${subtask.completed ? 'line-through text-gray-500' : 'text-gray-700'}`}>{subtask.title}</p>
                                    <button onClick={() => onDeleteSubtask(task.id, subtask.id)} className="opacity-0 group-hover:opacity-100">
                                        <ICONS.trash className="h-4 w-4 text-gray-400 hover:text-red-500" />
                                    </button>
                                </div>
                             ))}
                        </div>
                        <form onSubmit={handleAddSubtask} className="mt-2 flex items-center">
                            <ICONS.add className="h-5 w-5 text-gray-400" />
                            <input 
                                type="text"
                                value={newSubtaskTitle}
                                onChange={(e) => setNewSubtaskTitle(e.target.value)}
                                placeholder="Añadir subtarea"
                                className="w-full text-sm bg-transparent ml-3 p-1 focus:outline-none border-b border-transparent focus:border-blue-500"
                            />
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TaskDetails;
