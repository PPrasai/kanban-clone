import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import TaskColumn from '../../ui/components/TaskColumn';
import { Task, TaskStatus } from '../../domain/Task';
import { act } from 'react';

const task: Task = {
    id: '1',
    title: 'Test Task',
    description: 'Testing column',
    favorite: false,
    status: TaskStatus.TODO,
};

describe('TaskColumn', () => {
    const onCardClick = jest.fn();
    const onFavoriteToggle = jest.fn();
    const onDelete = jest.fn();
    const onToggleSort = jest.fn();

    beforeEach(() => {
        render(
            <TaskColumn
                status={TaskStatus.TODO}
                tasks={[task]}
                sortOrder="asc"
                onToggleSort={onToggleSort}
                onCardClick={onCardClick}
                onFavoriteToggle={onFavoriteToggle}
                onDelete={onDelete}
            />,
        );
    });

    it('renders task and allows interactions', async () => {
        expect(screen.getByText('Test Task')).toBeInTheDocument();

        await act(() => fireEvent.click(screen.getByText('Test Task')));
        waitFor(() => expect(onCardClick).toHaveBeenCalled());

        const buttons = screen.getAllByRole('button');
        await act(() => fireEvent.click(buttons[0]));
        await act(() => fireEvent.click(buttons[1]));

        waitFor(() => expect(onFavoriteToggle).toHaveBeenCalled());
        waitFor(() => expect(onDelete).toHaveBeenCalled());
    });

    it('calls onToggleSort when sort button clicked', async () => {
        const sortBtn = screen.getByTestId('sort-button');
        await act(() => fireEvent.click(sortBtn));
        waitFor(() => expect(onToggleSort).toHaveBeenCalled());
    });
});
