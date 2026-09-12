/* =====================================================
   YO G NEWS — script.js
   Connects to Flask backend at http://127.0.0.1:5000
   Falls back to local demo data when backend is offline
   ===================================================== */

const API_BASE = "http://127.0.0.1:5000";

/* ── Demo articles shown when the backend is offline ── */
const DEMO_ARTICLES = [
  {
    id: 1,
    title: "Scientists Announce Preliminary Water Purification Technology",
    content: "Researchers published preliminary findings on a new filtration prototype currently undergoing laboratory testing and independent evaluation.",
    category: "Science"
  },
  {
    id: 2,
    title: "Government Launches Digital Scholarship Portal for Students",
    content: "The education department announced an official online scholarship portal with published eligibility rules and an open application window.",
    category: "Education"
  },
  {
    id: 3,
    title: "City Rolls Out New Public Electric Bus Route",
    content: "Municipal officials released a statement about a pilot electric-bus service, subject to final route schedules pending approval.",
    category: "Technology"
  },
  {
    id: 4,
    title: "Regional Sports Authority Opens New Training Centre",
    content: "The authority published registration details and coaching schedules through official channels ahead of the upcoming season.",
    category: "Sports"
  },
  {
    id: 5,
    title: "Researchers Report Progress in Battery Recycling",
    content: "A university team published preliminary findings on lithium-ion recycling efficiency that require further independent validation before scaling.",
    category: "Science"
  },
  {
    id: 6,
    title: "Celebrity Claims One Fruit Cures Every Disease",
    content: "A viral article circulating on social media makes extraordinary medical claims without clinical evidence, peer review, or reliable sourcing.",
    category: "Health"
  }
];

/* ════════════════════════════════════════════
   LOAD NEWS
   ════════════════════════════════════════════ */
async function loadNews() {
  const grid = document.getElementById("newsGrid");
  grid.innerHTML = '<p style="color:var(--muted);font-size:14px;">Loading articles…</p>';

  try {
    const res = await fetch(`${API_BASE}/api/news`);
    if (!res.ok) throw new Error("Non-OK response");
    const data = await res.json();
    renderNews(data.articles || []);
  } catch {
    /* Backend offline — use demo data silently */
    renderNews(DEMO_ARTICLES);
  }
}

function renderNews(articles) {
  const grid = document.getElementById("newsGrid");

  if (!articles.length) {
    grid.innerHTML = '<p style="color:var(--muted);">No articles found.</p>';
    return;
  }

  grid.innerHTML = articles
    .map(
      (a) => `
    <div class="news-card">
      <span class="category">${escHtml(a.category || "General")}</span>
      <h3>${escHtml(a.title)}</h3>
      <p>${escHtml(a.content)}</p>
      <button class="read-btn" onclick="prefillVerify(${a.id})">
        Verify this article →
      </button>
    </div>`
    )
    .join("");
}

/* ── Clicking "Verify this article" fills the form ── */
function prefillVerify(id) {
  const all = [...DEMO_ARTICLES]; // works even when backend provided extras
  const article = all.find((a) => a.id === id);
  if (!article) return;

  document.getElementById("title").value = article.title;
  document.getElementById("content").value = article.content;

  document.getElementById("verify").scrollIntoView({ behavior: "smooth" });
}

/* ════════════════════════════════════════════
   ANALYZE NEWS
   ════════════════════════════════════════════ */
async function analyzeNews() {
  const titleEl   = document.getElementById("title");
  const contentEl = document.getElementById("content");
  const resultEl  = document.getElementById("result");
  const btn       = document.getElementById("analyzeBtn");

  const title   = titleEl.value.trim();
  const content = contentEl.value.trim();

  if (!title && !content) {
    showError(resultEl, "Please enter a headline or article content before analyzing.");
    return;
  }

  /* Loading state */
  btn.disabled    = true;
  btn.textContent = "⏳ Analyzing…";
  resultEl.classList.add("hidden");
  resultEl.innerHTML = "";

  try {
    const res = await fetch(`${API_BASE}/api/analyze`, {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ title, content })
    });

    const data = await res.json();

    if (!res.ok || !data.success) {
      throw new Error(data.message || "Analysis failed.");
    }

    renderResult(resultEl, data);
  } catch (err) {
    /* Backend offline — run lightweight client-side heuristic */
    const fallback = localAnalyze(title + " " + content);
    renderResult(resultEl, fallback, true);
  } finally {
    btn.disabled    = false;
    btn.textContent = "🛡️ Analyze News";
  }
}

