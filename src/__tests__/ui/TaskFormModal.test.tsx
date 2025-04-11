import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Task, TaskStatus } from '../../domain/Task';
import TaskFormModal from '../../ui/components/TaskFormModal';
import { useTaskStore } from '../../service/task/TaskContext';

jest.mock('../../service/task/TaskContext', () => ({
    useTaskStore: jest.fn(() => ({
        createTask: jest.fn(),
        updateTask: jest.fn(),
        getTasksByStatus: jest.fn(),
        getAllTasks: jest.fn(),
        deleteTask: jest.fn(),
        moveTask: jest.fn(),
    })),
}));

const mockTask: Task = {
    id: '1',
    title: 'Test Task',
    description: 'Test Description',
    status: TaskStatus.IN_PROGRESS,
};

describe('TaskFormModal', () => {
    const mockOnClose = jest.fn();
    const mockCreateTask = jest.fn();
    const mockUpdateTask = jest.fn();

    beforeEach(() => {
        (useTaskStore as jest.Mock).mockImplementation(() => ({
            createTask: mockCreateTask,
            updateTask: mockUpdateTask,
        }));
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('renders in create mode', () => {
        render(<TaskFormModal open={true} onClose={mockOnClose} task={null} />);

        expect(screen.getByText('New Task')).toBeInTheDocument();
        expect(screen.getByRole('textbox', { name: /title/i })).toHaveValue('');
        expect(
            screen.getByRole('textbox', { name: /description/i }),
        ).toHaveValue('');
        expect(
            screen.getByRole('combobox', { name: 'Status' }),
        ).not.toHaveValue();
    });

    it('renders in edit mode with task data', () => {
        render(
            <TaskFormModal open={true} onClose={mockOnClose} task={mockTask} />,
        );

        expect(screen.getByText('Edit Task')).toBeInTheDocument();
        expect(screen.getByRole('textbox', { name: /title/i })).toHaveValue(
            mockTask.title,
        );
        expect(
            screen.getByRole('textbox', { name: /description/i }),
        ).toHaveValue(mockTask.description);
    });

    it('submits new task', async () => {
        render(<TaskFormModal open={true} onClose={mockOnClose} task={null} />);

        fireEvent.change(screen.getByRole('textbox', { name: /title/i }), {
            target: { value: 'New Task Title' },
        });
        fireEvent.change(
            screen.getByRole('textbox', { name: /description/i }),
            {
                target: { value: 'New Task Description' },
            },
        );

        fireEvent.mouseDown(screen.getByRole('combobox', { name: 'Status' }));
        fireEvent.click(screen.getByRole('option', { name: /in review/i }));

        fireEvent.click(screen.getByText('Create'));

        await waitFor(() => {
            expect(mockCreateTask).toHaveBeenCalledWith({
                title: 'New Task Title',
                description: 'New Task Description',
                status: TaskStatus.IN_REVIEW.toUpperCase(),
            });
            expect(mockOnClose).toHaveBeenCalled();
        });
    });

    it('submits updated task', async () => {
        render(
            <TaskFormModal open={true} onClose={mockOnClose} task={mockTask} />,
        );

        fireEvent.change(screen.getByRole('textbox', { name: /title/i }), {
            target: { value: 'Updated Title' },
        });

        fireEvent.mouseDown(screen.getByRole('combobox', { name: 'Status' }));
        fireEvent.click(screen.getByRole('option', { name: /done/i }));

        fireEvent.click(screen.getByText('Save'));

        await waitFor(() => {
            expect(mockUpdateTask).toHaveBeenCalledWith(mockTask.id, {
                title: 'Updated Title',
                description: mockTask.description,
                status: TaskStatus.DONE.toUpperCase(),
            });
            expect(mockOnClose).toHaveBeenCalled();
        });
    });
});
