import { createContext, useContext } from 'react';
import { TaskService } from './TaskService';
import { Task, TaskStatus } from '../../domain/Task';

interface TaskContextType {
    taskService: TaskService;
    getTasksByStatus: (status: TaskStatus) => Task[];
    getAllTasks: () => Task[];
    createTask: (task: Omit<Task, 'id'>) => Task;
    updateTask: (id: string, updates: Partial<Omit<Task, 'id'>>) => Task;
    deleteTask: (id: string) => void;
    moveTask: (id: string, status: TaskStatus) => Task;
}

export const TaskContext = createContext<TaskContextType | undefined>(
    undefined,
);

export const useTaskStore = (): TaskContextType => {
    const context = useContext(TaskContext);
    if (!context) {
        throw new Error('useTaskContext must be used within a TaskProvider');
    }
    return context;
};
