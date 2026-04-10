# NexusAI — Chat UI

**CampusPe Gen AI Assignment** | Student Chat UI Project

---

## Overview

NexusAI is a modern, responsive chat user interface inspired by Claude and ChatGPT. Built entirely with HTML, CSS, JavaScript, jQuery, and Bootstrap 5 — no backend required.

---

## Features

### Core Tasks (100 pts)
- ✅ **Task 1** — Semantic HTML5 structure, welcome screen, suggestion cards, input area
- ✅ **Task 2** — CSS variables, message bubbles, animated typing indicator, smooth transitions
- ✅ **Task 3** — `addMessage()` / `sendMessage()` functions, Enter key handling, mock AI responses, auto-scroll
- ✅ **Task 4** — Fixed 260px sidebar, chat history, mobile hamburger menu, overlay, responsive 320px–1920px

### Bonus Features (10 pts)
- ✅ **Dark/Light mode toggle** with smooth theme transition (4 pts)
- ✅ **Message formatting** — `**bold**`, `*italic*`, `` `code` ``, ` ```code blocks``` ` (3 pts)
- ✅ **Typewriter animation** — AI responses type out letter by letter (4 pts)
- ✅ **Export chat** — Downloads conversation as `.txt` using JavaScript Blob API (3 pts)
- ✅ **Custom scrollbar** styling (2 pts)
- ✅ **Sound effects** — Web Audio API tones on send and receive (2 pts)

---

## Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| HTML5      | —       | Semantic structure |
| CSS3       | —       | Custom properties, animations, flexbox/grid |
| JavaScript | ES6+    | Core interactivity, Blob API, Web Audio API |
| jQuery     | 3.7.1   | DOM manipulation, event handling |
| Bootstrap  | 5.3.3   | Responsive grid utilities |
| Font Awesome | 6.5.2 | Icons |
| Google Fonts | —     | DM Sans + Syne typography |

---

## File Structure

```
YourName_ChatUI/
├── index.html          ← Main HTML file
├── css/
│   └── style.css       ← All custom styles (commented & organized)
├── js/
│   └── chat.js         ← All JavaScript + jQuery functionality
├── screenshots/
│   ├── desktop.png
│   ├── tablet.png
│   └── mobile.png
└── README.md           ← This file
```

---

## How to Run

1. **Unzip** the `YourName_ChatUI.zip` file
2. **Open** `index.html` in any modern browser (Chrome, Firefox, Safari, Edge)
3. No build step, no server needed — it's fully static!

> Tip: For the best experience use Chrome or Firefox with Developer Tools open (F12) to inspect at different screen sizes.

---

## Design Decisions

- **Typography:** DM Sans (body) + Syne (headings) — distinct, modern, non-generic
- **Color system:** CSS custom properties (`--clr-*`) for easy theming
- **Dark-first design** with full light mode support
- **Mobile-first** breakpoints: 320px → 768px → 1280px+
- **Typewriter effect** uses vanilla JS `setTimeout` recursion for smooth character-by-character reveal

---

## Testing Checklist

- [x] Messages appear correctly when sent
- [x] User and AI messages are visually different (colors, alignment, avatars)
- [x] Send button disabled when input empty, enabled when text present
- [x] Enter sends; Shift+Enter creates new line
- [x] Typing indicator shows for 1–2 seconds then hides
- [x] Auto-scroll on new messages
- [x] Textarea auto-resizes up to 180px max-height
- [x] Suggestion cards clickable and fill input
- [x] Welcome screen hides after first message
- [x] Sidebar appears/hides on mobile with overlay
- [x] Layout works at 320px, 768px, 1024px, 1920px
- [x] No console errors in browser DevTools

---

## Author

Rohan c u | CampusPe Internship  
Assignment Date: April 04, 2026
