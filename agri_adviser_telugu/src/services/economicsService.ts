// ============================================================
// Economics Service — cost, revenue, profit, and ROI logic
// ============================================================

import { EconomicsResult } from '@/models/types';
import { dataStore } from '@/store/dataStore';

export interface EconomicsInputs {
  crop: string;
  landSize: number;
  estimatedYield: number;
  fertilizerCost: number;
  laborCost: number;
  irrigationCost: number;
}

export interface ProfitInputs {
  crop: string;
  landSize: number;
  estimatedYield: number;
  seedCost: number;
  fertCost: number;
  laborCost: number;
  irrigationCost: number;
  pesticideCost: number;
  transportCost: number;
}

// MSP / market prices — sourced dynamically in production
const CROP_PRICES: Record<string, number> = {
  'Rice': 2040, 'Cotton': 6620, 'Maize': 2090, 'Groundnut': 5850, 'Chilli': 8000,
  'Turmeric': 7500, 'Sugarcane': 315, 'Jowar': 2970, 'Bajra': 2350, 'Sunflower': 6400,
  'Tomato': 1500, 'Onion': 2000, 'Pulses': 6300, 'Tobacco': 5000, 'Mango': 4000,
};

export function getCropPrice(crop: string): number {
  return CROP_PRICES[crop] || 3000;
}

export function calculateEconomics(inputs: EconomicsInputs, farmerId: string): EconomicsResult {
  const pricePerQuintal = getCropPrice(inputs.crop);
  const totalCost = inputs.fertilizerCost + inputs.laborCost + inputs.irrigationCost;
  const revenue = Math.round(inputs.estimatedYield * pricePerQuintal);
  const profit = revenue - totalCost;
  const profitRisk = profit < 0 ? 'High' : profit < totalCost * 0.3 ? 'Medium' : 'Low';

  const result: EconomicsResult = {
    id: dataStore.generateId(),
    farmerId,
    totalCost,
    revenue,
    profit,
    profitRisk,
    crop: inputs.crop,
    createdAt: new Date().toISOString(),
  };

  dataStore.addEconomicsResult(result);
  return result;
}

export function calculateProfit(inputs: ProfitInputs) {
  const totalCost = inputs.seedCost + inputs.fertCost + inputs.laborCost +
    inputs.irrigationCost + inputs.pesticideCost + inputs.transportCost;
  const pricePerQ = getCropPrice(inputs.crop);
  const revenue = inputs.estimatedYield * pricePerQ;
  const profit = revenue - totalCost;
  const roi = totalCost > 0 ? Math.round((profit / totalCost) * 100) : 0;

  return {
    totalCost,
    revenue,
    profit,
    roi,
    costBreakdown: [
      { name: 'Seed', value: inputs.seedCost },
      { name: 'Fertilizer', value: inputs.fertCost },
      { name: 'Labor', value: inputs.laborCost },
      { name: 'Irrigation', value: inputs.irrigationCost },
      { name: 'Pesticide', value: inputs.pesticideCost },
      { name: 'Transport', value: inputs.transportCost },
    ],
  };
}
