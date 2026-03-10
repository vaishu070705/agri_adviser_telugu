import React, { useState } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { useFarmer } from '@/contexts/FarmerContext';
import { calculateEconomics } from '@/lib/mockPredictions';
import { crops } from '@/data/districts';

export default function FarmEconomics() {
  const { t } = useTranslation();
  const { setEconomicsResult, economicsResult } = useFarmer();
  const [form, setForm] = useState({
    crop: 'Rice', landSize: 5, estimatedYield: 125,
    fertilizerCost: 15000, laborCost: 25000, irrigationCost: 10000
  });

  const update = (f: string, v: string) => setForm(prev => ({ ...prev, [f]: parseFloat(v) || 0 }));
  const inputClass = "w-full px-3 py-2 rounded-md border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring";

  const handleCalc = () => {
    const simple = calculateEconomics(form);
    setEconomicsResult({ ...simple, id: Date.now().toString(), farmerId: '', crop: form.crop, createdAt: new Date().toISOString() });
  };

  const fmt = (n: number) => `₹${n.toLocaleString('en-IN')}`;

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-foreground mb-1">{t('econ.title')}</h1>
      <p className="text-sm text-muted-foreground mb-6">{t('econ.subtitle')}</p>

      <div className="bg-card border border-border rounded-lg p-5 space-y-4 mb-6">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-medium mb-1">{t('common.crop')}</label>
            <select className={inputClass} value={form.crop} onChange={e => setForm(prev => ({ ...prev, crop: e.target.value }))}>
              {crops.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          {[
            ['landSize', 'common.landSize'], ['estimatedYield', 'econ.estimatedYield'],
            ['fertilizerCost', 'econ.fertilizerCost'], ['laborCost', 'econ.laborCost'],
            ['irrigationCost', 'econ.irrigationCost'],
          ].map(([f, l]) => (
            <div key={f}>
              <label className="block text-xs font-medium mb-1">{t(l)}</label>
              <input className={inputClass} type="number" value={(form as any)[f]} onChange={e => update(f, e.target.value)} />
            </div>
          ))}
        </div>
        <button onClick={handleCalc} className="w-full py-2.5 rounded-md bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90">
          {t('common.analyze')}
        </button>
      </div>

      {economicsResult && (
        <div className={`bg-card border-2 rounded-lg p-6 ${economicsResult.profitRisk === 'Low' ? 'border-success' : economicsResult.profitRisk === 'Medium' ? 'border-warning' : 'border-danger'}`}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-xs text-muted-foreground">{t('econ.totalCost')}</p>
              <p className="text-xl font-bold text-danger">{fmt(economicsResult.totalCost)}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">{t('econ.revenue')}</p>
              <p className="text-xl font-bold text-primary">{fmt(economicsResult.revenue)}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">{t('econ.profit')}</p>
              <p className={`text-xl font-bold ${economicsResult.profit >= 0 ? 'text-success' : 'text-danger'}`}>{fmt(economicsResult.profit)}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">{t('common.risk')}</p>
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${economicsResult.profitRisk === 'Low' ? 'bg-success text-success-foreground' : economicsResult.profitRisk === 'Medium' ? 'bg-warning text-warning-foreground' : 'bg-danger text-danger-foreground'}`}>
                {economicsResult.profitRisk}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
