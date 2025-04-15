import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TaskColumn from '../../../ui/components/TaskColumn';
import { Column } from '../../../domain/Column';
import { Task } from '../../../domain/Task';

const mockColumn: Column = { id: '1', title: 'Todo' };
const mockTasks: Task[] = [
    { id: '1', title: 'Task 1', status: '1', favorite: false },
    { id: '2', title: 'Task 2', status: '1', favorite: true },
];

describe('TaskColumn', () => {
    it('renders column title and tasks', () => {
        render(
            <TaskColumn
                column={mockColumn}
                tasks={mockTasks}
                sortOrder="asc"
                onToggleSort={jest.fn()}
                onCardClick={jest.fn()}
                onFavoriteToggle={jest.fn()}
                onDelete={jest.fn()}
                onDeleteColumn={jest.fn()}
            />,
        );

        expect(screen.getByText('Todo')).toBeInTheDocument();
        expect(screen.getAllByTestId('task-card')).toHaveLength(2);
    });

    it('toggles sort order when button is clicked', async () => {
        const mockToggleSort = jest.fn();
        render(
            <TaskColumn
                column={mockColumn}
                tasks={mockTasks}
                sortOrder="asc"
                onToggleSort={mockToggleSort}
                onCardClick={jest.fn()}
                onFavoriteToggle={jest.fn()}
                onDelete={jest.fn()}
                onDeleteColumn={jest.fn()}
            />,
        );

        await userEvent.click(
            screen.getByRole('button', { name: /toggle sort order/i }),
        );
        expect(mockToggleSort).toHaveBeenCalled();
    });

    it('deletes column after confirmation', async () => {
        const mockDeleteColumn = jest.fn();
        window.confirm = jest.fn().mockReturnValue(true);

        render(
            <TaskColumn
                column={mockColumn}
                tasks={mockTasks}
                sortOrder="asc"
                onToggleSort={jest.fn()}
                onCardClick={jest.fn()}
                onFavoriteToggle={jest.fn()}
                onDelete={jest.fn()}
                onDeleteColumn={mockDeleteColumn}
            />,
        );

        await userEvent.click(
            screen.getByRole('button', { name: /delete column/i }),
        );
        expect(mockDeleteColumn).toHaveBeenCalledWith('1');
    });

    it('handles empty task list well', () => {
        render(
            <TaskColumn
                column={mockColumn}
                tasks={[]}
                sortOrder="asc"
                onToggleSort={jest.fn()}
                onCardClick={jest.fn()}
                onFavoriteToggle={jest.fn()}
                onDelete={jest.fn()}
            />,
        );

        expect(screen.queryByTestId('task-card')).toBeNull();
    });
});
