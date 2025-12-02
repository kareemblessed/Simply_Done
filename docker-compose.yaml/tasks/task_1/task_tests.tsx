
declare var jest: any;
declare var describe: any;
declare var beforeEach: any;
declare var test: any;
declare var expect: any;

import { Task, SubTask, Priority } from '../../../src/shared/types/task.types';
import { taskService } from '../../../src/server/services/taskService';
import { db } from '../../../src/server/db/jsonDatabase';


// Mock DB for isolation
jest.mock('../../../src/server/db/jsonDatabase');

describe('Task-001: Subtasks Functionality', () => {
  
  beforeEach(() => {
    jest.clearAllMocks();
    (db.readTasks as any).mockReturnValue([]);
  });

  test('1. Task interface should include subtasks array', () => {
    const task: Task = {
      id: '1',
      text: 'Test',
      isCompleted: false,
      priority: Priority.LOW,
      createdAt: 123,
      updatedAt: 123,
      subtasks: [] // This line should not error if type is updated
    };
    expect(task.subtasks).toBeDefined();
    expect(Array.isArray(task.subtasks)).toBe(true);
  });

  test('2. SubTask interface should exist with correct properties', () => {
    const subtask: SubTask = {
      id: 'sub-1',
      text: 'Buy milk',
      isCompleted: false
    };
    expect(subtask.id).toBeTruthy();
    expect(subtask.text).toBe('Buy milk');
    expect(subtask.isCompleted).toBe(false);
  });

  test('3. Service should initialize new tasks with empty subtasks', () => {
    const newTask = taskService.create({ 
      text: 'Main Task', 
      priority: Priority.MEDIUM 
    });
    expect(newTask.subtasks).toEqual([]);
  });

  test('4. toggleSubtask should flip subtask status', () => {
    const mockTask: Task = {
      id: '1',
      text: 'Main',
      isCompleted: false,
      priority: Priority.MEDIUM,
      createdAt: 100,
      updatedAt: 100,
      subtasks: [
        { id: 's1', text: 'Sub 1', isCompleted: false }
      ]
    };
    (db.readTasks as any).mockReturnValue([mockTask]);

    const updated = taskService.toggleSubtask('1', 's1');
    expect(updated?.subtasks[0].isCompleted).toBe(true);
    
    // Toggle back
    (db.readTasks as any).mockReturnValue([updated]);
    const reverted = taskService.toggleSubtask('1', 's1');
    expect(reverted?.subtasks[0].isCompleted).toBe(false);
  });

  test('5. toggleSubtask should return null for invalid IDs', () => {
    (db.readTasks as any).mockReturnValue([]);
    const result = taskService.toggleSubtask('999', 's1');
    expect(result).toBeNull();
  });

  test('6. Progress calculation logic (implied test)', () => {
    const subtasks: SubTask[] = [
      { id: '1', text: 'A', isCompleted: true },
      { id: '2', text: 'B', isCompleted: false }
    ];
    const completed = subtasks.filter(s => s.isCompleted).length;
    const total = subtasks.length;
    expect(completed).toBe(1);
    expect(total).toBe(2);
    expect((completed/total) * 100).toBe(50);
  });
});