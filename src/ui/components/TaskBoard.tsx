import { useState } from 'react';
import { DndContext, DragEndEvent } from '@dnd-kit/core';

import { Fab } from '@mui/material';
import { Add } from '@mui/icons-material';

import TaskColumn from './TaskColumn';
import TaskFormModal from './TaskFormModal';

import { Task } from '../../domain/Task';
import { useTaskBoard } from '../hooks/useTaskBoard';
import { useColumnStore } from '../../service/column/ColumnContext';

const TaskBoard = () => {
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const {
        sortOrders,
        toggleSortOrder,
        getSortedTasks,
        createTask,
        updateTask,
        moveTask,
        deleteTask,
    } = useTaskBoard();

    const { columns, createColumn, deleteColumn } = useColumnStore();

    const handleAddColumn = () => {
        const name = prompt('Enter new column title');
        if (!name?.trim()) return;
        createColumn({ title: name.trim() });
    };

    const handleDeleteColumn = (columnId: string) => {
        if (!confirm('Delete this column and all its tasks?')) return;
        deleteColumn(columnId);
        const tasksToDelete = getSortedTasks(columnId);
        tasksToDelete.forEach((task) => deleteTask(task.id));
    };

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
        if (over && active.data.current?.status !== over.id) {
            moveTask(active.id as string, over.id as string);
        }
    };

    return (
        <DndContext onDragEnd={handleDragEnd}>
            <div className="flex flex-col h-screen p-2 relative bg-gray-50">
                <div
                    className="flex gap-4 grow overflow-x-auto"
                    style={{ overflowY: 'auto' }}
                >
                    {columns.map((column) => (
                        <TaskColumn
                            key={column.id}
                            column={column}
                            tasks={getSortedTasks(column.id)}
                            sortOrder={sortOrders[column.id] || 'asc'}
                            onToggleSort={() => toggleSortOrder(column.id)}
                            onCardClick={handleCardClick}
                            onFavoriteToggle={(taskId: string) => {
                                const task = getSortedTasks(column.id).find(
                                    (t) => t.id === taskId,
                                );
                                if (task) {
                                    updateTask(taskId, {
                                        favorite: !task.favorite,
                                    });
                                }
                            }}
                            onDelete={(taskId: string) => deleteTask(taskId)}
                            onDeleteColumn={handleDeleteColumn}
                        />
                    ))}
                </div>

                <div className="flex justify-between items-center p-4 bg-white shadow-md">
                    <Fab
                        data-testid="add-task-button"
                        variant="extended"
                        color="primary"
                        className="flex gap-2 fixed bottom-6 right-6"
                        onClick={handleCreateClick}
                    >
                        <Add /> Task
                    </Fab>

                    <Fab
                        data-testid="add-column-button"
                        variant="extended"
                        color="secondary"
                        className="flex gap-2 fixed bottom-6 left-6"
                        onClick={handleAddColumn}
                    >
                        <>
                            <Add /> Column
                        </>
                    </Fab>
                </div>
                <TaskFormModal
                    open={modalOpen}
                    onClose={() => setModalOpen(false)}
                    task={selectedTask}
                    createTask={createTask}
                    updateTask={updateTask}
                    columns={columns}
                />
            </div>
        </DndContext>
    );
};

export default TaskBoard;
