/* ── Feed cache ──────────────────────────────────────── */
const CACHE_KEY    = 'pulse_stories_v1';
const CACHE_TS_KEY = 'pulse_stories_ts_v1';
const CACHE_TTL    = 24 * 60 * 60 * 1000;

function getCachedData() {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

function isCacheFresh() {
  const ts = localStorage.getItem(CACHE_TS_KEY);
  return !!ts && (Date.now() - parseInt(ts, 10) < CACHE_TTL);
}

function setCache(stories) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(stories));
    localStorage.setItem(CACHE_TS_KEY, String(Date.now()));
  } catch {}
}

/* ── Fallback data ───────────────────────────────────── */
const FALLBACK_STORIES = [
  {
    id: 1,
    topic: 'geo',
    title: 'Ceasefire negotiations stall in Gaza as humanitarian crisis deepens',
    source: 'Al Jazeera',
    region: 'Middle East',
    time: '45m ago',
    urgency: 'high',
    lat: 31.5, lng: 34.5,
    url: 'https://www.aljazeera.com/',
    summary: `<p>Diplomatic efforts to broker a ceasefire in Gaza have collapsed for the fourth time in as many weeks, as key mediators from Qatar and Egypt announced a suspension of talks. Both sides have cited irreconcilable differences over the conditions for a prisoner exchange and the future governance of the territory.</p><p>The humanitarian situation inside Gaza continues to deteriorate rapidly. <strong>UN agencies report that over 1.1 million people are facing catastrophic levels of food insecurity</strong>, with aid convoys repeatedly blocked at crossing points. Medical facilities are operating at less than 30% capacity due to fuel shortages and structural damage.</p>`
  },
  {
    id: 2,
    topic: 'geo',
    title: 'Ukraine frontline shifts as spring offensive begins, air defence gap cited',
    source: 'AP News',
    region: 'Europe',
    time: '2h ago',
    urgency: 'high',
    lat: 49.0, lng: 31.5,
    url: 'https://apnews.com/',
    summary: `<p>Ukrainian forces have launched a renewed ground operation in the Zaporizhzhia region, marking the most significant territorial movement in six months. Military analysts suggest the offensive is timed to exploit a weakened Russian defensive line following reported ammunition shortfalls.</p><p><strong>Air defence remains the critical vulnerability</strong> — Western partners have been unable to fully replace interceptor stocks depleted through sustained Russian missile barrages.</p>`
  },
  {
    id: 3,
    topic: 'geo',
    title: 'Naval standoff near contested reef as Philippines protests',
    source: 'South China Morning Post',
    region: 'Asia-Pacific',
    time: '3h ago',
    urgency: 'med',
    lat: 12.0, lng: 119.5,
    url: 'https://www.scmp.com/',
    summary: `<p>A standoff between Philippine and Chinese Coast Guard vessels near the Second Thomas Shoal has entered its third day, with Manila lodging a formal diplomatic protest and releasing video footage it claims shows water cannon used against Filipino sailors.</p><p><strong>The US has reaffirmed its mutual defence obligations under the 1951 treaty</strong>, signalling potential American involvement if Philippine vessels are directly attacked.</p>`
  },
  {
    id: 4,
    topic: 'tech',
    title: 'China launches sovereign AI cloud, bans foreign model access for government',
    source: 'South China Morning Post',
    region: 'Asia-Pacific',
    time: '5h ago',
    urgency: 'high',
    lat: 39.9, lng: 116.4,
    url: 'https://www.scmp.com/',
    summary: `<p>The Chinese government has formally launched a state-controlled AI infrastructure platform and issued a directive prohibiting all ministries and state-owned enterprises from using foreign-developed large language models for official functions.</p><p><strong>Domestically developed models — including those from Baidu, Alibaba and Zhipu AI — are pre-approved for government deployment</strong>.</p>`
  },
  {
    id: 5,
    topic: 'tech',
    title: 'EU AI Act enforcement triggers first major compliance review',
    source: 'TechCrunch',
    region: 'Europe',
    time: '1h ago',
    urgency: 'med',
    lat: 50.8, lng: 4.4,
    url: 'https://techcrunch.com/',
    summary: `<p>The European AI Office has opened its first formal investigation under the AI Act's high-risk system provisions, targeting a widely-deployed hiring algorithm used across several member states.</p><p><strong>Non-compliance penalties can reach €35 million or 7% of global turnover</strong>, whichever is greater.</p>`
  },
  {
    id: 6,
    topic: 'health',
    title: 'WHO declares mpox variant of concern in DRC outbreak',
    source: 'WHO',
    region: 'Africa',
    time: '6h ago',
    urgency: 'high',
    lat: -4.0, lng: 21.8,
    url: 'https://www.who.int/',
    summary: `<p>The World Health Organization has escalated its classification of a circulating mpox clade in the Democratic Republic of Congo to a Variant of Concern, citing evidence of increased transmissibility and reduced vaccine effectiveness against the new subtype.</p><p><strong>Cross-border transmission has been confirmed in Burundi, Rwanda and Uganda</strong>, prompting those governments to activate emergency response protocols.</p>`
  },
  {
    id: 7,
    topic: 'health',
    title: 'New H5N1 subtype detected in poultry across three Indian states',
    source: 'NDTV',
    region: 'Asia-Pacific',
    time: '4h ago',
    urgency: 'med',
    lat: 20.5, lng: 78.9,
    url: 'https://www.ndtv.com/',
    summary: `<p>Indian veterinary authorities have confirmed the detection of a previously unsequenced H5N1 avian influenza subtype in commercial poultry farms across Maharashtra, Telangana and Andhra Pradesh. Over 800,000 birds have been culled as a precautionary measure.</p><p><strong>WHO has requested full genomic sequence data to assess pandemic risk potential</strong>.</p>`
  },
  {
    id: 8,
    topic: 'space',
    title: 'SpaceX Starship completes first crewed lunar flyby test',
    source: 'NASA',
    region: 'Americas',
    time: '8h ago',
    urgency: 'low',
    lat: 28.5, lng: -80.6,
    url: 'https://www.nasa.gov/',
    summary: `<p>SpaceX's Starship HLS vehicle successfully completed a crewed lunar flyby carrying four NASA astronauts, marking the first time humans have travelled beyond low Earth orbit since Apollo 17 in 1972.</p><p><strong>Mission control confirmed all primary objectives were met</strong>.</p>`
  },
  {
    id: 9,
    topic: 'space',
    title: 'James Webb detects potential biosignature in exoplanet atmosphere',
    source: 'Nature',
    region: 'Global',
    time: '10h ago',
    urgency: 'low',
    lat: 48.8, lng: 2.3,
    url: 'https://www.nature.com/',
    summary: `<p>An international team of astronomers has published findings reporting the detection of dimethyl sulfide — a compound produced exclusively by biological processes on Earth — in the atmosphere of K2-18b, a sub-Neptune exoplanet 120 light-years away.</p><p><strong>The signal requires independent confirmation</strong> before stronger conclusions can be drawn.</p>`
  }
];

