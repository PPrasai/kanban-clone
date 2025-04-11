import { Card, CardContent, IconButton, Typography } from '@mui/material';
import { Favorite } from '@mui/icons-material';
import { Task } from '../../domain/Task';

interface Props {
    task: Task;
    onClick: () => void;
    onFavoriteToggle: (taskId: string) => void;
}

const TaskCard = ({ task, onClick, onFavoriteToggle }: Props) => {
    return (
        <Card
            onClick={onClick}
            data-testid="task-card"
            className="cursor-pointer hover:shadow-lg transition-shadow"
        >
            <CardContent className="flex justify-between">
                <div>
                    <Typography variant="h6">{task.title}</Typography>
                    {task.description && (
                        <Typography variant="body2" color="text.secondary">
                            {task.description}
                        </Typography>
                    )}
                </div>
                <IconButton
                    onClick={(e) => {
                        e.stopPropagation();
                        onFavoriteToggle(task.id);
                    }}
                    color={task.favorite ? 'error' : 'default'}
                >
                    <Favorite />
                </IconButton>
            </CardContent>
        </Card>
    );
};

export default TaskCard;
