import React, { useState } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { useFarmer } from '@/contexts/FarmerContext';
import { getFertilizerRecommendation } from '@/lib/mockPredictions';
import { crops, soilTypes } from '@/data/districts';
import { logFertilizerRecommendation } from '@/services/activityLogService';

export default function FertilizerAdvisor() {
  const { t, language } = useTranslation();
  const { cropResult, farmer } = useFarmer();
  const [form, setForm] = useState({ crop: cropResult?.crop || 'Rice', soilType: 'Black Cotton', nitrogen: 40, phosphorus: 25, potassium: 30 });
  const [results, setResults] = useState<Array<{ name: string; dosage: string; reason: string }>>([]);

  const inputClass = "w-full px-3 py-2 rounded-md border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring";

  const handleRecommend = () => {
    const recs = getFertilizerRecommendation(form.crop, form.soilType, form.nitrogen, form.phosphorus, form.potassium);
    setResults(recs);
    // Log each recommendation
    recs.forEach(r => logFertilizerRecommendation(farmer?.id || null, r.name));
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-foreground mb-1">{t('fert.title')}</h1>
      <p className="text-sm text-muted-foreground mb-6">{t('fert.subtitle')}</p>

      <div className="bg-card border border-border rounded-lg p-5 space-y-4 mb-6">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-medium mb-1">{t('common.crop')}</label>
            <select className={inputClass} value={form.crop} onChange={e => setForm(p => ({ ...p, crop: e.target.value }))}>
              {crops.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium mb-1">{t('common.soilType')}</label>
            <select className={inputClass} value={form.soilType} onChange={e => setForm(p => ({ ...p, soilType: e.target.value }))}>
              {soilTypes.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium mb-1">Nitrogen (N)</label>
            <input className={inputClass} type="number" value={form.nitrogen} onChange={e => setForm(p => ({ ...p, nitrogen: +e.target.value }))} />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1">Phosphorus (P)</label>
            <input className={inputClass} type="number" value={form.phosphorus} onChange={e => setForm(p => ({ ...p, phosphorus: +e.target.value }))} />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1">Potassium (K)</label>
            <input className={inputClass} type="number" value={form.potassium} onChange={e => setForm(p => ({ ...p, potassium: +e.target.value }))} />
          </div>
        </div>
        <button onClick={handleRecommend} className="w-full py-2.5 rounded-md bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90">
          {t('common.analyze')}
        </button>
      </div>

      {results.length > 0 && (
        <div className="space-y-3">
          {results.map((r, i) => (
            <div key={i} className="bg-card border border-border rounded-lg p-4 flex items-start gap-3">
              <span className="text-2xl">🧪</span>
              <div>
                <h3 className="font-semibold text-foreground text-sm">{r.name}</h3>
                <p className="text-xs text-primary font-medium">{r.dosage}</p>
                <p className="text-xs text-muted-foreground mt-1">{r.reason}</p>
              </div>
            </div>
          ))}

          {language === 'te' && (
            <div className="bg-accent border border-border rounded-lg p-4 mt-2">
              <h4 className="text-sm font-semibold telugu-text mb-1">{t('common.teluguSummary')}</h4>
              <p className="text-xs telugu-text text-accent-foreground">
                {results.map(r => `${r.name}: ${r.dosage}`).join('. ')}.
                దయచేసి సరైన మోతాదులో ఎరువులను వాడండి.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