/* ── Story store ─────────────────────────────────────── */
let STORIES = [...FALLBACK_STORIES];

/* ── Static data ─────────────────────────────────────── */
const FALLBACK_SOCIAL = [
  { platform: 'static', handle: '@KyivIndependent', initials: 'KI', color: '#3a5fa0', topic: 'geo',    text: 'BREAKING: Ukrainian forces cross the Dnipro in Zaporizhzhia — unconfirmed yet but multiple sources reporting movement. Watching closely. 🧵', time: '12m', url: '#' },
  { platform: 'static', handle: '@WHO',             initials: 'W',  color: '#2a7d4f', topic: 'health', text: 'We are convening the Emergency Committee on mpox this week. New clade data from DRC shows increased transmissibility. All updates at who.int/emergencies', time: '34m', url: '#' },
  { platform: 'static', handle: '@NASAArtemis',     initials: 'NA', color: '#3a4a8a', topic: 'space',  text: 'The crew of #Artemis III-F has safely completed the lunar flyby. Full post-flight debrief tomorrow. Historic mission. 🌕', time: '2h', url: '#' },
  { platform: 'static', handle: '@techreview_eu',   initials: 'TR', color: '#555',    topic: 'tech',   text: 'The EU AI Act compliance clock is running. Most companies I talk to are nowhere near ready. The first big enforcement action will send shockwaves.', time: '1h', url: '#' },
  { platform: 'static', handle: '@reuters_world',   initials: 'RW', color: '#c0392b', topic: 'geo',    text: 'Philippines FM: "What happened today at Second Thomas Shoal is not just a bilateral issue. It is a test of international law." Full statement incoming.', time: '55m', url: '#' },
  { platform: 'static', handle: '@SCMPNews',        initials: 'SC', color: '#8b6914', topic: 'tech',   text: 'China\'s sovereign AI cloud is now live. Government ministries have 90 days to migrate. Foreign AI vendors are watching their China revenue projections very carefully.', time: '5h', url: '#' },
];
let SOCIAL_POSTS = [...FALLBACK_SOCIAL];

