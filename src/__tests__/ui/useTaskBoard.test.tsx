import { act, renderHook } from '@testing-library/react';
import { TaskStatus, Task } from '../../domain/Task';
import { STATUSES, useTaskBoard } from '../../ui/hooks/useTaskBoard';

const mockUpdate = jest.fn();
const mockMove = jest.fn();
const mockDelete = jest.fn();

const dummyTasks: Task[] = [
    { id: '1', title: 'Alpha', status: TaskStatus.TODO, favorite: false },
    { id: '2', title: 'Beta', status: TaskStatus.TODO, favorite: true },
];

jest.mock('../../service/task/TaskContext', () => ({
    useTaskStore: () => ({
        getTasksByStatus: () => dummyTasks,
        updateTask: mockUpdate,
        moveTask: mockMove,
        deleteTask: mockDelete,
    }),
}));

describe('useTaskBoard', () => {
    test('initializes sortOrders to asc for all statuses', () => {
        const { result } = renderHook(() => useTaskBoard());
        STATUSES.forEach((status) => {
            expect(result.current.sortOrders[status]).toBe('asc');
        });
    });

    test('toggleSortOrder flips sort order', () => {
        const { result } = renderHook(() => useTaskBoard());

        act(() => {
            result.current.toggleSortOrder(TaskStatus.TODO);
        });
        expect(result.current.sortOrders[TaskStatus.TODO]).toBe('desc');

        act(() => {
            result.current.toggleSortOrder(TaskStatus.TODO);
        });
        expect(result.current.sortOrders[TaskStatus.TODO]).toBe('asc');
    });

    test('getSortedTasks sorts by favorite then title', () => {
        const { result } = renderHook(() => useTaskBoard());
        const sortedTasks = result.current.getSortedTasks(TaskStatus.TODO);
        expect(sortedTasks).toHaveLength(2);
        expect(sortedTasks[0].id).toBe('2');
        expect(sortedTasks[1].id).toBe('1');
    });

    test('calls updateTask, moveTask, deleteTask', () => {
        const { result } = renderHook(() => useTaskBoard());

        act(() => {
            result.current.updateTask('1', { title: 'Updated' });
            result.current.moveTask('1', TaskStatus.DONE);
            result.current.deleteTask('1');
        });

        expect(mockUpdate).toHaveBeenCalledWith('1', { title: 'Updated' });
        expect(mockMove).toHaveBeenCalledWith('1', TaskStatus.DONE);
        expect(mockDelete).toHaveBeenCalledWith('1');
    });
});
