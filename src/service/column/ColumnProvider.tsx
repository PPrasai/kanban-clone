import React, { useState, useEffect, useMemo } from 'react';
import { Column } from '../../domain/Column';
import { ColumnService } from './ColumnService';
import { ColumnContext } from './ColumnContext';

interface Props {
    children: React.ReactNode;
}

export const ColumnProvider = ({ children }: Props) => {
    const columnService = useMemo(() => new ColumnService(), []);
    const [columns, setColumns] = useState<Column[]>([]);

    const refreshColumns = () => {
        const all = columnService.getAll();
        setColumns(all);
    };

    useEffect(() => {
        refreshColumns();
    }, [columnService]);

    const createColumn = (data: Omit<Column, 'id'>): Column => {
        const newCol = columnService.create(data);
        setColumns((prev) => [...prev, newCol]);
        return newCol;
    };

    const updateColumn = (
        id: string,
        updates: Partial<Omit<Column, 'id'>>,
    ): Column => {
        const updated = columnService.update(id, updates);
        setColumns((prev) =>
            prev.map((col) => (col.id === id ? updated : col)),
        );
        return updated;
    };

    const deleteColumn = (id: string): void => {
        columnService.delete(id);
        setColumns((prev) => prev.filter((col) => col.id !== id));
    };

    return (
        <ColumnContext.Provider
            value={{
                columnService,
                columns,
                createColumn,
                updateColumn,
                deleteColumn,
                refreshColumns,
            }}
        >
            {children}
        </ColumnContext.Provider>
    );
};