/* ── Render the result card ── */
function renderResult(el, data, isOffline = false) {
  const { prediction, confidence, explanation, probabilities, disclaimer } = data;

  const colorMap = {
    "Likely Reliable":      "#2a7d4f",
    "Needs Verification":   "#b07d1a",
    "Potentially Misleading": "#c54b32"
  };
  const iconMap = {
    "Likely Reliable":      "✅",
    "Needs Verification":   "⚠️",
    "Potentially Misleading": "🚨"
  };

  const color = colorMap[prediction] || "var(--accent)";
  const icon  = iconMap[prediction]  || "🔍";

  /* Build probability bars if available */
  let barsHtml = "";
  if (probabilities && typeof probabilities === "object") {
    barsHtml = Object.entries(probabilities)
      .sort((a, b) => b[1] - a[1])
      .map(([label, pct]) => `
        <div style="margin-bottom:8px;">
          <div style="display:flex;justify-content:space-between;font-size:12px;margin-bottom:3px;">
            <span>${escHtml(label)}</span><span>${pct.toFixed(1)}%</span>
          </div>
          <div style="background:#e4e3de;border-radius:3px;height:6px;overflow:hidden;">
            <div style="width:${pct}%;background:${colorMap[label] || "#999"};height:100%;border-radius:3px;transition:width .6s ease;"></div>
          </div>
        </div>`)
      .join("");
  }

  const offlineBadge = isOffline
    ? `<p style="font-size:11px;color:var(--muted);margin-top:8px;">⚡ Offline mode — heuristic estimate (backend not reachable)</p>`
    : "";

  el.style.borderLeftColor = color;
  el.innerHTML = `
    <div style="display:flex;align-items:center;gap:10px;margin-bottom:4px;">
      <span style="font-size:26px;">${icon}</span>
      <div>
        <p style="font-size:11px;letter-spacing:1.5px;font-weight:700;color:var(--muted);text-transform:uppercase;">Verdict</p>
        <p class="prediction" style="color:${color};font-size:22px;font-weight:700;margin:0;">${escHtml(prediction)}</p>
      </div>
      <div style="margin-left:auto;text-align:right;">
        <p style="font-size:11px;color:var(--muted);letter-spacing:1px;">CONFIDENCE</p>
        <p style="font-size:20px;font-weight:700;color:${color};margin:0;">${confidence.toFixed ? confidence.toFixed(1) : confidence}%</p>
      </div>
    </div>

    <hr style="margin:14px 0;border:0;border-top:1px solid #dddcd8;">

    <p style="font-size:14px;color:var(--text);margin-bottom:${barsHtml ? "14px" : "0"};">${escHtml(explanation)}</p>

    ${barsHtml ? `<div style="margin-bottom:6px;">${barsHtml}</div>` : ""}

    <p style="font-size:11px;color:var(--muted);margin-top:10px;font-style:italic;">${escHtml(disclaimer || "This AI prediction is not definitive proof that news is true or false.")}</p>
    ${offlineBadge}
  `;

  el.classList.remove("hidden");
  el.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

/* ── Lightweight offline heuristic (no ML) ── */
function localAnalyze(text) {
  const lower = text.toLowerCase();

  const misleadingSignals = [
    "cures every", "100%", "doctors hate", "secret", "they don't want you",
    "miracle", "banned", "hoax", "clickbait", "shocking truth",
    "moon will disappear", "banks will shut", "anonymous"
  ];
  const reliableSignals = [
    "official", "government", "published", "researchers", "study",
    "university", "department", "announced", "registered", "portal"
  ];
  const verifySignals = [
    "preliminary", "prototype", "testing", "unconfirmed", "alleged",
    "reportedly", "could", "may", "might", "claims"
  ];

  let misleadScore = misleadingSignals.filter((s) => lower.includes(s)).length;
  let reliableScore  = reliableSignals.filter((s) => lower.includes(s)).length;
  let verifyScore    = verifySignals.filter((s) => lower.includes(s)).length;

  let prediction, confidence, probabilities;

  if (misleadScore > reliableScore && misleadScore > verifyScore) {
    prediction = "Potentially Misleading";
    confidence  = Math.min(55 + misleadScore * 8, 88);
    probabilities = {
      "Potentially Misleading": confidence,
      "Needs Verification":     100 - confidence - 5,
      "Likely Reliable":        5
    };
  } else if (reliableScore > verifyScore) {
    prediction = "Likely Reliable";
    confidence  = Math.min(52 + reliableScore * 7, 85);
    probabilities = {
      "Likely Reliable":        confidence,
      "Needs Verification":     100 - confidence - 6,
      "Potentially Misleading": 6
    };
  } else {
    prediction = "Needs Verification";
    confidence  = 55;
    probabilities = {
      "Needs Verification":     55,
      "Likely Reliable":        25,
      "Potentially Misleading": 20
    };
  }

  const explanations = {
    "Likely Reliable":        "The text contains patterns typically associated with relatively reliable reporting.",
    "Needs Verification":     "The model cannot confidently determine reliability. Please verify with trusted sources.",
    "Potentially Misleading": "The text contains patterns commonly associated with potentially misleading content."
  };

  return {
    prediction,
    confidence,
    probabilities,
    explanation:  explanations[prediction],
    disclaimer:   "This AI prediction is not definitive proof that news is true or false."
  };
}

/* ════════════════════════════════════════════
   CATEGORY FILTER
   ════════════════════════════════════════════ */
function initCategories() {
  const buttons = document.querySelectorAll(".categories button");
  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      /* Toggle active style */
      buttons.forEach((b) => b.style.cssText = "");
      btn.style.cssText = "background:var(--dark);color:#fff;border-color:var(--dark);";

      const cat = btn.textContent.trim();
      filterNewsByCategory(cat);

      /* Scroll to news section */
      document.getElementById("latest").scrollIntoView({ behavior: "smooth" });
    });
  });
}

