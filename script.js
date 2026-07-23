document.getElementById("ava").src = INFO.avatar;
document.getElementById("ava").alt = INFO.username;
document.title = INFO.username;
document.getElementById("github-btn").href = INFO.github;

const favicon = document.createElement("link");
favicon.rel = "icon";
favicon.href = INFO.avatar;
document.head.appendChild(favicon);

const SOCIALS = [
  {
    href: "mailto:" + INFO.email,
    label: INFO.email,
    svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" style="color:#888"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5"/></svg>',
  },
  {
    href: INFO.linkedin,
    label: "LinkedIn",
    svg: '<svg viewBox="0 0 24 24" fill="currentColor" style="color:#0a66c2"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>',
  },
  {
    href: INFO.cv,
    label: "CV",
    svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" style="color:#888"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>',
  },
];

const slist = document.getElementById("slist");
SOCIALS.forEach((s) => {
  const a = document.createElement("a");
  a.href = s.href;
  a.className = "pill";
  if (!s.href.startsWith("mailto")) {
    a.target = "_blank";
    a.rel = "noopener noreferrer";
  }
  a.innerHTML = s.svg + s.label;
  slist.appendChild(a);
});

const STAR =
  '<svg viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>';

function ago(d) {
  const s = Math.floor((Date.now() - new Date(d)) / 1000);
  if (s < 60) return "just now";
  if (s < 3600) return Math.floor(s / 60) + "m ago";
  if (s < 86400) return Math.floor(s / 3600) + "h ago";
  if (s < 2592000) return Math.floor(s / 86400) + "d ago";
  if (s < 31536000) return Math.floor(s / 2592000) + "mo ago";
  return Math.floor(s / 31536000) + "y ago";
}

