import React, { useState } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { useFarmer } from '@/contexts/FarmerContext';
import { stateDistricts, soilTypes } from '@/data/districts';
import { toast } from 'sonner';

export default function Registration() {
  const { t } = useTranslation();
  const { registerFarmer } = useFarmer();
  const [form, setForm] = useState({
    name: '', state: '', district: '', mandal: '', landSize: '',
    soilType: '', email: '', phone: '', preferredLanguage: 'English'
  });
  const [submitting, setSubmitting] = useState(false);

  const districts = form.state ? stateDistricts[form.state] || [] : [];

  const update = (field: string, value: string) => setForm(prev => ({ ...prev, [field]: value }));

  const validate = () => {
    if (!form.name || !form.state || !form.district || !form.email || !form.phone) {
      toast.error('Please fill all required fields');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      toast.error('Invalid email format');
      return false;
    }
    if (form.phone.length !== 10 || !/^\d+$/.test(form.phone)) {
      toast.error('Phone number must be 10 digits');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setSubmitting(true);
    try {
      await registerFarmer({
        name: form.name, state: form.state, district: form.district,
        mandal: form.mandal, landSize: parseFloat(form.landSize) || 0,
        soilType: form.soilType, email: form.email, phone: form.phone,
        preferredLanguage: form.preferredLanguage,
      });
      toast.success(t('reg.success'));
      setForm({ name: '', state: '', district: '', mandal: '', landSize: '', soilType: '', email: '', phone: '', preferredLanguage: 'English' });
    } catch (err: any) {
      toast.error(err.message || 'Registration failed');
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass = "w-full px-3 py-2 rounded-md border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring";
  const labelClass = "block text-sm font-medium text-foreground mb-1";

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">{t('reg.title')}</h1>
        <p className="text-sm text-muted-foreground mt-1">{t('reg.subtitle')}</p>
      </div>

      <div className="bg-card border border-border rounded-lg p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>{t('common.name')} *</label>
            <input className={inputClass} value={form.name} onChange={e => update('name', e.target.value)} placeholder="Enter name" />
          </div>
          <div>
            <label className={labelClass}>{t('common.state')} *</label>
            <select className={inputClass} value={form.state} onChange={e => { update('state', e.target.value); update('district', ''); }}>
              <option value="">Select State</option>
              <option>Telangana</option>
              <option>Andhra Pradesh</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>{t('common.district')} *</label>
            <select className={inputClass} value={form.district} onChange={e => update('district', e.target.value)} disabled={!form.state}>
              <option value="">Select District</option>
              {districts.map(d => <option key={d}>{d}</option>)}
            </select>
          </div>
          <div>
            <label className={labelClass}>{t('common.mandal')}</label>
            <input className={inputClass} value={form.mandal} onChange={e => update('mandal', e.target.value)} placeholder="Enter mandal" />
          </div>
          <div>
            <label className={labelClass}>{t('common.landSize')}</label>
            <input className={inputClass} type="number" value={form.landSize} onChange={e => update('landSize', e.target.value)} placeholder="e.g. 5" />
          </div>
          <div>
            <label className={labelClass}>{t('common.soilType')}</label>
            <select className={inputClass} value={form.soilType} onChange={e => update('soilType', e.target.value)}>
              <option value="">Select Soil Type</option>
              {soilTypes.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className={labelClass}>{t('common.email')} *</label>
            <input className={inputClass} type="email" value={form.email} onChange={e => update('email', e.target.value)} placeholder="farmer@example.com" />
          </div>
          <div>
            <label className={labelClass}>{t('common.phone')} *</label>
            <input className={inputClass} value={form.phone} onChange={e => update('phone', e.target.value)} placeholder="9876543210" maxLength={10} />
          </div>
          <div>
            <label className={labelClass}>{t('reg.prefLanguage')}</label>
            <select className={inputClass} value={form.preferredLanguage} onChange={e => update('preferredLanguage', e.target.value)}>
              <option>English</option>
              <option>Telugu</option>
            </select>
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="w-full py-2.5 rounded-md bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {submitting ? 'Registering...' : t('common.submit')}
        </button>
      </div>
    </div>
  );
}
