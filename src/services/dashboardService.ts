// ============================================================
// Dashboard Service — fetches real counts from persistent DB
// Falls back to in-memory store for prediction-level metrics
// ============================================================

import { DashboardMetrics } from '@/models/types';
import { dataStore } from '@/store/dataStore';
import { supabase } from '@/integrations/supabase/client';

export interface DbCounts {
  farmerCount: number;
  workerCount: number;
  taskCount: number;
  dbConnected: boolean;
}

export async function getDbCounts(): Promise<DbCounts> {
  try {
    console.log('Fetching counts from database...');
    const [farmersRes, workersRes, tasksRes] = await Promise.all([
      supabase.from('farmers').select('id', { count: 'exact', head: true }),
      supabase.from('workers').select('id', { count: 'exact', head: true }),
      supabase.from('worker_tasks').select('id', { count: 'exact', head: true }),
    ]);

    const farmerCount = farmersRes.count ?? 0;
    const workerCount = workersRes.count ?? 0;
    const taskCount = tasksRes.count ?? 0;

    console.log(`DB counts — farmers: ${farmerCount}, workers: ${workerCount}, tasks: ${taskCount}`);

    return { farmerCount, workerCount, taskCount, dbConnected: !farmersRes.error };
  } catch (err) {
    console.error('Database connection failed:', err);
    return { farmerCount: 0, workerCount: 0, taskCount: 0, dbConnected: false };
  }
}

export function getDashboardMetrics(dbCounts?: DbCounts): DashboardMetrics {
  const { cropResults, diseaseResults, yieldResults, healthResults, economicsResults, alerts } = dataStore;

  const totalPredictions = cropResults.length + diseaseResults.length + yieldResults.length + healthResults.length + economicsResults.length;

  const cropCounts: Record<string, number> = {};
  cropResults.forEach(r => { cropCounts[r.crop] = (cropCounts[r.crop] || 0) + 1; });
  const topPredictedCrop = Object.entries(cropCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';

  const avgConfidence = cropResults.length > 0
    ? Math.round(cropResults.reduce((s, r) => s + r.confidence, 0) / cropResults.length)
    : 0;

  const stateMap: Record<string, number> = {};
  dataStore.farmers.forEach(f => { stateMap[f.state] = (stateMap[f.state] || 0) + 1; });
  const stateDistribution = Object.entries(stateMap).map(([name, value]) => ({ name, value }));

  const cropDistribution = Object.entries(cropCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const diseaseCounts: Record<string, number> = {};
  diseaseResults.forEach(r => { if (r.disease !== 'No image provided') diseaseCounts[r.disease] = (diseaseCounts[r.disease] || 0) + 1; });
  const diseaseDistribution = Object.entries(diseaseCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const modelUsage = [
    { name: 'Crop Rec.', usage: cropResults.length },
    { name: 'Disease Det.', usage: diseaseResults.length },
    { name: 'Yield Pred.', usage: yieldResults.length },
    { name: 'Health Score', usage: healthResults.length },
    { name: 'Economics', usage: economicsResults.length },
  ];

  const activeWorkersToday = dataStore.workers.filter(w => w.available && w.assignedTasks.length > 0).length;

  return {
    totalFarmers: dbCounts?.farmerCount ?? dataStore.farmers.length,
    totalWorkers: dbCounts?.workerCount ?? dataStore.workers.length,
    activeWorkersToday,
    totalPredictions,
    topPredictedCrop,
    averageConfidence: avgConfidence,
    totalRegistrations: dbCounts?.farmerCount ?? dataStore.farmers.length,
    totalAlerts: alerts.length,
    stateDistribution,
    cropDistribution,
    diseaseDistribution,
    modelUsage,
  };
}
