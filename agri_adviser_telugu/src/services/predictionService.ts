// ============================================================
// Prediction Service — encapsulates all ML prediction logic
// Placeholder hooks ready for real model integration
// ============================================================

import { CropResult, DiseaseResult, YieldResult, HealthResult } from '@/models/types';
import { dataStore } from '@/store/dataStore';

export interface CropInputs {
  nitrogen: number;
  phosphorus: number;
  potassium: number;
  ph: number;
  temperature: number;
  humidity: number;
  rainfall: number;
  season: string;
}

export interface YieldInputs {
  crop: string;
  landSize: number;
  soilType: string;
  season: string;
  region: string;
}

export function predictCrop(inputs: CropInputs, farmerId: string): CropResult {
  const { nitrogen, phosphorus, potassium, ph, temperature, humidity, rainfall, season } = inputs;

  // Rule-based mock — replace with real ML model
  let crop = 'Rice';
  let confidence = 85;
  let risk = 'Low';

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

  const result: CropResult = {
    id: dataStore.generateId(),
    farmerId,
    crop,
    confidence,
    risk,
    factors,
    createdAt: new Date().toISOString(),
  };

  dataStore.addCropResult(result);
  return result;
}

export function predictDisease(hasImage: boolean, farmerId: string): DiseaseResult {
  if (!hasImage) {
    return { id: '', farmerId, disease: 'No image provided', confidence: 0, severity: 'N/A', treatments: [], createdAt: '' };
  }

  const diseases = [
    { disease: 'Leaf Blight', confidence: 89, severity: 'Moderate', treatments: [
      'Apply Mancozeb 75% WP @ 2.5g/L', 'Remove infected leaves immediately',
      'Ensure proper spacing between plants', 'Apply Trichoderma viride as bio-control'
    ]},
    { disease: 'Powdery Mildew', confidence: 82, severity: 'Mild', treatments: [
      'Spray Sulfur dust @ 25kg/ha', 'Apply Karathane @ 1ml/L',
      'Improve air circulation', 'Avoid overhead irrigation'
    ]},
    { disease: 'Bacterial Wilt', confidence: 76, severity: 'Severe', treatments: [
      'Remove and destroy infected plants', 'Apply Streptocycline @ 0.5g/L',
      'Rotate with non-host crops', 'Use disease-free seeds', 'Improve drainage system'
    ]},
  ];

  // Deterministic selection based on a simple hash of farmerId
  const hash = farmerId.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const picked = diseases[hash % diseases.length];
  const result: DiseaseResult = {
    id: dataStore.generateId(),
    farmerId,
    ...picked,
    createdAt: new Date().toISOString(),
  };

  dataStore.addDiseaseResult(result);
  return result;
}

export function predictYield(inputs: YieldInputs, farmerId: string): YieldResult {
  const { crop, landSize, soilType } = inputs;

  const baseYields: Record<string, number> = {
    'Rice': 25, 'Cotton': 8, 'Maize': 30, 'Groundnut': 12, 'Chilli': 10,
    'Turmeric': 20, 'Sugarcane': 350, 'Jowar': 15, 'Bajra': 12, 'Sunflower': 8,
    'Tomato': 200, 'Onion': 150, 'Pulses': 8, 'Tobacco': 15, 'Mango': 60,
  };

  const base = (baseYields[crop] || 20) * landSize;
  const soilMultiplier = soilType === 'Black Cotton' ? 1.1 : soilType === 'Alluvial' ? 1.15 : 0.95;
  const estimated = Math.round(base * soilMultiplier);
  const low = Math.round(estimated * 0.8);
  const high = Math.round(estimated * 1.2);
  const confidence = Math.floor(70 + Math.random() * 20);
  const risk = confidence > 85 ? 'Low' : confidence > 75 ? 'Medium' : 'High';

  const result: YieldResult = {
    id: dataStore.generateId(),
    farmerId,
    estimatedYield: estimated,
    yieldRange: [low, high],
    risk,
    confidence,
    crop,
    createdAt: new Date().toISOString(),
  };

  dataStore.addYieldResult(result);
  return result;
}

export function calculateHealthScore(
  diseaseResult: DiseaseResult | null,
  cropResult: CropResult | null,
  yieldResult: YieldResult | null,
  farmerId: string,
): HealthResult {
  let diseaseImpact = 90;
  let nutrientImpact = 85;
  let yieldImpact = 80;

  if (diseaseResult) {
    diseaseImpact = diseaseResult.severity === 'Severe' ? 30 : diseaseResult.severity === 'Moderate' ? 60 : 85;
  }
  if (cropResult) {
    nutrientImpact = cropResult.risk === 'High' ? 40 : cropResult.risk === 'Medium' ? 65 : 90;
  }
  if (yieldResult) {
    yieldImpact = yieldResult.risk === 'High' ? 35 : yieldResult.risk === 'Medium' ? 60 : 85;
  }

  const score = Math.round(diseaseImpact * 0.4 + nutrientImpact * 0.3 + yieldImpact * 0.3);
  const result: HealthResult = {
    id: dataStore.generateId(),
    farmerId,
    score,
    diseaseImpact,
    nutrientImpact,
    yieldImpact,
    createdAt: new Date().toISOString(),
  };

  dataStore.addHealthResult(result);
  return result;
}
