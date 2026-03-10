// ============================================================
// Mock prediction functions — LEGACY compatibility layer
// New code should use services directly instead.
// ============================================================

import type { FertilizerRecommendation, PesticideRecommendation } from '@/models/types';
import { getFertilizerRecommendation, getPesticideRecommendation } from '@/services/fertilizerService';

// Simple result types for pages that call these directly
export interface SimpleCropResult {
  crop: string;
  confidence: number;
  risk: string;
  factors: string[];
}

export interface SimpleDiseaseResult {
  disease: string;
  confidence: number;
  severity: string;
  treatments: string[];
}

export interface SimpleYieldResult {
  estimatedYield: number;
  yieldRange: [number, number];
  risk: string;
  confidence: number;
}

export interface SimpleHealthResult {
  score: number;
  diseaseImpact: number;
  nutrientImpact: number;
  yieldImpact: number;
}

export interface SimpleEconomicsResult {
  totalCost: number;
  revenue: number;
  profit: number;
  profitRisk: string;
}

export function predictCrop(inputs: {
  nitrogen: number; phosphorus: number; potassium: number;
  ph: number; temperature: number; humidity: number; rainfall: number; season: string;
}): SimpleCropResult {
  const { nitrogen, phosphorus, potassium, ph, temperature, humidity, rainfall, season } = inputs;
  let crop = 'Rice', confidence = 85, risk = 'Low';

  if (nitrogen > 80 && rainfall > 200) { crop = 'Rice'; confidence = 92; risk = 'Low'; }
  else if (temperature > 30 && humidity < 60) { crop = 'Cotton'; confidence = 87; risk = 'Medium'; }
  else if (potassium > 40 && ph > 6) { crop = 'Maize'; confidence = 78; risk = 'Low'; }
  else if (ph < 6 && rainfall < 100) { crop = 'Groundnut'; confidence = 82; risk = 'Medium'; }
  else if (season === 'Rabi') { crop = 'Chilli'; confidence = 80; risk = 'Low'; }
  else { crop = 'Turmeric'; confidence = 75; risk = 'Medium'; }

  const factors = [
    `Nitrogen level: ${nitrogen} (${nitrogen > 50 ? 'Adequate' : 'Low'})`,
    `Rainfall: ${rainfall}mm (${rainfall > 150 ? 'Sufficient' : 'May need irrigation'})`,
    `Soil pH: ${ph} (${ph > 5.5 && ph < 7.5 ? 'Optimal' : 'Needs adjustment'})`,
  ];
  return { crop, confidence, risk, factors };
}

/**
 * Deterministic disease prediction based on image content hash.
 * Same image data always produces the same result. Different images produce different results.
 */
export function predictDisease(imageDataUrl: string | null): SimpleDiseaseResult {
  if (!imageDataUrl) return { disease: 'No image provided', confidence: 0, severity: 'N/A', treatments: [] };

  const diseases: SimpleDiseaseResult[] = [
    { disease: 'Leaf Blight', confidence: 89, severity: 'Moderate', treatments: ['Apply Mancozeb 75% WP @ 2.5g/L', 'Remove infected leaves immediately', 'Ensure proper spacing between plants', 'Apply Trichoderma viride as bio-control'] },
    { disease: 'Powdery Mildew', confidence: 82, severity: 'Mild', treatments: ['Spray Sulfur dust @ 25kg/ha', 'Apply Karathane @ 1ml/L', 'Improve air circulation', 'Avoid overhead irrigation'] },
    { disease: 'Bacterial Wilt', confidence: 76, severity: 'Severe', treatments: ['Remove and destroy infected plants', 'Apply Streptocycline @ 0.5g/L', 'Rotate with non-host crops', 'Use disease-free seeds', 'Improve drainage system'] },
    { disease: 'Rust', confidence: 84, severity: 'Moderate', treatments: ['Apply Propiconazole 25% EC @ 1ml/L', 'Remove infected plant debris', 'Use resistant varieties', 'Avoid excessive nitrogen fertilization'] },
    { disease: 'Anthracnose', confidence: 80, severity: 'Severe', treatments: ['Spray Carbendazim 50% WP @ 1g/L', 'Prune and destroy infected parts', 'Avoid overhead irrigation', 'Apply copper-based fungicide preventively'] },
    { disease: 'Mosaic Virus', confidence: 74, severity: 'Severe', treatments: ['Remove and destroy infected plants immediately', 'Control aphid vectors with Imidacloprid', 'Use virus-free certified seeds', 'Disinfect tools between plants'] },
  ];

  // Robust hash: sample across entire image data for strong differentiation
  const data = imageDataUrl;
  const len = data.length;
  let hash = 5381;
  const sampleSize = Math.min(len, 2000);
  const step = Math.max(1, Math.floor(len / sampleSize));
  for (let i = 0; i < len; i += step) {
    hash = ((hash << 5) + hash + data.charCodeAt(i)) | 0; // djb2 hash
  }
  hash = Math.abs(hash);

  // Simulate softmax-like confidence: pick highest "score" deterministically
  const index = hash % diseases.length;
  const result = { ...diseases[index] };
  // Adjust confidence slightly based on hash for realism (but deterministically)
  result.confidence = diseases[index].confidence + (hash % 7) - 3;
  return result;
}

