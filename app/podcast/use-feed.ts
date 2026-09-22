'use client';
import {useEffect, useState} from 'react';
import fallback from './episodes.json';
import type {EpisodeFeed} from './feed';
export const initialFeed: EpisodeFeed = {episodes: fallback, fresh: false, checkedAt: ''};
export function useEpisodeFeed(visible: boolean, initial: EpisodeFeed = initialFeed) {
  const [feed, setFeed] = useState(initial);
  useEffect(() => {
    if (!visible) return;
    const abort = new AbortController();
    let refreshing = false;
    const refresh = async () => {
      if (document.hidden || refreshing) return;
      refreshing = true;
      try {
        const response = await fetch('/api/podcast', {signal: abort.signal, cache: 'no-store'});
        if (!response.ok) return;
        const data = await response.json() as EpisodeFeed;
        if (data.episodes?.length) setFeed(data);
      } catch { /* The last known episodes stay usable when YouTube is unavailable. */ }
      finally { refreshing = false; }
    };
    void refresh();
    const timer = setInterval(refresh, 300000);
    document.addEventListener('visibilitychange', refresh);
    window.addEventListener('online', refresh);
    return () => { clearInterval(timer); abort.abort(); document.removeEventListener('visibilitychange', refresh); window.removeEventListener('online', refresh); };
  }, [visible]);
  return feed;
}
