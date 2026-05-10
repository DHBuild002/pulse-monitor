const REDDIT_DEFAULTS = [
  { sub: 'worldnews',   topic: 'geo'    },
  { sub: 'geopolitics', topic: 'geo'    },
  { sub: 'technology',  topic: 'tech'   },
  { sub: 'science',     topic: 'space'  },
  { sub: 'health',      topic: 'health' },
];

function relTime(ts) {
  const d = typeof ts === 'number' ? new Date(ts * 1000) : new Date(ts);
  if (isNaN(d)) return 'recently';
  const diff = Date.now() - d.getTime();
  const m = Math.floor(diff / 60000);
  const h = Math.floor(diff / 3600000);
  if (m < 1)  return 'just now';
  if (m < 60) return `${m}m ago`;
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

async function redditDefault() {
  const fetches = REDDIT_DEFAULTS.map(async ({ sub, topic }) => {
    const r = await fetch(`https://www.reddit.com/r/${sub}/hot.json?limit=3`, {
      headers: { 'User-Agent': 'web:pulse-dashboard:1.0' },
      signal: AbortSignal.timeout(5000),
    });
    if (!r.ok) return [];
    const d = await r.json();
    return (d.data?.children || []).map(({ data: p }) => ({
      id: `reddit-${p.id}`,
      platform: 'reddit',
      handle: `r/${p.subreddit}`,
      initials: 'r/',
      color: '#ff4500',
      topic,
      text: p.title,
      time: relTime(p.created_utc),
      url: `https://reddit.com${p.permalink}`,
      score: p.score || 0,
    }));
  });
  const results = await Promise.allSettled(fetches);
  return results.flatMap(r => r.status === 'fulfilled' ? r.value : []);
}

async function redditSearch(q) {
  const r = await fetch(
    `https://www.reddit.com/search.json?q=${encodeURIComponent(q)}&sort=new&limit=8&t=day`,
    { headers: { 'User-Agent': 'web:pulse-dashboard:1.0' }, signal: AbortSignal.timeout(5000) }
  );
  if (!r.ok) return [];
  const d = await r.json();
  return (d.data?.children || []).map(({ data: p }) => ({
    id: `reddit-${p.id}`,
    platform: 'reddit',
    handle: `r/${p.subreddit}`,
    initials: 'r/',
    color: '#ff4500',
    topic: 'geo',
    text: p.title,
    time: relTime(p.created_utc),
    url: `https://reddit.com${p.permalink}`,
    score: p.score || 0,
  }));
}

async function hnDefault() {
  const r = await fetch('https://hacker-news.firebaseio.com/v0/topstories.json', {
    signal: AbortSignal.timeout(5000),
  });
  if (!r.ok) return [];
  const ids = await r.json();
  const items = await Promise.allSettled(
    ids.slice(0, 3).map(id =>
      fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`, {
        signal: AbortSignal.timeout(2000),
      }).then(r2 => r2.json())
    )
  );
  return items
    .filter(r => r.status === 'fulfilled' && r.value?.title)
    .map(({ value: h }) => ({
      id: `hn-${h.id}`,
      platform: 'hn',
      handle: `@${h.by}`,
      initials: 'HN',
      color: '#ff6600',
      topic: 'tech',
      text: h.title,
      time: relTime(h.time),
      url: h.url || `https://news.ycombinator.com/item?id=${h.id}`,
      score: h.score || 0,
    }));
}

async function hnSearch(q) {
  const since = Math.floor((Date.now() - 86400000) / 1000);
  const r = await fetch(
    `https://hn.algolia.com/api/v1/search?query=${encodeURIComponent(q)}&tags=story&numericFilters=created_at_i>${since}&hitsPerPage=5`,
    { signal: AbortSignal.timeout(5000) }
  );
  if (!r.ok) return [];
  const d = await r.json();
  return (d.hits || []).map(h => ({
    id: `hn-${h.objectID}`,
    platform: 'hn',
    handle: `@${h.author}`,
    initials: 'HN',
    color: '#ff6600',
    topic: 'tech',
    text: h.title,
    time: relTime(h.created_at),
    url: h.url || `https://news.ycombinator.com/item?id=${h.objectID}`,
    score: h.points || 0,
  }));
}

async function bskySearch(q) {
  const r = await fetch(
    `https://public.api.bsky.app/xrpc/app.bsky.feed.searchPosts?q=${encodeURIComponent(q)}&limit=5`,
    { signal: AbortSignal.timeout(5000) }
  );
  if (!r.ok) return [];
  const d = await r.json();
  return (d.posts || [])
    .filter(p => p.record?.text)
    .map(p => ({
      id: `bsky-${p.uri.split('/').pop()}`,
      platform: 'bluesky',
      handle: `@${p.author.handle}`,
      initials: 'BS',
      color: '#0085ff',
      topic: 'geo',
      text: p.record.text,
      time: relTime(p.indexedAt),
      url: `https://bsky.app/profile/${p.author.handle}/post/${p.uri.split('/').pop()}`,
      score: (p.likeCount || 0) + (p.repostCount || 0),
    }));
}

exports.handler = async function (event) {
  const q = event.queryStringParameters?.q || '';

  let posts = [];

  if (q) {
    const [reddit, hn, bsky] = await Promise.allSettled([
      redditSearch(q),
      hnSearch(q),
      bskySearch(q),
    ]);
    [reddit, hn, bsky].forEach(r => { if (r.status === 'fulfilled') posts.push(...r.value); });
  } else {
    const [reddit, hn, bsky] = await Promise.allSettled([
      redditDefault(),
      hnDefault(),
      bskySearch('world news OR politics OR technology'),
    ]);
    [reddit, hn, bsky].forEach(r => { if (r.status === 'fulfilled') posts.push(...r.value); });
  }

  posts.sort((a, b) => (b.score || 0) - (a.score || 0));

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=1800',
    },
    body: JSON.stringify(posts.slice(0, 20)),
  };
};
