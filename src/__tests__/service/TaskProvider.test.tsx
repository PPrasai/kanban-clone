import { renderHook, act, waitFor } from '@testing-library/react';
import { TaskProvider } from '../../service/task/TaskProvider';
import { useTaskStore } from '../../service/task/TaskContext';
import { TaskService } from '../../service/task/TaskService';

jest.mock('../../service/task/TaskService', () => ({
    TaskService: jest.fn(() => ({
        getAll: jest.fn(() => []),
        create: jest.fn((task) => ({ ...task, id: '1' })),
        update: jest.fn(),
        delete: jest.fn(),
        move: jest.fn(),
    })),
}));

describe('TaskProvider', () => {
    it('loads tasks on mount', () => {
        const { result } = renderHook(() => useTaskStore(), {
            wrapper: TaskProvider,
        });
        expect(result.current.getAllTasks()).toEqual([]);
    });

    it('creates and adds task', async () => {
        const { result } = renderHook(() => useTaskStore(), {
            wrapper: TaskProvider,
        });

        act(() => {
            result.current.createTask({ title: 'Test', status: 'TODO' });
        });

        waitFor(() => {
            expect(TaskService).toHaveBeenCalled();
            expect(result.current.getAllTasks()).toHaveLength(1);
        });
    });
});
