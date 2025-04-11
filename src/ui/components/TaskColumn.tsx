import { Card, CardHeader, IconButton, Tooltip } from '@mui/material';
import { ArrowUpward, ArrowDownward } from '@mui/icons-material';

import { Task, TaskStatus } from '../../domain/Task';
import { useTaskStore } from '../../service/task/TaskContext';
import TaskCard from './TaskCard';

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
    const { getTasksByStatus, updateTask } = useTaskStore();

    const tasks = getTasksByStatus(status);

    const sortedTasks = [...tasks].sort((a, b) => {
        if (a.favorite && !b.favorite) return -1;
        if (!a.favorite && b.favorite) return 1;

        const comparison = a.title.localeCompare(b.title, undefined, {
            sensitivity: 'base',
        });

        return sortOrder === 'asc' ? comparison : -comparison;
    });

    return (
        <div className="min-w-[300px] w-full max-w-sm flex flex-col gap-2">
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
            {sortedTasks.map((task) => (
                <TaskCard
                    key={task.id}
                    task={task}
                    onFavoriteToggle={() =>
                        updateTask(task.id, { favorite: !task.favorite })
                    }
                    onClick={() => onCardClick(task)}
                />
            ))}
        </div>
    );
};

export default TaskColumn;
