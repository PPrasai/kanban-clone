import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TaskCard from '../../../ui/components/TaskCard';
import { Task } from '../../../domain/Task';

const mockTask: Task = {
    id: '1',
    title: 'Test Task',
    description: 'Test Description',
    status: '1',
    favorite: false,
};

describe('TaskCard', () => {
    it('renders task details', () => {
        render(
            <TaskCard
                task={mockTask}
                onClick={jest.fn()}
                onFavoriteToggle={jest.fn()}
                onDelete={jest.fn()}
            />,
        );

        expect(screen.getByText('Test Task')).toBeInTheDocument();
        expect(screen.getByText('Test Description')).toBeInTheDocument();
    });

    it('toggles favorite status', async () => {
        const mockToggle = jest.fn();
        render(
            <TaskCard
                task={mockTask}
                onClick={jest.fn()}
                onFavoriteToggle={mockToggle}
                onDelete={jest.fn()}
            />,
        );

        await userEvent.click(
            screen.getByRole('button', { name: /favorite/i }),
        );
        expect(mockToggle).toHaveBeenCalled();
    });

    it('triggers delete action', async () => {
        const mockDelete = jest.fn();
        render(
            <TaskCard
                task={mockTask}
                onClick={jest.fn()}
                onFavoriteToggle={jest.fn()}
                onDelete={mockDelete}
            />,
        );

        await userEvent.click(screen.getByRole('button', { name: /delete/i }));
        expect(mockDelete).toHaveBeenCalled();
    });

    it('has draggable handle', () => {
        render(
            <TaskCard
                task={mockTask}
                onClick={jest.fn()}
                onFavoriteToggle={jest.fn()}
                onDelete={jest.fn()}
            />,
        );

        expect(screen.getByTestId('drag-handle')).toBeInTheDocument();
    });
});
