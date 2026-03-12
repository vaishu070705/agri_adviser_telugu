import { useLanguage } from '@/contexts/LanguageContext';
import { translations, Language } from '@/data/translations';

export function useTranslation() {
  const { language } = useLanguage();
  
  const t = (key: string): string => {
    const entry = translations[key];
    if (!entry) return key;
    return entry[language] || entry['en'] || key;
  };

  const bilingual = (key: string): string => {
    const entry = translations[key];
    if (!entry) return key;
    if (language === 'te') return `${entry['te']} (${entry['en']})`;
    return `${entry['en']} / ${entry['te']}`;
  };

  return { t, bilingual, language };
}
