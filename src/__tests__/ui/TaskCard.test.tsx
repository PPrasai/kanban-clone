import { render, screen, fireEvent } from '@testing-library/react';
import TaskCard from '../../ui/components/TaskCard';
import { Task, TaskStatus } from '../../domain/Task';

describe('TaskCard', () => {
    const mockTask: Task = {
        id: '1',
        title: 'Test Task',
        description: 'Test Description',
        status: TaskStatus.TODO,
    };

    const mockTaskWithoutDescription: Task = {
        id: '2',
        title: 'Task Without Description',
        status: TaskStatus.IN_PROGRESS,
    };

    const mockOnClick = jest.fn();

    it('renders task title and description when provided', () => {
        render(<TaskCard task={mockTask} onClick={mockOnClick} />);

        expect(screen.getByText(mockTask.title)).toBeInTheDocument();
        expect(screen.getByText(mockTask.description!)).toBeInTheDocument();
    });

    it('does not render description when not provided', () => {
        render(
            <TaskCard
                task={mockTaskWithoutDescription}
                onClick={mockOnClick}
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
        render(<TaskCard task={mockTask} onClick={mockOnClick} />);

        fireEvent.click(screen.getByTestId('task-card'));
        expect(mockOnClick).toHaveBeenCalledTimes(1);
    });

    it('has hover styles and cursor pointer', () => {
        const { container } = render(
            <TaskCard task={mockTask} onClick={mockOnClick} />,
        );
        const card = container.firstChild;

        expect(card).toHaveClass('cursor-pointer');
        expect(card).toHaveClass('hover:shadow-lg');
        expect(card).toHaveClass('transition-shadow');
    });
});
