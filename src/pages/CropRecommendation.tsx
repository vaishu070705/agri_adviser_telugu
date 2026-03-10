import React, { useState } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { useFarmer } from '@/contexts/FarmerContext';
import { predictCrop } from '@/lib/mockPredictions';
import { seasons } from '@/data/districts';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { logCropPrediction } from '@/services/activityLogService';

export default function CropRecommendation() {
  const { t, language } = useTranslation();
  const { setCropResult, cropResult, farmer } = useFarmer();
  const [form, setForm] = useState({
    nitrogen: 50, phosphorus: 30, potassium: 35, ph: 6.5,
    temperature: 28, humidity: 65, rainfall: 150, season: 'Kharif'
  });

  const update = (field: string, value: string) => setForm(prev => ({ ...prev, [field]: parseFloat(value) || value }));

  

  const handlePredict = () => {
    const simple = predictCrop(form as any);
    setCropResult({ ...simple, id: Date.now().toString(), farmerId: farmer?.id || '', createdAt: new Date().toISOString() });
    logCropPrediction(farmer?.id || null, simple.crop, simple.confidence, simple.risk);
  };

  const riskColor = (risk: string) => risk === 'Low' ? 'bg-success text-success-foreground' : risk === 'Medium' ? 'bg-warning text-warning-foreground' : 'bg-danger text-danger-foreground';

  const featureData = [
    { name: 'Nitrogen', value: form.nitrogen },
    { name: 'Phosphorus', value: form.phosphorus },
    { name: 'Potassium', value: form.potassium },
    { name: 'pH', value: form.ph * 10 },
    { name: 'Temp', value: form.temperature },
    { name: 'Humidity', value: form.humidity },
    { name: 'Rainfall', value: Math.min(form.rainfall / 3, 100) },
  ];

  const inputClass = "w-full px-3 py-2 rounded-md border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring";
  const labelClass = "block text-xs font-medium text-foreground mb-1";

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-foreground mb-1">{t('crop.title')}</h1>
      <p className="text-sm text-muted-foreground mb-6">{t('crop.subtitle')}</p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card border border-border rounded-lg p-5 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            {[
              ['nitrogen', 'crop.nitrogen', 'number'], ['phosphorus', 'crop.phosphorus', 'number'],
              ['potassium', 'crop.potassium', 'number'], ['ph', 'crop.ph', 'number'],
              ['temperature', 'crop.temperature', 'number'], ['humidity', 'crop.humidity', 'number'],
              ['rainfall', 'crop.rainfall', 'number'],
            ].map(([field, label]) => (
              <div key={field}>
                <label className={labelClass}>{t(label)}</label>
                <input className={inputClass} type="number" value={(form as any)[field]} onChange={e => update(field, e.target.value)} />
              </div>
            ))}
            <div>
              <label className={labelClass}>{t('common.season')}</label>
              <select className={inputClass} value={form.season} onChange={e => update('season', e.target.value)}>
                {seasons.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
          </div>
          <button onClick={handlePredict} className="w-full py-2.5 rounded-md bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90">
            {t('common.predict')}
          </button>
        </div>

        <div className="space-y-4">
          {cropResult && (
            <>
              <div className={`rounded-lg p-5 border-2 ${cropResult.risk === 'Low' ? 'border-success' : cropResult.risk === 'Medium' ? 'border-warning' : 'border-danger'} bg-card`}>
                <h3 className="text-lg font-bold text-foreground">{t('crop.recommended')}</h3>
                <p className="text-3xl font-extrabold text-primary mt-1">{cropResult.crop}</p>
                <div className="flex gap-3 mt-3">
                  <span className="px-3 py-1 rounded-full bg-accent text-accent-foreground text-xs font-medium">
                    {t('common.confidence')}: {cropResult.confidence}%
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${riskColor(cropResult.risk)}`}>
                    {t('common.risk')}: {cropResult.risk}
                  </span>
                </div>
              </div>

              <div className="bg-card border border-border rounded-lg p-4">
                <h4 className="text-sm font-semibold mb-2">{t('crop.topFactors')}</h4>
                <ul className="space-y-1 text-xs text-muted-foreground">
                  {cropResult.factors.map((f, i) => <li key={i}>• {f}</li>)}
                </ul>
              </div>

              {language === 'te' && (
                <div className="bg-accent border border-border rounded-lg p-4">
                  <h4 className="text-sm font-semibold mb-1 telugu-text">{t('common.teluguSummary')}</h4>
                  <p className="text-xs telugu-text text-accent-foreground">
                    సిఫార్సు చేసిన పంట: {cropResult.crop}. నమ్మకం: {cropResult.confidence}%. ప్రమాద స్థాయి: {cropResult.risk === 'Low' ? 'తక్కువ' : cropResult.risk === 'Medium' ? 'మధ్యస్థం' : 'ఎక్కువ'}.
                  </p>
                </div>
              )}
            </>
          )}

          <div className="bg-card border border-border rounded-lg p-4">
            <h4 className="text-sm font-semibold mb-3">{t('crop.featureImportance')}</h4>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={featureData}>
                <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {featureData.map((_, i) => (
                    <Cell key={i} fill={`hsl(${142 + i * 20}, 50%, ${35 + i * 5}%)`} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
