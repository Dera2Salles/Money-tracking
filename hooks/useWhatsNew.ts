import { useState, useCallback, useEffect } from 'react';
import { useSQLiteContext } from '@/lib/database';
import { APP_VERSION } from '@/constants/app';

export function useWhatsNew() {
  const db = useSQLiteContext();
  const [hasNew, setHasNew] = useState(false);

  const checkNew = useCallback(async () => {
    try {
      const result = await db.getFirstAsync<{ value: string }>(
        'SELECT value FROM settings WHERE key = ?',
        ['whats_new_seen']
      );
      setHasNew(result?.value !== APP_VERSION);
    } catch {
      setHasNew(true);
    }
  }, [db]);

  useEffect(() => { checkNew(); }, [checkNew]);

  const markSeen = useCallback(async () => {
    try {
      const now = new Date().toISOString();
      await db.runAsync(
        'INSERT OR REPLACE INTO settings (key, value, updated_at) VALUES (?, ?, ?)',
        ['whats_new_seen', APP_VERSION, now]
      );
      setHasNew(false);
    } catch (err) {
      console.error('Error marking whats new as seen:', err);
    }
  }, [db]);

  return { hasNew, markSeen, checkNew };
}
