import { render, screen } from '@testing-library/react';
import { useTaskStore } from '../../service/task/TaskContext';
import { TaskProvider } from '../../service/task/TaskProvider';

const MockComponent = () => {
    const { getAllTasks } = useTaskStore();
    const tasks = getAllTasks();

    return <div>{tasks.length}</div>;
};

describe('TaskProvider', () => {
    it('provides the task context successfully', () => {
        render(
            <TaskProvider>
                <MockComponent />
            </TaskProvider>,
        );

        expect(screen.getByText('0')).toBeInTheDocument();
    });
});
