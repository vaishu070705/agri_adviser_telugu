// ============================================================
// Centralized type definitions — single source of truth
// ============================================================

export interface FarmerData {
  id: string;
  name: string;
  state: string;
  district: string;
  mandal: string;
  landSize: number;
  soilType: string;
  email: string;
  phone: string;
  preferredLanguage: string;
  registeredAt: string;
}

export interface CropResult {
  id: string;
  farmerId: string;
  crop: string;
  confidence: number;
  risk: string;
  factors: string[];
  createdAt: string;
}

export interface DiseaseResult {
  id: string;
  farmerId: string;
  disease: string;
  confidence: number;
  severity: string;
  treatments: string[];
  createdAt: string;
}

export interface YieldResult {
  id: string;
  farmerId: string;
  estimatedYield: number;
  yieldRange: [number, number];
  risk: string;
  confidence: number;
  crop: string;
  createdAt: string;
}

export interface HealthResult {
  id: string;
  farmerId: string;
  score: number;
  diseaseImpact: number;
  nutrientImpact: number;
  yieldImpact: number;
  createdAt: string;
}

export interface EconomicsResult {
  id: string;
  farmerId: string;
  totalCost: number;
  revenue: number;
  profit: number;
  profitRisk: string;
  crop: string;
  createdAt: string;
}

export interface AlertItem {
  id: string;
  farmerId: string;
  type: string;
  priority: string;
  message: string;
  timestamp: string;
  status: 'active' | 'resolved';
  triggeredBy: string; // event ID that triggered this alert
}

export type EventType =
  | 'farmer_registered'
  | 'crop_predicted'
  | 'disease_predicted'
  | 'yield_predicted'
  | 'health_calculated'
  | 'economics_calculated'
  | 'task_completed'
  | 'worker_registered';

export interface EventEntry {
  id: string;
  type: EventType;
  farmerId: string;
  payload: Record<string, unknown>;
  timestamp: string;
}

export interface WorkerTask {
  id: string;
  title: string;
  description: string;
  difficulty: number; // 1-5
  requiredLevel: number; // minimum worker level
  status: 'pending' | 'assigned' | 'in_progress' | 'completed';
  assignedTo: string | null;
  createdAt: string;
  completedAt: string | null;
}

export interface WorkerProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  skills: string[];
  available: boolean;
  district: string;
  level: number; // 1-10
  completedTasks: number;
  accuracyRate: number; // 0-100
  assignedTasks: string[]; // task IDs
  registeredAt: string;
}

export interface DashboardMetrics {
  totalFarmers: number;
  totalWorkers: number;
  activeWorkersToday: number;
  totalPredictions: number;
  topPredictedCrop: string;
  averageConfidence: number;
  totalRegistrations: number;
  totalAlerts: number;
  stateDistribution: Array<{ name: string; value: number }>;
  cropDistribution: Array<{ name: string; count: number }>;
  diseaseDistribution: Array<{ name: string; count: number }>;
  modelUsage: Array<{ name: string; usage: number }>;
}

export interface FertilizerRecommendation {
  name: string;
  dosage: string;
  reason: string;
}

export interface PesticideRecommendation {
  disease: string;
  isHealthy: boolean;
  chemical: string;
  dosagePerLiter: string;
  sprayInterval: string;
  precautions: string[];
  organicAlternative: string;
  preventionTips: string[];
}
