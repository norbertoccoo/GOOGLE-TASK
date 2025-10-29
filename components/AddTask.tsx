import React, { useState } from 'react';
import { ICONS } from '../constants';

interface AddTaskProps {
    onAddTask: (title: string) => void;
}

const AddTask: React.FC<AddTaskProps> = ({ onAddTask }) => {
    const [title, setTitle] = useState('');
    const [isFocused, setIsFocused] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (title.trim()) {
            onAddTask(title);
            setTitle('');
        }
    };

    return (
        <form 
            onSubmit={handleSubmit} 
            className={`flex items-center bg-white p-2 rounded-lg transition-shadow duration-200 ${isFocused ? 'shadow-md border border-gray-200' : 'shadow-sm'}`}
        >
            <ICONS.add className="h-6 w-6 text-gray-400 mx-2" />
            <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                placeholder="Añadir una tarea"
                className="w-full bg-transparent text-gray-800 placeholder-gray-500 focus:outline-none"
            />
            <button
                type="submit"
                className={`ml-2 px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-blue-300 transition-opacity ${title ? 'opacity-100' : 'opacity-0'}`}
                disabled={!title.trim()}
            >
                Añadir
            </button>
        </form>
    );
};

export default AddTask;
