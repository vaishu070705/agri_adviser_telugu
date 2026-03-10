import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTranslation } from '@/hooks/useTranslation';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  UserPlus, Sprout, Bug, BarChart3, Heart, DollarSign,
  Bell, FileText, LayoutDashboard, Users, Droplets, Shield, TrendingUp, Globe, Menu, X
} from 'lucide-react';
import { useState } from 'react';

const navItems = [
  { path: '/', icon: UserPlus, label: 'nav.registration' },
  { path: '/crop-recommendation', icon: Sprout, label: 'nav.cropRecommendation' },
  { path: '/fertilizer-advisor', icon: Droplets, label: 'nav.fertilizerAdvisor' },
  { path: '/disease-detection', icon: Bug, label: 'nav.diseaseDetection' },
  { path: '/pesticide-recommendation', icon: Shield, label: 'nav.pesticideRecommendation' },
  { path: '/yield-prediction', icon: BarChart3, label: 'nav.yieldPrediction' },
  { path: '/health-score', icon: Heart, label: 'nav.healthScore' },
  { path: '/farm-economics', icon: DollarSign, label: 'nav.farmEconomics' },
  { path: '/profit-estimation', icon: TrendingUp, label: 'nav.profitEstimation' },
  { path: '/alerts', icon: Bell, label: 'nav.alerts' },
  { path: '/reports', icon: FileText, label: 'nav.reports' },
  { path: '/workers', icon: Users, label: 'nav.workers' },
  { path: '/admin', icon: LayoutDashboard, label: 'nav.admin' },
];

export default function Sidebar() {
  const { t } = useTranslation();
  const { language, setLanguage } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Mobile toggle */}
      <button
        className="fixed top-4 left-4 z-50 md:hidden p-2 rounded-lg bg-sidebar text-sidebar-foreground"
        onClick={() => setOpen(!open)}
      >
        {open ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Overlay */}
      {open && <div className="fixed inset-0 z-30 bg-foreground/30 md:hidden" onClick={() => setOpen(false)} />}

      <aside className={`fixed top-0 left-0 z-40 h-full w-64 bg-sidebar text-sidebar-foreground flex flex-col transition-transform duration-200 ${open ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
        {/* Header */}
        <div className="p-4 border-b border-sidebar-border">
          <div className="flex items-center gap-2 mb-1">
            <Sprout className="text-sidebar-primary" size={24} />
            <h1 className="text-sm font-bold text-sidebar-primary">AgriAdvisory AI</h1>
          </div>
          <p className="text-[10px] text-sidebar-foreground/70 leading-tight">
            {language === 'te' ? 'AI ఆధారిత ప్రాంతీయ వ్యవసాయ మేధస్సు' : 'AI-Based Regional Agricultural Intelligence'}
          </p>
          <p className="text-[10px] text-sidebar-foreground/60">
            {language === 'te' ? '(తెలంగాణ & ఆంధ్రప్రదేశ్)' : '(Telangana & Andhra Pradesh)'}
          </p>
        </div>

        {/* Language toggle */}
        <div className="px-4 py-2 border-b border-sidebar-border">
          <div className="flex items-center gap-2 text-xs">
            <Globe size={14} />
            <button
              onClick={() => setLanguage(language === 'en' ? 'te' : 'en')}
              className="flex items-center gap-1 px-2 py-1 rounded bg-sidebar-accent text-sidebar-accent-foreground text-xs hover:bg-sidebar-primary hover:text-sidebar-primary-foreground transition-colors"
            >
              {language === 'en' ? '🇮🇳 తెలుగు' : '🇬🇧 English'}
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-2">
          {navItems.map(({ path, icon: Icon, label }) => {
            const active = location.pathname === path;
            return (
              <button
                key={path}
                onClick={() => { navigate(path); setOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-2.5 text-xs font-medium transition-colors ${
                  active
                    ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                    : 'text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                }`}
              >
                <Icon size={16} />
                <span>{t(label)}</span>
              </button>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
