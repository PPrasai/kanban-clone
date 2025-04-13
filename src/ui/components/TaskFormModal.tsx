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
import { useTaskStore } from '../../service/task/TaskContext';
import { useColumnStore } from '../../service/column/ColumnContext';

interface Props {
    open: boolean;
    onClose: () => void;
    task: Task | null;
}

const TaskFormModal = ({ open, onClose, task }: Props) => {
    const isEditMode = Boolean(task);
    const { createTask, updateTask } = useTaskStore();
    const { columns } = useColumnStore();

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [status, setStatus] = useState<string>('');

    useEffect(() => {
        if (task) {
            setTitle(task.title);
            setDescription(task.description || '');
            setStatus(task.status);
        } else {
            setTitle('');
            setDescription('');
            setStatus(columns[0]?.id || '');
        }
    }, [task, columns]);

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
                    onChange={(e) => setStatus(e.target.value)}
                    select
                    fullWidth
                >
                    {columns.length > 0 ? (
                        columns.map((col) => (
                            <MenuItem key={col.id} value={col.id}>
                                {col.title}
                            </MenuItem>
                        ))
                    ) : (
                        <MenuItem value="">No columns available</MenuItem>
                    )}
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
