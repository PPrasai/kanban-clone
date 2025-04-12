import { render, screen, act } from '@testing-library/react';
import { TaskProvider } from '../../service/task/TaskProvider';
import { useTaskStore } from '../../service/task/TaskContext';
import { TaskStatus } from '../../service/task/../../domain/Task';
import '@testing-library/jest-dom';

const MockComponent = () => {
    const {
        getAllTasks,
        createTask,
        updateTask,
        deleteTask,
        moveTask,
        getTasksByStatus,
    } = useTaskStore();

    const tasks = getAllTasks();
    const pendingTasks = getTasksByStatus(TaskStatus.TODO);

    return (
        <>
            <div data-testid="all-count">{tasks.length}</div>
            <div data-testid="pending-count">{pendingTasks.length}</div>
            <button
                onClick={() =>
                    createTask({
                        title: 'Test Task',
                        description: 'This is a test',
                        status: TaskStatus.TODO,
                    })
                }
            >
                Create Task
            </button>
            <button
                onClick={() => {
                    const task = getAllTasks()[0];
                    if (task) updateTask(task.id, { title: 'Updated Task' });
                }}
            >
                Update Task
            </button>
            <button
                onClick={() => {
                    const task = getAllTasks()[0];
                    if (task) moveTask(task.id, TaskStatus.IN_PROGRESS);
                }}
            >
                Move Task
            </button>
            <button
                onClick={() => {
                    const task = getAllTasks()[0];
                    if (task) deleteTask(task.id);
                }}
            >
                Delete Task
            </button>
        </>
    );
};

describe('TaskProvider', () => {
    it('creates a task and shows it', () => {
        render(
            <TaskProvider>
                <MockComponent />
            </TaskProvider>,
        );

        const createBtn = screen.getByText('Create Task');

        act(() => {
            createBtn.click();
        });

        expect(screen.getByTestId('all-count')).toHaveTextContent('1');
        expect(screen.getByTestId('pending-count')).toHaveTextContent('1');
    });

    it('updates a task', () => {
        render(
            <TaskProvider>
                <MockComponent />
            </TaskProvider>,
        );

        const createBtn = screen.getByText('Create Task');
        const updateBtn = screen.getByText('Update Task');

        act(() => {
            createBtn.click();
        });

        act(() => {
            updateBtn.click();
        });

        expect(screen.getByTestId('all-count')).toHaveTextContent('2');
    });

    it('moves a task to a new status', () => {
        render(
            <TaskProvider>
                <MockComponent />
            </TaskProvider>,
        );

        const createBtn = screen.getByText('Create Task');
        const moveBtn = screen.getByText('Move Task');

        act(() => {
            createBtn.click();
        });

        act(() => {
            moveBtn.click();
        });

        expect(screen.getByTestId('pending-count')).toHaveTextContent('2');
    });

    it('deletes a task', () => {
        render(
            <TaskProvider>
                <MockComponent />
            </TaskProvider>,
        );

        const createBtn = screen.getByText('Create Task');
        const deleteBtn = screen.getByText('Delete Task');

        act(() => {
            createBtn.click();
        });

        act(() => {
            deleteBtn.click();
        });

        expect(screen.getByTestId('all-count')).toHaveTextContent('3');
    });
});
