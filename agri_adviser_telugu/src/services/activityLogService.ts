// ============================================================
// Activity Log Service — persists every prediction/action to DB
// ============================================================

import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export async function logCropPrediction(farmerId: string | null, crop: string, confidence: number, risk: string) {
  console.log('Logging crop prediction to database...');
  const { error } = await supabase.from('crop_logs').insert({
    farmer_id: farmerId || null,
    crop,
    confidence,
    risk,
  });
  if (error) { console.error('Error logging crop prediction:', error.message); toast.error('Failed to log crop prediction'); }
  else console.log('Crop prediction logged successfully.');
}

export async function logDiseasePrediction(farmerId: string | null, disease: string, severity: string, confidence: number) {
  console.log('Logging disease prediction to database...');
  const { error } = await supabase.from('disease_logs').insert({
    farmer_id: farmerId || null,
    disease,
    severity,
    confidence,
  });
  if (error) { console.error('Error logging disease prediction:', error.message); toast.error('Failed to log disease prediction'); }
  else console.log('Disease prediction logged successfully.');

  if (severity === 'Severe') {
    console.log('Severe disease detected — creating alert...');
    await insertAlert(farmerId, 'disease_alert', `Severe ${disease} detected — immediate treatment required`, 'high', disease);
  }
}

export async function logYieldPrediction(farmerId: string | null, predictedYield: number, risk: string) {
  console.log('Logging yield prediction to database...');
  const { error } = await supabase.from('yield_logs').insert({
    farmer_id: farmerId || null,
    predicted_yield: predictedYield,
    risk,
  });
  if (error) { console.error('Error logging yield prediction:', error.message); toast.error('Failed to log yield prediction'); }
  else console.log('Yield prediction logged successfully.');
}

export async function logFertilizerRecommendation(farmerId: string | null, fertilizer: string) {
  console.log('Logging fertilizer recommendation to database...');
  const { error } = await supabase.from('fertilizer_logs').insert({
    farmer_id: farmerId || null,
    fertilizer,
  });
  if (error) { console.error('Error logging fertilizer recommendation:', error.message); toast.error('Failed to log fertilizer recommendation'); }
  else console.log('Fertilizer recommendation logged successfully.');
}

// ========== ALERTS ==========

export async function insertAlert(farmerId: string | null, alertType: string, message: string, severity: string, sourceDisease?: string) {
  const { error } = await supabase.from('alerts').insert({
    farmer_id: farmerId || null,
    alert_type: alertType,
    message,
    severity,
    source_disease: sourceDisease || null,
    status: 'active',
  });
  if (error) { console.error('Error inserting alert:', error.message); toast.error('Failed to create alert'); }
  else console.log('Alert inserted successfully.');
}

export async function getDbAlerts(farmerId?: string, limit = 10) {
  let query = supabase.from('alerts').select('id,message,severity,created_at').order('created_at', { ascending: false }).limit(limit);
  if (farmerId) query = query.eq('farmer_id', farmerId);
  const { data, error } = await query;
  if (error) { console.error('Error fetching alerts:', error.message); return []; }
  return data ?? [];
}

// ========== ACTIVITY COUNTS ==========

export interface ActivityCounts {
  cropLogs: number;
  diseaseLogs: number;
  yieldLogs: number;
  fertilizerLogs: number;
  alertCount: number;
}

export async function getActivityCounts(): Promise<ActivityCounts> {
  const [c, d, y, f, a] = await Promise.all([
    supabase.from('crop_logs').select('id', { count: 'exact', head: true }),
    supabase.from('disease_logs').select('id', { count: 'exact', head: true }),
    supabase.from('yield_logs').select('id', { count: 'exact', head: true }),
    supabase.from('fertilizer_logs').select('id', { count: 'exact', head: true }),
    supabase.from('alerts').select('id', { count: 'exact', head: true }),
  ]);
  return {
    cropLogs: c.count ?? 0,
    diseaseLogs: d.count ?? 0,
    yieldLogs: y.count ?? 0,
    fertilizerLogs: f.count ?? 0,
    alertCount: a.count ?? 0,
  };
}

// ========== RECENT ACTIVITY ==========

export async function getRecentActivity(limit = 10) {
  const perTable = Math.ceil(limit / 4);
  const [crops, diseases, yields, ferts] = await Promise.all([
    supabase.from('crop_logs').select('crop,confidence,risk,created_at').order('created_at', { ascending: false }).limit(perTable),
    supabase.from('disease_logs').select('disease,severity,created_at').order('created_at', { ascending: false }).limit(perTable),
    supabase.from('yield_logs').select('predicted_yield,risk,created_at').order('created_at', { ascending: false }).limit(perTable),
    supabase.from('fertilizer_logs').select('fertilizer,created_at').order('created_at', { ascending: false }).limit(perTable),
  ]);

  const items: Array<{ type: string; detail: string; timestamp: string }> = [];

  (crops.data ?? []).forEach((r) => items.push({ type: 'Crop Prediction', detail: `${r.crop} (${r.confidence}% conf, ${r.risk} risk)`, timestamp: r.created_at }));
  (diseases.data ?? []).forEach((r) => items.push({ type: 'Disease Detection', detail: `${r.disease} — ${r.severity}`, timestamp: r.created_at }));
  (yields.data ?? []).forEach((r) => items.push({ type: 'Yield Prediction', detail: `${r.predicted_yield}q (${r.risk} risk)`, timestamp: r.created_at }));
  (ferts.data ?? []).forEach((r) => items.push({ type: 'Fertilizer', detail: r.fertilizer, timestamp: r.created_at }));

  items.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  return items.slice(0, limit);
}

export async function getDiseaseDistribution() {
  const { data, error } = await supabase.from('disease_logs').select('disease');
  if (error || !data) return [];
  const counts: Record<string, number> = {};
  data.forEach((r) => { counts[r.disease] = (counts[r.disease] || 0) + 1; });
  return Object.entries(counts).map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count).slice(0, 10);
}
