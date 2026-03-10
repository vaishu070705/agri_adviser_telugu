// ============================================================
// Fertilizer & Pesticide Service
// ============================================================

import { FertilizerRecommendation, PesticideRecommendation } from '@/models/types';

export function getFertilizerRecommendation(
  crop: string, soilType: string, nitrogen: number, phosphorus: number, potassium: number,
): FertilizerRecommendation[] {
  const recommendations: FertilizerRecommendation[] = [];

  if (nitrogen < 50) recommendations.push({ name: 'Urea', dosage: `${Math.round((50 - nitrogen) * 2)}kg/acre`, reason: 'Low nitrogen levels' });
  if (phosphorus < 30) recommendations.push({ name: 'DAP (Di-Ammonium Phosphate)', dosage: `${Math.round((30 - phosphorus) * 1.5)}kg/acre`, reason: 'Low phosphorus levels' });
  if (potassium < 30) recommendations.push({ name: 'MOP (Muriate of Potash)', dosage: `${Math.round((30 - potassium) * 1.5)}kg/acre`, reason: 'Low potassium levels' });

  if (recommendations.length === 0) {
    recommendations.push({ name: 'Vermicompost', dosage: '2 tons/acre', reason: 'Maintain soil health' });
  }

  recommendations.push({ name: 'Neem Cake', dosage: '200kg/acre', reason: 'Organic supplement for soil conditioning' });
  return recommendations;
}

// ============================================================
// Disease-to-Treatment Mapping Database
// ============================================================

