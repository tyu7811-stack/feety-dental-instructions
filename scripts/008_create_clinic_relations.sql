-- Create clinic_relations table to track lab-clinic invitations
CREATE TABLE IF NOT EXISTS public.clinic_relations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lab_id UUID NOT NULL REFERENCES labs(id) ON DELETE CASCADE,
  clinic_email TEXT NOT NULL,
  clinic_name TEXT,
  clinic_phone TEXT,
  contact_person TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'cancelled')),
  invited_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  accepted_at TIMESTAMP WITH TIME ZONE,
  clinic_id UUID REFERENCES clinics(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(lab_id, clinic_email)
);

-- Enable RLS
ALTER TABLE public.clinic_relations ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Labs can view their own clinic relations"
  ON public.clinic_relations
  FOR SELECT
  USING (lab_id = (SELECT id FROM labs WHERE user_id = auth.uid()));

CREATE POLICY "Labs can insert clinic relations"
  ON public.clinic_relations
  FOR INSERT
  WITH CHECK (lab_id = (SELECT id FROM labs WHERE user_id = auth.uid()));

CREATE POLICY "Labs can update their clinic relations"
  ON public.clinic_relations
  FOR UPDATE
  USING (lab_id = (SELECT id FROM labs WHERE user_id = auth.uid()));

-- Create index for performance
CREATE INDEX idx_clinic_relations_lab_id ON public.clinic_relations(lab_id);
CREATE INDEX idx_clinic_relations_status ON public.clinic_relations(status);
CREATE INDEX idx_clinic_relations_clinic_email ON public.clinic_relations(clinic_email);
