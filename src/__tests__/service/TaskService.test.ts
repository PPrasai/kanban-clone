import { Task, TaskStatus } from '../../domain/Task';
import LocalStorageTaskRepository from '../../repositoy/LocalStorageTaskRepository';
import {
    InvalidTaskError,
    TaskNotFoundError,
    TaskService,
} from '../../service/task/TaskService';

jest.mock('../../repositoy/LocalStorageTaskRepository');

jest.mock('uuid', () => ({
    v4: jest.fn(() => 'mock-uuid-a-b-c'),
}));

describe('TaskService', () => {
    let taskService: TaskService;
    let mockRepo: LocalStorageTaskRepository;

    const sampleTask: Task = {
        id: '1',
        title: 'Sample Task',
        description: 'Test task',
        status: TaskStatus.TODO,
    };

    beforeEach(() => {
        mockRepo = new LocalStorageTaskRepository();
        taskService = new TaskService(mockRepo);

        jest.clearAllMocks();
    });

    describe('getAll', () => {
        it('should return all tasks from the repository', () => {
            const tasks = [sampleTask];
            mockRepo.getAll = jest.fn().mockReturnValue(tasks);
            const result = taskService.getAll();
            expect(result).toEqual(tasks);
        });

        it('should return empty array if no tasks are available', () => {
            mockRepo.getAll = jest.fn().mockReturnValue([]);
            const result = taskService.getAll();
            expect(result).toEqual([]);
        });
    });

    describe('create', () => {
        it('should create a new task when valid data is provided', () => {
            const newTask: Omit<Task, 'id'> = {
                title: 'New Task',
                description: 'New Task Description',
                status: TaskStatus.TODO,
            };
            const createdTask: Task = { ...newTask, id: 'mock-uuid-a-b-c' };

            mockRepo.getAll = jest.fn().mockReturnValue([]);
            const task = taskService.create(newTask);
            expect(task).toEqual(createdTask);
            expect(mockRepo.saveAll).toHaveBeenCalledWith([createdTask]);
        });

        it('should throw an error if title is empty', () => {
            const invalidTask: Omit<Task, 'id'> = {
                title: '',
                description: 'Invalid Task',
                status: TaskStatus.TODO,
            };
            expect(() => taskService.create(invalidTask)).toThrow(
                InvalidTaskError,
            );
        });
    });

    describe('update', () => {
        it('should update an existing task', () => {
            const updatedTask = { ...sampleTask, title: 'Updated Task' };
            mockRepo.getAll = jest.fn().mockReturnValue([sampleTask]);

            const task = taskService.update('1', { title: 'Updated Task' });
            expect(task.title).toBe('Updated Task');
            expect(mockRepo.saveAll).toHaveBeenCalledWith([updatedTask]);
        });

        it('should throw an error if the task to update does not exist', () => {
            mockRepo.getAll = jest.fn().mockReturnValue([]);
            expect(() =>
                taskService.update('nonexistent-id', { title: 'Updated Task' }),
            ).toThrow(TaskNotFoundError);
        });

        it('should throw an error if updated title is empty', () => {
            const invalidUpdate = { title: '' };
            mockRepo.getAll = jest.fn().mockReturnValue([sampleTask]);

            expect(() => taskService.update('1', invalidUpdate)).toThrow(
                InvalidTaskError,
            );
        });
    });

    describe('delete', () => {
        it('should delete a task by id', () => {
            mockRepo.getAll = jest.fn().mockReturnValue([sampleTask]);
            taskService.delete('1');
            expect(mockRepo.saveAll).toHaveBeenCalledWith([]);
        });

        it('should throw an error if the task to delete does not exist', () => {
            mockRepo.getAll = jest.fn().mockReturnValue([]);
            expect(() => taskService.delete('nonexistent-id')).toThrow(
                TaskNotFoundError,
            );
        });
    });

    describe('move', () => {
        it("should update a task's status", () => {
            const movedTask = {
                ...sampleTask,
                status: TaskStatus.DONE.toUpperCase(),
            };
            mockRepo.getAll = jest.fn().mockReturnValue([sampleTask]);

            const task = taskService.move('1', TaskStatus.DONE);
            expect(task.status).toBe(TaskStatus.DONE.toUpperCase());
            expect(mockRepo.saveAll).toHaveBeenCalledWith([movedTask]);
        });
    });
});
