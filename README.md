# 💀 FAAAAH! — Rejection Email Detector  
### Chrome Extension v2

---

## 🔧 INSTALL (Step by Step)

### 1. Unzip the folder
Unzip `rejection-detector.zip` somewhere permanent — like your Desktop or Documents.  
**Don't delete the folder after installing.** Chrome needs it to stay there.

### 2. Open Chrome Extensions page
Type this in your Chrome address bar and press Enter:
```
chrome://extensions
```

### 3. Turn on Developer Mode
Look for the **"Developer mode"** toggle in the **top-right corner** of the page.  
Switch it **ON**. New buttons will appear on the left.

### 4. Load the extension
Click **"Load unpacked"** (top-left).  
Navigate to and select the **`rejection-detector`** folder (the one with `manifest.json` inside it).

### 5. Pin it to your toolbar
Click the 🧩 puzzle piece icon in Chrome's toolbar → click the 📌 pin next to "FAAAAH!"

✅ **Done!** You'll see the 💀 skull icon in your toolbar.

---

## ✅ HOW TO TEST IT WORKS

**Quick sound test:**
1. Click the 💀 skull icon in your toolbar
2. Click **"🔊 Test the FAAAAH sound"**
3. You should hear the sad trombone — if you do, it's working!

**Verify it's running on Gmail:**
1. Open **Gmail** (mail.google.com) in Chrome
2. Press `F12` to open DevTools → click the **Console** tab
3. You should see: `[FAAAAH] v2 loaded and watching Gmail 👀`

---

## 🐛 TROUBLESHOOTING

### "I don't hear any sound"
- Make sure your computer volume is not muted
- Test via the popup: click 💀 → "Test the FAAAAH sound"
- Check the toggle in the popup is switched ON (glowing red)

### "Extension icon doesn't appear in toolbar"
- Go to `chrome://extensions` → make sure FAAAAH is enabled (blue toggle on)
- Click 🧩 puzzle piece → click 📌 to pin it

### "Not detecting rejection emails"
- Only works on **mail.google.com** — not Outlook or the mobile app
- **Reload Gmail** after installing (close & reopen the tab)
- Open a rejection email by clicking it — scanning happens when you open emails
- Check DevTools Console (F12) for `[FAAAAH]` log messages

### "Nothing happens at all after installing"
1. Go to `chrome://extensions`
2. Find FAAAAH → look for an **"Errors"** button in red
3. If errors exist: click Remove, then re-do Load Unpacked
4. Make sure you selected the folder that **contains** `manifest.json` (not a parent folder)

### "It disappears after restarting Chrome"
Normal for developer-mode extensions. Just go to `chrome://extensions` → Load unpacked → select the folder again.

---

## 🧠 How It Works

| File | Role |
|------|------|
| `content.js` | Runs inside Gmail, watches for emails being opened, scans text |
| `manifest.json` | Tells Chrome what the extension is and its permissions |
| `background.js` | Stores settings and rejection count |
| `popup.html/js` | The 💀 toolbar popup UI |

Detects 30+ rejection phrases including "moving forward with other candidates", "we regret to inform", "not the right fit", "position has been filled", and more.

Sound is generated live using Web Audio API — three descending oscillators creating a defeated trombone effect. No audio file needed.

---

## 🫡 You've got this. Every no gets you closer to the yes.
