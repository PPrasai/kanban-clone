export enum TaskStatus {
    TODO = 'todo',
    IN_PROGRESS = 'in_progress',
    IN_REVIEW = 'in_review',
    DONE = 'done',
}

export interface Task {
    id: string;
    title: string;
    description?: string;
    status: TaskStatus;
}

export interface AbstractTaskRepository {
    getAll(): Task[];
    saveAll(tasks: Task[]): void;
    createTask(task: Task): void;
    updateTask(updatedTask: Task): void;
    deleteTask(taskId: string): void;
}
