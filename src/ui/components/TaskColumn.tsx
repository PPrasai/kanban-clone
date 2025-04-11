import { Card, CardHeader } from '@mui/material';
import { Task, TaskStatus } from '../../domain/Task';
import { useTaskStore } from '../../service/task/TaskContext';
import TaskCard from './TaskCard';
import { useEffect, useState } from 'react';

interface Props {
    status: TaskStatus;
    onCardClick: (task: Task) => void;
}

const TaskColumn = ({ status, onCardClick }: Props) => {
    const { getTasksByStatus, updateTask } = useTaskStore();
    const [tasks, setTasks] = useState<Task[]>(getTasksByStatus(status));

    useEffect(() => {
        setTasks(getTasksByStatus(status));
    }, [status]);

    const handleFavoriteToggle = (taskId: string) => {
        updateTask(taskId, {
            favorite: !tasks.find((task) => task.id === taskId)?.favorite,
        });
        setTasks(getTasksByStatus(status));
    };

    return (
        <div className="min-w-[300px] w-full max-w-sm flex flex-col gap-2">
            <Card className="shadow-md">
                <CardHeader title={status.replace('_', ' ')} />
            </Card>
            {tasks.map((task) => (
                <TaskCard
                    key={task.id}
                    task={task}
                    onFavoriteToggle={() => handleFavoriteToggle(task.id)}
                    onClick={() => onCardClick(task)}
                />
            ))}
        </div>
    );
};

export default TaskColumn;
