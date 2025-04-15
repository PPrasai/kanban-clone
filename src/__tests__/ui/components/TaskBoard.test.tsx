import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TaskBoard from '../../../ui/components/TaskBoard';
import { useTaskBoard } from '../../../ui/hooks/useTaskBoard';
import { useColumnStore } from '../../../service/column/ColumnContext';

jest.mock('../../../ui/hooks/useTaskBoard');
jest.mock('../../../service/column/ColumnContext');

const mockUseTaskBoard = useTaskBoard as jest.MockedFunction<
    typeof useTaskBoard
>;
const mockUseColumnStore = useColumnStore as jest.MockedFunction<
    typeof useColumnStore
>;

const mockTasks = [
    { id: '1', title: 'Task 1', status: '1', favorite: false },
    { id: '2', title: 'Task 2', status: '2', favorite: true },
];

beforeEach(() => {
    mockUseTaskBoard.mockReturnValue({
        sortOrders: {},
        toggleSortOrder: jest.fn(),
        getSortedTasks: jest
            .fn()
            .mockImplementation((columnId) =>
                mockTasks.filter((t) => t.status === columnId),
            ),
        createTask: jest.fn(),
        updateTask: jest.fn(),
        moveTask: jest.fn(),
        deleteTask: jest.fn(),
    });

    mockUseColumnStore.mockReturnValue({
        columns: [
            { id: '1', title: 'Todo' },
            { id: '2', title: 'In Progress' },
        ],
        createColumn: jest.fn(),
        deleteColumn: jest.fn(),
        updateColumn: jest.fn(),
        refreshColumns: jest.fn(),
        columnService: jest.requireMock(
            '../../../service/column/ColumnService',
        ),
    });
});

describe('TaskBoard', () => {
    it('renders columns and tasks', () => {
        render(<TaskBoard />);
        expect(screen.getByText('Todo')).toBeInTheDocument();
        expect(screen.getByText('In Progress')).toBeInTheDocument();
        expect(screen.getAllByTestId('task-card')).toHaveLength(2);
    });

    it('opens task modal when "Add Task" is clicked', async () => {
        render(<TaskBoard />);
        await userEvent.click(screen.getByTestId('add-task-button'));
        expect(screen.getByText('New Task')).toBeInTheDocument();
    });

    it('creates a new column when prompted', async () => {
        const mockCreateColumn = jest.fn();
        mockUseColumnStore.mockReturnValueOnce({
            ...mockUseColumnStore(),
            createColumn: mockCreateColumn,
        });
        window.prompt = jest.fn().mockReturnValue('New Column');

        render(<TaskBoard />);
        await userEvent.click(screen.getByTestId('add-column-button'));
        expect(mockCreateColumn).toHaveBeenCalledWith({ title: 'New Column' });
    });

    it('deletes a column after confirmation', async () => {
        const mockDeleteColumn = jest.fn();
        window.confirm = jest.fn().mockReturnValue(true);
        mockUseColumnStore.mockReturnValueOnce({
            ...mockUseColumnStore(),
            deleteColumn: mockDeleteColumn,
        });

        render(<TaskBoard />);
        const deleteButtons = screen.getAllByRole('button', {
            name: /delete column/i,
        });
        await userEvent.click(deleteButtons[0]);
        expect(mockDeleteColumn).toHaveBeenCalledWith('1');
    });
});
