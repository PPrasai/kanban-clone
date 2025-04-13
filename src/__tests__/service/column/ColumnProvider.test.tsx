import React from 'react';
import { render, screen } from '@testing-library/react';
import { useColumnStore } from '../../../service/column/ColumnContext';
import { ColumnProvider } from '../../../service/column/ColumnProvider';

const ConsumerComponent = () => {
    const {
        columns,
        createColumn,
        updateColumn,
        deleteColumn,
        refreshColumns,
    } = useColumnStore();

    React.useEffect(() => {
        const newCol = createColumn({ title: 'Hello' });
        updateColumn(newCol.id, { title: 'World' });
        deleteColumn(newCol.id);
        refreshColumns();
    }, []);

    return <div data-testid="columns-length">{columns.length}</div>;
};

describe('ColumnProvider', () => {
    it('should create, update, and delete a column correctly', () => {
        render(
            <ColumnProvider>
                <ConsumerComponent />
            </ColumnProvider>,
        );
        const colCount = screen.getByTestId('columns-length');
        expect(colCount.textContent).toBe('0');
    });
});
