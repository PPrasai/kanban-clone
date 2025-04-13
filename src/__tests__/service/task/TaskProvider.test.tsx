import { renderHook, waitFor, act } from '@testing-library/react';
import { useTaskStore } from '../../../service/task/TaskContext';
import { TaskProvider } from '../../../service/task/TaskProvider';

const mockCreate = jest.fn((task) => ({ ...task, id: 'new-id' }));
const mockUpdate = jest.fn((id, updates) => ({ id, ...updates }));
const mockDelete = jest.fn();

jest.mock('../../../service/task/TaskService', () => ({
    TaskService: jest.fn(() => ({
        getAll: jest.fn(() => [{ id: '1', title: 'Task 1', status: 'TODO' }]),
        create: mockCreate,
        update: mockUpdate,
        delete: mockDelete,
        move: (id: string, status: string) => mockUpdate(id, { status }),
    })),
}));

describe('TaskProvider Logic', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('loads tasks on mount via useEffect', () => {
        const { result } = renderHook(() => useTaskStore(), {
            wrapper: TaskProvider,
        });
        expect(result.current.getAllTasks()).toEqual([
            { id: '1', title: 'Task 1', status: 'TODO' },
        ]);
    });

    it('filters tasks by status (case-insensitive)', () => {
        const { result } = renderHook(() => useTaskStore(), {
            wrapper: TaskProvider,
        });
        const tasks = result.current.getTasksByStatus('todo');
        expect(tasks).toHaveLength(1);
        expect(result.current.getTasksByStatus('DoNe')).toHaveLength(0);
    });

    it('createTask updates state', async () => {
        const { result } = renderHook(() => useTaskStore(), {
            wrapper: TaskProvider,
        });

        act(() => {
            result.current.createTask({ title: 'New Task', status: 'TODO' });
        });

        waitFor(() => {
            expect(mockCreate).toHaveBeenCalled();
            expect(result.current.getAllTasks()).toEqual(
                expect.arrayContaining([
                    expect.objectContaining({ title: 'New Task' }),
                ]),
            );
        });
    });

    it('updateTask modifies existing task', () => {
        const { result } = renderHook(() => useTaskStore(), {
            wrapper: TaskProvider,
        });

        act(() => {
            result.current.updateTask('1', { title: 'Updated Title' });
        });

        waitFor(() => {
            expect(mockUpdate).toHaveBeenCalledWith('1', {
                title: 'Updated Title',
            });
            expect(result.current.getAllTasks()[0].title).toBe('Updated Title');
        });
    });

    it('deleteTask removes the task', () => {
        const { result } = renderHook(() => useTaskStore(), {
            wrapper: TaskProvider,
        });

        act(() => {
            result.current.deleteTask('1');
        });

        expect(mockDelete).toHaveBeenCalledWith('1');
        expect(result.current.getAllTasks()).toEqual([]);
    });

    it('moveTask updates the task status', () => {
        const { result } = renderHook(() => useTaskStore(), {
            wrapper: TaskProvider,
        });

        act(() => {
            result.current.moveTask('1', 'DONE');
        });

        expect(mockUpdate).toHaveBeenCalledWith('1', { status: 'DONE' });

        const movedTask = result.current.getAllTasks()[0];
        expect(movedTask.status).toBe('DONE');
    });
});
