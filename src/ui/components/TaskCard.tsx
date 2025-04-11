import { Card, CardContent, Typography } from '@mui/material';
import { Task } from '../../domain/Task';

interface Props {
    task: Task;
    onClick: () => void;
}

const TaskCard = ({ task, onClick }: Props) => {
    return (
        <Card
            onClick={onClick}
            className="cursor-pointer hover:shadow-lg transition-shadow"
        >
            <CardContent>
                <Typography variant="h6">{task.title}</Typography>
                {task.description && (
                    <Typography variant="body2" color="text.secondary">
                        {task.description}
                    </Typography>
                )}
            </CardContent>
        </Card>
    );
};

export default TaskCard;
