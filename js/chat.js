/**
 * NexusAI Chat UI — chat.js
 * CampusPe Gen AI Assignment
 * All Tasks + All Bonus Features implemented
 */

$(document).ready(function () {

  /* ══════════════════════════════════════════
     CONSTANTS & STATE
  ══════════════════════════════════════════ */
  const AI_NAME   = 'NexusAI';
  const USER_NAME = 'You';

  // Mock AI responses array
  const AI_RESPONSES = [
    "That's a great question! Based on current research, there are several important factors to consider here. Let me break it down for you step by step.",
    "Absolutely! Here's a **comprehensive overview**:\n\n1. First, let's understand the core concept\n2. Then we'll explore practical applications\n3. Finally, I'll share some pro tips\n\nThis approach ensures you get a well-rounded understanding.",
    "Sure! Here's a quick example in Python:\n\n```python\ndef greet(name):\n    return f\"Hello, {name}! 👋\"\n\nprint(greet(\"World\"))\n```\n\nThis is a simple function demonstrating basic syntax. You can extend it further!",
    "Great point! The key insight here is that **modern AI systems** leverage transformer architectures that process tokens in parallel rather than sequentially. This is why they're so much faster than older RNN-based models.",
    "I'd recommend approaching this problem in three phases:\n\n- **Phase 1:** Gather requirements and define scope\n- **Phase 2:** Build a minimal prototype\n- **Phase 3:** Iterate based on feedback\n\nThis keeps the project manageable and deliverable.",
    "Interesting! The answer actually depends on context. In most production environments, you'd want to consider scalability, maintainability, and performance. Let me elaborate on each...",
    "Here's a clean solution: the trick is to use `async/await` with proper error handling:\n\n```javascript\nasync function fetchData(url) {\n  try {\n    const res = await fetch(url);\n    return await res.json();\n  } catch (err) {\n    console.error('Error:', err);\n  }\n}\n```",
    "The short answer: *it depends* — but the best practice is to always **start simple and optimize later**. Premature optimization is the root of many bugs in production code.",
    "That's a fascinating area! Generative AI in 2025 is characterized by:\n\n1. **Multimodal capabilities** — text, image, audio, video\n2. **Reasoning-first models** — longer thinking chains\n3. **Agent orchestration** — AI working with tools autonomously\n\nThings are moving incredibly fast!",
    "For your resume, here are 5 high-impact tips:\n\n1. **Quantify achievements** — use numbers and percentages\n2. **Use action verbs** — led, built, improved, reduced\n3. **Tailor per role** — match keywords from job description\n4. **Keep it one page** — brevity is a skill\n5. **Include links** — GitHub, LinkedIn, portfolio"
  ];

  let responseIndex   = 0;
  let chatLog         = [];   // For export feature
  let isTyping        = false;
  let currentTheme    = localStorage.getItem('nexus-theme') || 'dark';

  /* ══════════════════════════════════════════
     THEME INITIALIZATION
  ══════════════════════════════════════════ */
  applyTheme(currentTheme);

  function applyTheme(theme) {
    currentTheme = theme;
    $('html').attr('data-theme', theme);
    localStorage.setItem('nexus-theme', theme);
    if (theme === 'dark') {
      $('#theme-icon').removeClass('fa-sun').addClass('fa-moon');
      $('#theme-label').text('Dark mode');
    } else {
      $('#theme-icon').removeClass('fa-moon').addClass('fa-sun');
      $('#theme-label').text('Light mode');
    }
  }

  $('#theme-toggle').on('click', function () {
    applyTheme(currentTheme === 'dark' ? 'light' : 'dark');
  });

  /* ══════════════════════════════════════════
     UTILITY FUNCTIONS
  ══════════════════════════════════════════ */

  /**
   * Returns current time as HH:MM AM/PM
   */
  function getTime() {
    const now = new Date();
    let h = now.getHours(), m = now.getMinutes();
    const ampm = h >= 12 ? 'PM' : 'AM';
    h = h % 12 || 12;
    return `${h}:${String(m).padStart(2, '0')} ${ampm}`;
  }

  /**
   * Formats raw text → HTML
   * Handles: **bold**, *italic*, `code`, ```code blocks```, bullet lists
   */
  function formatMessage(text) {
    let html = $('<div>').text(text).html(); // escape HTML entities first

    // Code blocks (``` ... ```)
    html = html.replace(/```(\w*)\n?([\s\S]*?)```/g, function (_, lang, code) {
      return `<pre><code class="lang-${lang || 'text'}">${code.trim()}</code></pre>`;
    });

    // Inline code
    html = html.replace(/`([^`]+)`/g, '<code>$1</code>');

    // Bold
    html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');

    // Italic
    html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');

    // Newlines → <br> (outside of <pre> tags)
    html = html.replace(/\n/g, '<br>');

    // Ordered list items (1. 2. etc.)
    html = html.replace(/(\d+)\.\s+(.*?)(<br>|$)/g, '<li>$2</li>');

    // Unordered list items (- item)
    html = html.replace(/[-•]\s+(.*?)(<br>|$)/g, '<li>$1</li>');

    // Wrap consecutive <li> in <ul>
    html = html.replace(/(<li>[\s\S]*?<\/li>)+/g, function (match) {
      return `<ul>${match}</ul>`;
    });

    return html;
  }

  /* ══════════════════════════════════════════
     SCROLL TO BOTTOM
  ══════════════════════════════════════════ */
  function scrollToBottom(smooth) {
    const container = document.getElementById('chat-container');
    if (smooth) {
      container.scrollTo({ top: container.scrollHeight, behavior: 'smooth' });
    } else {
      container.scrollTop = container.scrollHeight;
    }
  }

  /* ══════════════════════════════════════════
     ADD MESSAGE
  ══════════════════════════════════════════ */
  /**
   * @param {string} text    — message text
   * @param {string} sender  — 'user' | 'ai'
   * @param {boolean} typewriter — use typewriter animation (AI only)
   */
  function addMessage(text, sender, typewriter) {
    const isUser  = sender === 'user';
    const time    = getTime();
    const name    = isUser ? USER_NAME : AI_NAME;
    const avatarClass = isUser ? 'user-avatar-msg' : 'ai-avatar';
    const msgClass    = isUser ? 'user-message'    : 'ai-message';
    const avatarContent = isUser
      ? '<span>S</span>'
      : '<i class="fa-solid fa-hexagon-nodes"></i>';

    const $msg = $(`
      <div class="message ${msgClass}">
        <div class="message-avatar ${avatarClass}">${avatarContent}</div>
        <div class="message-bubble">
          <div class="message-header">
            <span class="message-sender">${name}</span>
            <span class="message-time">${time}</span>
          </div>
          <div class="bubble-content"></div>
        </div>
      </div>
    `);

    $('#messages-list').append($msg);

    const $content = $msg.find('.bubble-content');

    if (typewriter && !isUser) {
      animateTypewriter($content, text, function () {
        // callback after typing done
        scrollToBottom(true);
      });
    } else {
      $content.html(formatMessage(text));
    }

    // Log for export
    chatLog.push({ sender: name, time, text });

    scrollToBottom(true);
    return $msg;
  }

  /* ══════════════════════════════════════════
     TYPEWRITER ANIMATION (BONUS)
  ══════════════════════════════════════════ */
  function animateTypewriter($el, text, onDone) {
    const formatted = formatMessage(text);
    // We'll type out the raw text char by char, then swap to formatted HTML at end
    // For a smoother UX, type the plain text, then format at end

    $el.html('<span class="typing-cursor"></span>');
    let i = 0;
    const speed = 18; // ms per char

    function typeNext() {
      if (i < text.length) {
        const char = text[i];
        // Insert before cursor
        const $cursor = $el.find('.typing-cursor');
        $cursor.before(document.createTextNode(char));
        i++;
        scrollToBottom(false);
        setTimeout(typeNext, speed);
      } else {
        // Done — replace plain text with formatted HTML
        $el.html(formatMessage(text));
        if (typeof onDone === 'function') onDone();
      }
    }

    typeNext();
  }

  /* ══════════════════════════════════════════
     TYPING INDICATOR
  ══════════════════════════════════════════ */
  function showTypingIndicator() {
    $('#typing-indicator').fadeIn(200);
    scrollToBottom(true);
  }

  function hideTypingIndicator() {
    $('#typing-indicator').fadeOut(150);
  }

  /* ══════════════════════════════════════════
     SEND MESSAGE FLOW
  ══════════════════════════════════════════ */
  function sendMessage() {
    const rawText = $('#message-input').val().trim();
    if (!rawText || isTyping) return;

    // Hide welcome screen after first message
    if ($('#welcome-screen').is(':visible')) {
      $('#welcome-screen').fadeOut(300, function () {
        $(this).remove();
      });
    }

    // Add user message
    addMessage(rawText, 'user', false);

    // Clear + reset input
    $('#message-input').val('').css('height', 'auto');
    $('#send-btn').prop('disabled', true);

    // Play send sound
    playSendSound();

    // Show typing indicator after short delay
    isTyping = true;
    setTimeout(function () {
      showTypingIndicator();
    }, 300);

    // Simulate AI thinking delay: 1–2 seconds
    const delay = 1000 + Math.random() * 1000;

    setTimeout(function () {
      hideTypingIndicator();

      // Cycle through mock responses
      const response = AI_RESPONSES[responseIndex % AI_RESPONSES.length];
      responseIndex++;

      addMessage(response, 'ai', true);
      playReceiveSound();
      isTyping = false;
    }, delay);
  }

  /* ══════════════════════════════════════════
     SOUND EFFECTS (BONUS)
     Uses Web Audio API for crisp tones
  ══════════════════════════════════════════ */
  let audioCtx = null;

  function getAudioCtx() {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    return audioCtx;
  }

  function playTone(freq, type, duration, vol) {
    try {
      const ctx = getAudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = type || 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(vol || 0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + duration);
    } catch (e) { /* Silently ignore if audio blocked */ }
  }

  function playSendSound() {
    playTone(880, 'sine', 0.12, 0.06);
    setTimeout(() => playTone(1100, 'sine', 0.1, 0.05), 60);
  }

  function playReceiveSound() {
    playTone(660, 'sine', 0.14, 0.06);
    setTimeout(() => playTone(880, 'sine', 0.12, 0.05), 80);
  }

  /* ══════════════════════════════════════════
     INPUT HANDLING
  ══════════════════════════════════════════ */
  // Enable/disable send button based on input
  $('#message-input').on('input', function () {
    const val = $(this).val().trim();
    $('#send-btn').prop('disabled', val.length === 0 || isTyping);

    // Auto-resize textarea
    this.style.height = 'auto';
    this.style.height = Math.min(this.scrollHeight, 180) + 'px';
  });

  // Enter to send, Shift+Enter for newline
  $('#message-input').on('keydown', function (e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });

  // Send button click
  $('#send-btn').on('click', function () {
    sendMessage();
  });

  /* ══════════════════════════════════════════
     SUGGESTION CARDS
  ══════════════════════════════════════════ */
  $(document).on('click', '.suggestion-card', function () {
    const prompt = $(this).data('prompt');
    if (prompt) {
      $('#message-input').val(prompt).trigger('input');
      $('#message-input').focus();
      sendMessage();
    }
  });

  /* ══════════════════════════════════════════
     NEW CHAT BUTTON
  ══════════════════════════════════════════ */
  $('#new-chat-btn').on('click', function () {
    // Clear messages
    $('#messages-list').empty();
    chatLog = [];
    responseIndex = 0;
    isTyping = false;
    hideTypingIndicator();

    // Show welcome screen again
    if ($('#welcome-screen').length === 0) {
      const $welcome = $(`
        <div id="welcome-screen">
          <div class="welcome-inner">
            <div class="welcome-logo">
              <div class="logo-ring"></div>
              <i class="fa-solid fa-hexagon-nodes welcome-icon"></i>
            </div>
            <h1 class="welcome-title">What can I help with?</h1>
            <p class="welcome-subtitle">Ask me anything — I'm fast, precise, and always learning.</p>
            <div class="suggestion-grid" id="suggestion-grid">
              <div class="suggestion-card" data-prompt="Explain quantum computing in simple terms">
                <div class="card-icon"><i class="fa-solid fa-atom"></i></div>
                <div class="card-body-text">
                  <div class="card-title">Explain quantum computing</div>
                  <div class="card-desc">Break down complex concepts simply</div>
                </div>
              </div>
              <div class="suggestion-card" data-prompt="Write a Python function to parse JSON from an API response">
                <div class="card-icon"><i class="fa-solid fa-code"></i></div>
                <div class="card-body-text">
                  <div class="card-title">Write Python code</div>
                  <div class="card-desc">Parse JSON from an API response</div>
                </div>
              </div>
              <div class="suggestion-card" data-prompt="Give me 5 tips to improve my resume for a tech job">
                <div class="card-icon"><i class="fa-solid fa-file-lines"></i></div>
                <div class="card-body-text">
                  <div class="card-title">Improve my resume</div>
                  <div class="card-desc">5 tips for landing a tech role</div>
                </div>
              </div>
              <div class="suggestion-card" data-prompt="What are the latest trends in generative AI for 2025?">
                <div class="card-icon"><i class="fa-solid fa-brain"></i></div>
                <div class="card-body-text">
                  <div class="card-title">AI trends 2025</div>
                  <div class="card-desc">Latest in generative intelligence</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      `);
      $('#messages-wrapper').prepend($welcome);
    }

    // Add to history
    const $newItem = $('<div class="history-item"><i class="fa-regular fa-message"></i><span>New conversation</span></div>');
    $('.history-item').removeClass('active');
    $newItem.addClass('active');
    $('#chat-history').prepend($newItem);

    // Close sidebar on mobile
    closeSidebar();

    $('#message-input').val('').css('height', 'auto');
    $('#send-btn').prop('disabled', true);
    scrollToBottom(false);
  });

  /* ══════════════════════════════════════════
     SIDEBAR — MOBILE TOGGLE
  ══════════════════════════════════════════ */
  function openSidebar() {
    $('#sidebar').addClass('open');
    $('#sidebar-overlay').addClass('active');
    $('body').css('overflow', 'hidden');
  }

  function closeSidebar() {
    $('#sidebar').removeClass('open');
    $('#sidebar-overlay').removeClass('active');
    $('body').css('overflow', '');
  }

  $('#hamburger-btn').on('click', openSidebar);
  $('#sidebar-overlay').on('click', closeSidebar);

  // History item clicks
  $(document).on('click', '.history-item', function () {
    $('.history-item').removeClass('active');
    $(this).addClass('active');
    closeSidebar();
  });

  /* ══════════════════════════════════════════
     EXPORT CHAT — BONUS (Blob API)
  ══════════════════════════════════════════ */
  $('#export-btn').on('click', function () {
    if (chatLog.length === 0) {
      alert('No messages to export yet!');
      return;
    }

    let txt = '============================\n';
    txt    += '   NexusAI — Chat Export\n';
    txt    += `   ${new Date().toLocaleString()}\n`;
    txt    += '============================\n\n';

    chatLog.forEach(function (entry) {
      txt += `[${entry.time}] ${entry.sender}:\n${entry.text}\n\n`;
    });

    txt += '============================\n';
    txt += 'Exported from NexusAI Chat\n';

    const blob = new Blob([txt], { type: 'text/plain;charset=utf-8' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = `NexusAI_Chat_${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  });

  /* ══════════════════════════════════════════
     ATTACH BUTTON (visual feedback)
  ══════════════════════════════════════════ */
  $('.attach-btn').on('click', function () {
    // Visual pulse feedback
    $(this).addClass('fa-beat');
    setTimeout(() => $(this).removeClass('fa-beat'), 500);
    alert('File attachment is a UI demo — no backend required!');
  });

  /* ══════════════════════════════════════════
     FOCUS INPUT ON LOAD
  ══════════════════════════════════════════ */
  setTimeout(() => $('#message-input').focus(), 100);

}); // end document.ready
