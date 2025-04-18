import { useState, ReactNode, useEffect, useMemo } from 'react';
import { TaskContext } from './TaskContext';
import { TaskService } from './TaskService';
import LocalStorageTaskRepository from '../../repositoy/LocalStorageTaskRepository';
import { Task, TaskStatus } from '../../domain/Task';

interface TaskProviderProps {
    children: ReactNode;
}

export const TaskProvider = ({ children }: TaskProviderProps) => {
    const taskService = useMemo(
        () => new TaskService(new LocalStorageTaskRepository()),
        [],
    );

    const [tasks, setTasks] = useState<Task[]>([]);

    useEffect(() => {
        setTasks(taskService.getAll());
    }, [taskService]);

    const getAllTasks = () => tasks;

    const getTasksByStatus = (status: TaskStatus) =>
        tasks.filter(
            (task) => task.status.toLowerCase() === status.toLowerCase(),
        );

    const createTask = (task: Omit<Task, 'id'>) => {
        console.log('creating');
        const newTask = taskService.create(task);
        setTasks([...tasks, newTask]);
        return newTask;
    };

    const updateTask = (id: string, updates: Partial<Omit<Task, 'id'>>) => {
        const updated = taskService.update(id, updates);
        setTasks((prev) =>
            prev.map((task) =>
                task.id === id ? { ...task, ...updated } : task,
            ),
        );
        return updated;
    };

    const deleteTask = (id: string) => {
        taskService.delete(id);
        setTasks((prev) => prev.filter((task) => task.id !== id));
    };

    const moveTask = (id: string, status: TaskStatus) => {
        const moved = taskService.move(id, status);
        setTasks((prev) =>
            prev.map((task) => (task.id === id ? { ...task, ...moved } : task)),
        );
        return moved;
    };

    return (
        <TaskContext.Provider
            value={{
                taskService,
                getAllTasks,
                getTasksByStatus,
                createTask,
                updateTask,
                deleteTask,
                moveTask,
            }}
        >
            {children}
        </TaskContext.Provider>
    );
};
