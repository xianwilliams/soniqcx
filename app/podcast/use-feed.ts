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
    const refresh = async () => {
      if (document.hidden) return;
      try {
        const response = await fetch('/api/podcast', {signal: abort.signal});
        if (!response.ok) return;
        const data = await response.json() as EpisodeFeed;
        if (data.episodes?.length) setFeed(data);
      } catch { /* The last known episodes stay usable when YouTube is unavailable. */ }
    };
    void refresh();
    const timer = setInterval(refresh, 300000);
    document.addEventListener('visibilitychange', refresh);
    return () => { clearInterval(timer); abort.abort(); document.removeEventListener('visibilitychange', refresh); };
  }, [visible]);
  return feed;
}
