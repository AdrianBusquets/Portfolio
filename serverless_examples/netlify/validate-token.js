// Netlify Function example: validate-token
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
    const token = body.token;
    if (!token) return { statusCode: 400, body: JSON.stringify({ valid: false }) };

    // Example: tokens table with columns (token text, valid boolean, extra_data json)
    const { data, error } = await supabase.from('tokens').select('valid, extra_data').eq('token', token).limit(1).single();
    if (error && error.code !== 'PGRST116') throw error; // not found handled below

    const valid = !!(data && data.valid);
    return { statusCode: 200, body: JSON.stringify({ valid, data: data ? data.extra_data : null }) };
  } catch (err) {
    console.error(err);
    return { statusCode: 500, body: JSON.stringify({ error: err.message || String(err) }) };
  }
};
