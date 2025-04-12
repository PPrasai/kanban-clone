import { useDraggable } from '@dnd-kit/core';
import {
    Card,
    CardContent,
    IconButton,
    Tooltip,
    Typography,
} from '@mui/material';
import {
    Favorite,
    FavoriteBorder,
    Delete,
    DragIndicator,
} from '@mui/icons-material';
import { Task } from '../../domain/Task';

interface Props {
    task: Task;
    onClick: () => void;
    onFavoriteToggle: () => void;
    onDelete: () => void;
}

const TaskCard = ({ task, onFavoriteToggle, onClick, onDelete }: Props) => {
    const { attributes, listeners, setNodeRef, transform, isDragging } =
        useDraggable({
            id: task.id,
            data: { status: task.status },
        });

    const style = {
        transform: transform
            ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
            : undefined,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <div ref={setNodeRef} style={style}>
            <Card
                data-testid="task-card"
                className="cursor-pointer hover:shadow-lg transition-shadow"
            >
                <CardContent className="flex justify-between items-center">
                    <div
                        {...listeners}
                        {...attributes}
                        className="drag-handle mr-2"
                        style={{
                            cursor: 'grab',
                            display: 'flex',
                            alignItems: 'center',
                        }}
                    >
                        <DragIndicator fontSize="small" />
                    </div>

                    <div onClick={onClick} className="flex flex-1 flex-col">
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
                                    onFavoriteToggle();
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
                                    onDelete();
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
