/* eslint-disable @typescript-eslint/no-explicit-any */
import '@testing-library/jest-dom';
import { Task } from '../../../domain/Task';
import {
    InvalidTaskError,
    TaskNotFoundError,
    TaskService,
} from '../../../service/task/TaskService';

describe('TaskService base functionality', () => {
    let mockRepo: any;
    let service: TaskService;

    beforeEach(() => {
        mockRepo = {
            getAll: jest.fn(() => []),
            saveAll: jest.fn(),
        };
        service = new TaskService(mockRepo);
        (service as any).cache = null;
    });

    it('loads and caches tasks from repository', () => {
        const tasks: Task[] = [{ id: '1', title: 'Test', status: 'TODO' }];
        mockRepo.getAll.mockReturnValue(tasks);

        expect(service.getAll()).toEqual(tasks);
        expect(mockRepo.getAll).toHaveBeenCalledTimes(1);
        expect(service.getAll()).toEqual(tasks);
        expect(mockRepo.getAll).toHaveBeenCalledTimes(1);
    });

    it('creates a valid task', () => {
        const newTask = service.create({ title: 'Test', status: 'TODO' });
        expect(newTask.id).toBeDefined();
        expect(mockRepo.saveAll).toHaveBeenCalledWith([newTask]);
    });

    it('throws error for empty title', () => {
        expect(() => service.create({ title: '', status: 'TODO' })).toThrow(
            InvalidTaskError,
        );
    });

    it('updates existing task', () => {
        mockRepo.getAll.mockReturnValue([
            { id: '1', title: 'Old', status: 'TODO' },
        ]);
        const updated = service.update('1', { title: 'New' });
        expect(updated.title).toBe('New');
        expect(mockRepo.saveAll).toHaveBeenCalled();
    });

    it('throws if task not found', () => {
        expect(() => service.update('1', { title: 'New' })).toThrow(
            TaskNotFoundError,
        );
    });

    it('deletes existing task', () => {
        mockRepo.getAll.mockReturnValue([
            { id: '1', title: 'Test', status: 'TODO' },
        ]);
        service.delete('1');
        expect(mockRepo.saveAll).toHaveBeenCalledWith([]);
    });

    it('throws if task not found', () => {
        expect(() => service.delete('1')).toThrow(TaskNotFoundError);
    });

    it('updates task status', () => {
        mockRepo.getAll.mockReturnValue([
            { id: '1', title: 'Test', status: 'TODO' },
        ]);
        const moved = service.move('1', 'DONE');
        expect(moved.status).toBe('DONE');
    });
});

describe('TaskService Edge Cases', () => {
    it('update() throws when title becomes empty', () => {
        const mockRepo = {
            getAll: () => [{ id: '1', title: 'Test', status: 'TODO' }],
        };
        const service = new TaskService(mockRepo as any);

        expect(() => service.update('1', { title: '' })).toThrow(
            InvalidTaskError,
        );
    });

    it('move() converts status to uppercase', () => {
        const mockRepo = {
            getAll: () => [{ id: '1', title: 'Test', status: 'TODO' }],
            saveAll: jest.fn(),
        };
        const service = new TaskService(mockRepo as any);

        const movedTask = service.move('1', 'done');
        expect(movedTask.status).toBe('DONE');
    });

    it('throws if updated title is only whitespace', () => {
        const mockRepo = {
            getAll: () => [{ id: '1', title: 'Test', status: 'TODO' }],
        };
        const service = new TaskService(mockRepo as any);
        (service as any).cache = null;

        expect(() => service.update('1', { title: '   ' })).toThrow(
            InvalidTaskError,
        );
    });
});
