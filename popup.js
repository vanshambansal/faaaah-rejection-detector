// FAAAAH! Popup Script

const motivations = [
  "Keep applying, champ. 🫡",
  "Their loss, honestly.",
  "You're not the problem. They are.",
  "Next one's yours. Probably.",
  "Pain is temporary. FAAAAH is eternal.",
  "Stay hydrated and reapply.",
  "The right job is still out there. Maybe.",
  "This is fine. 🔥",
  "Rome wasn't built in a day either.",
  "Billionaires get rejected too. Allegedly."
];

// Load state
chrome.storage.local.get(['enabled', 'faaaahCount'], (data) => {
  const count = data.faaaahCount || 0;
  const enabled = data.enabled !== false;

  document.getElementById('faaaahCount').textContent = count;
  document.getElementById('enableToggle').checked = enabled;

  const dot = document.getElementById('statusDot');
  const statusText = document.getElementById('statusText');

  if (!enabled) {
    dot.classList.add('off');
    statusText.textContent = 'Detection paused.';
  }

  // Motivation message based on count
  const msgEl = document.getElementById('motivationMsg');
  if (count === 0) {
    msgEl.textContent = "No rejections yet! 🤞";
  } else if (count === 1) {
    msgEl.textContent = "First blood. Keep going.";
  } else if (count < 5) {
    msgEl.textContent = motivations[count % motivations.length];
  } else if (count < 10) {
    msgEl.textContent = "You're really putting yourself out there. 💪";
  } else if (count < 20) {
    msgEl.textContent = "Legend. Absolute legend.";
  } else {
    msgEl.textContent = "You are indestructible. 🏆";
  }
});

// Toggle
document.getElementById('enableToggle').addEventListener('change', (e) => {
  const enabled = e.target.checked;
  chrome.storage.local.set({ enabled });

  const dot = document.getElementById('statusDot');
  const statusText = document.getElementById('statusText');

  if (enabled) {
    dot.classList.remove('off');
    statusText.textContent = 'Watching Gmail for rejections...';
  } else {
    dot.classList.add('off');
    statusText.textContent = 'Detection paused.';
  }
});

// Test button - plays the FAAAAH sound in the popup itself
document.getElementById('testBtn').addEventListener('click', () => {
  const btn = document.getElementById('testBtn');
  btn.textContent = '💀 FAAAAH!';
  btn.style.color = '#ff3333';
  btn.style.borderColor = '#ff3333';

  playFaaaahSound();

  setTimeout(() => {
    btn.textContent = '🔊 Test the FAAAAH sound';
    btn.style.color = '';
    btn.style.borderColor = '';
  }, 2000);
});

function playFaaaahSound() {
  // Route through background service worker -> offscreen document
  chrome.runtime.sendMessage({ action: 'playFaaaah' });
}