export function predictYield(inputs: { crop: string; landSize: number; soilType: string; season: string; region: string; }): SimpleYieldResult {
  const { crop, landSize, soilType } = inputs;
  const baseYields: Record<string, number> = { 'Rice': 25, 'Cotton': 8, 'Maize': 30, 'Groundnut': 12, 'Chilli': 10, 'Turmeric': 20, 'Sugarcane': 350, 'Jowar': 15, 'Bajra': 12, 'Sunflower': 8, 'Tomato': 200, 'Onion': 150, 'Pulses': 8, 'Tobacco': 15, 'Mango': 60 };
  const base = (baseYields[crop] || 20) * landSize;
  const soilMultiplier = soilType === 'Black Cotton' ? 1.1 : soilType === 'Alluvial' ? 1.15 : 0.95;
  const estimated = Math.round(base * soilMultiplier);
  const confidence = Math.floor(70 + Math.random() * 20);
  const risk = confidence > 85 ? 'Low' : confidence > 75 ? 'Medium' : 'High';
  return { estimatedYield: estimated, yieldRange: [Math.round(estimated * 0.8), Math.round(estimated * 1.2)], risk, confidence };
}

export function calculateHealthScore(d: SimpleDiseaseResult | null, c: SimpleCropResult | null, y: SimpleYieldResult | null): SimpleHealthResult {
  let diseaseImpact = 90, nutrientImpact = 85, yieldImpact = 80;
  if (d) diseaseImpact = d.severity === 'Severe' ? 30 : d.severity === 'Moderate' ? 60 : 85;
  if (c) nutrientImpact = c.risk === 'High' ? 40 : c.risk === 'Medium' ? 65 : 90;
  if (y) yieldImpact = y.risk === 'High' ? 35 : y.risk === 'Medium' ? 60 : 85;
  const score = Math.round(diseaseImpact * 0.4 + nutrientImpact * 0.3 + yieldImpact * 0.3);
  return { score, diseaseImpact, nutrientImpact, yieldImpact };
}

export function calculateEconomics(inputs: { crop: string; landSize: number; estimatedYield: number; fertilizerCost: number; laborCost: number; irrigationCost: number; }): SimpleEconomicsResult {
  const cropPrices: Record<string, number> = { 'Rice': 2040, 'Cotton': 6620, 'Maize': 2090, 'Groundnut': 5850, 'Chilli': 8000, 'Turmeric': 7500, 'Sugarcane': 315, 'Jowar': 2970, 'Bajra': 2350, 'Sunflower': 6400, 'Tomato': 1500, 'Onion': 2000, 'Pulses': 6300, 'Tobacco': 5000, 'Mango': 4000 };
  const pricePerQuintal = cropPrices[inputs.crop] || 3000;
  const totalCost = inputs.fertilizerCost + inputs.laborCost + inputs.irrigationCost;
  const revenue = Math.round(inputs.estimatedYield * pricePerQuintal);
  const profit = revenue - totalCost;
  const profitRisk = profit < 0 ? 'High' : profit < totalCost * 0.3 ? 'Medium' : 'Low';
  return { totalCost, revenue, profit, profitRisk };
}

export { getFertilizerRecommendation, getPesticideRecommendation } from '@/services/fertilizerService';
