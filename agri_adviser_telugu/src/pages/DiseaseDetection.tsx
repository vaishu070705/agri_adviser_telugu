import React, { useState } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { useFarmer } from '@/contexts/FarmerContext';
import { predictDisease } from '@/lib/mockPredictions';
import { logDiseasePrediction } from '@/services/activityLogService';

export default function DiseaseDetection() {
  const { t, language } = useTranslation();
  const { setDiseaseResult, diseaseResult, farmer } = useFarmer();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [lowQuality, setLowQuality] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Clear previous result immediately on new upload
    setDiseaseResult(null);
    setImagePreview(null);
    setLowQuality(false);

    const reader = new FileReader();
    reader.onload = () => {
      const data = reader.result as string;
      setImagePreview(data);

      // Run prediction immediately — deterministic based on image content
      const result = predictDisease(data);
      setDiseaseResult({ ...result, id: Date.now().toString(), farmerId: farmer?.id || '', createdAt: new Date().toISOString() });
      logDiseasePrediction(farmer?.id || null, result.disease, result.severity, result.confidence);

      // Deterministic quality flag based on file size
      setLowQuality(file.size < 50000);
    };
    reader.readAsDataURL(file);
  };

  // Analyze button kept for manual re-confirmation

  const severityPercent = diseaseResult?.severity === 'Severe' ? 90 : diseaseResult?.severity === 'Moderate' ? 55 : 25;
  const severityColor = diseaseResult?.severity === 'Severe' ? 'bg-danger' : diseaseResult?.severity === 'Moderate' ? 'bg-warning' : 'bg-success';

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-foreground mb-1">{t('disease.title')}</h1>
      <p className="text-sm text-muted-foreground mb-6">{t('disease.subtitle')}</p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card border border-border rounded-lg p-5 space-y-4">
          <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
            {imagePreview ? (
              <img src={imagePreview} alt="Uploaded crop" className="max-h-48 mx-auto rounded-lg object-cover" />
            ) : (
              <div className="text-muted-foreground">
                <p className="text-sm">📷 {t('disease.upload')}</p>
                <p className="text-xs mt-1">JPG, PNG supported</p>
              </div>
            )}
            <input type="file" accept="image/*" onChange={handleImageUpload} className="mt-3 text-xs text-foreground" />
          </div>

          {lowQuality && (
            <div className="bg-warning/10 border border-warning rounded-lg p-3 text-xs text-warning-foreground">
              {t('disease.qualityWarning')}
            </div>
          )}

          <button onClick={() => {
            if (imagePreview) {
              setDiseaseResult(null);
              const result = predictDisease(imagePreview);
              setDiseaseResult({ ...result, id: Date.now().toString(), farmerId: farmer?.id || '', createdAt: new Date().toISOString() });
              logDiseasePrediction(farmer?.id || null, result.disease, result.severity, result.confidence);
            }
          }} disabled={!imagePreview} className="w-full py-2.5 rounded-md bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 disabled:opacity-50">
            {t('common.analyze')}
          </button>
        </div>

        {diseaseResult && diseaseResult.disease !== 'No image provided' && (
          <div className="space-y-4">
            <div className={`rounded-lg p-5 border-2 bg-card ${diseaseResult.severity === 'Severe' ? 'border-danger' : diseaseResult.severity === 'Moderate' ? 'border-warning' : 'border-success'}`}>
              <h3 className="text-sm font-medium text-muted-foreground">{t('common.result')}</h3>
              <p className="text-2xl font-bold text-foreground mt-1">{diseaseResult.disease}</p>
              <div className="flex gap-3 mt-3">
                <span className="px-3 py-1 rounded-full bg-accent text-accent-foreground text-xs font-medium">
                  {t('common.confidence')}: {diseaseResult.confidence}%
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${diseaseResult.severity === 'Severe' ? 'bg-danger text-danger-foreground' : diseaseResult.severity === 'Moderate' ? 'bg-warning text-warning-foreground' : 'bg-success text-success-foreground'}`}>
                  {t('disease.severity')}: {diseaseResult.severity}
                </span>
              </div>
            </div>

            <div className="bg-card border border-border rounded-lg p-4">
              <h4 className="text-sm font-semibold mb-2">{t('disease.severity')}</h4>
              <div className="w-full bg-muted rounded-full h-4 overflow-hidden">
                <div className={`h-full rounded-full transition-all duration-500 ${severityColor}`} style={{ width: `${severityPercent}%` }} />
              </div>
              <p className="text-xs text-muted-foreground mt-1">{severityPercent}% severity</p>
            </div>

            <div className="bg-card border border-border rounded-lg p-4">
              <h4 className="text-sm font-semibold mb-2">{t('disease.treatment')}</h4>
              <ul className="space-y-1.5">
                {diseaseResult.treatments.map((step, i) => (
                  <li key={i} className="text-xs text-foreground flex gap-2">
                    <span className="text-primary font-bold">{i + 1}.</span> {step}
                  </li>
                ))}
              </ul>
            </div>

            {language === 'te' && (
              <div className="bg-accent border border-border rounded-lg p-4">
                <h4 className="text-sm font-semibold mb-1 telugu-text">{t('common.teluguSummary')}</h4>
                <p className="text-xs telugu-text text-accent-foreground">
                  వ్యాధి: {diseaseResult.disease}. నమ్మకం: {diseaseResult.confidence}%.
                  తీవ్రత: {diseaseResult.severity === 'Severe' ? 'తీవ్రమైన' : diseaseResult.severity === 'Moderate' ? 'మధ్యస్థం' : 'తేలిక'}.
                  దయచేసి చికిత్స దశలను అనుసరించండి.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
