import React, { useState } from 'react';
import { TaskList } from '../types';
import { ICONS } from '../constants';

interface SidebarProps {
    isOpen: boolean;
    taskLists: TaskList[];
    activeListId: string;
    onSelectList: (id: string) => void;
    onAddList: (name: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, taskLists, activeListId, onSelectList, onAddList }) => {
    const [newListName, setNewListName] = useState('');
    const [isCreating, setIsCreating] = useState(false);

    const handleCreateList = () => {
        if (newListName.trim()) {
            onAddList(newListName.trim());
            setNewListName('');
            setIsCreating(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleCreateList();
        } else if (e.key === 'Escape') {
            setIsCreating(false);
            setNewListName('');
        }
    };
    
    return (
        <aside className={`absolute md:fixed top-16 left-0 h-[calc(100vh-4rem)] bg-white border-r border-gray-200 w-64 transform transition-transform duration-300 ease-in-out z-20 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
            <nav className="py-4">
                <ul>
                    {taskLists.map(list => (
                        <li key={list.id}>
                            <a
                                href="#"
                                onClick={(e) => { e.preventDefault(); onSelectList(list.id); }}
                                className={`flex items-center px-6 py-2 text-sm font-medium ${activeListId === list.id ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}`}
                            >
                                <ICONS.list className={`h-5 w-5 mr-3 ${activeListId === list.id ? 'text-blue-600' : 'text-gray-500'}`} />
                                {list.name}
                            </a>
                        </li>
                    ))}
                </ul>
                <div className="px-6 mt-4">
                    {isCreating ? (
                        <div className="flex items-center space-x-2">
                             <input
                                type="text"
                                value={newListName}
                                onChange={(e) => setNewListName(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Nombre de la lista"
                                autoFocus
                                className="flex-grow p-2 text-sm border-b-2 border-blue-500 focus:outline-none"
                            />
                            <button onClick={handleCreateList} className="p-1 rounded-full text-blue-600 hover:bg-blue-100">
                                <ICONS.checkCircle className="h-6 w-6" />
                            </button>
                        </div>

                    ) : (
                        <button
                            onClick={() => setIsCreating(true)}
                            className="flex items-center w-full px-0 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md"
                        >
                            <ICONS.add className="h-5 w-5 mr-3 text-gray-500" />
                            Crear lista nueva
                        </button>
                    )}
                </div>
            </nav>
        </aside>
    );
};

export default Sidebar;
