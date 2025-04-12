import { useState } from 'react';
import { DndContext, DragEndEvent } from '@dnd-kit/core';
import TaskColumn from './TaskColumn';
import TaskFormModal from './TaskFormModal';
import { Task, TaskStatus } from '../../domain/Task';
import { useTaskBoard } from '../hooks/useTaskBoard';
import { Fab } from '@mui/material';
import { Add } from '@mui/icons-material';

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

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (
            over &&
            active.data.current?.status &&
            over.id &&
            over.id !== active.data.current.status
        ) {
            moveTask(active.id as string, over.id as TaskStatus);
        }
    };

    return (
        <DndContext onDragEnd={handleDragEnd}>
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
                        />
                    ))}
                </div>

                <Fab
                    data-testid="add-task-button"
                    color="primary"
                    className="fixed bottom-6 right-6"
                    onClick={handleCreateClick}
                >
                    <Add />
                </Fab>

                <TaskFormModal
                    open={modalOpen}
                    onClose={() => setModalOpen(false)}
                    task={selectedTask}
                />
            </div>
        </DndContext>
    );
};

export default TaskBoard;
