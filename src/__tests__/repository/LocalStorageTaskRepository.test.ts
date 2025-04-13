import { Task } from '../../domain/Task';
import LocalStorageTaskRepository from '../../repositoy/LocalStorageTaskRepository';

describe('LocalStorageTaskRepository', () => {
    const STORAGE_KEY = 'tasks';
    const mockTask: Task = { id: '1', title: 'Test', status: 'TODO' };

    beforeEach(() => {
        localStorage.clear();
        jest.spyOn(Storage.prototype, 'setItem');
        jest.spyOn(Storage.prototype, 'getItem');
    });

    it('returns empty array when no data', () => {
        const repo = new LocalStorageTaskRepository();
        expect(repo.getAll()).toEqual([]);
    });

    it('returns parsed tasks', () => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify([mockTask]));
        const repo = new LocalStorageTaskRepository();
        expect(repo.getAll()).toEqual([mockTask]);
    });

    it('saves tasks to localStorage', () => {
        const repo = new LocalStorageTaskRepository();
        repo.saveAll([mockTask]);
        expect(localStorage.setItem).toHaveBeenCalledWith(
            STORAGE_KEY,
            JSON.stringify([mockTask]),
        );
    });

    it('removes task', () => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify([mockTask]));
        const repo = new LocalStorageTaskRepository();
        repo.delete('1');
        expect(localStorage.setItem).toHaveBeenCalledWith(STORAGE_KEY, '[]');
    });

    it('throws error when JSON is invalid in getAll', () => {
        localStorage.setItem(STORAGE_KEY, 'invalid json');
        const repo = new LocalStorageTaskRepository();
        expect(() => repo.getAll()).toThrow(
            'Failed to get tasks from local storage',
        );
    });

    it('throws error when localStorage.setItem fails in saveAll', () => {
        const repo = new LocalStorageTaskRepository();
        jest.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
            throw new Error('Quota exceeded');
        });

        expect(() => repo.saveAll([mockTask])).toThrow(
            'Failed to save tasks to local storage: Quota exceeded',
        );
    });

    it('throws error when create fails due to saveAll failure', () => {
        const repo = new LocalStorageTaskRepository();
        jest.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
            throw new Error('Storage full');
        });

        expect(() => repo.create(mockTask)).toThrow(
            'Failed to create task: Failed to save tasks to local storage: Storage full',
        );
    });

    it('throws error when updating non-existing task', () => {
        const repo = new LocalStorageTaskRepository();
        expect(() => repo.update(mockTask)).toThrow(
            'Failed to update task: Task with id 1 not found',
        );
    });

    it('throws error when deleting non-existing task', () => {
        const repo = new LocalStorageTaskRepository();
        expect(() => repo.delete('non-existing')).toThrow(
            'Failed to delete task: Task with id non-existing not found',
        );
    });
});
