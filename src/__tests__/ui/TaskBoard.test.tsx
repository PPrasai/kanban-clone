/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen, fireEvent } from '@testing-library/react';
import TaskBoard from '../../ui/components/TaskBoard';
import { TaskStatus } from '../../domain/Task';

jest.mock('../../ui/components/TaskColumn', () => ({
    __esModule: true,
    default: ({ status, onToggleSort, onCardClick, sortOrder }: any) => (
        <div data-testid={`column-${status}`}>
            <button onClick={onToggleSort}>Toggle {status}</button>
            <button
                onClick={() =>
                    onCardClick({
                        id: '1',
                        title: 'Task',
                        status,
                        favorite: false,
                    })
                }
            >
                Select Task {status}
            </button>
            <div>{sortOrder}</div>
        </div>
    ),
}));

jest.mock('../../service/task/TaskContext', () => ({
    useTaskStore: () => ({
        getTasksByStatus: (status: TaskStatus) => [
            {
                id: '1',
                title: `Task in ${status}`,
                description: '',
                status,
                favorite: false,
            },
        ],
        createTask: jest.fn(),
        updateTask: jest.fn(),
        moveTask: jest.fn(),
        deleteTask: jest.fn(),
    }),
}));

jest.mock('../../ui/components/CreateTaskButton', () => ({
    __esModule: true,
    default: ({ onClick }: any) => (
        <button data-testid="create-task" onClick={onClick}>
            Create Task
        </button>
    ),
}));

jest.mock('../../ui/components/TaskFormModal', () => ({
    __esModule: true,
    default: ({ open, task, onClose }: any) =>
        open ? (
            <div data-testid="modal">
                <button onClick={onClose}>Close Modal</button>
                <div>{task ? `Editing ${task.title}` : 'Creating Task'}</div>
            </div>
        ) : null,
}));

describe('TaskBoard', () => {
    it('renders all task columns', () => {
        render(<TaskBoard />);

        Object.values(TaskStatus).forEach((status) => {
            expect(screen.getByTestId(`column-${status}`)).toBeInTheDocument();
        });
    });

    it('opens modal in create mode when CreateTaskButton is clicked', () => {
        render(<TaskBoard />);
        fireEvent.click(screen.getByTestId('create-task'));
        expect(screen.getByTestId('modal')).toBeInTheDocument();
        expect(screen.getByText('Creating Task')).toBeInTheDocument();
    });
});