function filterNewsByCategory(category) {
  const cards = document.querySelectorAll(".news-card");

  if (!cards.length) {
    /* News not yet loaded — load first, then filter */
    loadNews().then(() => filterNewsByCategory(category));
    return;
  }

  cards.forEach((card) => {
    const catEl = card.querySelector(".category");
    const matches =
      !category ||
      category === "All" ||
      (catEl && catEl.textContent.trim().toLowerCase() === category.toLowerCase());

    card.style.display = matches ? "" : "none";
  });
}

/* ════════════════════════════════════════════
   HELPERS
   ════════════════════════════════════════════ */
function showError(el, msg) {
  el.style.borderLeftColor = "var(--accent)";
  el.innerHTML = `<p style="color:var(--accent);font-weight:600;">⚠️ ${escHtml(msg)}</p>`;
  el.classList.remove("hidden");
}

function escHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/* ── Char counter for textarea ── */
function initCharCounter() {
  const textarea = document.getElementById("content");
  if (!textarea) return;

  const counter = document.createElement("p");
  counter.style.cssText = "font-size:11px;color:var(--muted);text-align:right;margin-top:4px;";
  textarea.insertAdjacentElement("afterend", counter);

  const update = () => {
    counter.textContent = `${textarea.value.length} characters`;
  };
  textarea.addEventListener("input", update);
  update();
}

/* ── Clear form helper ── */
function clearForm() {
  document.getElementById("title").value   = "";
  document.getElementById("content").value = "";
  const resultEl = document.getElementById("result");
  resultEl.classList.add("hidden");
  resultEl.innerHTML = "";
}

/* ── Add a "Clear" button next to Analyze ── */
function initClearButton() {
  const analyzeBtn = document.getElementById("analyzeBtn");
  if (!analyzeBtn) return;

  const clearBtn = document.createElement("button");
  clearBtn.textContent = "✕ Clear";
  clearBtn.style.cssText =
    "width:100%;margin-top:10px;padding:12px;background:transparent;border:1px solid var(--line);border-radius:4px;cursor:pointer;font-family:inherit;font-size:14px;color:var(--muted);";
  clearBtn.onclick = clearForm;
  analyzeBtn.insertAdjacentElement("afterend", clearBtn);
}

/* ════════════════════════════════════════════
   INIT
   ════════════════════════════════════════════ */
document.addEventListener("DOMContentLoaded", () => {
  loadNews();
  initCategories();
  initCharCounter();
  initClearButton();
});
