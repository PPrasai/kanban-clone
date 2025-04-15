import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TaskFormModal from '../../../ui/components/TaskFormModal';
import { Task } from '../../../domain/Task';

describe('TaskFormModal', () => {
    const mockOnClose = jest.fn();
    const createTaskMock = jest.fn();
    const updateTaskMock = jest.fn();

    const mockColumns = [
        { id: '1', title: 'Todo' },
        { id: '2', title: 'In Progress' },
    ];

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('submits new task correctly', async () => {
        render(
            <TaskFormModal
                open={true}
                onClose={mockOnClose}
                task={null}
                createTask={createTaskMock}
                updateTask={updateTaskMock}
                columns={mockColumns}
            />,
        );

        const titleInput = screen.getByRole('textbox', { name: /title/i });
        const descInput = screen.getByLabelText(/description/i);
        const createBtn = screen.getByRole('button', { name: /create/i });

        await userEvent.type(titleInput, 'New Task');
        await userEvent.type(descInput, 'New Description');

        const select = screen.getByRole('combobox');
        await userEvent.click(select);

        const inProgressOption = await screen.findByRole('option', {
            name: 'In Progress',
        });
        await userEvent.click(inProgressOption);

        await userEvent.click(createBtn);

        expect(createTaskMock).toHaveBeenCalledWith({
            title: 'New Task',
            description: 'New Description',
            status: '2',
        });

        expect(mockOnClose).toHaveBeenCalled();
    });

    it('renders edit mode correctly', () => {
        const task: Task = {
            id: '123',
            title: 'Existing Task',
            description: 'Some description',
            status: '2',
        };

        render(
            <TaskFormModal
                open={true}
                onClose={mockOnClose}
                task={task}
                createTask={createTaskMock}
                updateTask={updateTaskMock}
                columns={mockColumns}
            />,
        );

        expect(screen.getByText('Edit Task')).toBeInTheDocument();
        expect(screen.getByDisplayValue('Existing Task')).toBeInTheDocument();
        expect(
            screen.getByDisplayValue('Some description'),
        ).toBeInTheDocument();
        expect(screen.getByText('In Progress')).toBeInTheDocument();
    });

    it('calls onClose when cancel button is clicked', async () => {
        render(
            <TaskFormModal
                open={true}
                onClose={mockOnClose}
                task={null}
                createTask={createTaskMock}
                updateTask={updateTaskMock}
                columns={mockColumns}
            />,
        );

        const cancelBtn = screen.getByRole('button', { name: /cancel/i });
        await userEvent.click(cancelBtn);

        expect(mockOnClose).toHaveBeenCalled();
    });

    it('disables Create button when title is empty', () => {
        render(
            <TaskFormModal
                open={true}
                onClose={mockOnClose}
                task={null}
                createTask={createTaskMock}
                updateTask={updateTaskMock}
                columns={mockColumns}
            />,
        );

        const createBtn = screen.getByRole('button', { name: /create/i });
        expect(createBtn).toBeDisabled();
    });

    it('disables Save button if no fields are changed', () => {
        const task: Task = {
            id: '1',
            title: 'Unchanged Task',
            description: 'Same description',
            status: '1',
        };

        render(
            <TaskFormModal
                open={true}
                onClose={mockOnClose}
                task={task}
                createTask={createTaskMock}
                updateTask={updateTaskMock}
                columns={mockColumns}
            />,
        );

        const saveBtn = screen.getByRole('button', { name: /save/i });
        expect(saveBtn).toBeDisabled();
    });

    it('enables Save button when task is edited', async () => {
        const task: Task = {
            id: '1',
            title: 'Old Task',
            description: 'Old Desc',
            status: '1',
        };

        render(
            <TaskFormModal
                open={true}
                onClose={mockOnClose}
                task={task}
                createTask={createTaskMock}
                updateTask={updateTaskMock}
                columns={mockColumns}
            />,
        );

        const titleInput = screen.getByRole('textbox', { name: /title/i });
        const saveBtn = screen.getByRole('button', { name: /save/i });

        await userEvent.clear(titleInput);
        await userEvent.type(titleInput, 'Changed Task');

        expect(saveBtn).not.toBeDisabled();
    });
});
