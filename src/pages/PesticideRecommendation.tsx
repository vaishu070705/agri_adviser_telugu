import React from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { useFarmer } from '@/contexts/FarmerContext';
import { getPesticideRecommendation } from '@/services/fertilizerService';

export default function PesticideRecommendation() {
  const { t, language } = useTranslation();
  const { diseaseResult } = useFarmer();

  const disease = diseaseResult?.disease || '';
  const recommendation = disease ? getPesticideRecommendation(disease) : null;

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-foreground mb-1">{t('pest.title')}</h1>
      <p className="text-sm text-muted-foreground mb-6">{t('pest.subtitle')}</p>

      {!diseaseResult ? (
        <div className="bg-card border border-border rounded-lg p-8 text-center text-muted-foreground">
          <p className="text-lg">🔬</p>
          <p className="text-sm mt-2">Please detect a disease first in the Disease Detection tab</p>
          <p className="text-xs telugu-text mt-1">దయచేసి ముందుగా వ్యాధి గుర్తింపు ట్యాబ్‌లో వ్యాధిని గుర్తించండి</p>
        </div>
      ) : !recommendation ? (
        <div className="bg-card border border-border rounded-lg p-8 text-center text-muted-foreground">
          <p className="text-lg">⚠️</p>
          <p className="text-sm mt-2">No treatment mapping found for "{disease}"</p>
        </div>
      ) : recommendation.isHealthy ? (
        /* ── Healthy plant ── */
        <div className="space-y-4">
          <div className="bg-success/10 border-2 border-success rounded-lg p-5">
            <div className="flex items-center gap-3">
              <span className="text-3xl">✅</span>
              <div>
                <h3 className="text-lg font-bold text-foreground">Plant is Healthy</h3>
                <p className="text-sm text-muted-foreground">No pesticide required</p>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-4">
            <h4 className="text-sm font-semibold text-foreground mb-2">🌱 Prevention Tips</h4>
            <ul className="space-y-1.5">
              {recommendation.preventionTips.map((tip, i) => (
                <li key={i} className="text-xs text-foreground flex gap-2">
                  <span className="text-primary font-bold">{i + 1}.</span> {tip}
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : (
        /* ── Disease detected ── */
        <>
          <div className="bg-destructive/10 border border-destructive rounded-lg p-4 mb-4">
            <p className="text-sm text-foreground">
              <span className="font-semibold">🔴 Detected Disease:</span> {recommendation.disease}
              {diseaseResult.severity && <span className="ml-2 text-xs text-muted-foreground">({diseaseResult.severity})</span>}
            </p>
          </div>

          <div className="space-y-3">
            {/* Chemical Treatment */}
            <div className="bg-card border border-border rounded-lg p-4">
              <div className="flex items-start gap-3">
                <span className="text-2xl">🧪</span>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground text-sm">Chemical Treatment</h3>
                  <p className="text-primary font-medium text-sm mt-1">{recommendation.chemical}</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2 text-xs">
                    <div>
                      <span className="text-muted-foreground">Dosage: </span>
                      <span className="text-foreground font-medium">{recommendation.dosagePerLiter}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Spray Interval: </span>
                      <span className="text-foreground font-medium">{recommendation.sprayInterval}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Safety Precautions */}
            <div className="bg-card border border-border rounded-lg p-4">
              <h4 className="text-sm font-semibold text-foreground mb-2">⚠️ Safety Precautions</h4>
              <ul className="space-y-1.5">
                {recommendation.precautions.map((p, i) => (
                  <li key={i} className="text-xs text-foreground flex gap-2">
                    <span className="text-warning font-bold">•</span> {p}
                  </li>
                ))}
              </ul>
            </div>

            {/* Organic Alternative */}
            <div className="bg-card border border-border rounded-lg p-4">
              <div className="flex items-start gap-3">
                <span className="text-2xl">🌿</span>
                <div>
                  <h3 className="font-semibold text-foreground text-sm">Organic Alternative</h3>
                  <p className="text-sm text-primary mt-1">{recommendation.organicAlternative}</p>
                </div>
              </div>
            </div>

            {/* Prevention Tips */}
            <div className="bg-card border border-border rounded-lg p-4">
              <h4 className="text-sm font-semibold text-foreground mb-2">🛡️ Prevention Tips</h4>
              <ul className="space-y-1.5">
                {recommendation.preventionTips.map((tip, i) => (
                  <li key={i} className="text-xs text-foreground flex gap-2">
                    <span className="text-primary font-bold">{i + 1}.</span> {tip}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {language === 'te' && (
            <div className="bg-accent border border-border rounded-lg p-4 mt-4">
              <h4 className="text-sm font-semibold telugu-text mb-1">{t('common.teluguSummary')}</h4>
              <p className="text-xs telugu-text text-accent-foreground">
                {recommendation.disease} వ్యాధికి సిఫార్సు: {recommendation.chemical} ({recommendation.dosagePerLiter}).
                సేంద్రీయ ప్రత్యామ్నాయం: {recommendation.organicAlternative}.
                దయచేసి భద్రతా సూచనలను పాటించండి.
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
