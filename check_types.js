const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function check() {
    const { data, error } = await supabase.from('questions').select('type').limit(100);
    if (error) console.error(error);
    const types = [...new Set(data.map(q => q.type))];
    console.log('Available types:', types);
}
check();
