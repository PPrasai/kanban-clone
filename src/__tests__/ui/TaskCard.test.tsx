import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import TaskCard from '../../ui/components/TaskCard';
import { TaskStatus } from '../../domain/Task';
import { act } from 'react';

const task = {
    id: '1',
    title: 'Clickable Card',
    description: 'Details',
    favorite: false,
    status: TaskStatus.TODO,
};

describe('TaskCard', () => {
    const onClick = jest.fn();
    const onDelete = jest.fn();
    const onFavoriteToggle = jest.fn();

    beforeEach(() => {
        onClick.mockClear();
        onDelete.mockClear();
        onFavoriteToggle.mockClear();
        render(
            <TaskCard
                task={task}
                onClick={onClick}
                onDelete={onDelete}
                onFavoriteToggle={onFavoriteToggle}
            />,
        );
    });

    it('fires onClick when card is clicked (outside buttons)', async () => {
        const card = screen.getByTestId('task-card');
        await act(() => fireEvent.click(card));
        waitFor(() => expect(onClick).toHaveBeenCalled());
    });

    it('does NOT trigger drag or click on favorite/delete', async () => {
        const buttons = screen.getAllByRole('button');
        await act(() => fireEvent.click(buttons[0]));
        waitFor(() => expect(onFavoriteToggle).toHaveBeenCalled());

        await act(() => fireEvent.click(buttons[1]));
        waitFor(() => expect(onDelete).toHaveBeenCalled());
        waitFor(() => expect(onClick).toHaveBeenCalledTimes(1));
    });
});
