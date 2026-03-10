// ============================================================
// Database Service — persistent CRUD for farmers, workers, tasks
// All data is stored in Lovable Cloud (PostgreSQL)
// ============================================================

import { supabase } from '@/integrations/supabase/client';
import type { FarmerData, WorkerProfile, WorkerTask } from '@/models/types';

// ========== FARMERS ==========

export async function getAllFarmers(): Promise<FarmerData[]> {
  console.log('Fetching farmers from database...');
  const { data, error } = await supabase.from('farmers').select('*').order('registered_at', { ascending: false });
  if (error) {
    console.error('Error fetching farmers:', error.message);
    return [];
  }
  const farmers = (data ?? []).map(mapDbFarmer);
  console.log(`Total farmers found: ${farmers.length}`);
  return farmers;
}

export async function insertFarmer(farmer: Omit<FarmerData, 'id' | 'registeredAt'>): Promise<FarmerData | null> {
  console.log('Inserting farmer into database...');
  const { data, error } = await supabase.from('farmers').insert({
    name: farmer.name,
    state: farmer.state,
    district: farmer.district,
    mandal: farmer.mandal || '',
    land_size: farmer.landSize || 0,
    soil_type: farmer.soilType || '',
    email: farmer.email,
    phone: farmer.phone,
    preferred_language: farmer.preferredLanguage || 'English',
  } as any).select().single();

  if (error) {
    if (error.code === '23505') {
      console.error('Duplicate email:', farmer.email);
      throw new Error('A farmer with this email already exists.');
    }
    console.error('Error inserting farmer:', error.message);
    throw new Error(error.message);
  }

  console.log('Farmer inserted successfully.');
  return mapDbFarmer(data);
}

function mapDbFarmer(row: any): FarmerData {
  return {
    id: row.id,
    name: row.name,
    state: row.state,
    district: row.district,
    mandal: row.mandal || '',
    landSize: Number(row.land_size) || 0,
    soilType: row.soil_type || '',
    email: row.email,
    phone: row.phone,
    preferredLanguage: row.preferred_language || 'English',
    registeredAt: row.registered_at,
  };
}

// ========== WORKERS ==========

export async function getAllWorkersDb(): Promise<WorkerProfile[]> {
  console.log('Fetching workers from database...');
  const { data, error } = await supabase.from('workers').select('*').order('registered_at', { ascending: false });
  if (error) {
    console.error('Error fetching workers:', error.message);
    return [];
  }
  const workers = (data ?? []).map(mapDbWorker);
  console.log(`Total workers found: ${workers.length}`);
  return workers;
}

export async function insertWorker(worker: { name: string; email: string; phone: string; skills: string[]; district: string; available?: boolean }): Promise<WorkerProfile | null> {
  console.log('Inserting worker into database...');
  const { data, error } = await supabase.from('workers').insert({
    name: worker.name,
    email: worker.email,
    phone: worker.phone,
    skills: worker.skills,
    district: worker.district,
    available: worker.available ?? true,
    level: 1,
    completed_tasks: 0,
    accuracy_rate: 100,
    assigned_tasks: [],
  } as any).select().single();

  if (error) {
    if (error.code === '23505') {
      console.error('Duplicate email:', worker.email);
      throw new Error('A worker with this email already exists.');
    }
    console.error('Error inserting worker:', error.message);
    throw new Error(error.message);
  }

  console.log('Worker inserted successfully.');
  return mapDbWorker(data);
}

export async function updateWorkerDb(id: string, updates: Partial<Record<string, any>>): Promise<void> {
  const { error } = await supabase.from('workers').update(updates as any).eq('id', id);
  if (error) console.error('Error updating worker:', error.message);
}

function mapDbWorker(row: any): WorkerProfile {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    phone: row.phone,
    skills: row.skills || [],
    available: row.available ?? true,
    district: row.district || '',
    level: row.level || 1,
    completedTasks: row.completed_tasks || 0,
    accuracyRate: row.accuracy_rate || 100,
    assignedTasks: row.assigned_tasks || [],
    registeredAt: row.registered_at,
  };
}

// ========== TASKS ==========

export async function getAllTasksDb(): Promise<WorkerTask[]> {
  console.log('Fetching tasks from database...');
  const { data, error } = await supabase.from('worker_tasks').select('*').order('created_at', { ascending: false });
  if (error) {
    console.error('Error fetching tasks:', error.message);
    return [];
  }
  const tasks = (data ?? []).map(mapDbTask);
  console.log(`Total tasks found: ${tasks.length}`);
  return tasks;
}

export async function insertTask(task: { title: string; description: string; difficulty: number; requiredLevel: number }): Promise<WorkerTask | null> {
  const { data, error } = await supabase.from('worker_tasks').insert({
    title: task.title,
    description: task.description,
    difficulty: task.difficulty,
    required_level: task.requiredLevel,
    status: 'pending',
    assigned_to: null,
  } as any).select().single();

  if (error) {
    console.error('Error inserting task:', error.message);
    throw new Error(error.message);
  }
  return mapDbTask(data);
}

export async function assignTaskDb(taskId: string, workerId: string): Promise<WorkerTask | null> {
  const { data, error } = await supabase.from('worker_tasks').update({
    status: 'assigned',
    assigned_to: workerId,
  } as any).eq('id', taskId).select().single();

  if (error) {
    console.error('Error assigning task:', error.message);
    return null;
  }

  // Add task to worker's assigned_tasks
  const worker = await supabase.from('workers').select('assigned_tasks').eq('id', workerId).single();
  if (worker.data) {
    const currentTasks = (worker.data as any).assigned_tasks || [];
    await supabase.from('workers').update({ assigned_tasks: [...currentTasks, taskId] } as any).eq('id', workerId);
  }

  return mapDbTask(data);
}

export async function completeTaskDb(taskId: string, success: boolean): Promise<WorkerTask | null> {
  const { data: taskData, error: taskErr } = await supabase.from('worker_tasks')
    .update({ status: 'completed', completed_at: new Date().toISOString() } as any)
    .eq('id', taskId).select().single();

  if (taskErr || !taskData) return null;
  const task = mapDbTask(taskData);

  if (task.assignedTo) {
    const { data: wData } = await supabase.from('workers').select('*').eq('id', task.assignedTo).single();
    if (wData) {
      const w = wData as any;
      const newCompleted = (w.completed_tasks || 0) + 1;
      const prevSuccessful = Math.round(((w.accuracy_rate || 100) / 100) * (w.completed_tasks || 0));
      const newAccuracy = Math.round(((prevSuccessful + (success ? 1 : 0)) / newCompleted) * 100);
      const assignedTasks = (w.assigned_tasks || []).filter((id: string) => id !== taskId);
      await supabase.from('workers').update({
        completed_tasks: newCompleted,
        accuracy_rate: newAccuracy,
        assigned_tasks: assignedTasks,
      } as any).eq('id', task.assignedTo);
    }
  }

  return task;
}

function mapDbTask(row: any): WorkerTask {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    difficulty: row.difficulty || 1,
    requiredLevel: row.required_level || 1,
    status: row.status || 'pending',
    assignedTo: row.assigned_to || null,
    createdAt: row.created_at,
    completedAt: row.completed_at || null,
  };
}
