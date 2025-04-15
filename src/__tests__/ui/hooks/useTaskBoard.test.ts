import { renderHook, act } from '@testing-library/react';
import { useTaskStore } from '../../../service/task/TaskContext';
import { Task } from '../../../domain/Task';
import { useTaskBoard } from '../../../ui/hooks/useTaskBoard';

jest.mock('../../../service/task/TaskContext');

const mockUseTaskStore = useTaskStore as jest.MockedFunction<
    typeof useTaskStore
>;

describe('useTaskBoard', () => {
    const mockTasks: Task[] = [
        { id: '1', title: 'B Task', favorite: false, status: 'todo' },
        { id: '2', title: 'A Task', favorite: true, status: 'todo' },
        { id: '3', title: 'C Task', favorite: true, status: 'todo' },
    ];

    beforeEach(() => {
        mockUseTaskStore.mockReturnValue({
            getTasksByStatus: jest
                .fn()
                .mockImplementation((status: string) =>
                    mockTasks.filter((task) => task.status === status),
                ),
            updateTask: jest.fn(),
            moveTask: jest.fn(),
            deleteTask: jest.fn(),
            createTask: jest.fn(),
            getAllTasks: jest.fn().mockReturnValue(mockTasks),
            taskService: jest.requireMock('../../../service/task/TaskService'),
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should initialize with empty sort orders', () => {
        const { result } = renderHook(() => useTaskBoard());
        expect(result.current.sortOrders).toEqual({});
    });

    it('should toggle sort order for a column', () => {
        const { result } = renderHook(() => useTaskBoard());

        act(() => {
            result.current.toggleSortOrder('todo');
        });
        expect(result.current.sortOrders).toEqual({ todo: 'asc' });

        act(() => {
            result.current.toggleSortOrder('todo');
        });
        expect(result.current.sortOrders).toEqual({ todo: 'desc' });
    });

    it('should sort tasks by favorite first, then title in ascending order', () => {
        const { result } = renderHook(() => useTaskBoard());
        const sortedTasks = result.current.getSortedTasks('todo');

        expect(sortedTasks.map((t) => t.title)).toEqual([
            'A Task',
            'C Task',
            'B Task',
        ]);
    });

    it('should sort tasks by favorite first, then title in descending order', () => {
        const { result } = renderHook(() => useTaskBoard());

        act(() => {
            result.current.toggleSortOrder('todo');
            result.current.toggleSortOrder('todo');
        });

        const sortedTasks = result.current.getSortedTasks('todo');
        expect(sortedTasks.map((t) => t.title)).toEqual([
            'C Task',
            'A Task',
            'B Task',
        ]);
    });

    it('should handle case-insensitive sorting', () => {
        mockUseTaskStore.mockReturnValueOnce({
            getTasksByStatus: jest.fn().mockReturnValue([
                { id: '1', title: 'Banana', favorite: true, status: 'todo' },
                { id: '2', title: 'apple', favorite: true, status: 'todo' },
            ]),
            updateTask: jest.fn(),
            moveTask: jest.fn(),
            deleteTask: jest.fn(),
            createTask: jest.fn(),
            getAllTasks: jest.fn().mockReturnValue(mockTasks),
            taskService: jest.requireMock('../../../service/task/TaskService'),
        });

        const { result } = renderHook(() => useTaskBoard());
        const sortedTasks = result.current.getSortedTasks('todo');

        expect(sortedTasks.map((t) => t.title)).toEqual(['apple', 'Banana']);
    });

    it('should call createTask from store', () => {
        const { result } = renderHook(() => useTaskBoard());
        act(() => {
            result.current.createTask({ title: 'New Task', status: 'todo' });
        });
        expect(useTaskStore().createTask).toHaveBeenCalledWith({
            title: 'New Task',
            status: 'todo',
        });
    });

    it('should call updateTask from store', () => {
        const { result } = renderHook(() => useTaskBoard());
        act(() => {
            result.current.updateTask('1', { title: 'Updated Task' });
        });
        expect(useTaskStore().updateTask).toHaveBeenCalledWith('1', {
            title: 'Updated Task',
        });
    });
});
