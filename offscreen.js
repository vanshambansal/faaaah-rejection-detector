// Offscreen document - handles audio playback for FAAAAH extension
// This runs in a hidden page, bypassing autoplay restrictions

chrome.runtime.onMessage.addListener((message) => {
  if (message.action === 'playFaaaah') {
    const audio = new Audio(chrome.runtime.getURL('faaaah.mp3'));
    audio.volume = 1.0;
    audio.play().then(() => {
      console.log('[FAAAAH Offscreen] Sound played successfully!');
    }).catch(e => {
      console.error('[FAAAAH Offscreen] Play failed:', e);
    });
  }
});
