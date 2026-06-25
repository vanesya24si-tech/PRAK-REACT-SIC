-- ============================================================
-- SUPABASE MIGRATION: Sedap Restaurant Admin Dashboard
-- Jalankan script ini di Supabase SQL Editor
-- ============================================================

-- ─── 1. TABEL PROFILES ───────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name VARCHAR NOT NULL,
  email VARCHAR NOT NULL UNIQUE,
  role VARCHAR NOT NULL DEFAULT 'Member',
  points INTEGER NOT NULL DEFAULT 0,
  tier VARCHAR NOT NULL DEFAULT 'Bronze',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ─── 2. TABEL PRODUCTS ───────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR NOT NULL,
  description TEXT,
  price NUMERIC NOT NULL CHECK (price >= 0),
  stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ─── 3. TABEL ORDERS ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id UUID REFERENCES public.profiles(id) ON DELETE RESTRICT,
  total_original NUMERIC NOT NULL,
  discount_amount NUMERIC NOT NULL DEFAULT 0,
  total_final NUMERIC NOT NULL,
  status VARCHAR NOT NULL DEFAULT 'Pending',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ─── 4. TABEL ORDER_ITEMS ────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id) ON DELETE RESTRICT,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  price_at_purchase NUMERIC NOT NULL
);

-- ─── 5. FUNCTION: Auto-create profile saat register ──────────
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email, role, points, tier)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', 'User'),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'role', 'Member'),
    0,
    'Bronze'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger: jalankan function saat user baru dibuat
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ─── 6. FUNCTION: Calculate tier berdasarkan poin ────────────
CREATE OR REPLACE FUNCTION public.calculate_tier(p_points INTEGER)
RETURNS VARCHAR AS $$
BEGIN
  IF p_points >= 5000 THEN
    RETURN 'Platinum';
  ELSIF p_points >= 1500 THEN
    RETURN 'Gold';
  ELSIF p_points >= 500 THEN
    RETURN 'Silver';
  ELSE
    RETURN 'Bronze';
  END IF;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- ─── 7. TRIGGER: Auto-update tier saat points berubah ────────
CREATE OR REPLACE FUNCTION public.update_tier_on_points_change()
RETURNS TRIGGER AS $$
BEGIN
  NEW.tier := public.calculate_tier(NEW.points);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_tier ON public.profiles;
CREATE TRIGGER trigger_update_tier
  BEFORE UPDATE OF points ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_tier_on_points_change();

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================

-- ─── 8. RLS pada PROFILES ────────────────────────────────────
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- SELECT: User bisa baca profil sendiri, Admin baca semua
DROP POLICY IF EXISTS "profiles_select" ON public.profiles;
CREATE POLICY "profiles_select" ON public.profiles FOR SELECT USING (
  auth.uid() = id
  OR (auth.jwt() -> 'user_metadata' ->> 'role') = 'Admin'
);

-- INSERT: Hanya via trigger (security definer), tidak lewat API client
DROP POLICY IF EXISTS "profiles_insert" ON public.profiles;
CREATE POLICY "profiles_insert" ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- UPDATE: Admin bisa update semua, Member hanya bisa update nama sendiri
DROP POLICY IF EXISTS "profiles_update" ON public.profiles;
CREATE POLICY "profiles_update" ON public.profiles FOR UPDATE USING (
  auth.uid() = id
  OR (auth.jwt() -> 'user_metadata' ->> 'role') = 'Admin'
);

-- ─── 9. RLS pada PRODUCTS ────────────────────────────────────
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- SELECT: Public (semua bisa baca)
DROP POLICY IF EXISTS "products_select" ON public.products;
CREATE POLICY "products_select" ON public.products FOR SELECT
  USING (true);

-- INSERT: Hanya Admin
DROP POLICY IF EXISTS "products_insert" ON public.products;
CREATE POLICY "products_insert" ON public.products FOR INSERT
  WITH CHECK ((auth.jwt() -> 'user_metadata' ->> 'role') = 'Admin');

-- UPDATE: Hanya Admin
DROP POLICY IF EXISTS "products_update" ON public.products;
CREATE POLICY "products_update" ON public.products FOR UPDATE USING ((auth.jwt() -> 'user_metadata' ->> 'role') = 'Admin');

-- DELETE: Hanya Admin
DROP POLICY IF EXISTS "products_delete" ON public.products;
CREATE POLICY "products_delete" ON public.products FOR DELETE USING ((auth.jwt() -> 'user_metadata' ->> 'role') = 'Admin');