/* ── Social cache & state ────────────────────────────── */
const SOCIAL_CACHE_KEY    = 'pulse_social_v1';
const SOCIAL_CACHE_TS_KEY = 'pulse_social_ts_v1';
const SOCIAL_CACHE_TTL    = 30 * 60 * 1000;

let socialPaused      = false;
let socialRefreshTimer = null;
let currentSocialQuery = '';
let socialSearchTimer  = null;

function getSocialCached(query) {
  try {
    const key   = query ? `${SOCIAL_CACHE_KEY}_${query}` : SOCIAL_CACHE_KEY;
    const tsKey = query ? `${SOCIAL_CACHE_TS_KEY}_${query}` : SOCIAL_CACHE_TS_KEY;
    const ts  = localStorage.getItem(tsKey);
    const raw = localStorage.getItem(key);
    if (!ts || !raw) return null;
    if (Date.now() - parseInt(ts, 10) > SOCIAL_CACHE_TTL) return null;
    return JSON.parse(raw);
  } catch { return null; }
}

function setSocialCache(posts, query) {
  try {
    const key   = query ? `${SOCIAL_CACHE_KEY}_${query}` : SOCIAL_CACHE_KEY;
    const tsKey = query ? `${SOCIAL_CACHE_TS_KEY}_${query}` : SOCIAL_CACHE_TS_KEY;
    localStorage.setItem(key, JSON.stringify(posts));
    localStorage.setItem(tsKey, String(Date.now()));
  } catch {}
}

const MARKETS = [
  { name: 'Brent',   unit: '/bbl',   price: '$84.20', chg: '+1.4%', dir: 'up' },
  { name: 'Uranium', unit: '/lb',    price: '$95.50', chg: '+3.1%', dir: 'up' },
  { name: 'Wheat',   unit: '/bu',    price: '$5.84',  chg: '+0.7%', dir: 'up' },
  { name: 'Nat Gas', unit: '/MMBtu', price: '$2.18',  chg: '−0.9%', dir: 'down' },
  { name: 'Cobalt',  unit: '/MT',    price: '$24.8k', chg: '−2.3%', dir: 'down' },
  { name: 'Corn',    unit: '/bu',    price: '$4.41',  chg: '0.0%',  dir: 'flat' },
];

const ALERTS = [
  { text: 'WHO Emergency Committee on mpox — live briefing',  time: 'Today · 15:00 UTC',    color: '#3fb884' },
  { text: 'UN Security Council session: South China Sea',     time: 'Tomorrow · 10:00 EST', color: '#e8a83a' },
  { text: 'SpaceX Starship IFT-9 launch window opens',        time: 'In 3 days',            color: '#9b7ff4' },
  { text: 'EU AI Act Tier-1 enforcement deadline',            time: 'In 6 days',            color: '#4f8ef7' },
];

