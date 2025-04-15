import { useState } from 'react';
import { Task } from '../../domain/Task';
import { useTaskStore } from '../../service/task/TaskContext';

export const useTaskBoard = () => {
    const { getTasksByStatus, updateTask, moveTask, deleteTask, createTask } =
        useTaskStore();

    const [sortOrders, setSortOrders] = useState<
        Record<string, 'asc' | 'desc'>
    >({});

    const toggleSortOrder = (columnId: string) => {
        setSortOrders((prev) => ({
            ...prev,
            [columnId]: prev[columnId] === 'asc' ? 'desc' : 'asc',
        }));
    };

    const getSortedTasks = (columnId: string): Task[] => {
        const tasks = getTasksByStatus(columnId);
        const sorted = [...tasks].sort((a, b) => {
            if (a.favorite && !b.favorite) return -1;
            if (!a.favorite && b.favorite) return 1;
            const comparison = a.title.localeCompare(b.title, undefined, {
                sensitivity: 'base',
            });
            const order = sortOrders[columnId] || 'asc';
            return order === 'asc' ? comparison : -comparison;
        });
        return sorted;
    };

    return {
        sortOrders,
        toggleSortOrder,
        getSortedTasks,
        createTask,
        updateTask,
        moveTask,
        deleteTask,
    };
};
