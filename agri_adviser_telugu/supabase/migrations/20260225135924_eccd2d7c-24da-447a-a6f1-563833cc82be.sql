
-- Create farmers table
CREATE TABLE public.farmers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  state TEXT NOT NULL,
  district TEXT NOT NULL,
  mandal TEXT DEFAULT '',
  land_size NUMERIC DEFAULT 0,
  soil_type TEXT DEFAULT '',
  email TEXT NOT NULL UNIQUE,
  phone TEXT NOT NULL,
  preferred_language TEXT DEFAULT 'English',
  registered_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create workers table
CREATE TABLE public.workers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT NOT NULL,
  skills TEXT[] DEFAULT '{}',
  available BOOLEAN DEFAULT true,
  district TEXT NOT NULL,
  level INTEGER DEFAULT 1,
  completed_tasks INTEGER DEFAULT 0,
  accuracy_rate INTEGER DEFAULT 100,
  assigned_tasks TEXT[] DEFAULT '{}',
  registered_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create worker_tasks table
CREATE TABLE public.worker_tasks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  difficulty INTEGER DEFAULT 1,
  required_level INTEGER DEFAULT 1,
  status TEXT DEFAULT 'pending',
  assigned_to UUID REFERENCES public.workers(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS on all tables
ALTER TABLE public.farmers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.worker_tasks ENABLE ROW LEVEL SECURITY;

-- Public access policies (no auth required for this app)
CREATE POLICY "Anyone can read farmers" ON public.farmers FOR SELECT USING (true);
CREATE POLICY "Anyone can insert farmers" ON public.farmers FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update farmers" ON public.farmers FOR UPDATE USING (true);

CREATE POLICY "Anyone can read workers" ON public.workers FOR SELECT USING (true);
CREATE POLICY "Anyone can insert workers" ON public.workers FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update workers" ON public.workers FOR UPDATE USING (true);

CREATE POLICY "Anyone can read tasks" ON public.worker_tasks FOR SELECT USING (true);
CREATE POLICY "Anyone can insert tasks" ON public.worker_tasks FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update tasks" ON public.worker_tasks FOR UPDATE USING (true);
