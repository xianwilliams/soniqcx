import type {Episode} from './feed';

export const topics = ['All conversations', 'AI & technology', 'Business & growth', 'People & culture'];
const patterns: Record<string, RegExp> = {
  'AI & technology': /\bAI\b|ChatGPT|SaaS|technolog|digital|automation/i,
  'Business & growth': /business|brand|startup|owner|finance|profit|growth/i,
  'People & culture': /people|cultur|leader|team|yourself|personal|coaching/i,
};

export function matchesEpisode(episode: Pick<Episode, 'title'>, query: string, topic: string) {
  return episode.title.toLowerCase().includes(query.trim().toLowerCase()) &&
    (!patterns[topic] || patterns[topic].test(episode.title));
}
