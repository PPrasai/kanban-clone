import LocalStorageColumnRepository from '../../repositoy/LocalStorageColumnRepository';
import { Column } from '../../domain/Column';

describe('LocalStorageColumnRepository', () => {
    const key = 'kanban_columns';
    const sampleColumn: Column = { id: '1', title: 'To Do' };

    beforeEach(() => {
        localStorage.clear();
    });

    it('should return empty array if localStorage is empty', () => {
        const repo = new LocalStorageColumnRepository();
        expect(repo.getAll()).toEqual([]);
    });

    it('should save and retrieve columns', () => {
        const repo = new LocalStorageColumnRepository();
        repo.saveAll([sampleColumn]);
        expect(repo.getAll()).toEqual([sampleColumn]);
    });

    it('should create a new column', () => {
        const repo = new LocalStorageColumnRepository();
        repo.create(sampleColumn);
        expect(repo.getAll()).toEqual([sampleColumn]);
    });

    it('should update a column', () => {
        const updated = { ...sampleColumn, title: 'Done' };
        const repo = new LocalStorageColumnRepository();
        repo.saveAll([sampleColumn]);
        repo.update(updated);
        expect(repo.getAll()[0].title).toBe('Done');
    });

    it('should delete a column', () => {
        const repo = new LocalStorageColumnRepository();
        repo.saveAll([sampleColumn]);
        repo.delete('1');
        expect(repo.getAll()).toEqual([]);
    });

    it('should handle corrupted JSON', () => {
        localStorage.setItem(key, 'not-json');
        const repo = new LocalStorageColumnRepository();
        expect(repo.getAll()).toEqual([]);
    });
});
