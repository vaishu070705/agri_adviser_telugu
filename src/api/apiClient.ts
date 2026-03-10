// ============================================================
// Mock API Client — simulates REST endpoints
// Each method represents an API call; replace internals with
// fetch() calls when a real backend is connected.
// ============================================================

import { dataStore } from '@/store/dataStore';
import { getDashboardMetrics } from '@/services/dashboardService';
import { getAlerts, getActiveAlerts, resolveAlert } from '@/services/alertService';
import { predictCrop, predictDisease, predictYield, calculateHealthScore, CropInputs, YieldInputs } from '@/services/predictionService';
import { calculateEconomics, calculateProfit, EconomicsInputs, ProfitInputs } from '@/services/economicsService';
import { getAllWorkersDb, insertWorker, getAllTasksDb, assignTaskDb, completeTaskDb, insertTask as insertTaskDb } from '@/services/databaseService';
import { getFertilizerRecommendation, getPesticideRecommendation } from '@/services/fertilizerService';
import { generateReportText, ReportData } from '@/services/reportService';
import type { FarmerData, WorkerProfile, DashboardMetrics, AlertItem, CropResult, DiseaseResult, YieldResult, HealthResult, EconomicsResult, WorkerTask, FertilizerRecommendation, PesticideRecommendation } from '@/models/types';

// Simulate async latency
const delay = <T>(val: T, ms = 50): Promise<T> => new Promise(r => setTimeout(() => r(val), ms));

// ================== Farmer ==================
export const api = {
  // --- Registration ---
  registerFarmer: (data: Omit<FarmerData, 'id' | 'registeredAt'>): Promise<FarmerData> => {
    const farmer: FarmerData = { ...data, id: dataStore.generateId(), registeredAt: new Date().toISOString() };
    dataStore.addFarmer(farmer);
    return delay(farmer);
  },

  // --- Predictions ---
  predictCrop: (inputs: CropInputs, farmerId: string): Promise<CropResult> => delay(predictCrop(inputs, farmerId)),
  predictDisease: (hasImage: boolean, farmerId: string): Promise<DiseaseResult> => delay(predictDisease(hasImage, farmerId)),
  predictYield: (inputs: YieldInputs, farmerId: string): Promise<YieldResult> => delay(predictYield(inputs, farmerId)),
  calculateHealth: (d: DiseaseResult | null, c: CropResult | null, y: YieldResult | null, farmerId: string): Promise<HealthResult> => delay(calculateHealthScore(d, c, y, farmerId)),

  // --- Economics ---
  calculateEconomics: (inputs: EconomicsInputs, farmerId: string): Promise<EconomicsResult> => delay(calculateEconomics(inputs, farmerId)),
  calculateProfit: (inputs: ProfitInputs) => delay(calculateProfit(inputs)),

  // --- Fertilizer & Pesticide ---
  getFertilizer: (crop: string, soil: string, n: number, p: number, k: number): Promise<FertilizerRecommendation[]> => delay(getFertilizerRecommendation(crop, soil, n, p, k)),
  getPesticide: (disease: string): Promise<PesticideRecommendation | null> => delay(getPesticideRecommendation(disease)),

  // --- Alerts (event-driven — no manual generation needed) ---
  getAlerts: (farmerId?: string): Promise<AlertItem[]> => delay(getAlerts(farmerId)),
  getActiveAlerts: (farmerId?: string): Promise<AlertItem[]> => delay(getActiveAlerts(farmerId)),
  resolveAlert: (alertId: string): Promise<AlertItem | undefined> => delay(resolveAlert(alertId)),

  // --- Workers ---
  getWorkers: (): Promise<WorkerProfile[]> => getAllWorkersDb(),
  searchWorkers: (q: string): Promise<WorkerProfile[]> => getAllWorkersDb().then(ws => {
    const ql = q.toLowerCase();
    return ws.filter(w => w.name.toLowerCase().includes(ql) || w.skills.some(s => s.toLowerCase().includes(ql)) || w.district.toLowerCase().includes(ql));
  }),
  registerWorker: (data: Omit<WorkerProfile, 'id' | 'level' | 'completedTasks' | 'accuracyRate' | 'assignedTasks' | 'registeredAt'>): Promise<WorkerProfile> => insertWorker(data) as Promise<WorkerProfile>,
  getTasksForWorker: (workerId: string): Promise<WorkerTask[]> => getAllTasksDb().then(ts => ts.filter(t => t.status === 'pending')),
  getAllTasks: (): Promise<WorkerTask[]> => getAllTasksDb(),
  assignTask: (taskId: string, workerId: string): Promise<WorkerTask | undefined> => assignTaskDb(taskId, workerId).then(r => r ?? undefined),
  completeTask: (taskId: string, success: boolean): Promise<WorkerTask | undefined> => completeTaskDb(taskId, success).then(r => r ?? undefined),
  createTask: (data: Omit<WorkerTask, 'id' | 'status' | 'assignedTo' | 'createdAt' | 'completedAt'>): Promise<WorkerTask> => insertTaskDb(data) as Promise<WorkerTask>,

  // --- Dashboard ---
  getDashboardMetrics: (): Promise<DashboardMetrics> => delay(getDashboardMetrics()),

  // --- Reports ---
  generateReport: (data: ReportData): Promise<string> => delay(generateReportText(data)),
};
