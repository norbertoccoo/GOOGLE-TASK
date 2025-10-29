import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { Task, TaskList, Subtask } from './types';
import { ICONS } from './constants';
import Sidebar from './components/Sidebar';
import TaskListComponent from './components/TaskList';
import TaskDetails from './components/TaskDetails';

const initialTaskLists: TaskList[] = [
  {
    id: 'my-tasks',
    name: 'Mis Tareas',
    tasks: [
      { id: '1', title: 'Completar el informe del proyecto', details: 'Revisar las secciones A y B y enviar a revisión final.', completed: false, starred: true, subtasks: [
        { id: 's1', title: 'Revisar sección A', completed: true },
        { id: 's2', title: 'Revisar sección B', completed: false },
      ], createdAt: Date.now() - 24 * 60 * 60 * 1000 },
      { id: '2', title: 'Llamar a soporte técnico', details: 'Problema con la conexión a internet.', completed: false, starred: false, subtasks: [], createdAt: Date.now() - 2 * 24 * 60 * 60 * 1000 },
      { id: '3', title: 'Comprar leche y pan', details: '', completed: true, starred: false, subtasks: [], createdAt: Date.now() },
    ]
  },
  {
    id: 'work',
    name: 'Trabajo',
    tasks: [
      { id: '4', title: 'Preparar presentación para el lunes', details: 'Incluir los gráficos de ventas del último trimestre.', completed: false, starred: true, subtasks: [], createdAt: Date.now() },
      { id: '5', title: 'Reunión de equipo a las 10 AM', details: '', completed: true, starred: false, subtasks: [], createdAt: Date.now() - 3 * 24 * 60 * 60 * 1000 },
    ]
  }
];

