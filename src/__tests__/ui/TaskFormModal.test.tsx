import {
    render,
    fireEvent,
    screen,
    act,
    waitFor,
} from '@testing-library/react';
import TaskFormModal from '../../ui/components/TaskFormModal';
import { TaskStatus, Task } from '../../domain/Task';

const mockCreateTask = jest.fn();
const mockUpdateTask = jest.fn();
const mockOnClose = jest.fn();

jest.mock('../../service/task/TaskContext', () => ({
    useTaskStore: () => ({
        createTask: mockCreateTask,
        updateTask: mockUpdateTask,
    }),
}));

const renderModal = (task: Task | null = null) => {
    render(<TaskFormModal open={true} onClose={mockOnClose} task={task} />);
};

describe('TaskFormModal', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders create mode with empty fields', async () => {
        renderModal();

        expect(screen.getByLabelText(/Title/i)).toHaveValue('');
        expect(screen.getByLabelText(/Description/i)).toHaveValue('');
        expect(screen.getByText(/New Task/i)).toBeInTheDocument();
    });

    it('renders edit mode with task values', async () => {
        const task: Task = {
            id: '123',
            title: 'Edit me',
            description: 'Edit desc',
            status: TaskStatus.IN_PROGRESS,
            favorite: false,
        };

        renderModal(task);

        await waitFor(() => {
            expect(screen.getByLabelText(/Title/i)).toHaveValue('Edit me');
            expect(screen.getByLabelText(/Description/i)).toHaveValue(
                'Edit desc',
            );
        });
    });

    it('calls createTask and closes modal in create mode', async () => {
        renderModal();

        await act(async () => {
            fireEvent.change(screen.getByLabelText(/Title/i), {
                target: { value: 'New Task' },
            });
            fireEvent.change(screen.getByLabelText(/Description/i), {
                target: { value: 'New Description' },
            });
        });

        await act(async () => {
            fireEvent.click(screen.getByText(/Create/i));
        });

        await waitFor(() => {
            expect(mockCreateTask).toHaveBeenCalledWith({
                title: 'New Task',
                description: 'New Description',
                status: 'todo',
            });
            expect(mockOnClose).toHaveBeenCalled();
        });
    });

    it('calls updateTask and closes modal in edit mode', async () => {
        const task: Task = {
            id: '321',
            title: 'Old Title',
            description: 'Old desc',
            status: TaskStatus.TODO,
            favorite: false,
        };

        renderModal(task);

        await act(async () => {
            fireEvent.change(screen.getByLabelText(/Title/i), {
                target: { value: 'Updated Title' },
            });

            await act(async () => {
                fireEvent.mouseDown(screen.getByLabelText(/Status/i));
            });

            await act(async () => {
                fireEvent.click(screen.getByText('DONE'));
            });
        });

        await act(async () => {
            fireEvent.click(screen.getByText(/Save/i));
        });

        await waitFor(() => {
            expect(mockUpdateTask).toHaveBeenCalledWith('321', {
                title: 'Updated Title',
                description: 'Old desc',
                status: 'DONE',
            });
            expect(mockOnClose).toHaveBeenCalled();
        });
    });

    it('resets form when modal is reopened with null task', async () => {
        const { rerender } = render(
            <TaskFormModal
                open={true}
                onClose={mockOnClose}
                task={{
                    id: 't1',
                    title: 'Temp',
                    description: 'Temp desc',
                    status: TaskStatus.TODO,
                    favorite: false,
                }}
            />,
        );

        rerender(
            <TaskFormModal open={true} onClose={mockOnClose} task={null} />,
        );

        await waitFor(() => {
            expect(screen.getByLabelText(/Title/i)).toHaveValue('');
            expect(screen.getByLabelText(/Description/i)).toHaveValue('');
        });
    });

    it('calls onClose when Cancel is clicked', async () => {
        renderModal();

        await act(async () => {
            fireEvent.click(screen.getByText(/Cancel/i));
        });

        await waitFor(() => {
            expect(mockOnClose).toHaveBeenCalled();
        });
    });
});
