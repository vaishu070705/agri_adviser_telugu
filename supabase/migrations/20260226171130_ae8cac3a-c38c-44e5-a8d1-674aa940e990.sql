-- Activity logs for live admin analytics
CREATE TABLE IF NOT EXISTS public.crop_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  farmer_id UUID,
  crop TEXT NOT NULL,
  confidence NUMERIC,
  risk TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.disease_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  farmer_id UUID,
  disease TEXT NOT NULL,
  severity TEXT,
  confidence NUMERIC,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.yield_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  farmer_id UUID,
  predicted_yield NUMERIC,
  risk TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.fertilizer_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  farmer_id UUID,
  fertilizer TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  farmer_id UUID,
  alert_type TEXT NOT NULL,
  message TEXT NOT NULL,
  severity TEXT NOT NULL,
  source_disease TEXT,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.crop_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.disease_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.yield_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fertilizer_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alerts ENABLE ROW LEVEL SECURITY;

-- Public app policies (current app has no auth gates)
DROP POLICY IF EXISTS "Anyone can read crop logs" ON public.crop_logs;
DROP POLICY IF EXISTS "Anyone can insert crop logs" ON public.crop_logs;
CREATE POLICY "Anyone can read crop logs" ON public.crop_logs FOR SELECT USING (true);
CREATE POLICY "Anyone can insert crop logs" ON public.crop_logs FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Anyone can read disease logs" ON public.disease_logs;
DROP POLICY IF EXISTS "Anyone can insert disease logs" ON public.disease_logs;
CREATE POLICY "Anyone can read disease logs" ON public.disease_logs FOR SELECT USING (true);
CREATE POLICY "Anyone can insert disease logs" ON public.disease_logs FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Anyone can read yield logs" ON public.yield_logs;
DROP POLICY IF EXISTS "Anyone can insert yield logs" ON public.yield_logs;
CREATE POLICY "Anyone can read yield logs" ON public.yield_logs FOR SELECT USING (true);
CREATE POLICY "Anyone can insert yield logs" ON public.yield_logs FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Anyone can read fertilizer logs" ON public.fertilizer_logs;
DROP POLICY IF EXISTS "Anyone can insert fertilizer logs" ON public.fertilizer_logs;
CREATE POLICY "Anyone can read fertilizer logs" ON public.fertilizer_logs FOR SELECT USING (true);
CREATE POLICY "Anyone can insert fertilizer logs" ON public.fertilizer_logs FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Anyone can read alerts" ON public.alerts;
DROP POLICY IF EXISTS "Anyone can insert alerts" ON public.alerts;
DROP POLICY IF EXISTS "Anyone can update alerts" ON public.alerts;
CREATE POLICY "Anyone can read alerts" ON public.alerts FOR SELECT USING (true);
CREATE POLICY "Anyone can insert alerts" ON public.alerts FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update alerts" ON public.alerts FOR UPDATE USING (true);

CREATE INDEX IF NOT EXISTS idx_crop_logs_created_at ON public.crop_logs (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_crop_logs_farmer_id ON public.crop_logs (farmer_id);
CREATE INDEX IF NOT EXISTS idx_disease_logs_disease ON public.disease_logs (disease);
CREATE INDEX IF NOT EXISTS idx_disease_logs_severity ON public.disease_logs (severity);
CREATE INDEX IF NOT EXISTS idx_yield_logs_farmer_id ON public.yield_logs (farmer_id);
CREATE INDEX IF NOT EXISTS idx_alerts_status_created_at ON public.alerts (status, created_at DESC);