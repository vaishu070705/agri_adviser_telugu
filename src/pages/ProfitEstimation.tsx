import React, { useState } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { crops, seasons } from '@/data/districts';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export default function ProfitEstimation() {
  const { t, language } = useTranslation();
  const [form, setForm] = useState({
    crop: 'Rice', landSize: 5, season: 'Kharif',
    seedCost: 5000, fertCost: 15000, laborCost: 25000,
    irrigationCost: 10000, pesticideCost: 8000, transportCost: 5000,
    estimatedYield: 125,
  });

  const [result, setResult] = useState<{
    totalCost: number; revenue: number; profit: number; roi: number;
    costBreakdown: Array<{ name: string; value: number }>;
  } | null>(null);

  const prices: Record<string, number> = {
    'Rice': 2040, 'Cotton': 6620, 'Maize': 2090, 'Groundnut': 5850,
    'Chilli': 8000, 'Turmeric': 7500, 'Sugarcane': 315, 'Tomato': 1500, 'Onion': 2000,
  };

  const handleCalc = () => {
    const totalCost = form.seedCost + form.fertCost + form.laborCost + form.irrigationCost + form.pesticideCost + form.transportCost;
    const pricePerQ = prices[form.crop] || 3000;
    const revenue = form.estimatedYield * pricePerQ;
    const profit = revenue - totalCost;
    const roi = totalCost > 0 ? Math.round((profit / totalCost) * 100) : 0;

    setResult({
      totalCost, revenue, profit, roi,
      costBreakdown: [
        { name: 'Seed', value: form.seedCost },
        { name: 'Fertilizer', value: form.fertCost },
        { name: 'Labor', value: form.laborCost },
        { name: 'Irrigation', value: form.irrigationCost },
        { name: 'Pesticide', value: form.pesticideCost },
        { name: 'Transport', value: form.transportCost },
      ]
    });
  };

  const fmt = (n: number) => `₹${n.toLocaleString('en-IN')}`;
  const inputClass = "w-full px-3 py-2 rounded-md border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring";
  const COLORS = ['hsl(142,50%,40%)', 'hsl(38,70%,55%)', 'hsl(200,60%,50%)', 'hsl(0,72%,51%)', 'hsl(280,50%,50%)', 'hsl(30,80%,50%)'];

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-foreground mb-1">{t('profit.title')}</h1>
      <p className="text-sm text-muted-foreground mb-6">{t('profit.subtitle')}</p>

      <div className="bg-card border border-border rounded-lg p-5 space-y-4 mb-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div>
            <label className="block text-xs font-medium mb-1">{t('common.crop')}</label>
            <select className={inputClass} value={form.crop} onChange={e => setForm(p => ({ ...p, crop: e.target.value }))}>
              {crops.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          {[
            ['landSize', 'Land (acres)'], ['estimatedYield', 'Yield (quintals)'],
            ['seedCost', 'Seed Cost (₹)'], ['fertCost', 'Fertilizer (₹)'],
            ['laborCost', 'Labor (₹)'], ['irrigationCost', 'Irrigation (₹)'],
            ['pesticideCost', 'Pesticide (₹)'], ['transportCost', 'Transport (₹)'],
          ].map(([f, l]) => (
            <div key={f}>
              <label className="block text-xs font-medium mb-1">{l}</label>
              <input className={inputClass} type="number" value={(form as any)[f]} onChange={e => setForm(p => ({ ...p, [f]: +e.target.value }))} />
            </div>
          ))}
        </div>
        <button onClick={handleCalc} className="w-full py-2.5 rounded-md bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90">
          {t('common.analyze')}
        </button>
      </div>

      {result && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className={`bg-card border-2 rounded-lg p-6 ${result.profit >= 0 ? 'border-success' : 'border-danger'}`}>
            <div className="space-y-4 text-center">
              <div>
                <p className="text-xs text-muted-foreground">Total Investment</p>
                <p className="text-xl font-bold text-danger">{fmt(result.totalCost)}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Expected Revenue</p>
                <p className="text-xl font-bold text-primary">{fmt(result.revenue)}</p>
              </div>
              <div className="border-t border-border pt-3">
                <p className="text-xs text-muted-foreground">Net Profit</p>
                <p className={`text-3xl font-extrabold ${result.profit >= 0 ? 'text-success' : 'text-danger'}`}>{fmt(result.profit)}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">ROI</p>
                <p className={`text-lg font-bold ${result.roi >= 0 ? 'text-success' : 'text-danger'}`}>{result.roi}%</p>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-4">
            <h3 className="text-sm font-semibold mb-3">Cost Breakdown</h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={result.costBreakdown} layout="vertical">
                <XAxis type="number" tick={{ fontSize: 10 }} />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 10 }} width={70} />
                <Tooltip formatter={(v: number) => fmt(v)} />
                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                  {result.costBreakdown.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}
