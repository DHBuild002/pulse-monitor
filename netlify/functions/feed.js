const SOURCES = [
  { id: 'aje',    name: 'Al Jazeera',              rss: 'https://www.aljazeera.com/xml/rss/all.xml',                 topic: 'geo',    region: 'Middle East',  lat: 25.0,  lng: 45.0   },
  { id: 'apn',    name: 'AP News',                  rss: 'https://feeds.apnews.com/rss/apf-topnews',                  topic: 'geo',    region: 'Global',       lat: 40.7,  lng: -74.0  },
  { id: 'scmp',   name: 'South China Morning Post', rss: 'https://www.scmp.com/rss/91/feed',                          topic: 'geo',    region: 'Asia-Pacific', lat: 22.3,  lng: 114.2  },
  { id: 'tc',     name: 'TechCrunch',               rss: 'https://techcrunch.com/feed/',                              topic: 'tech',   region: 'Americas',     lat: 37.4,  lng: -122.1 },
  { id: 'who',    name: 'WHO',                      rss: 'https://www.who.int/rss-feeds/news-releases.xml',           topic: 'health', region: 'Global',       lat: 46.2,  lng: 6.1    },
  { id: 'ndtv',   name: 'NDTV',                     rss: 'https://feeds.feedburner.com/ndtvnews-top-stories',         topic: 'geo',    region: 'Asia-Pacific', lat: 28.6,  lng: 77.2   },
  { id: 'nasa',   name: 'NASA',                     rss: 'https://www.nasa.gov/news-release/feed/',                   topic: 'space',  region: 'Americas',     lat: 28.5,  lng: -80.6  },
  { id: 'nature', name: 'Nature',                   rss: 'https://www.nature.com/nature.rss',                         topic: 'space',  region: 'Global',       lat: 51.5,  lng: -0.1   },
];

const ITEMS_PER_SOURCE = 2;

function extractTag(xml, tag) {
  const cdata = xml.match(new RegExp(`<${tag}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]><\\/${tag}>`, 'i'));
  if (cdata) return cdata[1].trim();
  const plain = xml.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'i'));
  return plain ? plain[1].trim() : '';
}

function decodeEntities(str) {
  return str
    .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&#39;/g, "'")
    .replace(/&#\d+;/g, '');
}

function stripHtml(str) {
  return str.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

function relativeTime(pubDate) {
  if (!pubDate) return 'recently';
  const d = new Date(pubDate);
  if (isNaN(d)) return 'recently';
  const diff = Date.now() - d.getTime();
  const m = Math.floor(diff / 60000);
  const h = Math.floor(diff / 3600000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m}m ago`;
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

async function fetchSource(src) {
  const res = await fetch(src.rss, {
    headers: { 'User-Agent': 'Pulse/1.0 RSS Reader' },
    signal: AbortSignal.timeout(8000),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const xml = await res.text();

  const items = [];
  const itemRx = /<item>([\s\S]*?)<\/item>/g;
  let match;
  while ((match = itemRx.exec(xml)) !== null && items.length < ITEMS_PER_SOURCE) {
    const chunk = match[1];
    const title = decodeEntities(extractTag(chunk, 'title'));
    if (!title) continue;
    const link = extractTag(chunk, 'link') || src.rss;
    const raw = decodeEntities(stripHtml(extractTag(chunk, 'description'))).substring(0, 600);
    const pubDate = extractTag(chunk, 'pubDate') || extractTag(chunk, 'dc:date');
    items.push({
      source: src.name,
      topic: src.topic,
      region: src.region,
      lat: src.lat,
      lng: src.lng,
      title,
      url: link,
      time: relativeTime(pubDate),
      urgency: 'med',
      summary: `<p>${raw}</p>`,
    });
  }
  return items;
}

exports.handler = async function () {
  const results = await Promise.allSettled(SOURCES.map(fetchSource));

  const stories = [];
  let id = 1;
  for (const result of results) {
    if (result.status === 'fulfilled') {
      for (const story of result.value) {
        stories.push({ ...story, id: id++ });
      }
    }
  }

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=3600',
    },
    body: JSON.stringify(stories),
  };
};
