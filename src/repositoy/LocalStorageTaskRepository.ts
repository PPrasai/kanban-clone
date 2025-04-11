import { AbstractTaskRepository, Task } from '../domain/Task';

class LocalStorageTaskRepository implements AbstractTaskRepository {
    private readonly STORAGE_KEY = 'tasks';

    getAll(): Task[] {
        try {
            const data = localStorage.getItem(this.STORAGE_KEY);
            if (!data) {
                throw new Error('No tasks found in local storage.');
            }
            return JSON.parse(data);
        } catch (error) {
            throw new Error(
                `Failed to get tasks from local storage: ${
                    (error as Error).message
                }`,
            );
        }
    }

    saveAll(tasks: Task[]): void {
        try {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(tasks));
        } catch (error) {
            throw new Error(
                `Failed to save tasks to local storage: ${
                    (error as Error).message
                }`,
            );
        }
    }

    createTask(task: Task): void {
        try {
            const tasks = this.getAll();
            tasks.push(task);
            this.saveAll(tasks);
        } catch (error) {
            throw new Error(
                `Failed to create task: ${(error as Error).message}`,
            );
        }
    }

    updateTask(updatedTask: Task): void {
        try {
            const tasks = this.getAll();
            const taskIndex = tasks.findIndex(
                (task) => task.id === updatedTask.id,
            );
            if (taskIndex === -1) {
                throw new Error(`Task with id ${updatedTask.id} not found`);
            }
            tasks[taskIndex] = updatedTask;
            this.saveAll(tasks);
        } catch (error) {
            throw new Error(
                `Failed to update task: ${(error as Error).message}`,
            );
        }
    }

    deleteTask(taskId: string): void {
        try {
            const tasks = this.getAll();
            const updatedTasks = tasks.filter((task) => task.id !== taskId);
            if (tasks.length === updatedTasks.length) {
                throw new Error(`Task with id ${taskId} not found`);
            }
            this.saveAll(updatedTasks);
        } catch (error) {
            throw new Error(
                `Failed to delete task: ${(error as Error).message}`,
            );
        }
    }
}

export default LocalStorageTaskRepository;
