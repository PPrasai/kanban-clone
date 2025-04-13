import {
    ColumnNotFoundError,
    ColumnService,
} from '../../../service/column/ColumnService';

describe('ColumnService', () => {
    let service: ColumnService;

    beforeEach(() => {
        localStorage.clear();
        service = new ColumnService();
    });

    it('should create and retrieve a column', () => {
        const all = service.getAll();
        expect(all).toHaveLength(0);
    });

    it('should update a column', () => {
        const { id } = service.create({ title: 'Old' });
        const updated = service.update(id, { title: 'New' });
        expect(updated.title).toBe('New');
    });

    it('should throw on updating non-existent column', () => {
        expect(() => service.update('fake', { title: 'X' })).toThrow(
            ColumnNotFoundError,
        );
    });

    it('should delete a column', () => {
        const { id } = service.create({ title: 'A' });
        service.delete(id);
        expect(service.getAll()).toEqual([]);
    });

    it('should throw on deleting non-existent column', () => {
        expect(() => service.delete('fake')).toThrow(ColumnNotFoundError);
    });
});