const App: React.FC = () => {
    const [taskLists, setTaskLists] = useState<TaskList[]>(() => {
        try {
            const savedLists = localStorage.getItem('taskLists');
            return savedLists ? JSON.parse(savedLists) : initialTaskLists;
        } catch (error) {
            console.error("Failed to parse task lists from localStorage", error);
            return initialTaskLists;
        }
    });

    const [activeListId, setActiveListId] = useState<string>(() => {
        const savedActiveListId = localStorage.getItem('activeListId');
        // Ensure the saved ID is valid
        const lists = taskLists;
        if (savedActiveListId && lists.some(l => l.id === savedActiveListId)) {
            return savedActiveListId;
        }
        return lists.length > 0 ? lists[0].id : '';
    });

    const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
    
    const [isSidebarOpen, setSidebarOpen] = useState<boolean>(() => {
        const savedState = localStorage.getItem('isSidebarOpen');
        return savedState ? JSON.parse(savedState) : true;
    });

    useEffect(() => {
        localStorage.setItem('taskLists', JSON.stringify(taskLists));
    }, [taskLists]);

    useEffect(() => {
        localStorage.setItem('activeListId', activeListId);
    }, [activeListId]);

    useEffect(() => {
        localStorage.setItem('isSidebarOpen', JSON.stringify(isSidebarOpen));
    }, [isSidebarOpen]);

    const activeList = useMemo(() => 
        taskLists.find(list => list.id === activeListId) || null,
        [taskLists, activeListId]
    );

    const selectedTask = useMemo(() => {
        if (!selectedTaskId || !activeList) return null;
        return activeList.tasks.find(task => task.id === selectedTaskId) || null;
    }, [activeList, selectedTaskId]);

    const updateTaskInList = useCallback((listId: string, taskId: string, updatedTask: Partial<Task>) => {
        setTaskLists(prevLists =>
            prevLists.map(list =>
                list.id === listId
                    ? {
                        ...list,
                        tasks: list.tasks.map(task =>
                            task.id === taskId ? { ...task, ...updatedTask } : task
                        ),
                    }
                    : list
            )
        );
    }, []);

    const handlerWrapper = <T extends (...args: any[]) => void>(fn: T) => useCallback(fn, [updateTaskInList]);
    
    const handleAddTask = handlerWrapper((listId: string, title: string) => {
        if (title.trim() === '') return;
        const newTask: Task = {
            id: Date.now().toString(),
            title: title.trim(),
            details: '',
            completed: false,
            starred: false,
            subtasks: [],
            createdAt: Date.now(),
        };
        setTaskLists(prevLists =>
            prevLists.map(list =>
                list.id === listId ? { ...list, tasks: [newTask, ...list.tasks] } : list
            )
        );
    });

    const handleUpdateTask = handlerWrapper((taskId: string, updatedFields: Partial<Task>) => {
        if (!activeListId) return;
        updateTaskInList(activeListId, taskId, updatedFields);
    });

    const handleDeleteTask = handlerWrapper((taskId: string) => {
        if (!activeListId) return;
        setTaskLists(prevLists =>
            prevLists.map(list =>
                list.id === activeListId
                    ? { ...list, tasks: list.tasks.filter(task => task.id !== taskId) }
                    : list
            )
        );
        if (selectedTaskId === taskId) {
            setSelectedTaskId(null);
        }
    });

    const handleAddSubtask = handlerWrapper((taskId: string, title: string) => {
      if (!activeListId || !selectedTask || title.trim() === '') return;
      const newSubtask: Subtask = {
        id: Date.now().toString(),
        title: title.trim(),
        completed: false,
      };
      const updatedSubtasks = [...selectedTask.subtasks, newSubtask];
      handleUpdateTask(taskId, { subtasks: updatedSubtasks });
    });

    const handleUpdateSubtask = handlerWrapper((taskId: string, subtaskId: string, updatedFields: Partial<Subtask>) => {
      if (!activeListId || !selectedTask) return;
      const updatedSubtasks = selectedTask.subtasks.map(sub => 
        sub.id === subtaskId ? {...sub, ...updatedFields} : sub
      );
      handleUpdateTask(taskId, { subtasks: updatedSubtasks });
    });

    const handleDeleteSubtask = handlerWrapper((taskId: string, subtaskId: string) => {
        if (!activeListId || !selectedTask) return;
        const updatedSubtasks = selectedTask.subtasks.filter(sub => sub.id !== subtaskId);
        handleUpdateTask(taskId, { subtasks: updatedSubtasks });
    });

    const handleAddList = (name: string) => {
        if (name.trim() === '') return;
        const newList: TaskList = {
            id: Date.now().toString(),
            name: name.trim(),
            tasks: [],
        };
        setTaskLists(prev => [...prev, newList]);
        setActiveListId(newList.id);
    };

    const handleDeleteList = (listId: string) => {
        setTaskLists(prevLists => {
            const remainingLists = prevLists.filter(list => list.id !== listId);
            if (activeListId === listId) {
                const newActiveListId = remainingLists.length > 0 ? remainingLists[0].id : '';
                setActiveListId(newActiveListId);
                setSelectedTaskId(null);
            }
            return remainingLists;
        });
    };

    const handleSelectTask = (taskId: string | null) => {
        setSelectedTaskId(taskId);
    };

    return (
        <div className="h-screen w-screen bg-white flex flex-col font-sans">
            <header className="flex-shrink-0 bg-white border-b border-gray-200 flex items-center h-16 px-4">
                <button 
                    onClick={() => setSidebarOpen(!isSidebarOpen)}
                    className="p-2 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 mr-4"
                >
                    <ICONS.menu className="h-6 w-6 text-gray-600" />
                </button>
                <div className="flex items-center">
                    <img src="https://www.gstatic.com/images/branding/product/1x/tasks_2021_48dp.png" alt="Google Tasks" className="h-8 w-8" />
                    <h1 className="text-2xl text-gray-700 ml-3">Tareas</h1>
                </div>
            </header>

            <main className="flex-grow flex overflow-hidden">
                <Sidebar 
                    isOpen={isSidebarOpen} 
                    taskLists={taskLists}
                    activeListId={activeListId}
                    onSelectList={setActiveListId}
                    onAddList={handleAddList}
                    onDeleteList={handleDeleteList}
                />
                
                <div className={`flex-grow transition-all duration-300 ${isSidebarOpen ? 'md:ml-64' : 'ml-0'}`}>
                    {activeList ? (
                        <TaskListComponent 
                            taskList={activeList}
                            onAddTask={(title) => handleAddTask(activeList.id, title)}
                            onSelectTask={handleSelectTask}
                            onUpdateTask={handleUpdateTask}
                            selectedTaskId={selectedTaskId}
                        />
                    ) : (
                        <div className="h-full flex items-center justify-center bg-gray-50">
                            <p className="text-gray-500">Seleccione una lista o cree una nueva.</p>
                        </div>
                    )}
                </div>
                
                <TaskDetails
                    task={selectedTask}
                    onClose={() => setSelectedTaskId(null)}
                    onUpdate={handleUpdateTask}
                    onDelete={handleDeleteTask}
                    onAddSubtask={handleAddSubtask}
                    onUpdateSubtask={handleUpdateSubtask}
                    onDeleteSubtask={handleDeleteSubtask}
                />
            </main>
        </div>
    );
};

export default App;