import React from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { Sprout } from 'lucide-react';

export default function Footer() {
  const { t } = useTranslation();
  return (
    <footer className="border-t border-border bg-card px-6 py-4 text-center">
      <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
        <Sprout size={16} className="text-primary" />
        <span>{t('footer.builtBy')}</span>
      </div>
    </footer>
  );
}
