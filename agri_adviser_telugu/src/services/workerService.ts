// ============================================================
// Worker Service — CRUD, task allocation, level management
// ============================================================

import { WorkerProfile, WorkerTask } from '@/models/types';
import { dataStore } from '@/store/dataStore';

export function getAllWorkers(): WorkerProfile[] {
  return dataStore.workers;
}

export function getWorker(id: string): WorkerProfile | undefined {
  return dataStore.getWorker(id);
}

export function registerWorker(data: Omit<WorkerProfile, 'id' | 'level' | 'completedTasks' | 'accuracyRate' | 'assignedTasks' | 'registeredAt'>): WorkerProfile {
  const worker: WorkerProfile = {
    ...data,
    id: dataStore.generateId(),
    level: 1,
    completedTasks: 0,
    accuracyRate: 100,
    assignedTasks: [],
    registeredAt: new Date().toISOString(),
  };
  return dataStore.addWorker(worker);
}

export function searchWorkers(query: string): WorkerProfile[] {
  const q = query.toLowerCase();
  return dataStore.workers.filter(w =>
    w.name.toLowerCase().includes(q) ||
    w.skills.some(s => s.toLowerCase().includes(q)) ||
    w.district.toLowerCase().includes(q)
  );
}

// ---------- Task allocation ----------

export function getAvailableTasksForWorker(workerId: string): WorkerTask[] {
  const worker = dataStore.getWorker(workerId);
  if (!worker) return [];
  return dataStore.getAvailableTasks(worker.level);
}

export function getAllTasks(): WorkerTask[] {
  return dataStore.tasks;
}

export function createTask(data: Omit<WorkerTask, 'id' | 'status' | 'assignedTo' | 'createdAt' | 'completedAt'>): WorkerTask {
  const task: WorkerTask = {
    ...data,
    id: dataStore.generateId(),
    status: 'pending',
    assignedTo: null,
    createdAt: new Date().toISOString(),
    completedAt: null,
  };
  return dataStore.addTask(task);
}

export function assignTaskToWorker(taskId: string, workerId: string): WorkerTask | undefined {
  return dataStore.assignTask(taskId, workerId);
}

export function completeWorkerTask(taskId: string, success: boolean): WorkerTask | undefined {
  return dataStore.completeTask(taskId, success);
}
