// ============================================================
// In-memory data store — simulates persistent database
// All collections are mutable and survive across the session
// ============================================================

import {
  FarmerData, CropResult, DiseaseResult, YieldResult,
  HealthResult, EconomicsResult, AlertItem, EventEntry, EventType,
  WorkerProfile, WorkerTask,
} from '@/models/types';

// No seed data — all data comes from persistent database

// ---------- event listeners ----------
type EventListener = (event: EventEntry) => void;

// ---------- collections ----------
class DataStore {
  farmers: FarmerData[] = [];
  cropResults: CropResult[] = [];
  diseaseResults: DiseaseResult[] = [];
  yieldResults: YieldResult[] = [];
  healthResults: HealthResult[] = [];
  economicsResults: EconomicsResult[] = [];
  alerts: AlertItem[] = [];
  events: EventEntry[] = [];
  workers: WorkerProfile[] = [];
  tasks: WorkerTask[] = [];

  private _listeners: EventListener[] = [];

  // ---------- helpers ----------
  generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  }

  // ---------- event system ----------
  onEvent(listener: EventListener): () => void {
    this._listeners.push(listener);
    return () => { this._listeners = this._listeners.filter(l => l !== listener); };
  }

  emitEvent(type: EventType, farmerId: string, payload: Record<string, unknown>): EventEntry {
    const event: EventEntry = {
      id: this.generateId(),
      type,
      farmerId,
      payload,
      timestamp: new Date().toISOString(),
    };
    this.events.push(event);
    // Notify all listeners synchronously
    this._listeners.forEach(l => l(event));
    return event;
  }

  // ---------- farmer ----------
  addFarmer(farmer: FarmerData): FarmerData {
    this.farmers.push(farmer);
    this.emitEvent('farmer_registered', farmer.id, { name: farmer.name, state: farmer.state, district: farmer.district });
    return farmer;
  }

  getFarmer(id: string): FarmerData | undefined {
    return this.farmers.find(f => f.id === id);
  }

  // ---------- predictions ----------
  addCropResult(r: CropResult): CropResult {
    this.cropResults.push(r);
    this.emitEvent('crop_predicted', r.farmerId, { crop: r.crop, confidence: r.confidence, risk: r.risk });
    return r;
  }

  addDiseaseResult(r: DiseaseResult): DiseaseResult {
    this.diseaseResults.push(r);
    this.emitEvent('disease_predicted', r.farmerId, { disease: r.disease, severity: r.severity, confidence: r.confidence });
    return r;
  }

  addYieldResult(r: YieldResult): YieldResult {
    this.yieldResults.push(r);
    this.emitEvent('yield_predicted', r.farmerId, { crop: r.crop, estimatedYield: r.estimatedYield, risk: r.risk });
    return r;
  }

  addHealthResult(r: HealthResult): HealthResult {
    this.healthResults.push(r);
    this.emitEvent('health_calculated', r.farmerId, { score: r.score });
    return r;
  }

  addEconomicsResult(r: EconomicsResult): EconomicsResult {
    this.economicsResults.push(r);
    this.emitEvent('economics_calculated', r.farmerId, { profit: r.profit, profitRisk: r.profitRisk });
    return r;
  }

  // ---------- alerts ----------
  addAlert(alert: AlertItem): AlertItem {
    this.alerts.push(alert);
    return alert;
  }

  resolveAlert(alertId: string): AlertItem | undefined {
    const alert = this.alerts.find(a => a.id === alertId);
    if (alert) alert.status = 'resolved';
    return alert;
  }

  getAlertsByFarmer(farmerId: string): AlertItem[] {
    return this.alerts.filter(a => a.farmerId === farmerId);
  }

  // ---------- workers ----------
  addWorker(worker: WorkerProfile): WorkerProfile {
    this.workers.push(worker);
    return worker;
  }

  getWorker(id: string): WorkerProfile | undefined {
    return this.workers.find(w => w.id === id);
  }

  updateWorker(id: string, updates: Partial<WorkerProfile>): WorkerProfile | undefined {
    const idx = this.workers.findIndex(w => w.id === id);
    if (idx === -1) return undefined;
    this.workers[idx] = { ...this.workers[idx], ...updates };
    return this.workers[idx];
  }

  // ---------- tasks ----------
  addTask(task: WorkerTask): WorkerTask {
    this.tasks.push(task);
    return task;
  }

  getAvailableTasks(workerLevel: number): WorkerTask[] {
    return this.tasks.filter(t => t.status === 'pending' && t.requiredLevel <= workerLevel);
  }

  assignTask(taskId: string, workerId: string): WorkerTask | undefined {
    const task = this.tasks.find(t => t.id === taskId);
    const worker = this.workers.find(w => w.id === workerId);
    if (!task || !worker) return undefined;
    task.status = 'assigned';
    task.assignedTo = workerId;
    worker.assignedTasks.push(taskId);
    return task;
  }

  completeTask(taskId: string, success: boolean): WorkerTask | undefined {
    const task = this.tasks.find(t => t.id === taskId);
    if (!task || !task.assignedTo) return undefined;

    task.status = 'completed';
    task.completedAt = new Date().toISOString();

    const worker = this.workers.find(w => w.id === task.assignedTo);
    if (worker) {
      worker.completedTasks += 1;
      const totalAttempts = worker.completedTasks;
      const successfulTasks = Math.round((worker.accuracyRate / 100) * (totalAttempts - 1)) + (success ? 1 : 0);
      worker.accuracyRate = Math.round((successfulTasks / totalAttempts) * 100);
      worker.assignedTasks = worker.assignedTasks.filter(id => id !== taskId);
      this._updateWorkerLevel(worker);
    }

    this.emitEvent('task_completed', task.assignedTo || '', {
      taskId: task.id,
      taskTitle: task.title,
      success,
      workerId: task.assignedTo,
    });

    return task;
  }

  private _updateWorkerLevel(worker: WorkerProfile) {
    const thresholds = [
      { tasks: 50, accuracy: 90, level: 10 },
      { tasks: 40, accuracy: 88, level: 9 },
      { tasks: 35, accuracy: 86, level: 8 },
      { tasks: 30, accuracy: 84, level: 7 },
      { tasks: 25, accuracy: 82, level: 6 },
      { tasks: 20, accuracy: 80, level: 5 },
      { tasks: 15, accuracy: 75, level: 4 },
      { tasks: 10, accuracy: 70, level: 3 },
      { tasks: 5, accuracy: 60, level: 2 },
      { tasks: 0, accuracy: 0, level: 1 },
    ];

    for (const t of thresholds) {
      if (worker.completedTasks >= t.tasks && worker.accuracyRate >= t.accuracy) {
        worker.level = Math.max(worker.level, t.level);
        break;
      }
    }
  }
}

// Singleton instance — survives across the session
export const dataStore = new DataStore();
