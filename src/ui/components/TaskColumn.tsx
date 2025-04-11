import { useDrop } from 'react-dnd';
import { Card, CardHeader, IconButton, Tooltip } from '@mui/material';
import { ArrowUpward, ArrowDownward } from '@mui/icons-material';

import { Task, TaskStatus } from '../../domain/Task';
import { useTaskStore } from '../../service/task/TaskContext';
import { ItemTypes } from '../../domain/Task';
import TaskCard from './TaskCard';
import { useRef } from 'react';

interface Props {
    status: TaskStatus;
    sortOrder: 'asc' | 'desc';
    onToggleSort: () => void;
    onCardClick: (task: Task) => void;
}

const TaskColumn = ({
    status,
    onCardClick,
    onToggleSort,
    sortOrder,
}: Props) => {
    const { getTasksByStatus, updateTask, moveTask, deleteTask } =
        useTaskStore();

    const tasks = getTasksByStatus(status);

    const sortedTasks = [...tasks].sort((a, b) => {
        if (a.favorite && !b.favorite) return -1;
        if (!a.favorite && b.favorite) return 1;

        const comparison = a.title.localeCompare(b.title, undefined, {
            sensitivity: 'base',
        });

        return sortOrder === 'asc' ? comparison : -comparison;
    });

    const columnRef = useRef<HTMLDivElement>(null);

    const [{ isOver }, drop] = useDrop(
        () => ({
            accept: ItemTypes.TASK,
            drop: (draggedItem: { id: string; status: TaskStatus }) => {
                if (draggedItem.status !== status) {
                    moveTask(draggedItem.id, status);
                }
            },
            collect: (monitor) => ({
                isOver: monitor.isOver(),
            }),
        }),
        [status],
    );

    drop(columnRef);

    return (
        <div
            ref={columnRef}
            className={`min-w-[300px] w-full max-w-sm flex flex-col gap-2 transition-colors ${
                isOver ? 'bg-yellow-100' : ''
            }`}
        >
            <Card className="shadow-md">
                <CardHeader
                    title={
                        <div className="flex items-center justify-between">
                            <span>{status.replace('_', ' ')}</span>
                            <Tooltip title="Toggle sort order">
                                <IconButton size="small" onClick={onToggleSort}>
                                    {sortOrder === 'asc' ? (
                                        <ArrowUpward fontSize="small" />
                                    ) : (
                                        <ArrowDownward fontSize="small" />
                                    )}
                                </IconButton>
                            </Tooltip>
                        </div>
                    }
                />
            </Card>
            {sortedTasks
                .filter(
                    (task, index, self) =>
                        self.findIndex((t) => t.id === task.id) === index,
                )
                .map((task) => (
                    <TaskCard
                        key={task.id}
                        task={task}
                        onFavoriteToggle={() =>
                            updateTask(task.id, { favorite: !task.favorite })
                        }
                        onClick={() => onCardClick(task)}
                        onDelete={() => deleteTask(task.id)}
                    />
                ))}
        </div>
    );
};

export default TaskColumn;
