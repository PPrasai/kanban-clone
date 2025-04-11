import { useRef } from 'react';
import { useDrag } from 'react-dnd';

import {
    Card,
    CardContent,
    IconButton,
    Tooltip,
    Typography,
} from '@mui/material';
import { Favorite, FavoriteBorder, Delete } from '@mui/icons-material';

import { ItemTypes, Task } from '../../domain/Task';

interface Props {
    task: Task;
    onClick: () => void;
    onFavoriteToggle: (taskId: string) => void;
    onDelete: (taskId: string) => void;
}

const TaskCard = ({ task, onFavoriteToggle, onClick, onDelete }: Props) => {
    const cardRef = useRef<HTMLDivElement>(null);

    const [, drag] = useDrag(() => ({
        type: ItemTypes.TASK,
        item: { id: task.id, status: task.status },
    }));

    drag(cardRef);

    return (
        <div ref={cardRef} onClick={onClick} className="cursor-grab">
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
                    <div className="flex items-center space-x-1">
                        <Tooltip
                            title={
                                task.favorite
                                    ? 'Remove from Favorites'
                                    : 'Add to Favorites'
                            }
                        >
                            <IconButton
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onFavoriteToggle(task.id);
                                }}
                                color={task.favorite ? 'error' : 'default'}
                            >
                                {task.favorite ? (
                                    <Favorite />
                                ) : (
                                    <FavoriteBorder />
                                )}
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                            <IconButton
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onDelete(task.id);
                                }}
                                color="default"
                            >
                                <Delete />
                            </IconButton>
                        </Tooltip>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default TaskCard;
