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
import { Task } from '../../domain/Task';

interface Props {
    open: boolean;
    onClose: () => void;
    task: Task | null;
    createTask: (data: Omit<Task, 'id' | 'favorite'>) => void;
    updateTask: (id: string, data: Omit<Task, 'id' | 'favorite'>) => void;
    columns: { id: string; title: string }[];
}

export default function TaskFormModal({
    open,
    onClose,
    task,
    createTask,
    updateTask,
    columns,
}: Props) {
    const isEditMode = Boolean(task);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [status, setStatus] = useState('');

    const isSubmitDisabled =
        !title.trim() ||
        !status ||
        (isEditMode &&
            title === task?.title &&
            description === (task?.description || '') &&
            status === task?.status);

    useEffect(() => {
        if (task) {
            setTitle(task.title);
            setDescription(task.description ?? '');
            setStatus(task.status);
        } else {
            setTitle('');
            setDescription('');
            setStatus(columns[0]?.id || '');
        }
    }, [task, columns]);

    const handleSubmit = () => {
        const payload = { title, description, status };
        if (isEditMode) updateTask(task!.id, payload);
        else createTask(payload);
        setTitle('');
        setDescription('');
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth>
            <DialogTitle>{isEditMode ? 'Edit Task' : 'New Task'}</DialogTitle>
            <DialogContent>
                <TextField
                    label="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    fullWidth
                    multiline
                    rows={3}
                    margin="normal"
                />
                <TextField
                    label="Status"
                    select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    fullWidth
                    data-testid="task-status-select"
                    margin="normal"
                >
                    {columns.map((col) => (
                        <MenuItem key={col.id} value={col.id}>
                            {col.title}
                        </MenuItem>
                    ))}
                </TextField>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button
                    onClick={handleSubmit}
                    variant="contained"
                    disabled={isSubmitDisabled}
                >
                    {isEditMode ? 'Save' : 'Create'}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