const DISEASE_TREATMENT_MAP: Record<string, PesticideRecommendation> = {
  'Leaf Blight': {
    disease: 'Leaf Blight',
    isHealthy: false,
    chemical: 'Mancozeb 75% WP',
    dosagePerLiter: '2–2.5 g per liter',
    sprayInterval: 'Every 7–10 days',
    precautions: [
      'Avoid spraying during high temperature',
      'Wear protective gloves',
      'Do not spray during flowering stage',
    ],
    organicAlternative: 'Neem oil 3 ml per liter',
    preventionTips: [
      'Improve air circulation between plants',
      'Avoid overhead irrigation',
      'Remove and destroy infected leaves promptly',
    ],
  },
  'Rust': {
    disease: 'Rust',
    isHealthy: false,
    chemical: 'Propiconazole 25% EC',
    dosagePerLiter: '1 ml per liter',
    sprayInterval: 'Every 10–12 days',
    precautions: [
      'Spray in early morning or late evening',
      'Avoid mixing with incompatible chemicals',
      'Do not exceed 3 sprays per season',
    ],
    organicAlternative: 'Wettable sulfur 3 g per liter',
    preventionTips: [
      'Remove infected leaves immediately',
      'Avoid excessive nitrogen fertilization',
      'Use resistant crop varieties',
    ],
  },
  'Powdery Mildew': {
    disease: 'Powdery Mildew',
    isHealthy: false,
    chemical: 'Sulfur fungicide (Sulfur 80% WP)',
    dosagePerLiter: '2 g per liter',
    sprayInterval: 'Every 7 days',
    precautions: [
      'Avoid spraying during hot weather (>35°C)',
      'Keep away from eyes and skin',
      'Maximum 3 sprays per season',
    ],
    organicAlternative: 'Baking soda spray (5 g per liter + soap)',
    preventionTips: [
      'Increase plant spacing for airflow',
      'Avoid overhead watering',
      'Remove heavily infected plant parts',
    ],
  },
  'Early Blight': {
    disease: 'Early Blight',
    isHealthy: false,
    chemical: 'Chlorothalonil 75% WP',
    dosagePerLiter: '2 g per liter',
    sprayInterval: 'Every 7 days',
    precautions: [
      'Wear protective gear during application',
      'Do not apply near water sources',
      'Observe pre-harvest interval of 7 days',
    ],
    organicAlternative: 'Compost tea foliar spray',
    preventionTips: [
      'Practice crop rotation (3-year cycle)',
      'Remove lower infected leaves early',
      'Mulch around plants to prevent soil splash',
    ],
  },
  'Late Blight': {
    disease: 'Late Blight',
    isHealthy: false,
    chemical: 'Metalaxyl 8% + Mancozeb 64% WP',
    dosagePerLiter: '2.5 g per liter',
    sprayInterval: 'Every 5–7 days',
    precautions: [
      'Apply preventively before symptoms appear',
      'Alternate with contact fungicides',
      'Do not spray in windy conditions',
    ],
    organicAlternative: 'Copper fungicide (Bordeaux mixture) 1%',
    preventionTips: [
      'Avoid planting in poorly drained fields',
      'Destroy infected plant debris after harvest',
      'Use certified disease-free seeds',
    ],
  },
  'Bacterial Spot': {
    disease: 'Bacterial Spot',
    isHealthy: false,
    chemical: 'Copper-based bactericide (Copper Hydroxide)',
    dosagePerLiter: '2 g per liter',
    sprayInterval: 'Every 7–10 days',
    precautions: [
      'Do not mix with alkaline chemicals',
      'Spray before rain events if possible',
      'Avoid copper buildup in soil with excessive use',
    ],
    organicAlternative: 'Neem oil 5 ml + Garlic extract 10 ml per liter',
    preventionTips: [
      'Use disease-free transplants',
      'Avoid working in wet fields',
      'Disinfect tools between plants',
    ],
  },
  'Bacterial Wilt': {
    disease: 'Bacterial Wilt',
    isHealthy: false,
    chemical: 'Streptocycline (Streptomycin sulfate)',
    dosagePerLiter: '0.5 g per liter',
    sprayInterval: 'Every 7–10 days (soil drench + foliar)',
    precautions: [
      'Apply at early infection stage only',
      'Do not mix with other pesticides',
      'Use as soil drench for best results',
    ],
    organicAlternative: 'Pseudomonas fluorescens bio-agent 10 g per liter',
    preventionTips: [
      'Rotate with non-host crops for 3 years',
      'Improve field drainage',
      'Remove and destroy infected plants immediately',
    ],
  },
  'Anthracnose': {
    disease: 'Anthracnose',
    isHealthy: false,
    chemical: 'Carbendazim 50% WP',
    dosagePerLiter: '1 g per liter',
    sprayInterval: 'Every 7–14 days',
    precautions: [
      'Do not exceed recommended dosage',
      'Avoid spraying during rainfall',
      'Wear mask and gloves during application',
    ],
    organicAlternative: 'Trichoderma viride solution 5 g per liter',
    preventionTips: [
      'Prune and destroy infected plant parts',
      'Avoid overhead irrigation',
      'Apply copper-based fungicide preventively',
    ],
  },
  'Mosaic Virus': {
    disease: 'Mosaic Virus',
    isHealthy: false,
    chemical: 'No chemical cure available',
    dosagePerLiter: 'N/A',
    sprayInterval: 'N/A — manage vectors instead',
    precautions: [
      'Remove and destroy infected plants immediately',
      'Control aphid/whitefly vectors with Imidacloprid 0.3 ml/L',
      'Disinfect tools with bleach solution between plants',
    ],
    organicAlternative: 'Neem oil 5 ml per liter for vector control',
    preventionTips: [
      'Use virus-free certified seeds/seedlings',
      'Install yellow sticky traps for vector monitoring',
      'Maintain field hygiene — remove weed hosts',
    ],
  },
  'Downy Mildew': {
    disease: 'Downy Mildew',
    isHealthy: false,
    chemical: 'Ridomil Gold (Metalaxyl-M 4% + Mancozeb 64%)',
    dosagePerLiter: '2.5 g per liter',
    sprayInterval: 'Every 7 days',
    precautions: [
      'Apply as preventive spray before symptoms',
      'Alternate with contact fungicides to prevent resistance',
      'Avoid spraying in direct sunlight',
    ],
    organicAlternative: 'Potassium bicarbonate 5 g per liter',
    preventionTips: [
      'Ensure good air circulation',
      'Avoid excessive watering',
      'Remove infected leaves immediately',
    ],
  },
  'Healthy': {
    disease: 'Healthy',
    isHealthy: true,
    chemical: 'No pesticide required',
    dosagePerLiter: 'N/A',
    sprayInterval: 'N/A',
    precautions: [],
    organicAlternative: 'N/A',
    preventionTips: [
      'Continue balanced fertilization schedule',
      'Monitor crops regularly for early signs of disease',
      'Maintain proper irrigation and drainage',
      'Practice crop rotation for long-term soil health',
    ],
  },
};

export function getPesticideRecommendation(disease: string): PesticideRecommendation | null {
  if (!disease) return null;

  // Exact match first
  if (DISEASE_TREATMENT_MAP[disease]) {
    return { ...DISEASE_TREATMENT_MAP[disease] };
  }

  // Case-insensitive lookup
  const key = Object.keys(DISEASE_TREATMENT_MAP).find(
    k => k.toLowerCase() === disease.toLowerCase()
  );
  if (key) {
    return { ...DISEASE_TREATMENT_MAP[key] };
  }

  // No generic fallback — return null if disease not in map
  return null;
}

export function getAllSupportedDiseases(): string[] {
  return Object.keys(DISEASE_TREATMENT_MAP);
}
