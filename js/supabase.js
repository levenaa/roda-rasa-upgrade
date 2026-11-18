
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Ganti dengan Project URL milikmu
const SUPABASE_URL = "https://vcojhqptjemwcbglydwp.supabase.co";

// Ganti dengan Publishable Key milikmu
const SUPABASE_KEY = "sb_publishable_f6M4DGL7OuYD_J10TW4AeA_yypCOvK5";

// Membuat koneksi ke Supabase
export const supabase = createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);
