const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY; // or ANON_KEY
const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  const { data: d1, error: e1 } = await supabase.from('todos').select('*').limit(1);
  console.log('todos:', d1 ? 'exists' : e1.message);
  
  const { data: d2, error: e2 } = await supabase.from('deadlines').select('*').limit(1);
  console.log('deadlines:', d2 ? 'exists' : e2.message);

  const { data: d3, error: e3 } = await supabase.from('assignments').select('*').limit(1);
  console.log('assignments:', d3 ? 'exists' : e3.message);
}

check();
