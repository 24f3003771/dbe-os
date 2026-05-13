import { createClient } from '@supabase/supabase-js';

const supabase = createClient('https://kcpgkzkemaupmawzqxgm.supabase.co', 'sb_publishable_DWjU30Jv1LkVk0Cyl2YCrg_WBhzVekn');

async function run() {
    const { data, error } = await supabase.from('app_settings').select('*').eq('id', 1);
    console.log(data, error);
}
run();
