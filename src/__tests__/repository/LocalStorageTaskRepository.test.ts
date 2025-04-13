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

    describe('getAll()', () => {
        it('returns empty array when no data', () => {
            const repo = new LocalStorageTaskRepository();
            expect(repo.getAll()).toEqual([]);
        });

        it('returns parsed tasks', () => {
            localStorage.setItem(STORAGE_KEY, JSON.stringify([mockTask]));
            const repo = new LocalStorageTaskRepository();
            expect(repo.getAll()).toEqual([mockTask]);
        });
    });

    describe('saveAll()', () => {
        it('saves tasks to localStorage', () => {
            const repo = new LocalStorageTaskRepository();
            repo.saveAll([mockTask]);
            expect(localStorage.setItem).toHaveBeenCalledWith(
                STORAGE_KEY,
                JSON.stringify([mockTask]),
            );
        });
    });

    describe('delete()', () => {
        it('removes task', () => {
            localStorage.setItem(STORAGE_KEY, JSON.stringify([mockTask]));
            const repo = new LocalStorageTaskRepository();
            repo.delete('1');
            expect(localStorage.setItem).toHaveBeenCalledWith(
                STORAGE_KEY,
                '[]',
            );
        });
    });
});
