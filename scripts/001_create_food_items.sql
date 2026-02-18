-- Create food_items table with category support
CREATE TABLE IF NOT EXISTS public.food_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  location TEXT NOT NULL CHECK (location IN ('fridge', 'freezer')),
  category TEXT DEFAULT 'other',
  entry_date DATE NOT NULL DEFAULT CURRENT_DATE,
  entry_time TEXT,
  expiry_date DATE,
  notes TEXT,
  is_finished BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.food_items ENABLE ROW LEVEL SECURITY;

-- RLS Policies: users can only access their own items
CREATE POLICY "food_items_select_own" ON public.food_items
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "food_items_insert_own" ON public.food_items
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "food_items_update_own" ON public.food_items
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "food_items_delete_own" ON public.food_items
  FOR DELETE USING (auth.uid() = user_id);

-- Index for common queries
CREATE INDEX IF NOT EXISTS idx_food_items_user_location ON public.food_items(user_id, location, is_finished);
CREATE INDEX IF NOT EXISTS idx_food_items_expiry ON public.food_items(expiry_date);
