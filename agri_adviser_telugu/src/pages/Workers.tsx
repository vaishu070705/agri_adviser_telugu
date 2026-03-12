import React, { useState, useEffect } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { useFarmer } from '@/contexts/FarmerContext';
import type { WorkerTask } from '@/models/types';
import { getAllTasksDb, assignTaskDb, completeTaskDb } from '@/services/databaseService';
import { toast } from 'sonner';
import { Phone, Mail, UserPlus, Search, Award, CheckCircle, Star } from 'lucide-react';

export default function Workers() {
  const { t } = useTranslation();
  const { workers, workersLoading, addWorker, refreshWorkers } = useFarmer();
  const [tab, setTab] = useState<'browse' | 'join' | 'tasks'>('browse');
  const [search, setSearch] = useState('');
  const [form, setForm] = useState({ name: '', email: '', phone: '', skills: '', district: '' });
  const [tasks, setTasks] = useState<WorkerTask[]>([]);
  const [tasksLoading, setTasksLoading] = useState(true);
  const [selectedWorker, setSelectedWorker] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    setTasksLoading(true);
    const dbTasks = await getAllTasksDb();
    setTasks(dbTasks);
    setTasksLoading(false);
  };

  const filteredWorkers = workers.filter(w =>
    w.name.toLowerCase().includes(search.toLowerCase()) ||
    w.skills.some(s => s.toLowerCase().includes(search.toLowerCase())) ||
    w.district.toLowerCase().includes(search.toLowerCase())
  );

  const handleJoin = async () => {
    if (!form.name || !form.email || !form.phone) {
      toast.error('Please fill all required fields');
      return;
    }
    setSubmitting(true);
    try {
      await addWorker({
        name: form.name,
        email: form.email,
        phone: form.phone,
        skills: form.skills.split(',').map(s => s.trim()).filter(Boolean),
        district: form.district,
      });
      toast.success('Successfully registered as a worker!');
      setForm({ name: '', email: '', phone: '', skills: '', district: '' });
      setTab('browse');
    } catch (err: any) {
      toast.error(err.message || 'Registration failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleAssignTask = async (taskId: string, workerId: string) => {
    const result = await assignTaskDb(taskId, workerId);
    if (result) {
      toast.success('Task assigned successfully!');
      await loadTasks();
      await refreshWorkers();
    }
  };

  const handleCompleteTask = async (taskId: string, success: boolean) => {
    const result = await completeTaskDb(taskId, success);
    if (result) {
      toast.success(success ? 'Task completed successfully!' : 'Task marked as failed');
      await loadTasks();
      await refreshWorkers();
    }
  };

  const levelColor = (level: number) => {
    if (level >= 7) return 'bg-primary text-primary-foreground';
    if (level >= 4) return 'bg-warning text-warning-foreground';
    return 'bg-muted text-muted-foreground';
  };

  const difficultyLabel = (d: number) => ['', 'Easy', 'Basic', 'Moderate', 'Hard', 'Expert'][d] || 'Unknown';

  const inputClass = "w-full px-3 py-2 rounded-md border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring";

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-foreground mb-1">{t('workers.title')}</h1>
      <p className="text-sm text-muted-foreground mb-6">{t('workers.subtitle')}</p>

      <div className="flex gap-2 mb-6">
        {(['browse', 'join', 'tasks'] as const).map(tabKey => (
          <button
            key={tabKey}
            onClick={() => setTab(tabKey)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-1 ${
              tab === tabKey ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-accent'
            }`}
          >
            {tabKey === 'browse' && t('workers.browse')}
            {tabKey === 'join' && <><UserPlus size={14} /> {t('workers.join')}</>}
            {tabKey === 'tasks' && <><CheckCircle size={14} /> Task Board</>}
          </button>
        ))}
      </div>

      {tab === 'browse' && (
        <>
          <div className="relative mb-4">
            <Search className="absolute left-3 top-2.5 text-muted-foreground" size={16} />
            <input
              className="w-full pl-10 pr-3 py-2 rounded-md border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="Search by name, skill, or district..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          {workersLoading ? (
            <p className="text-sm text-muted-foreground">Loading workers...</p>
          ) : filteredWorkers.length === 0 ? (
            <p className="text-sm text-muted-foreground">No records found.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredWorkers.map(w => (
                <div key={w.id} className="bg-card border border-border rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-foreground">{w.name}</h3>
                      <p className="text-xs text-muted-foreground">{w.district}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${w.available ? 'bg-success text-success-foreground' : 'bg-muted text-muted-foreground'}`}>
                        {w.available ? t('workers.available') : 'Unavailable'}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${levelColor(w.level)}`}>
                        <Star size={10} className="inline mr-0.5" /> Lvl {w.level}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-3 mt-2 text-[10px] text-muted-foreground">
                    <span><Award size={10} className="inline" /> {w.completedTasks} tasks</span>
                    <span>📊 {w.accuracyRate}% accuracy</span>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {w.skills.map(s => (
                      <span key={s} className="px-2 py-0.5 rounded bg-accent text-accent-foreground text-[10px]">{s}</span>
                    ))}
                  </div>
                  <div className="flex gap-2 mt-3">
                    <a href={`tel:${w.phone}`} className="flex items-center gap-1 px-3 py-1.5 rounded-md bg-primary text-primary-foreground text-xs font-medium hover:opacity-90">
                      <Phone size={12} /> {t('workers.call')}
                    </a>
                    <a href={`mailto:${w.email}`} className="flex items-center gap-1 px-3 py-1.5 rounded-md bg-secondary text-secondary-foreground text-xs font-medium hover:opacity-90">
                      <Mail size={12} /> {t('workers.message')}
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {tab === 'join' && (
        <div className="bg-card border border-border rounded-lg p-6 max-w-md space-y-3">
          <div>
            <label className="block text-xs font-medium mb-1">{t('common.name')} *</label>
            <input className={inputClass} value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1">{t('common.email')} *</label>
            <input className={inputClass} type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1">{t('common.phone')} *</label>
            <input className={inputClass} value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} maxLength={10} />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1">{t('common.district')}</label>
            <input className={inputClass} value={form.district} onChange={e => setForm(p => ({ ...p, district: e.target.value }))} placeholder="e.g. Warangal" />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1">{t('workers.skills')} (comma separated)</label>
            <input className={inputClass} value={form.skills} onChange={e => setForm(p => ({ ...p, skills: e.target.value }))} placeholder="Plowing, Harvesting, Sowing" />
          </div>
          <button
            onClick={handleJoin}
            disabled={submitting}
            className="w-full py-2.5 rounded-md bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 disabled:opacity-50"
          >
            {submitting ? 'Registering...' : t('workers.join')}
          </button>
        </div>
      )}

      {tab === 'tasks' && (
        <div className="space-y-4">
          <div className="bg-card border border-border rounded-lg p-4">
            <label className="block text-xs font-medium mb-2">Select Worker to Assign/View Tasks</label>
            <select
              className={inputClass}
              value={selectedWorker || ''}
              onChange={e => setSelectedWorker(e.target.value || null)}
            >
              <option value="">-- Select Worker --</option>
              {workers.filter(w => w.available).map(w => (
                <option key={w.id} value={w.id}>{w.name} (Lvl {w.level})</option>
              ))}
            </select>
          </div>

          {tasksLoading ? (
            <p className="text-sm text-muted-foreground">Loading tasks...</p>
          ) : tasks.length === 0 ? (
            <p className="text-sm text-muted-foreground">No records found.</p>
          ) : (
            <div className="space-y-3">
              {tasks.map(task => {
                const assignedWorker = workers.find(w => w.id === task.assignedTo);
                const canAssign = selectedWorker && task.status === 'pending' &&
                  (workers.find(w => w.id === selectedWorker)?.level ?? 0) >= task.requiredLevel;

                return (
                  <div key={task.id} className="bg-card border border-border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-foreground text-sm">{task.title}</h3>
                        <p className="text-xs text-muted-foreground mt-0.5">{task.description}</p>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
                        task.status === 'completed' ? 'bg-success text-success-foreground' :
                        task.status === 'assigned' ? 'bg-warning text-warning-foreground' :
                        'bg-muted text-muted-foreground'
                      }`}>
                        {task.status}
                      </span>
                    </div>
                    <div className="flex gap-3 mt-2 text-[10px] text-muted-foreground">
                      <span>Difficulty: {difficultyLabel(task.difficulty)}</span>
                      <span>Min Level: {task.requiredLevel}</span>
                      {assignedWorker && <span>Assigned: {assignedWorker.name}</span>}
                    </div>
                    <div className="flex gap-2 mt-3">
                      {canAssign && (
                        <button
                          onClick={() => handleAssignTask(task.id, selectedWorker!)}
                          className="px-3 py-1.5 rounded-md bg-primary text-primary-foreground text-xs font-medium hover:opacity-90"
                        >
                          Assign to Selected Worker
                        </button>
                      )}
                      {task.status === 'assigned' && (
                        <>
                          <button
                            onClick={() => handleCompleteTask(task.id, true)}
                            className="px-3 py-1.5 rounded-md bg-success text-success-foreground text-xs font-medium hover:opacity-90"
                          >
                            ✓ Complete
                          </button>
                          <button
                            onClick={() => handleCompleteTask(task.id, false)}
                            className="px-3 py-1.5 rounded-md bg-danger text-danger-foreground text-xs font-medium hover:opacity-90"
                          >
                            ✗ Failed
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