/* ── Map init ────────────────────────────────────────── */
const TAG_COLORS = {
  geo: '#e25c5c', tech: '#4f8ef7', health: '#3fb884', space: '#9b7ff4',
};

const TAG_LABELS = {
  geo: 'Geopolitics', tech: 'Tech & AI', health: 'Public Health', space: 'Science & Space',
};

function sanitize(s) {
  const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
  return String(s || '').replace(/[&<>"']/g, c => map[c]);
}

let map, currentFilter = 'all';

function initMap() {
  map = L.map('map-container', {
    center: [25, 15], zoom: 2,
    zoomControl: true, scrollWheelZoom: true, attributionControl: true,
  });
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors', maxZoom: 18,
  }).addTo(map);
  renderMarkers();
}

function makeMarkerIcon(topic) {
  const color = TAG_COLORS[topic] || '#888';
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
    <circle cx="16" cy="16" r="12" fill="${color}" fill-opacity="0.15" stroke="${color}" stroke-width="1.5"/>
    <circle cx="16" cy="16" r="5" fill="${color}"/>
  </svg>`;
  return L.divIcon({ html: svg, className: '', iconSize: [32,32], iconAnchor: [16,16], popupAnchor: [0,-18] });
}

function renderMarkers() {
  if (!map) return;
  map.eachLayer(layer => { if (layer instanceof L.Marker) map.removeLayer(layer); });
  const filtered = currentFilter === 'all' ? STORIES : STORIES.filter(s => s.topic === currentFilter);
  filtered.forEach(story => {
    const marker = L.marker([story.lat, story.lng], { icon: makeMarkerIcon(story.topic) }).addTo(map);
    const color = TAG_COLORS[story.topic];
    const label = TAG_LABELS[story.topic];
    marker.bindPopup(`
      <div class="map-popup">
        <div class="pop-tag" style="color:${color}">${label}</div>
        <div class="pop-title">${sanitize(story.title)}</div>
        <div class="pop-meta">${sanitize(story.source)} &middot; ${sanitize(story.time)}</div>
        <button class="pop-read" onclick="openReader(${story.id})">
          <i class="ph ph-book-open"></i> Read summary
        </button>
      </div>`, { maxWidth: 240 });
  });
}

/* ── Render sidebar ──────────────────────────────────── */
function renderSidebar() {
  document.getElementById('market-list').innerHTML = MARKETS.map(m => `
    <div class="market-item">
      <span class="market-name">${m.name} <span style="font-size:9px;color:var(--text-3)">${m.unit}</span></span>
      <div style="text-align:right">
        <div class="market-val">${m.price}</div>
        <div class="market-chg chg-${m.dir}">
          ${m.dir === 'up' ? '<i class="ph ph-arrow-up"></i>' : m.dir === 'down' ? '<i class="ph ph-arrow-down"></i>' : '<i class="ph ph-minus"></i>'}
          ${m.chg}
        </div>
      </div>
    </div>`).join('');
}

/* ── Render right panel ──────────────────────────────── */
function deriveRegions(stories) {
  const map = {};
  stories.forEach(s => {
    if (!map[s.region]) map[s.region] = { name: s.region, count: 0, topics: new Set() };
    map[s.region].count++;
    map[s.region].topics.add(s.topic);
  });
  return Object.values(map).map(r => ({ ...r, topics: [...r.topics] }));
}

function renderRightPanel() {
  document.getElementById('region-list').innerHTML = deriveRegions(STORIES).map(r => `
    <div class="region-item">
      <div class="region-name">${sanitize(r.name)}</div>
      <div class="region-count">${r.count} active ${r.count === 1 ? 'story' : 'stories'}</div>
      <div class="region-tags">
        ${r.topics.map(t => `<span class="tag tag-${t}">${TAG_LABELS[t]}</span>`).join('')}
      </div>
    </div>`).join('');

  document.getElementById('alert-list').innerHTML = ALERTS.map(a => `
    <div class="alert-item">
      <div class="alert-dot" style="background:${a.color}"></div>
      <div>
        <div class="alert-text">${a.text}</div>
        <div class="alert-time">${a.time}</div>
      </div>
    </div>`).join('');
}

/* ── Render bottom: social ───────────────────────────── */
function platformLabel(p) {
  return { reddit: 'Reddit', hn: 'HN', bluesky: 'Bluesky', static: 'Feed' }[p] || 'Feed';
}

function renderSocial(posts) {
  const list = posts || SOCIAL_POSTS;
  document.getElementById('social-list').innerHTML = list.map(p => `
    <a class="social-post" href="${p.url || '#'}" target="_blank" rel="noopener">
      <div class="avatar" style="background:${p.color}20;color:${p.color}">${sanitize(p.initials)}</div>
      <div class="post-body">
        <div class="post-handle-row">
          <span class="platform-badge platform-${p.platform || 'static'}">${platformLabel(p.platform)}</span>
          <span class="post-handle">${sanitize(p.handle)} &middot; ${sanitize(p.time)}</span>
        </div>
        <div class="post-tag tag-${p.topic}">${TAG_LABELS[p.topic] || sanitize(p.topic)}</div>
        <div class="post-text">${sanitize(p.text)}</div>
      </div>
    </a>`).join('');
}

/* ── Social feed ─────────────────────────────────────── */
async function loadSocial(force = false, query = currentSocialQuery) {
  if (socialPaused && !force) return;
  const cached = getSocialCached(query);
  if (cached && !force) {
    SOCIAL_POSTS = cached;
    renderSocial(SOCIAL_POSTS);
    return;
  }
  const url = query
    ? `/.netlify/functions/social?q=${encodeURIComponent(query)}`
    : '/.netlify/functions/social';
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const posts = await res.json();
    if (posts.length) {
      SOCIAL_POSTS = posts;
      setSocialCache(posts, query);
    }
  } catch (err) {
    console.warn('Social fetch failed:', err);
  }
  renderSocial(SOCIAL_POSTS);
}

function toggleSocialPause() {
  socialPaused = !socialPaused;
  const icon   = document.getElementById('social-pause-icon');
  const status = document.getElementById('social-status');
  const btn    = document.getElementById('social-pause-btn');
  if (socialPaused) {
    icon.className  = 'ph ph-play';
    status.textContent = 'Paused';
    btn.title = 'Resume feed';
  } else {
    icon.className  = 'ph ph-pause';
    status.textContent = '';
    btn.title = 'Pause feed';
    loadSocial(true);
  }
}

function onSocialSearch(val) {
  clearTimeout(socialSearchTimer);
  socialSearchTimer = setTimeout(() => {
    currentSocialQuery = val.trim();
    loadSocial(true, currentSocialQuery);
  }, 600);
}

function startSocialRefresh() {
  if (socialRefreshTimer) clearInterval(socialRefreshTimer);
  socialRefreshTimer = setInterval(() => {
    if (!socialPaused && !currentSocialQuery) loadSocial(false);
  }, SOCIAL_CACHE_TTL);
}

/* ── Render bottom: stories ──────────────────────────── */
let activeTab = 'all';

function renderStories() {
  const filtered = activeTab === 'all' ? STORIES : STORIES.filter(s => s.topic === activeTab);
  document.getElementById('stories-list').innerHTML = filtered.map(s => `
    <div class="story-item" onclick="openReader(${s.id})">
      <div class="story-thumb">${topicEmoji(s.topic)}</div>
      <div class="story-body">
        <div class="story-tag-row">
          <span class="tag tag-${s.topic}">${TAG_LABELS[s.topic]}</span>
          <span style="font-size:10px;color:var(--text-3)">${sanitize(s.region)}</span>
        </div>
        <div class="story-title">${sanitize(s.title)}</div>
        <div class="story-meta-row">${sanitize(s.source)} &middot; ${sanitize(s.time)}</div>
      </div>
      <div class="urgency-dot" style="background:${urgencyColor(s.urgency)}"></div>
    </div>`).join('');
}

function topicEmoji(t) {
  return { geo: '🌍', tech: '💻', health: '🧬', space: '🚀' }[t] || '📰';
}
function urgencyColor(u) {
  return { high: '#e25c5c', med: '#e8a83a', low: '#555a6a' }[u] || '#555';
}

/* ── Story tabs ──────────────────────────────────────── */
function setStoryTab(tab, el) {
  activeTab = tab;
  document.querySelectorAll('.stories-tab').forEach(t => t.classList.remove('active'));
  el.classList.add('active');
  renderStories();
}

/* ── Nav filter ──────────────────────────────────────── */
function setFilter(topic, el) {
  currentFilter = topic;
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  el.classList.add('active');
  renderMarkers();
  activeTab = topic;
  renderStories();
}

/* ── Reader overlay ──────────────────────────────────── */
function openReader(id) {
  const story = STORIES.find(s => s.id === id);
  if (!story) return;
  if (map) map.closePopup();

  document.getElementById('reader-tag').className = `tag tag-${story.topic}`;
  document.getElementById('reader-tag').textContent = TAG_LABELS[story.topic];
  document.getElementById('reader-source-link').href = story.url;
  document.getElementById('reader-source-link').textContent = story.source + ' ↗';
  document.getElementById('reader-title').textContent = story.title;
  document.getElementById('reader-byline').textContent = `${story.region} · ${story.time} · Via ${story.source}`;
  document.getElementById('reader-body-text').innerHTML = story.summary;
  document.getElementById('reader-overlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeReader() {
  document.getElementById('reader-overlay').classList.remove('open');
  document.body.style.overflow = '';
}

document.getElementById('reader-backdrop').addEventListener('click', closeReader);
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeReader(); });

/* ── Live feed ───────────────────────────────────────── */
async function loadStories(force = false) {
  const btn = document.getElementById('refresh-btn');
  btn.classList.add('spinning');
  const minVisible = new Promise(r => setTimeout(r, 500));
  try {
    const res = await fetch('/.netlify/functions/feed');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const stories = await res.json();
    if (stories.length) {
      STORIES = stories;
      setCache(stories);
      renderMarkers();
      renderStories();
      renderRightPanel();
    }
  } catch (err) {
    console.warn('Feed fetch failed, using existing data:', err);
  } finally {
    await minVisible;
    btn.classList.remove('spinning');
    updateTimestamp();
  }
}

/* ── Refresh ─────────────────────────────────────────── */
let autoOn = true;

function triggerRefresh() {
  loadStories(true);
}

function updateTimestamp(ts) {
  const stored = ts ?? parseInt(localStorage.getItem(CACHE_TS_KEY) || '0', 10);
  const el = document.getElementById('last-updated');
  if (!stored) { el.textContent = 'Updated just now'; return; }
  const diff = Date.now() - stored;
  const m = Math.floor(diff / 60000);
  const h = Math.floor(diff / 3600000);
  if (m < 1)  el.textContent = 'Updated just now';
  else if (m < 60) el.textContent = `Updated ${m}m ago`;
  else         el.textContent = `Updated ${h}h ago`;
}

/* ── Boot ────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  // Use cache immediately if available — no flash of fallback data
  const cached = getCachedData();
  if (cached) STORIES = cached;

  initMap();
  renderSidebar();
  renderRightPanel();
  renderSocial();
  renderStories();
  updateTimestamp();

  if (!isCacheFresh()) loadStories(false);
  loadSocial(false);
  startSocialRefresh();
});