function esc(s) {
  return s.replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function resizeThread() {
  const nodes = document.querySelectorAll(".node");
  const last = nodes[nodes.length - 1];
  const thread = document.getElementById("thread");
  const canvas = document.querySelector(".canvas");
  if (!last || !thread || !canvas) return;
  const cr = canvas.getBoundingClientRect();
  const lr = last.getBoundingClientRect();
  const padTop = parseFloat(getComputedStyle(canvas).paddingTop);
  thread.style.top = padTop + "px";
  thread.style.height = lr.top - cr.top - padTop + lr.height / 2 + "px";
}

const CYCLE = 9000;

function easePhase(t, start, end) {
  if (t < start) return 0;
  if (t > end) return 1;
  return (t - start) / (end - start);
}

function inPhase(t, start, end) {
  return t >= start && t < end;
}

function loop() {
  const t = (Date.now() % CYCLE) / CYCLE;
  const thread = document.getElementById("thread");
  const spark = document.querySelector(".spark");
  if (!thread || !spark) {
    requestAnimationFrame(loop);
    return;
  }

  const h = thread.offsetHeight;

  const PHASES = {
    toActive: [0.0, 0.18],
    activeCard: [0.18, 0.38],
    toProjects: [0.38, 0.5],
    projectCards: [0.5, 0.7],
    github: [0.7, 0.8],
    toSocials: [0.8, 0.88],
    socialPills: [0.88, 1.0],
  };

  function lerp(a, b, t) {
    return a + (b - a) * Math.max(0, Math.min(1, t));
  }

  let pos;
  if (t < 0.18) pos = lerp(0, 0.22, t / 0.18);
  else if (t < 0.38) pos = lerp(0.22, 0.28, (t - 0.18) / 0.2);
  else if (t < 0.5) pos = lerp(0.28, 0.55, (t - 0.38) / 0.12);
  else if (t < 0.7) pos = lerp(0.55, 0.68, (t - 0.5) / 0.2);
  else if (t < 0.8) pos = lerp(0.68, 0.78, (t - 0.7) / 0.1);
  else if (t < 0.88) pos = lerp(0.78, 0.88, (t - 0.8) / 0.08);
  else pos = lerp(0.88, 1.0, (t - 0.88) / 0.12);

  const sparkY = -90 + pos * (h + 180);
  spark.style.top = sparkY + "px";

  const isGreen = inPhase(t, PHASES.activeCard[0], PHASES.activeCard[1]);
  spark.style.background = isGreen
    ? "linear-gradient(to bottom, transparent 0%, rgba(22,163,74,0.3) 20%, #16a34a 50%, rgba(22,163,74,0.3) 80%, transparent 100%)"
    : "linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.15) 20%, #111 50%, rgba(0,0,0,0.15) 80%, transparent 100%)";

  const ava = document.querySelector(".ava");
  if (ava) ava.classList.toggle("pulse-green", isGreen);

  const activeDot = document.querySelector(".dot.green");
  if (activeDot) {
    activeDot.style.opacity = "1";
  }

  const activeCard = document.querySelector(".active-card");
  if (activeCard) {
    activeCard.classList.toggle(
      "traced",
      inPhase(t, PHASES.activeCard[0], PHASES.activeCard[1]),
    );
  }

  document.querySelectorAll(".gcard").forEach((c) => {
    c.classList.toggle(
      "traced",
      inPhase(t, PHASES.projectCards[0], PHASES.projectCards[1]),
    );
  });

  const ghBtn = document.getElementById("github-btn");
  if (ghBtn) {
    ghBtn.classList.toggle(
      "glowing",
      inPhase(t, PHASES.github[0], PHASES.github[1]),
    );
  }

  const pills = document.querySelectorAll(".pill");
  pills.forEach((pill, i) => {
    const phaseStart = PHASES.socialPills[0] + i * 0.04;
    const phaseEnd = PHASES.socialPills[1];
    pill.classList.toggle("glowing", inPhase(t, phaseStart, phaseEnd));
  });

  requestAnimationFrame(loop);
}

(async () => {
  try {
    const res = await fetch(
      `https://api.github.com/users/${INFO.username}/repos?per_page=100&sort=pushed`,
    );
    const repos = await res.json();
    const list = repos
      .filter((r) => !r.fork && r.description)
      .sort((a, b) => new Date(b.pushed_at) - new Date(a.pushed_at));

    if (!list.length) {
      document.getElementById("active-wrap").innerHTML =
        '<p style="color:var(--muted)">No projects found.</p>';
      resizeThread();
      loop();
      return;
    }

    const active = list[0];
    const rest = list
      .slice(1)
      .sort((a, b) => b.stargazers_count - a.stargazers_count);

    document.getElementById("active-wrap").innerHTML = `
      <a href="${active.html_url}" target="_blank" rel="noopener noreferrer" class="active-card">
        <div class="active-top">
          <div class="active-name">${esc(active.name)}</div>
          <span class="badge">Active</span>
        </div>
        <div class="active-desc">${esc(active.description)}</div>
        <div class="active-meta">
          ${active.stargazers_count > 0 ? `<span class="stars">${STAR}${active.stargazers_count}</span>` : ""}
          <span class="ago">Updated ${ago(active.pushed_at)}</span>
        </div>
      </a>`;

    document.getElementById("grid-wrap").innerHTML = rest.length
      ? `
      <div class="grid">
        ${rest
          .map(
            (r) => `
          <a href="${r.html_url}" target="_blank" rel="noopener noreferrer" class="gcard">
            <div class="gcard-top">
              <div class="gname">${esc(r.name)}</div>
              ${r.stargazers_count > 0 ? `<span class="stars">${STAR}${r.stargazers_count}</span>` : ""}
            </div>
            <div class="gdesc">${esc(r.description)}</div>
          </a>`,
          )
          .join("")}
      </div>`
      : "";

    resizeThread();
    window.addEventListener("resize", resizeThread);
  } catch {
    document.getElementById("active-wrap").innerHTML =
      '<p style="color:var(--muted);font-size:0.9rem">Failed to load projects.</p>';
    resizeThread();
  }

  loop();
})();

function cp(txt) {
  navigator.clipboard.writeText(txt).catch(() => {
    const t = document.createElement("textarea");
    t.value = txt;
    t.style.cssText = "position:fixed;opacity:0";
    document.body.appendChild(t);
    t.select();
    document.execCommand("copy");
    t.remove();
  });
  const toast = document.getElementById("toast");
  toast.classList.add("on");
  setTimeout(() => toast.classList.remove("on"), 2000);
}