-- ─── 10. RLS pada ORDERS ─────────────────────────────────────
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- SELECT: Admin baca semua, Member hanya pesanan sendiri
DROP POLICY IF EXISTS "orders_select" ON public.orders;
CREATE POLICY "orders_select" ON public.orders FOR SELECT USING (
  member_id = auth.uid()
  OR (auth.jwt() -> 'user_metadata' ->> 'role') = 'Admin'
);

-- INSERT: Member hanya bisa buat pesanan atas namanya sendiri
DROP POLICY IF EXISTS "orders_insert" ON public.orders;
CREATE POLICY "orders_insert" ON public.orders FOR INSERT
  WITH CHECK (member_id = auth.uid());

-- UPDATE: Hanya Admin
DROP POLICY IF EXISTS "orders_update" ON public.orders;
CREATE POLICY "orders_update" ON public.orders FOR UPDATE USING ((auth.jwt() -> 'user_metadata' ->> 'role') = 'Admin');

-- DELETE: Hanya Admin
DROP POLICY IF EXISTS "orders_delete" ON public.orders;
CREATE POLICY "orders_delete" ON public.orders FOR DELETE USING ((auth.jwt() -> 'user_metadata' ->> 'role') = 'Admin');

-- ─── 11. RLS pada ORDER_ITEMS ────────────────────────────────
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- SELECT: Admin baca semua, Member hanya item dari pesanannya
DROP POLICY IF EXISTS "order_items_select" ON public.order_items;
CREATE POLICY "order_items_select" ON public.order_items FOR SELECT USING (
  (auth.jwt() -> 'user_metadata' ->> 'role') = 'Admin'
  OR EXISTS (
    SELECT 1 FROM public.orders
    WHERE public.orders.id = order_id
    AND public.orders.member_id = auth.uid()
  )
);

-- INSERT: Member hanya bisa insert ke pesanan miliknya
DROP POLICY IF EXISTS "order_items_insert" ON public.order_items;
CREATE POLICY "order_items_insert" ON public.order_items FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.orders
      WHERE public.orders.id = order_id
      AND public.orders.member_id = auth.uid()
    )
  );

-- UPDATE: Hanya Admin
DROP POLICY IF EXISTS "order_items_update" ON public.order_items;
CREATE POLICY "order_items_update" ON public.order_items FOR UPDATE USING ((auth.jwt() -> 'user_metadata' ->> 'role') = 'Admin');

-- DELETE: Hanya Admin
DROP POLICY IF EXISTS "order_items_delete" ON public.order_items;
CREATE POLICY "order_items_delete" ON public.order_items FOR DELETE USING ((auth.jwt() -> 'user_metadata' ->> 'role') = 'Admin');


-- ============================================================
-- SEED DATA: Produk contoh (Hanya dimasukkan jika tabel produk kosong)
-- ============================================================
INSERT INTO public.products (name, description, price, stock, image_url)
SELECT name, description, price, stock, image_url 
FROM (
  VALUES
    ('Nasi Goreng Spesial'::varchar, 'Nasi goreng dengan telur, ayam, dan sayuran segar'::text, 35000::numeric, 100::integer, 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400'::text),
    ('Mie Ayam Bakso'::varchar, 'Mie ayam dengan bakso sapi pilihan'::text, 25000::numeric, 80::integer, 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400'::text),
    ('Sate Ayam'::varchar, 'Sate ayam bumbu kacang dengan lontong'::text, 30000::numeric, 60::integer, 'https://images.unsplash.com/photo-1529563021893-cc83c992d75d?w=400'::text),
    ('Es Teh Manis'::varchar, 'Teh manis segar dengan es batu'::text, 8000::numeric, 200::integer, 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400'::text),
    ('Jus Alpukat'::varchar, 'Jus alpukat segar dengan susu coklat'::text, 15000::numeric, 50::integer, 'https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?w=400'::text),
    ('Rendang Sapi'::varchar, 'Rendang daging sapi empuk khas Padang'::text, 45000::numeric, 40::integer, 'https://images.unsplash.com/photo-1606491956689-2ea866880049?w=400'::text),
    ('Gado-gado'::varchar, 'Sayuran segar dengan bumbu kacang spesial'::text, 20000::numeric, 70::integer, 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400'::text),
    ('Ayam Bakar'::varchar, 'Ayam bakar bumbu merah dengan sambal'::text, 40000::numeric, 55::integer, 'https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=400'::text)
) AS v(name, description, price, stock, image_url)
WHERE NOT EXISTS (SELECT 1 FROM public.products);
