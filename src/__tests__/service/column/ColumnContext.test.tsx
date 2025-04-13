import { renderHook } from '@testing-library/react';
import { useColumnStore } from '../../../service/column/ColumnContext';

test('throws error when outside provider', () => {
    expect(() => renderHook(() => useColumnStore())).toThrow(
        'useColumnStore must be used within a ColumnProvider',
    );
});
