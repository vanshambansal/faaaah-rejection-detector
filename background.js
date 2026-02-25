// FAAAAH! - Background Service Worker
// Creates offscreen document to play audio (bypasses autoplay policy)

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({
    enabled: true,
    faaaahCount: 0,
    installDate: new Date().toISOString()
  });
  console.log('[FAAAAH] Extension installed. Ready to detect rejections. 💀');
});

// Listen for play requests from content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'playFaaaah') {
    playSound().then(() => sendResponse({ ok: true })).catch(e => sendResponse({ ok: false, error: e.message }));
    return true; // keep channel open for async response
  }
});

async function playSound() {
  // Close any existing offscreen document first
  const existing = await chrome.offscreen.hasDocument().catch(() => false);
  if (!existing) {
    await chrome.offscreen.createDocument({
      url: 'offscreen.html',
      reasons: ['AUDIO_PLAYBACK'],
      justification: 'Play rejection sound effect'
    });
  }
  // Send message to offscreen doc to play the sound
  await chrome.runtime.sendMessage({ action: 'playFaaaah' });
}
