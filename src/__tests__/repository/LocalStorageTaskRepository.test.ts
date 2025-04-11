import { Task, TaskStatus } from '../../domain/Task';
import LocalStorageTaskRepository from '../../repositoy/LocalStorageTaskRepository';

let store: Record<string, string> = {};

const mockLocalStorage = {
    getItem: jest.fn((key: string) => store[key] || null),
    setItem: jest.fn((key: string, value: string) => {
        store[key] = value;
    }),
    removeItem: jest.fn((key: string) => {
        delete store[key];
    }),
    clear: jest.fn(() => {
        store = {};
    }),
};

Object.defineProperty(window, 'localStorage', {
    value: mockLocalStorage,
});

describe('LocalStorageTaskRepository', () => {
    let repo: LocalStorageTaskRepository;
    const sampleTask: Task = {
        id: '1',
        title: 'Sample Task',
        description: 'Test task',
        status: TaskStatus.TODO,
    };

    beforeEach(() => {
        // Reset the store and mocks.
        store = {};
        jest.clearAllMocks();

        // Reset the localStorage mock implementations.
        mockLocalStorage.getItem.mockImplementation(
            (key: string) => store[key] || null,
        );
        mockLocalStorage.setItem.mockImplementation(
            (key: string, value: string) => {
                store[key] = value;
            },
        );
        mockLocalStorage.removeItem.mockImplementation((key: string) => {
            delete store[key];
        });
        mockLocalStorage.clear.mockImplementation(() => {
            store = {};
        });

        // Create a fresh repository instance for every test.
        repo = new LocalStorageTaskRepository();
    });

    describe('getAll', () => {
        it('returns parsed tasks from localStorage', () => {
            localStorage.setItem('tasks', JSON.stringify([sampleTask]));
            const tasks = repo.getAll();
            expect(tasks).toEqual([sampleTask]);
        });

        it('throws when JSON parsing fails', () => {
            localStorage.setItem('tasks', '{bad-json}');
            expect(() => repo.getAll()).toThrow(/Failed to get tasks/);
        });
    });

    describe('saveAll', () => {
        it('saves tasks to localStorage', () => {
            repo.saveAll([sampleTask]);
            expect(localStorage.setItem).toHaveBeenCalledWith(
                'tasks',
                JSON.stringify([sampleTask]),
            );
        });

        it('throws when localStorage.setItem fails', () => {
            // Override setItem to simulate failure.
            localStorage.setItem = jest.fn(() => {
                throw new Error('Quota exceeded');
            });
            expect(() => repo.saveAll([sampleTask])).toThrow(
                'Failed to save tasks to local storage: Quota exceeded',
            );
        });
    });

    describe('createTask', () => {
        it('adds task to existing list', () => {
            repo.saveAll([]); // initialize storage with an empty list
            repo.createTask(sampleTask);
            const tasks = repo.getAll();
            expect(tasks).toContainEqual(sampleTask);
        });

        it('throws if getAll fails', () => {
            jest.spyOn(repo, 'getAll').mockImplementation(() => {
                throw new Error('boom');
            });
            expect(() => repo.createTask(sampleTask)).toThrow(
                'Failed to create task',
            );
        });
    });

    describe('updateTask', () => {
        it('updates an existing task', () => {
            const updatedTask = { ...sampleTask, title: 'Updated' };
            repo.saveAll([sampleTask]);
            repo.updateTask(updatedTask);
            const tasks = repo.getAll();
            expect(tasks[0].title).toBe('Updated');
        });

        it('throws if task not found', () => {
            repo.saveAll([]);
            expect(() => repo.updateTask(sampleTask)).toThrow(
                /Task with id 1 not found/,
            );
        });
    });

    describe('deleteTask', () => {
        it('removes task by id', () => {
            repo.saveAll([sampleTask]);
            repo.deleteTask(sampleTask.id);
            expect(repo.getAll()).toEqual([]);
        });

        it('throws if task not found', () => {
            repo.saveAll([]);
            expect(() => repo.deleteTask('nonexistent')).toThrow(
                /Task with id nonexistent not found/,
            );
        });
    });
});
