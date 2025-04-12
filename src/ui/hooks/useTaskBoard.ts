import { useState } from 'react';
import { Task, TaskStatus } from '../../domain/Task';
import { useTaskStore } from '../../service/task/TaskContext';

export const STATUSES: TaskStatus[] = [
    TaskStatus.TODO,
    TaskStatus.IN_PROGRESS,
    TaskStatus.IN_REVIEW,
    TaskStatus.DONE,
];

export const useTaskBoard = () => {
    const { getTasksByStatus, updateTask, moveTask, deleteTask } =
        useTaskStore();

    const [sortOrders, setSortOrders] = useState<
        Record<TaskStatus, 'asc' | 'desc'>
    >({
        [TaskStatus.TODO]: 'asc',
        [TaskStatus.IN_PROGRESS]: 'asc',
        [TaskStatus.IN_REVIEW]: 'asc',
        [TaskStatus.DONE]: 'asc',
    });

    const toggleSortOrder = (status: TaskStatus) => {
        setSortOrders((prev) => ({
            ...prev,
            [status]: prev[status] === 'asc' ? 'desc' : 'asc',
        }));
    };

    const getSortedTasks = (status: TaskStatus): Task[] => {
        const tasks = getTasksByStatus(status);

        return tasks.sort((a, b) => {
            if (a.favorite && !b.favorite) return -1;
            if (!a.favorite && b.favorite) return 1;

            const comparison = a.title.localeCompare(b.title, undefined, {
                sensitivity: 'base',
            });

            return sortOrders[status] === 'asc' ? comparison : -comparison;
        });
    };

    return {
        STATUSES,
        sortOrders,
        toggleSortOrder,
        getSortedTasks,
        updateTask,
        moveTask,
        deleteTask,
    };
};
