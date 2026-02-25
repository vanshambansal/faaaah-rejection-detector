// FAAAAH! Rejection Email Detector - Content Script v2
// Runs on Gmail and watches for rejection emails

const REJECTION_PHRASES = [
  "we've decided to move forward with other candidates",
  "moving forward with other candidates",
  "we regret to inform",
  "not selected for",
  "decided not to move forward",
  "position has been filled",
  "not a match",
  "not moving forward",
  "gone with another candidate",
  "we will not be moving forward",
  "after careful consideration, we",
  "we have decided to pursue other",
  "other candidates whose experience",
  "not the right fit",
  "we won't be moving forward",
  "application was not selected",
  "not been selected",
  "we have chosen to",
  "pursue other applicants",
  "filled the position",
  "no longer considering",
  "not proceeding with your application",
  "regret to let you know",
  "decided to go in a different direction",
  "your application was unsuccessful",
  "not shortlisted",
  "we will not be able to move forward",
  "have decided not to proceed",
  "unfortunately, we",
  "unfortunately we will",
  "not be proceeding with your",
  "not selected to move forward",
  "another direction",
  "wished to let you know that"
];

const processedIds = new Set();
let isEnabled = true;
let faaaahCount = 0;
let pendingFaaaah = false;
let audioUnlocked = false;

// ─── UNLOCK AUDIO ─────────────────────────────────────────────────────────────
// Chrome blocks autoplay until the user interacts with the page.
// We silently unlock audio on the first click/keypress so the sound can fire later.
function unlockAudio() {
  if (audioUnlocked) return;
  audioUnlocked = true;
  // Play a silent buffer to satisfy Chrome autoplay policy
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const buf = ctx.createBuffer(1, 1, 22050);
    const src = ctx.createBufferSource();
    src.buffer = buf;
    src.connect(ctx.destination);
    src.start(0);
    ctx.resume();
    console.log('[FAAAAH] Audio unlocked ✅');
  } catch(e) {}
}

document.addEventListener('click', unlockAudio, { once: false, capture: true });
document.addEventListener('keydown', unlockAudio, { once: false, capture: true });

// Load settings
chrome.storage.local.get(['enabled', 'faaaahCount'], (data) => {
  isEnabled = data.enabled !== false;
  faaaahCount = data.faaaahCount || 0;
  console.log('[FAAAAH] Loaded settings - enabled:', isEnabled, 'count:', faaaahCount);
});

chrome.storage.onChanged.addListener((changes) => {
  if (changes.enabled !== undefined) isEnabled = changes.enabled.newValue;
});

// ─── SOUND ENGINE ────────────────────────────────────────────────────────────
function playFaaaah() {
  if (pendingFaaaah) return;
  pendingFaaaah = true;
  setTimeout(() => { pendingFaaaah = false; }, 4000);

  console.log('[FAAAAH] 💀 PLAYING FAAAAH!');

  // Send message to background service worker to play sound via offscreen document
  // This bypasses Chrome autoplay restrictions completely
  chrome.runtime.sendMessage({ action: 'playFaaaah' });

  showFaaaahOverlay();

  faaaahCount++;
  chrome.storage.local.set({ faaaahCount });
}

// ─── OVERLAY ─────────────────────────────────────────────────────────────────
function showFaaaahOverlay() {
  const existing = document.getElementById('faaaah-overlay');
  if (existing) existing.remove();
  const existingStyle = document.getElementById('faaaah-style');
  if (existingStyle) existingStyle.remove();

  const style = document.createElement('style');
  style.id = 'faaaah-style';
  style.textContent = `
    #faaaah-overlay {
      position: fixed !important;
      top: 0 !important; left: 0 !important; right: 0 !important; bottom: 0 !important;
      z-index: 2147483647 !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      pointer-events: none !important;
      background: rgba(0,0,0,0.5) !important;
      animation: faaaahBgFade 2.8s ease forwards !important;
    }
    #faaaah-card {
      background: #0d0000 !important;
      border: 3px solid #ff2222 !important;
      border-radius: 20px !important;
      padding: 44px 72px !important;
      text-align: center !important;
      box-shadow: 0 0 80px rgba(255,30,30,0.6), 0 0 160px rgba(255,30,30,0.25) !important;
      animation: faaaahCardPop 0.45s cubic-bezier(0.34, 1.56, 0.64, 1) both !important;
    }
    #faaaah-skull { font-size: 68px !important; display: block !important; animation: faaaahSkullBounce 0.5s ease !important; }
    #faaaah-word {
      font-family: Impact, 'Arial Black', sans-serif !important;
      font-size: 80px !important;
      color: #ff2020 !important;
      letter-spacing: 8px !important;
      text-shadow: 0 0 30px rgba(255,30,30,0.9), 4px 4px 0 #000 !important;
      display: block !important;
      animation: faaaahWordShake 0.5s ease 0.05s !important;
    }
    #faaaah-sub {
      font-family: Georgia, serif !important;
      font-size: 17px !important;
      color: #888 !important;
      font-style: italic !important;
      display: block !important;
      margin-top: 10px !important;
    }
    @keyframes faaaahBgFade {
      0% { opacity: 0; } 8% { opacity: 1; } 72% { opacity: 1; } 100% { opacity: 0; }
    }
    @keyframes faaaahCardPop {
      0% { transform: scale(0.3); opacity: 0; }
      60% { transform: scale(1.08); opacity: 1; }
      80% { transform: scale(0.96); }
      100% { transform: scale(1); }
    }
    @keyframes faaaahSkullBounce {
      0% { transform: scale(0) rotate(-30deg); }
      60% { transform: scale(1.25) rotate(10deg); }
      100% { transform: scale(1) rotate(0deg); }
    }
    @keyframes faaaahWordShake {
      0%,100% { transform: translateX(0); }
      20% { transform: translateX(-10px); }
      40% { transform: translateX(10px); }
      60% { transform: translateX(-6px); }
      80% { transform: translateX(6px); }
    }
  `;

  const overlay = document.createElement('div');
  overlay.id = 'faaaah-overlay';
  overlay.innerHTML = `
    <div id="faaaah-card">
      <span id="faaaah-skull">💀</span>
      <span id="faaaah-word">FAAAAH!</span>
      <span id="faaaah-sub">Another one bites the dust</span>
    </div>
  `;

  document.head.appendChild(style);
  document.body.appendChild(overlay);

  setTimeout(() => { overlay.remove(); style.remove(); }, 2900);
}

