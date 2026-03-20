import { useState, useEffect } from 'react';

export default function useTokenValidation() {
  const [valid, setValid] = useState(false);
  const [extraData, setExtraData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    if (!token) {
      setLoading(false);
      return;
    }

    const url = import.meta.env.VITE_TOKEN_VALIDATION_URL;
    if (!url) {
      setLoading(false);
      setValid(false);
      return;
    }

    (async () => {
      try {
        const res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token })
        });
        if (!res.ok) throw new Error('invalid response');
        const json = await res.json();
        if (json && json.valid) {
          setValid(true);
          setExtraData(json.data || null);
        } else {
          setValid(false);
        }
      } catch (e) {
        setValid(false);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return { valid, extraData, loading };
}
