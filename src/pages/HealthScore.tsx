import React, { useEffect } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { useFarmer } from '@/contexts/FarmerContext';
import { calculateHealthScore } from '@/lib/mockPredictions';

export default function HealthScore() {
  const { t, language } = useTranslation();
  const { cropResult, diseaseResult, yieldResult, healthResult, setHealthResult } = useFarmer();

  useEffect(() => {
    const simple = calculateHealthScore(diseaseResult, cropResult, yieldResult);
    setHealthResult({ ...simple, id: Date.now().toString(), farmerId: '', createdAt: new Date().toISOString() });
  }, [diseaseResult, cropResult, yieldResult]);

  const score = healthResult?.score ?? 75;
  const scoreColor = score >= 70 ? 'text-success' : score >= 40 ? 'text-warning' : 'text-danger';
  const scoreLabel = score >= 70 ? 'Good / మంచి' : score >= 40 ? 'Moderate / మధ్యస్థం' : 'Poor / పేలవం';

  const Breakdown = ({ label, value }: { label: string; value: number }) => (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span className="text-foreground">{label}</span>
        <span className="text-muted-foreground">{value}%</span>
      </div>
      <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${value >= 70 ? 'bg-success' : value >= 40 ? 'bg-warning' : 'bg-danger'}`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-foreground mb-1">{t('health.title')}</h1>
      <p className="text-sm text-muted-foreground mb-6">{t('health.subtitle')}</p>

      <div className="bg-card border border-border rounded-lg p-6 text-center mb-6">
        {/* Gauge */}
        <div className="inline-block relative w-40 h-40 rounded-full mb-4" style={{
          background: `conic-gradient(
            ${score >= 70 ? 'hsl(var(--success))' : score >= 40 ? 'hsl(var(--warning))' : 'hsl(var(--danger))'} ${score * 3.6}deg,
            hsl(var(--muted)) ${score * 3.6}deg
          )`
        }}>
          <div className="absolute inset-3 rounded-full bg-card flex items-center justify-center flex-col">
            <span className={`text-4xl font-extrabold ${scoreColor}`}>{score}</span>
            <span className="text-xs text-muted-foreground">/100</span>
          </div>
        </div>
        <p className={`text-lg font-bold ${scoreColor}`}>{scoreLabel}</p>
      </div>

      <div className="bg-card border border-border rounded-lg p-5 space-y-4">
        <h3 className="text-sm font-semibold">Breakdown</h3>
        <Breakdown label={t('health.diseaseImpact')} value={healthResult?.diseaseImpact ?? 80} />
        <Breakdown label={t('health.nutrientImpact')} value={healthResult?.nutrientImpact ?? 85} />
        <Breakdown label={t('health.yieldImpact')} value={healthResult?.yieldImpact ?? 75} />
      </div>

      {language === 'te' && (
        <div className="bg-accent border border-border rounded-lg p-4 mt-4">
          <h4 className="text-sm font-semibold mb-1 telugu-text">{t('common.teluguSummary')}</h4>
          <p className="text-xs telugu-text text-accent-foreground">
            పంట ఆరోగ్య స్కోరు: {score}/100. {score >= 70 ? 'మీ పంట ఆరోగ్యంగా ఉంది.' : score >= 40 ? 'మీ పంటకు కొంత శ్రద్ధ అవసరం.' : 'మీ పంటకు తక్షణ శ్రద్ధ అవసరం.'}
          </p>
        </div>
      )}
    </div>
  );
}