// ─── REJECTION CHECKER ───────────────────────────────────────────────────────
function isRejection(text) {
  const lower = text.toLowerCase();
  return REJECTION_PHRASES.some(p => lower.includes(p));
}

// ─── GMAIL SELECTORS ─────────────────────────────────────────────────────────
// Gmail uses obfuscated class names that change, so we use multiple strategies

function getEmailRows() {
  // Strategy 1: standard inbox rows (tr with role="row" inside table)
  let rows = Array.from(document.querySelectorAll('tr[jscontroller]'));
  if (rows.length === 0) rows = Array.from(document.querySelectorAll('tr.zA'));
  if (rows.length === 0) rows = Array.from(document.querySelectorAll('div[role="listitem"]'));
  return rows;
}

function getOpenEmailBody() {
  // Multiple selectors for open email body - Gmail changes these
  const selectors = [
    '.a3s.aiL',           // most common email body class
    '.a3s',               // fallback
    '[data-message-id] .ii.gt',
    '.AO .ii',
    'div[dir="ltr"] .ii',
    '.nH .ii'
  ];
  for (const sel of selectors) {
    const el = document.querySelector(sel);
    if (el && el.textContent.length > 50) return el;
  }
  return null;
}

// ─── SCAN FUNCTIONS ──────────────────────────────────────────────────────────
function scanInboxRows() {
  if (!isEnabled) return;
  const rows = getEmailRows();
  console.log('[FAAAAH] Scanning', rows.length, 'email rows...');

  rows.forEach(row => {
    // Generate a stable ID from the row's thread id attribute or text
    const id = row.getAttribute('data-legacy-thread-id')
      || row.getAttribute('id')
      || row.textContent.trim().slice(0, 100);

    if (!id || processedIds.has(id)) return;

    const text = row.textContent;
    if (text.length < 10) return;

    if (isRejection(text)) {
      processedIds.add(id);
      console.log('[FAAAAH] 🚨 REJECTION in inbox row!');
      playFaaaah();
    } else {
      // Mark as seen so we don't keep scanning it
      processedIds.add(id);
    }
  });
}

function scanOpenEmail() {
  if (!isEnabled) return;
  const body = getOpenEmailBody();
  if (!body) return;

  const id = 'open::' + body.textContent.trim().slice(0, 120);
  if (processedIds.has(id)) return;
  processedIds.add(id);

  if (isRejection(body.textContent)) {
    console.log('[FAAAAH] 🚨 REJECTION in open email!');
    setTimeout(() => playFaaaah(), 400);
  }
}

// ─── URL CHANGE DETECTION ─────────────────────────────────────────────────────
// Gmail is a SPA — we need to detect when the user navigates to an email
let lastUrl = location.href;
function checkUrlChange() {
  if (location.href !== lastUrl) {
    lastUrl = location.href;
    console.log('[FAAAAH] URL changed, scanning open email...');
    setTimeout(scanOpenEmail, 800);
    setTimeout(scanOpenEmail, 1800); // retry in case Gmail is slow
  }
}

// ─── MAIN OBSERVER ───────────────────────────────────────────────────────────
let debounceTimer;
const observer = new MutationObserver(() => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    checkUrlChange();
    scanOpenEmail();
  }, 600);
});

observer.observe(document.body, { childList: true, subtree: true });

// Also poll for URL changes (belt AND suspenders)
setInterval(checkUrlChange, 1000);

// Initial inbox scan after Gmail finishes loading
setTimeout(() => {
  console.log('[FAAAAH] Initial scan starting...');
  scanInboxRows();
}, 3000);

setTimeout(scanInboxRows, 6000); // second pass

console.log('[FAAAAH] v2 loaded and watching Gmail 👀');
