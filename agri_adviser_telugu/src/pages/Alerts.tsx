import React, { useState, useEffect } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { useFarmer } from '@/contexts/FarmerContext';
import { getAlerts, getActiveAlerts, resolveAlert, getEvents } from '@/services/alertService';
import type { AlertItem } from '@/models/types';
import { CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function Alerts() {
  const { t } = useTranslation();
  const { farmer } = useFarmer();
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [filter, setFilter] = useState<'all' | 'active' | 'resolved'>('all');

  // Reload alerts from the persistent store
  const reload = () => setAlerts(getAlerts(farmer?.id));

  useEffect(() => { reload(); }, [farmer?.id]);

  const handleResolve = (id: string) => {
    resolveAlert(id);
    toast.success('Alert resolved');
    reload();
  };

  const filtered = filter === 'all' ? alerts
    : alerts.filter(a => a.status === filter);

  const priorityColor = (p: string) =>
    p === 'High' ? 'bg-danger text-danger-foreground'
    : p === 'Medium' ? 'bg-warning text-warning-foreground'
    : 'bg-success text-success-foreground';

  const statusBadge = (s: string) =>
    s === 'active' ? 'bg-danger/20 text-danger' : 'bg-success/20 text-success';

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-foreground mb-1">{t('alert.title')}</h1>
      <p className="text-sm text-muted-foreground mb-4">{t('alert.subtitle')}</p>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-6">
        {(['all', 'active', 'resolved'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-md text-xs font-medium capitalize transition-colors ${
              filter === f ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-accent'
            }`}
          >
            {f} ({f === 'all' ? alerts.length : alerts.filter(a => a.status === f).length})
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="bg-card border border-border rounded-lg p-8 text-center text-muted-foreground">
          <p className="text-lg">✅ No alerts triggered</p>
          <p className="text-xs mt-1">Alerts are generated automatically when critical conditions are detected via predictions.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map(alert => (
            <div key={alert.id} className="bg-card border border-border rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg">🔔</span>
                    <h3 className="font-semibold text-foreground text-sm">{alert.type}</h3>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${priorityColor(alert.priority)}`}>
                      {alert.priority}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${statusBadge(alert.status)}`}>
                      {alert.status}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{alert.timestamp}</p>
                </div>
                {alert.status === 'active' && (
                  <button
                    onClick={() => handleResolve(alert.id)}
                    className="flex items-center gap-1 px-2 py-1 rounded-md bg-success/20 text-success text-xs hover:bg-success/30"
                  >
                    <CheckCircle size={12} /> Resolve
                  </button>
                )}
              </div>
              <p className="text-sm text-foreground mb-3">{alert.message}</p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="bg-muted rounded-lg p-3">
                  <h4 className="text-xs font-semibold mb-1">📧 {t('alert.emailPreview')}</h4>
                  <p className="text-[10px] text-muted-foreground">
                    To: {farmer?.email || 'farmer@email.com'}<br />
                    Subject: {alert.type} - {alert.priority} Priority<br />
                    {alert.message}
                  </p>
                </div>
                <div className="bg-muted rounded-lg p-3">
                  <h4 className="text-xs font-semibold mb-1">📱 {t('alert.smsPreview')}</h4>
                  <p className="text-[10px] text-muted-foreground">
                    [AgriAdvisory] {alert.type}: {alert.message.slice(0, 80)}...
                  </p>
                </div>
                <div className="bg-muted rounded-lg p-3">
                  <h4 className="text-xs font-semibold mb-1">📞 {t('alert.voicePreview')}</h4>
                  <p className="text-[10px] text-muted-foreground">
                    "Hello {farmer?.name || 'Farmer'}, this is AgriAdvisory. {alert.message}"
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* History table */}
      {alerts.length > 0 && (
        <div className="mt-6 bg-card border border-border rounded-lg p-4">
          <h3 className="text-sm font-semibold mb-3">📋 {t('alert.history')}</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2 px-2">{t('alert.type')}</th>
                  <th className="text-left py-2 px-2">{t('alert.priority')}</th>
                  <th className="text-left py-2 px-2">Status</th>
                  <th className="text-left py-2 px-2">Message</th>
                  <th className="text-left py-2 px-2">Time</th>
                </tr>
              </thead>
              <tbody>
                {alerts.map(a => (
                  <tr key={a.id} className="border-b border-border">
                    <td className="py-2 px-2">{a.type}</td>
                    <td className="py-2 px-2"><span className={`px-2 py-0.5 rounded-full text-[10px] ${priorityColor(a.priority)}`}>{a.priority}</span></td>
                    <td className="py-2 px-2"><span className={`px-2 py-0.5 rounded-full text-[10px] ${statusBadge(a.status)}`}>{a.status}</span></td>
                    <td className="py-2 px-2 max-w-xs truncate">{a.message}</td>
                    <td className="py-2 px-2 text-muted-foreground">{a.timestamp}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
