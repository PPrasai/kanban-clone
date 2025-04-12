import { Card, CardHeader, IconButton, Tooltip } from '@mui/material';
import { ArrowUpward, ArrowDownward } from '@mui/icons-material';

import TaskCard from './TaskCard';
import { useDrop } from 'react-dnd';
import { useRef } from 'react';
import { ItemTypes, Task, TaskStatus } from '../../domain/Task';

interface Props {
    status: TaskStatus;
    tasks: Task[];
    sortOrder: 'asc' | 'desc';
    onToggleSort: () => void;
    onCardClick: (task: Task) => void;
    onFavoriteToggle: (taskId: string) => void;
    onDelete: (taskId: string) => void;
    onTaskDrop: (draggedItem: { id: string; status: TaskStatus }) => void;
}

const TaskColumn = ({
    status,
    tasks,
    sortOrder,
    onToggleSort,
    onCardClick,
    onFavoriteToggle,
    onDelete,
    onTaskDrop,
}: Props) => {
    const columnRef = useRef<HTMLDivElement>(null);

    const [{ isOver }, drop] = useDrop(
        () => ({
            accept: ItemTypes.TASK,
            drop: (draggedItem: { id: string; status: TaskStatus }) =>
                onTaskDrop(draggedItem),
            collect: (monitor) => ({
                isOver: monitor.isOver(),
            }),
        }),
        [status, onTaskDrop],
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
            {tasks.map((task) => (
                <TaskCard
                    key={task.id}
                    task={task}
                    onFavoriteToggle={() => onFavoriteToggle(task.id)}
                    onClick={() => onCardClick(task)}
                    onDelete={() => onDelete(task.id)}
                />
            ))}
        </div>
    );
};

export default TaskColumn;
