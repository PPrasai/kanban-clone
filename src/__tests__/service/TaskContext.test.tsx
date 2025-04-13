import { renderHook } from '@testing-library/react';
import { useTaskStore } from '../../service/task/TaskContext';

test('throws error when outside provider', () => {
    expect(() => renderHook(() => useTaskStore())).toThrow(
        'useTaskStore must be used within a TaskProvider',
    );
});
