import { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    MenuItem,
} from '@mui/material';
import { Task, TaskStatus } from '../../domain/Task';
import { useTaskStore } from '../../service/task/TaskContext';

interface Props {
    open: boolean;
    onClose: () => void;
    task: Task | null;
}

const TaskFormModal = ({ open, onClose, task }: Props) => {
    const isEditMode = Boolean(task);
    const { createTask, updateTask } = useTaskStore();

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [status, setStatus] = useState<TaskStatus>(TaskStatus.TODO);

    useEffect(() => {
        if (task) {
            setTitle(task.title);
            setDescription(task.description || '');
            setStatus(task.status);
        } else {
            setTitle('');
            setDescription('');
            setStatus(TaskStatus.TODO);
        }
    }, [task]);

    const handleSubmit = () => {
        if (isEditMode) {
            updateTask(task!.id, { title, description, status });
        } else {
            createTask({ title, description, status });
        }

        setTitle('');
        setDescription('');
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth>
            <DialogTitle>{isEditMode ? 'Edit Task' : 'New Task'}</DialogTitle>
            <DialogContent className="flex flex-col gap-4 pt-4">
                <TextField
                    label="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    fullWidth
                />
                <TextField
                    label="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    multiline
                    rows={4}
                    fullWidth
                />
                <TextField
                    data-testid="task-status-select"
                    label="Status"
                    value={status}
                    onChange={(e) => setStatus(e.target.value as TaskStatus)}
                    select
                    fullWidth
                >
                    {['TODO', 'IN_PROGRESS', 'IN_REVIEW', 'DONE'].map((s) => (
                        <MenuItem key={s} value={s}>
                            {s.replace('_', ' ')}
                        </MenuItem>
                    ))}
                </TextField>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={handleSubmit} variant="contained">
                    {isEditMode ? 'Save' : 'Create'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default TaskFormModal;
