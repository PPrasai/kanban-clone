import { useState, ReactNode } from 'react';

import { Task, TaskStatus } from '../../domain/Task';
import LocalStorageTaskRepository from '../../repositoy/LocalStorageTaskRepository';
import { TaskContext } from './TaskContext';
import { TaskService } from './TaskService';

export const TaskProvider = ({ children }: { children: ReactNode }) => {
    const [taskService] = useState(
        () => new TaskService(new LocalStorageTaskRepository()),
    );

    const getAllTasks = () => taskService.getAll();
    const getTasksByStatus = (status: TaskStatus) =>
        taskService.getAll().filter((task) => task.status === status);
    const createTask = (task: Omit<Task, 'id'>) => taskService.create(task);
    const updateTask = (id: string, updates: Partial<Omit<Task, 'id'>>) =>
        taskService.update(id, updates);
    const deleteTask = (id: string) => taskService.delete(id);
    const moveTask = (id: string, status: TaskStatus) =>
        taskService.move(id, status);

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
