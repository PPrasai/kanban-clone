import { Card, CardHeader } from '@mui/material';
import { Task, TaskStatus } from '../../domain/Task';
import { useTaskStore } from '../../service/task/TaskContext';
import TaskCard from './TaskCard';

interface Props {
    status: TaskStatus;
    onCardClick: (task: Task) => void;
}

const TaskColumn = ({ status, onCardClick }: Props) => {
    const { getTasksByStatus, updateTask } = useTaskStore();

    const tasks = getTasksByStatus(status); // React now re-runs this when state updates

    return (
        <div className="min-w-[300px] w-full max-w-sm flex flex-col gap-2">
            <Card className="shadow-md">
                <CardHeader title={status.replace('_', ' ')} />
            </Card>
            {tasks.map((task) => (
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
