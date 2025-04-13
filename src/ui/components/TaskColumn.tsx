import { Card, CardHeader, IconButton, Tooltip } from '@mui/material';
import { ArrowUpward, ArrowDownward, Delete } from '@mui/icons-material';
import TaskCard from './TaskCard';
import { useDroppable } from '@dnd-kit/core';
import { Column } from '../../domain/Column';
import { Task } from '../../domain/Task';

interface Props {
    column: Column;
    tasks: Task[];
    sortOrder: 'asc' | 'desc';
    onToggleSort: () => void;
    onCardClick: (task: Task) => void;
    onFavoriteToggle: (taskId: string) => void;
    onDelete: (taskId: string) => void;
    onDeleteColumn?: (columnId: string) => void;
}

const TaskColumn = ({
    column,
    tasks,
    sortOrder,
    onToggleSort,
    onCardClick,
    onFavoriteToggle,
    onDelete,
    onDeleteColumn,
}: Props) => {
    const { setNodeRef, isOver } = useDroppable({ id: column.id });

    return (
        <div
            ref={setNodeRef}
            className={`min-w-[300px] w-full max-w-sm flex flex-col gap-2 transition-colors ${
                isOver ? 'bg-yellow-100' : ''
            }`}
        >
            <Card className="shadow-md">
                <CardHeader
                    title={
                        <div className="flex items-center justify-between">
                            <span>{column.title}</span>
                            <div className="flex items-center">
                                <Tooltip title="Toggle sort order">
                                    <IconButton
                                        size="small"
                                        onClick={onToggleSort}
                                    >
                                        {sortOrder === 'asc' ? (
                                            <ArrowUpward fontSize="small" />
                                        ) : (
                                            <ArrowDownward fontSize="small" />
                                        )}
                                    </IconButton>
                                </Tooltip>
                                {onDeleteColumn && (
                                    <Tooltip title="Delete Column">
                                        <IconButton
                                            size="small"
                                            onClick={() =>
                                                onDeleteColumn(column.id)
                                            }
                                        >
                                            <Delete fontSize="small" />
                                        </IconButton>
                                    </Tooltip>
                                )}
                            </div>
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
