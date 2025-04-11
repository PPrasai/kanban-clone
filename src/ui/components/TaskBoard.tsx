import { useState } from 'react';
import { Task, TaskStatus } from '../../domain/Task';
import TaskColumn from './TaskColumn';
import CreateTaskButton from './CreateTaskButton';
import TaskFormModal from './TaskFormModal';

const STATUSES: TaskStatus[] = [
    TaskStatus.TODO,
    TaskStatus.IN_PROGRESS,
    TaskStatus.IN_REVIEW,
    TaskStatus.DONE,
];

const TaskBoard = () => {
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);

    const [sortOrders, setSortOrders] = useState<
        Record<TaskStatus, 'asc' | 'desc'>
    >({
        [TaskStatus.TODO]: 'asc',
        [TaskStatus.IN_PROGRESS]: 'asc',
        [TaskStatus.IN_REVIEW]: 'asc',
        [TaskStatus.DONE]: 'asc',
    });

    const toggleSortOrder = (status: TaskStatus) => {
        setSortOrders((prev) => ({
            ...prev,
            [status]: prev[status] === 'asc' ? 'desc' : 'asc',
        }));
    };

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
                        sortOrder={sortOrders[status]}
                        onToggleSort={() => toggleSortOrder(status)}
                        onCardClick={handleCardClick}
                    />
                ))}
            </div>

            <CreateTaskButton onClick={handleCreateClick} />

            <TaskFormModal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                task={selectedTask}
            />
        </div>
    );
};

export default TaskBoard;
