import { v4 as uuidv4 } from 'uuid';
import { AbstractTaskRepository, Task, TaskStatus } from '../../domain/Task';

export class TaskNotFoundError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'TaskNotFoundError';
    }
}

export class InvalidTaskError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'InvalidTaskError';
    }
}

export class TaskService {
    private cache: Task[] | null = null;

    constructor(private repo: AbstractTaskRepository) {}

    private loadTasks(): Task[] {
        if (!this.cache) {
            this.cache = this.repo.getAll();
        }
        return this.cache;
    }

    private syncTasks(): void {
        if (this.cache) {
            this.repo.saveAll(this.cache);
        }
    }

    getAll(): Task[] {
        return this.loadTasks();
    }

    create(task: Omit<Task, 'id'>): Task {
        if (!task.title || task.title.trim() === '') {
            throw new InvalidTaskError('Task title is required');
        }
        const newTask: Task = {
            ...task,
            id: uuidv4(),
        };

        const tasks = this.loadTasks();
        const updatedTasks = [...tasks, newTask];
        this.cache = updatedTasks;
        this.syncTasks();
        return newTask;
    }

    update(id: string, updates: Partial<Omit<Task, 'id'>>): Task {
        const tasks = this.loadTasks();
        let updatedTask: Task | undefined;

        const updatedTasks = tasks.map((task) => {
            if (task.id === id) {
                if (
                    updates.title !== undefined &&
                    updates.title.trim() === ''
                ) {
                    throw new InvalidTaskError('Task title is required');
                }
                updatedTask = { ...task, ...updates };
                return updatedTask;
            }
            return task;
        });

        if (!updatedTask) {
            throw new TaskNotFoundError(`Task with id ${id} not found`);
        }

        this.cache = updatedTasks;
        this.syncTasks();
        return updatedTask;
    }

    delete(id: string): void {
        const tasks = this.loadTasks();
        const initialLength = tasks.length;
        const updatedTasks = tasks.filter((task) => task.id !== id);
        if (updatedTasks.length === initialLength) {
            throw new TaskNotFoundError(`Task with id ${id} not found`);
        }
        this.cache = updatedTasks;
        this.syncTasks();
    }

    move(id: string, status: TaskStatus): Task {
        return this.update(id, { status: status.toUpperCase() as TaskStatus });
    }
}
