/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen, fireEvent } from '@testing-library/react';
import TaskCard from '../../ui/components/TaskCard';
import { Task, TaskStatus } from '../../domain/Task';

jest.mock('react-dnd', () => ({
    useDrag: () => [{ isDragging: false }, jest.fn()],
    DndProvider: ({ children }: { children: any }) => children,
}));

describe('TaskCard', () => {
    const mockTask: Task = {
        id: '1',
        title: 'Test Task',
        description: 'Test Description',
        status: TaskStatus.TODO,
        favorite: false,
    };

    const mockTaskWithoutDescription: Task = {
        id: '2',
        title: 'Task Without Description',
        status: TaskStatus.IN_PROGRESS,
    };

    const mockOnClick = jest.fn();
    const mockFavoriteClick = jest.fn();
    const mockDeleteClick = jest.fn();

    it('renders task title and description when provided', () => {
        render(
            <TaskCard
                task={mockTask}
                onClick={mockOnClick}
                onFavoriteToggle={mockFavoriteClick}
                onDelete={mockDeleteClick}
            />,
        );

        expect(screen.getByText(mockTask.title)).toBeInTheDocument();
        expect(screen.getByText(mockTask.description!)).toBeInTheDocument();
    });

    it('does not render description when not provided', () => {
        render(
            <TaskCard
                task={mockTaskWithoutDescription}
                onClick={mockOnClick}
                onFavoriteToggle={mockFavoriteClick}
                onDelete={mockDeleteClick}
            />,
        );

        expect(
            screen.getByText(mockTaskWithoutDescription.title),
        ).toBeInTheDocument();
        expect(
            screen.queryByTestId('task-description'),
        ).not.toBeInTheDocument();
    });

    it('calls onClick handler when card is clicked', () => {
        render(
            <TaskCard
                task={mockTask}
                onClick={mockOnClick}
                onFavoriteToggle={mockFavoriteClick}
                onDelete={mockDeleteClick}
            />,
        );

        fireEvent.click(screen.getByTestId('task-card'));
        expect(mockOnClick).toHaveBeenCalledTimes(2);
    });
});
