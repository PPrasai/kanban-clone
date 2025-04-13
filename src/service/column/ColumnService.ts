import { Column } from '../../domain/Column';
import { v4 as uuidv4 } from 'uuid';
import LocalStorageColumnRepository from '../../repositoy/LocalStorageColumnRepository';

export class ColumnNotFoundError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'ColumnNotFoundError';
    }
}

export class ColumnService {
    private cache: Column[] | null = null;

    constructor(
        private repo: LocalStorageColumnRepository = new LocalStorageColumnRepository(),
    ) {}

    private loadColumns(): Column[] {
        if (!this.cache) {
            this.cache = this.repo.getAll();
        }
        return this.cache;
    }

    private syncColumns(): void {
        if (this.cache) {
            this.repo.saveAll(this.cache);
        }
    }

    getAll(): Column[] {
        return this.loadColumns();
    }

    create(column: Omit<Column, 'id'>): Column {
        const newColumn: Column = { id: uuidv4(), ...column };
        const columns = this.loadColumns();
        const updatedColumns = [...columns, newColumn];
        this.cache = updatedColumns;
        this.syncColumns();
        return newColumn;
    }

    update(id: string, updates: Partial<Omit<Column, 'id'>>): Column {
        const columns = this.loadColumns();
        let updatedColumn: Column | undefined;
        const updatedColumns = columns.map((col) => {
            if (col.id === id) {
                updatedColumn = { ...col, ...updates };
                return updatedColumn;
            }
            return col;
        });
        if (!updatedColumn) {
            throw new ColumnNotFoundError(`Column with id ${id} not found`);
        }
        this.cache = updatedColumns;
        this.syncColumns();
        return updatedColumn;
    }

    delete(id: string): void {
        const columns = this.loadColumns();
        const initialLength = columns.length;
        const updatedColumns = columns.filter((col) => col.id !== id);
        if (updatedColumns.length === initialLength) {
            throw new ColumnNotFoundError(`Column with id ${id} not found`);
        }
        this.cache = updatedColumns;
        this.syncColumns();
    }
}
