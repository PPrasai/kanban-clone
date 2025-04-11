import { render, screen } from '@testing-library/react';
import { TaskStatus } from '../../domain/Task';
import TaskColumn from '../../ui/components/TaskColumn';
import { TaskProvider } from '../../service/task/TaskProvider';
import { useTaskStore } from '../../service/task/TaskContext';

jest.mock('../../service/task/TaskContext', () => ({
    ...jest.requireActual('../../service/task/TaskContext'),
    useTaskStore: jest.fn(),
}));

describe('TaskColumn', () => {
    it('renders tasks based on the status', () => {
        (useTaskStore as jest.Mock).mockReturnValue({
            getTasksByStatus: jest
                .fn()
                .mockImplementation((status: TaskStatus) => {
                    const tasks = [
                        { id: '1', title: 'Task 1', status: TaskStatus.TODO },
                        {
                            id: '2',
                            title: 'Task 2',
                            status: TaskStatus.IN_PROGRESS,
                        },
                    ];
                    return tasks.filter((task) => task.status === status);
                }),
            getAllTasks: jest.fn(),
            createTask: jest.fn(),
            updateTask: jest.fn(),
            deleteTask: jest.fn(),
            moveTask: jest.fn(),
        });

        render(
            <TaskProvider>
                <TaskColumn status={TaskStatus.TODO} onCardClick={() => {}} />
            </TaskProvider>,
        );

        expect(screen.getByText('Task 1')).toBeInTheDocument();
        expect(screen.queryByText('Task 2')).toBeNull();
    });
});
