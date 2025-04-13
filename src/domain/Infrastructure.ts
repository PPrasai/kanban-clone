export interface AbstractRepository<T> {
    getAll(): T[];
    saveAll(items: T[]): void;
    create(item: T): void;
    update(updatedItem: T): void;
    delete(itemId: string): void;
}
