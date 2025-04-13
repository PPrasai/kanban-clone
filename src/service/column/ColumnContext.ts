import { createContext, useContext } from 'react';
import { Column } from '../../domain/Column';
import { ColumnService } from './ColumnService';

interface ColumnContextType {
    columns: Column[];
    createColumn: (data: Omit<Column, 'id'>) => Column;
    updateColumn: (id: string, updates: Partial<Omit<Column, 'id'>>) => Column;
    deleteColumn: (id: string) => void;
    refreshColumns: () => void;
    columnService: ColumnService;
}

export const ColumnContext = createContext<ColumnContextType | undefined>(
    undefined,
);

export const useColumnStore = () => {
    const context = useContext(ColumnContext);
    if (!context) {
        throw new Error('useColumnStore must be used within a ColumnProvider');
    }
    return context;
};
