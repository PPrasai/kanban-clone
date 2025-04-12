import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { TaskProvider } from '../../service/task/TaskProvider';
import TaskBoard from '../../ui/components/TaskBoard';
import { act } from 'react';

describe('TaskBoard', () => {
    beforeEach(() => {
        render(
            <TaskProvider>
                <TaskBoard />
            </TaskProvider>,
        );
    });

    test('renders columns for all statuses', () => {
        expect(screen.getByText(/TODO/i)).toBeInTheDocument();
        expect(screen.getByText(/IN PROGRESS/i)).toBeInTheDocument();
        expect(screen.getByText(/IN REVIEW/i)).toBeInTheDocument();
        expect(screen.getByText(/DONE/i)).toBeInTheDocument();
    });

    test('opens modal when create button is clicked', async () => {
        const addButton = screen.getByTestId('add-task-button');
        await act(() => fireEvent.click(addButton));

        waitFor(() =>
            expect(screen.getByText(/New Task/i)).toBeInTheDocument(),
        );
    });
});
