/* eslint-disable @typescript-eslint/no-explicit-any */
import '@testing-library/jest-dom';
import { Task } from '../../domain/Task';
import {
    InvalidTaskError,
    TaskNotFoundError,
    TaskService,
} from '../../service/task/TaskService';

describe('TaskService', () => {
    let mockRepo: any;
    let service: TaskService;

    beforeEach(() => {
        mockRepo = {
            getAll: jest.fn(() => []),
            saveAll: jest.fn(),
        };
        service = new TaskService(mockRepo);
        (service as any).cache = null; // Reset cache
    });

    describe('getAll()', () => {
        it('loads and caches tasks from repository', () => {
            const tasks: Task[] = [{ id: '1', title: 'Test', status: 'TODO' }];
            mockRepo.getAll.mockReturnValue(tasks);

            expect(service.getAll()).toEqual(tasks);
            expect(mockRepo.getAll).toHaveBeenCalledTimes(1);
            expect(service.getAll()).toEqual(tasks);
            expect(mockRepo.getAll).toHaveBeenCalledTimes(1);
        });
    });

    describe('create()', () => {
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
    });

    describe('update()', () => {
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
    });

    describe('delete()', () => {
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
    });

    describe('move()', () => {
        it('updates task status', () => {
            mockRepo.getAll.mockReturnValue([
                { id: '1', title: 'Test', status: 'TODO' },
            ]);
            const moved = service.move('1', 'DONE');
            expect(moved.status).toBe('DONE');
        });
    });
});
