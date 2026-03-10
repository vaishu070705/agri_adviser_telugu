import React, { useState } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { useFarmer } from '@/contexts/FarmerContext';
import { predictYield } from '@/lib/mockPredictions';
import { crops, soilTypes, seasons } from '@/data/districts';
import { logYieldPrediction } from '@/services/activityLogService';

export default function YieldPrediction() {
  const { t } = useTranslation();
  const { setYieldResult, yieldResult, farmer } = useFarmer();
  const [form, setForm] = useState({ crop: 'Rice', landSize: 5, soilType: 'Black Cotton', season: 'Kharif', region: 'Telangana' });

  const update = (field: string, value: string) => setForm(prev => ({ ...prev, [field]: field === 'landSize' ? parseFloat(value) || 0 : value }));

  const handlePredict = () => {
    const simple = predictYield(form);
    setYieldResult({ ...simple, id: Date.now().toString(), farmerId: farmer?.id || '', crop: form.crop, createdAt: new Date().toISOString() });
    logYieldPrediction(farmer?.id || null, simple.estimatedYield, simple.risk);
  };

  const riskColor = (r: string) => r === 'Low' ? 'border-success' : r === 'Medium' ? 'border-warning' : 'border-danger';
  const inputClass = "w-full px-3 py-2 rounded-md border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring";

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-foreground mb-1">{t('yield.title')}</h1>
      <p className="text-sm text-muted-foreground mb-6">{t('yield.subtitle')}</p>

      <div className="bg-card border border-border rounded-lg p-5 space-y-4 mb-6">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-medium mb-1">{t('common.crop')}</label>
            <select className={inputClass} value={form.crop} onChange={e => update('crop', e.target.value)}>
              {crops.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium mb-1">{t('common.landSize')}</label>
            <input className={inputClass} type="number" value={form.landSize} onChange={e => update('landSize', e.target.value)} />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1">{t('common.soilType')}</label>
            <select className={inputClass} value={form.soilType} onChange={e => update('soilType', e.target.value)}>
              {soilTypes.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium mb-1">{t('common.season')}</label>
            <select className={inputClass} value={form.season} onChange={e => update('season', e.target.value)}>
              {seasons.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium mb-1">Region</label>
            <select className={inputClass} value={form.region} onChange={e => update('region', e.target.value)}>
              <option>Telangana</option>
              <option>Andhra Pradesh</option>
            </select>
          </div>
        </div>
        <button onClick={handlePredict} className="w-full py-2.5 rounded-md bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90">
          {t('common.predict')}
        </button>
      </div>

      {yieldResult && (
        <div className={`bg-card border-2 ${riskColor(yieldResult.risk)} rounded-lg p-6`}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-xs text-muted-foreground">{t('yield.estimated')}</p>
              <p className="text-2xl font-bold text-primary">{yieldResult.estimatedYield} q</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">{t('yield.range')}</p>
              <p className="text-lg font-semibold text-foreground">{yieldResult.yieldRange[0]} – {yieldResult.yieldRange[1]} q</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">{t('common.confidence')}</p>
              <p className="text-lg font-semibold text-foreground">{yieldResult.confidence}%</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">{t('common.risk')}</p>
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${yieldResult.risk === 'Low' ? 'bg-success text-success-foreground' : yieldResult.risk === 'Medium' ? 'bg-warning text-warning-foreground' : 'bg-danger text-danger-foreground'}`}>
                {yieldResult.risk}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
