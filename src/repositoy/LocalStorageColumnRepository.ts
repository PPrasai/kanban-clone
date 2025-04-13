import { Column } from '../domain/Column';
import { AbstractRepository } from '../domain/Infrastructure';

const COLUMNS_STORAGE_KEY = 'kanban_columns';

export default class LocalStorageColumnRepository
    implements AbstractRepository<Column>
{
    getAll(): Column[] {
        const data = localStorage.getItem(COLUMNS_STORAGE_KEY);
        if (data) {
            try {
                return JSON.parse(data) as Column[];
            } catch {
                return [];
            }
        }
        return [];
    }

    saveAll(columns: Column[]): void {
        localStorage.setItem(COLUMNS_STORAGE_KEY, JSON.stringify(columns));
    }

    create(column: Column): void {
        const columns = this.getAll();
        columns.push(column);
        this.saveAll(columns);
    }

    update(updatedColumn: Column): void {
        const columns = this.getAll();
        const updatedColumns = columns.map((col) =>
            col.id === updatedColumn.id ? updatedColumn : col,
        );
        this.saveAll(updatedColumns);
    }

    delete(columnId: string): void {
        const columns = this.getAll();
        const updatedColumns = columns.filter((col) => col.id !== columnId);
        this.saveAll(updatedColumns);
    }
}
