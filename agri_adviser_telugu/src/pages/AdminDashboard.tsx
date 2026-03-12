import React, { useEffect, useState, useCallback, useMemo, lazy, Suspense } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { getDbCounts, DbCounts } from '@/services/dashboardService';
import { getActivityCounts, getRecentActivity, getDiseaseDistribution, getDbAlerts, ActivityCounts } from '@/services/activityLogService';
import { Skeleton } from '@/components/ui/skeleton';

const LazyChart = lazy(() => import('@/components/DashboardDiseaseChart'));

const POLL_INTERVAL = 30_000; // 30s instead of 5s

export default function AdminDashboard() {
  const { t } = useTranslation();
  const [dbStatus, setDbStatus] = useState<DbCounts | null>(null);
  const [activity, setActivity] = useState<ActivityCounts | null>(null);
  const [recentActivity, setRecentActivity] = useState<Array<{ type: string; detail: string; timestamp: string }>>([]);
  const [diseaseChart, setDiseaseChart] = useState<Array<{ name: string; count: number }>>([]);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async (isInitial = false) => {
    if (isInitial) setLoading(true);
    try {
      const [counts, actCounts, recent, diseases, dbAlerts] = await Promise.all([
        getDbCounts(),
        getActivityCounts(),
        getRecentActivity(10),
        getDiseaseDistribution(),
        getDbAlerts(undefined, 10),
      ]);
      setDbStatus(counts);
      setActivity(actCounts);
      setRecentActivity(recent);
      setDiseaseChart(diseases);
      setAlerts(dbAlerts);
      setError(null);
    } catch (err: any) {
      console.error('Dashboard load error:', err);
      setError('Failed to load dashboard data');
    } finally {
      if (isInitial) setLoading(false);
    }
  }, []);

  useEffect(() => { loadData(true); }, [loadData]);
  useEffect(() => {
    const interval = setInterval(() => loadData(false), POLL_INTERVAL);
    return () => clearInterval(interval);
  }, [loadData]);

  const totalPredictions = useMemo(() =>
    activity ? activity.cropLogs + activity.diseaseLogs + activity.yieldLogs + activity.fertilizerLogs : 0,
    [activity]
  );

  const COLORS = useMemo(() => ['hsl(142, 50%, 40%)', 'hsl(38, 70%, 55%)', 'hsl(200, 60%, 50%)', 'hsl(0, 72%, 51%)', 'hsl(280, 50%, 50%)'], []);

  const StatCard = React.memo(({ label, value, icon }: { label: string; value: string | number; icon: string }) => (
    <div className="bg-card border border-border rounded-lg p-4 text-center">
      <span className="text-2xl">{icon}</span>
      <p className="text-2xl font-bold text-primary mt-1">{value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  ));

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto space-y-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-48" />
        <Skeleton className="h-12 w-full" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-24" />)}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-1">
        <h1 className="text-2xl font-bold text-foreground">{t('admin.title')}</h1>
        <button
          onClick={() => loadData(false)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          🔄 Refresh
        </button>
      </div>
      <p className="text-sm text-muted-foreground mb-4">Live system metrics — refreshes every 30s</p>

      {/* Database Health Indicator */}
      <div className="flex items-center gap-4 mb-6 p-3 bg-card border border-border rounded-lg">
        <div className="flex items-center gap-2">
          <span className={`inline-block w-3 h-3 rounded-full ${dbStatus?.dbConnected ? 'bg-green-500' : 'bg-destructive'}`} />
          <span className="text-sm font-medium text-foreground">
            {dbStatus?.dbConnected ? 'Database Connected' : 'Database Disconnected'}
          </span>
        </div>
        {dbStatus && (
          <div className="flex gap-4 text-xs text-muted-foreground">
            <span>Farmers: {dbStatus.farmerCount}</span>
            <span>Workers: {dbStatus.workerCount}</span>
            <span>Tasks: {dbStatus.taskCount}</span>
          </div>
        )}
      </div>

      {error && (
        <div className="mb-4 p-3 bg-destructive/10 border border-destructive/30 rounded-lg text-sm text-destructive">
          ⚠️ {error}
        </div>
      )}

      {/* Registration Counts */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard label={t('admin.totalFarmers')} value={dbStatus?.farmerCount ?? 0} icon="👨‍🌾" />
        <StatCard label="Total Workers" value={dbStatus?.workerCount ?? 0} icon="👷" />
        <StatCard label="Total Alerts" value={activity?.alertCount ?? 0} icon="🔔" />
        <StatCard label="Total Predictions" value={totalPredictions} icon="🧠" />
      </div>

      {/* Activity Breakdown */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard label="Crop Predictions" value={activity?.cropLogs ?? 0} icon="🌾" />
        <StatCard label="Disease Detections" value={activity?.diseaseLogs ?? 0} icon="🦠" />
        <StatCard label="Yield Predictions" value={activity?.yieldLogs ?? 0} icon="📊" />
        <StatCard label="Fertilizer Recs" value={activity?.fertilizerLogs ?? 0} icon="🧪" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Disease Distribution - Lazy loaded */}
        <div className="bg-card border border-border rounded-lg p-4">
          <h3 className="text-sm font-semibold mb-3">{t('admin.commonDiseases')}</h3>
          {diseaseChart.length > 0 ? (
            <Suspense fallback={<Skeleton className="h-[200px]" />}>
              <LazyChart data={diseaseChart} colors={COLORS} />
            </Suspense>
          ) : (
            <p className="text-xs text-muted-foreground text-center py-8">No disease detections yet</p>
          )}
        </div>

        {/* Alerts */}
        <div className="bg-card border border-border rounded-lg p-4">
          <h3 className="text-sm font-semibold mb-3">🔔 Active Alerts</h3>
          {alerts.length > 0 ? (
            <div className="max-h-48 overflow-y-auto space-y-2">
              {alerts.map((a: any) => (
                <div key={a.id} className={`p-2 rounded text-xs border ${a.severity === 'high' ? 'border-destructive bg-destructive/10 text-destructive' : 'border-warning bg-warning/10 text-warning-foreground'}`}>
                  <p className="font-medium">{a.message}</p>
                  <p className="text-[10px] mt-0.5 opacity-70">{new Date(a.created_at).toLocaleString()}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-muted-foreground text-center py-8">No alerts triggered yet</p>
          )}
        </div>
      </div>

      {/* Recent Activity Log */}
      <div className="bg-card border border-border rounded-lg p-4 mt-6">
        <h3 className="text-sm font-semibold mb-3">📜 Recent Activity</h3>
        {recentActivity.length > 0 ? (
          <div className="max-h-64 overflow-y-auto">
            <table className="w-full text-xs">
              <thead className="sticky top-0 bg-card">
                <tr className="border-b border-border text-left text-muted-foreground">
                  <th className="py-2 pr-3">Timestamp</th>
                  <th className="py-2 pr-3">Type</th>
                  <th className="py-2">Details</th>
                </tr>
              </thead>
              <tbody>
                {recentActivity.map((item, i) => (
                  <tr key={i} className="border-b border-border/50">
                    <td className="py-1.5 pr-3 text-muted-foreground whitespace-nowrap">{new Date(item.timestamp).toLocaleString()}</td>
                    <td className="py-1.5 pr-3">
                      <span className="px-2 py-0.5 rounded-full bg-accent text-accent-foreground font-medium">{item.type}</span>
                    </td>
                    <td className="py-1.5 text-muted-foreground truncate max-w-[200px]">{item.detail}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-xs text-muted-foreground text-center py-8">No activity recorded yet — use the prediction modules to generate data</p>
        )}
      </div>
    </div>
  );
}
