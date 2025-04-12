import { useState } from 'react';

import { Fab } from '@mui/material';
import { Add } from '@mui/icons-material';

import TaskColumn from './TaskColumn';
import TaskFormModal from './TaskFormModal';

import { Task, TaskStatus } from '../../domain/Task';
import { useTaskBoard } from '../hooks/useTaskBoard';

const TaskBoard = () => {
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);

    const {
        STATUSES,
        sortOrders,
        toggleSortOrder,
        getSortedTasks,
        updateTask,
        moveTask,
        deleteTask,
    } = useTaskBoard();

    const handleCreateClick = () => {
        setSelectedTask(null);
        setModalOpen(true);
    };

    const handleCardClick = (task: Task) => {
        setSelectedTask(task);
        setModalOpen(true);
    };

    return (
        <div className="flex flex-col h-screen p-2 relative bg-gray-50">
            <div className="flex gap-4 grow overflow-x-auto">
                {STATUSES.map((status) => (
                    <TaskColumn
                        key={status}
                        status={status}
                        tasks={getSortedTasks(status)}
                        sortOrder={sortOrders[status]}
                        onToggleSort={() => toggleSortOrder(status)}
                        onCardClick={handleCardClick}
                        onFavoriteToggle={(taskId: string) => {
                            const task = getSortedTasks(status).find(
                                (t) => t.id === taskId,
                            );
                            if (task) {
                                updateTask(taskId, {
                                    favorite: !task.favorite,
                                });
                            }
                        }}
                        onDelete={(taskId: string) => deleteTask(taskId)}
                        onTaskDrop={(draggedItem: {
                            id: string;
                            status: TaskStatus;
                        }) => {
                            if (draggedItem.status !== status) {
                                moveTask(draggedItem.id, status);
                            }
                        }}
                    />
                ))}
            </div>

            <Fab
                color="primary"
                className="fixed bottom-6 right-6"
                onClick={handleCreateClick}
            >
                <Add />
            </Fab>

            <TaskFormModal
                open={modalOpen}
                onClose={() => {
                    setModalOpen(false);
                    setSelectedTask(null);
                }}
                task={selectedTask}
            />
        </div>
    );
};

export default TaskBoard;
