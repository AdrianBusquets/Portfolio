// Netlify Function example: increment-download
// Requires env: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

exports.handler = async (event) => {
  if (!SUPABASE_URL || !SUPABASE_KEY) {
    return { statusCode: 500, body: JSON.stringify({ error: 'Missing supabase env vars' }) };
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

  try {
    const body = event.body ? JSON.parse(event.body) : {};
    const file = body.file || 'cv_adrian';
    const token = body.token || null;

    // Simple insert for analytics. You can instead call an RPC to increment a counter atomically.
    const { data, error } = await supabase.from('downloads').insert([{ file, token, created_at: new Date().toISOString() }]);
    if (error) throw error;

    return { statusCode: 200, body: JSON.stringify({ ok: true, inserted: data }) };
  } catch (err) {
    console.error(err);
    return { statusCode: 500, body: JSON.stringify({ error: err.message || String(err) }) };
  }
};
