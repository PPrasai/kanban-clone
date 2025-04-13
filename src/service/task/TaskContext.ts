import { createContext, useContext } from 'react';
import { TaskService } from './TaskService';
import { Task } from '../../domain/Task';

interface TaskContextType {
    taskService: TaskService;
    getTasksByStatus: (status: string) => Task[];
    getAllTasks: () => Task[];
    createTask: (task: Omit<Task, 'id'>) => Task;
    updateTask: (id: string, updates: Partial<Omit<Task, 'id'>>) => Task;
    deleteTask: (id: string) => void;
    moveTask: (id: string, status: string) => Task;
}

export const TaskContext = createContext<TaskContextType | undefined>(
    undefined,
);

export const useTaskStore = (): TaskContextType => {
    const context = useContext(TaskContext);
    if (!context) {
        throw new Error('useTaskStore must be used within a TaskProvider');
    }
    return context;
};
