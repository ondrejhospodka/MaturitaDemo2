// ── FIREBASE ─────────────────────────────────────────────────────
const FIREBASE_CONFIG = {
  apiKey: "AIzaSyAC8O2ePjgN-QZoWsWMq3ydBcJcIktbvkc",
  authDomain: "axioma-ec7f6.firebaseapp.com",
  projectId: "axioma-ec7f6",
  storageBucket: "axioma-ec7f6.firebasestorage.app",
  messagingSenderId: "445517585785",
  appId: "1:445517585785:web:e5ea3d151eb8d211dea3a8"
};
let _db = null;
try {
  firebase.initializeApp(FIREBASE_CONFIG);
  _db = firebase.firestore();
} catch(e) { console.warn('Firebase init failed:', e.message); }

const LEVELS = [
  { level: 0, name: 'GUEST',       xp: 0    },
  { level: 1, name: 'SCRIPT_KID',  xp: 50   },
  { level: 2, name: 'INFILTRATOR', xp: 150  },
  { level: 3, name: 'ANALYST',     xp: 350  },
  { level: 4, name: 'CRACKER',     xp: 650  },
  { level: 5, name: 'HACKER',      xp: 1100 },
  { level: 6, name: 'GHOST',       xp: 1700 },
  { level: 7, name: 'PHANTOM',     xp: 2500 },
  { level: 8, name: 'CIPHER',      xp: 3500 },
];

const ACHIEVEMENTS = [
  // ── ONBOARDING ──────────────────────────────────────────────────
  {
    id: 'ACH_FIRST', name: 'FIRST_BREACH', secret: false,
    flavor: 'Přístup povolen. Systém kompromitován.',
    condition: 'Vstup do své první arény.',
    reward: { type: 'battery', amount: 1, label: '+1 Recharge Battery (+3 energie)' },
    color: '#00d2ff',
    icon: `<svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
      <rect x="8" y="20" width="24" height="16" rx="3"/>
      <path d="M14 20v-5a6 6 0 0 1 12 0v1"/>
      <circle cx="20" cy="28" r="2" fill="currentColor" stroke="none"/>
      <line x1="20" y1="30" x2="20" y2="33"/>
    </svg>`,
  },
  {
    id: 'ACH_FIRST_CORRECT', name: 'ACCESS_GRANTED', secret: false,
    flavor: 'Průnik potvrzen. Cesta do systému otevřena.',
    condition: 'Správně vyřeš svůj první firewall.',
    reward: { type: 'xp', amount: 10, label: '+10 XP' },
    color: '#2ecc8a',
    icon: `<svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <rect x="4" y="4" width="32" height="32" rx="3"/>
      <polyline points="11,20 17,27 29,13" stroke-width="2.5"/>
    </svg>`,
  },
  {
    id: 'ACH_BUY_LIFE', name: 'RESOURCE_ALLOCATION', secret: false,
    flavor: 'Přesměrování zdrojů schváleno.',
    condition: 'Nakup si nový pokus za XP.',
    reward: { type: 'xp', amount: 5, label: '+5 XP cashback' },
    color: '#00d2ff',
    icon: `<svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <polygon points="20,4 33,11 33,25 20,32 7,25 7,11"/>
      <text x="20" y="22" font-family="monospace" font-size="11" fill="currentColor" stroke="none" text-anchor="middle">¤</text>
      <line x1="7" y1="18" x2="2" y2="18"/>
      <line x1="33" y1="18" x2="38" y2="18"/>
    </svg>`,
  },
  // ── SKILL ────────────────────────────────────────────────────────
  {
    id: 'ACH_NOHINT', name: 'GHOST_MODE', secret: true,
    flavor: 'Žádná stopa. Celý sektor bez pomoci. Kapacita rozšířena.',
    condition: 'Projdi celý modul bez jediného použití nápovědy.',
    reward: { type: 'maxHp', amount: 1, label: '+1 permanentní HP slot' },
    color: '#7c5cfc',
    icon: `<svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
      <path d="M5 20 Q20 8 35 20 Q20 32 5 20"/>
      <circle cx="20" cy="20" r="4"/>
      <line x1="6" y1="6" x2="34" y2="34" stroke-width="2.5"/>
    </svg>`,
  },
  {
    id: 'ACH_STREAK', name: 'ZERO_RESISTANCE', secret: false,
    flavor: 'Firewall se vzdal. Odpor = 0.',
    condition: 'Vyřeš 15 příkladů za sebou správně bez jediné chyby.',
    reward: { type: 'xp', amount: 10, label: '+10 XP' },
    color: '#f7b84f',
    icon: `<svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <polyline points="22,4 14,20 20,20 18,36 26,20 20,20 22,4"/>
    </svg>`,
  },
  {
    id: 'ACH_TRAINER', name: 'SIMULATION_CORE', secret: false,
    flavor: 'Tréning dokončen. Simulace provedeny. Systém aktualizován.',
    condition: 'Dokonči 25 simulací (SIM).',
    reward: { type: 'xp', amount: 15, label: '+15 XP' },
    color: '#2ecc8a',
    icon: `<svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <rect x="4" y="8" width="32" height="24" rx="2"/>
      <polyline points="10,23 16,17 10,11"/>
      <line x1="19" y1="27" x2="31" y2="27"/>
    </svg>`,
  },
  {
    id: 'ACH_PERSISTENCE', name: 'PERSISTENCE', secret: false,
    flavor: 'Systém testoval tvou vůli. Prošels.',
    condition: 'Správně vyřeš příklad, na kterém jsi předtím dvakrát selhal.',
    reward: { type: 'xp', amount: 15, label: '+15 XP' },
    color: '#f7b84f',
    icon: `<svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M32 12 A13 13 0 1 0 35 22"/>
      <polyline points="35,12 35,22 25,22"/>
      <line x1="14" y1="17" x2="18" y2="21"/>
      <line x1="18" y1="17" x2="14" y2="21"/>
      <line x1="23" y1="17" x2="27" y2="21"/>
      <polyline points="22,23 25,27 31,21" stroke="#2ecc8a" stroke-width="2.5"/>
    </svg>`,
  },
  {
    id: 'ACH_LAST_STAND', name: 'LAST_STAND', secret: false,
    flavor: 'Jeden pokus. Jeden průnik. Stačilo.',
    condition: 'Správně odpověz, když ti zbývá právě 1 pokus.',
    reward: { type: 'xp', amount: 15, label: '+15 XP' },
    color: '#ff3b6a',
    icon: `<svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M20 4 L34 10 L34 22 Q34 32 20 37 Q6 32 6 22 L6 10 Z"/>
      <text x="20" y="27" font-family="monospace" font-size="16" font-weight="bold" fill="currentColor" stroke="none" text-anchor="middle">1</text>
    </svg>`,
  },
  // ── PROGRESS ─────────────────────────────────────────────────────
  {
    id: 'ACH_SECTOR', name: 'SECTOR_CLEAR', secret: false,
    flavor: 'Sektor pod kontrolou.',
    condition: 'Vyřeš všechny firewally v jednom modulu.',
    reward: { type: 'xp', amount: 25, label: '+25 XP' },
    color: '#00d2ff',
    icon: `<svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
      <rect x="4" y="4" width="14" height="14" rx="1"/>
      <rect x="22" y="4" width="14" height="14" rx="1"/>
      <rect x="4" y="22" width="14" height="14" rx="1"/>
      <rect x="22" y="22" width="14" height="14" rx="1"/>
      <polyline points="25,29 28,32 34,26" stroke="#2ecc8a" stroke-width="2.5"/>
    </svg>`,
  },
  {
    id: 'ACH_CLEAN', name: 'CLEAN_SWEEP', secret: false,
    flavor: 'Nulová chybovost. Systém respektuje.',
    condition: 'Vyřeš 3 různé moduly bez jediné chyby.',
    reward: { type: 'battery', amount: 1, label: '+1 Recharge Battery (+3 energie)' },
    color: '#2ecc8a',
    icon: `<svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M20 4 L33 10 L33 22 Q33 32 20 37 Q7 32 7 22 L7 10 Z"/>
      <polyline points="13,20 18,26 28,14"/>
    </svg>`,
  },
  {
    id: 'ACH_VETERAN', name: 'VETERAN', secret: false,
    flavor: 'Bojový záznam ověřen. Přístup: SENIOR.',
    condition: 'Správně vyřeš celkem 30 firewallů.',
    reward: { type: 'xp', amount: 40, label: '+40 XP' },
    color: '#f7b84f',
    icon: `<svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <polygon points="20,4 24,15 36,15 27,23 30,34 20,27 10,34 13,23 4,15 16,15"/>
    </svg>`,
  },
  {
    id: 'ACH_HALFWAY', name: 'MIDPOINT_BREACH', secret: false,
    flavor: 'Polovina systému prolomena. Druhá polovina čeká.',
    condition: 'Správně vyřeš 60 firewallů.',
    reward: { type: 'xp', amount: 20, label: '+20 XP' },
    color: '#00d2ff',
    icon: `<svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
      <rect x="4" y="17" width="32" height="6" rx="1"/>
      <rect x="4" y="17" width="16" height="6" rx="1" fill="currentColor" stroke="none"/>
      <line x1="20" y1="9" x2="20" y2="31" stroke-width="2.5"/>
    </svg>`,
  },
  {
    id: 'ACH_FINAL_PUSH', name: 'FINAL_PUSH', secret: false,
    flavor: 'Zbývá minimum. Systém cítí tlak.',
    condition: 'Správně vyřeš 100 firewallů.',
    reward: { type: 'xp', amount: 30, label: '+30 XP' },
    color: '#7c5cfc',
    icon: `<svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M20 5 L14 22 L20 19 L26 22 Z"/>
      <line x1="14" y1="34" x2="26" y2="34"/>
      <line x1="16" y1="30" x2="14" y2="34"/>
      <line x1="24" y1="30" x2="26" y2="34"/>
      <line x1="20" y1="19" x2="20" y2="30"/>
    </svg>`,
  },
  {
    id: 'ACH_ALL', name: 'SYSTEM_OVERRIDE', secret: false,
    flavor: 'Všechny firewally padly. Není co přidat.',
    condition: 'Vyřeš všechny firewally v celé aplikaci.',
    color: '#ff3b6a',
    icon: `<svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
      <circle cx="20" cy="15" r="7"/>
      <path d="M13 15 Q12 22 8 28 L32 28 Q28 22 27 15"/>
      <line x1="14" y1="28" x2="12" y2="34"/>
      <line x1="26" y1="28" x2="28" y2="34"/>
      <line x1="10" y1="34" x2="30" y2="34"/>
      <line x1="4" y1="10" x2="8" y2="13"/>
      <line x1="36" y1="10" x2="32" y2="13"/>
      <line x1="20" y1="4" x2="20" y2="8"/>
    </svg>`,
  },
  // ── TAJNÉ ────────────────────────────────────────────────────────
  {
    id: 'ACH_PHOENIX', name: 'PHOENIX', secret: true,
    flavor: 'Po pádu — 3 průniky bez zaváhání. Systém respektuje.',
    condition: 'Po lockdownu vyřeš 3 firewally v řadě bez chyby.',
    reward: { type: 'battery', amount: 1, label: '+1 Recharge Battery (+3 energie)' },
    color: '#f7b84f',
    icon: `<svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M20 36 C12 28 6 20 10 12 C12 8 16 4 20 4 C24 4 28 8 30 12 C34 20 28 28 20 36"/>
      <path d="M16 20 L20 12 L24 20" stroke-width="2.5"/>
      <line x1="20" y1="12" x2="20" y2="28"/>
    </svg>`,
  },
  {
    id: 'ACH_IRON_WILL', name: 'IRON_WILL', secret: true,
    flavor: 'Lockdown nestačil. Region dokončen navzdory všemu.',
    condition: 'Dokonči celý region, ve kterém jsi zažil lockdown.',
    reward: { type: 'battery', amount: 1, label: '+1 Recharge Battery (+3 energie)' },
    color: '#ff3b6a',
    icon: `<svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M20 4 L34 10 L34 22 Q34 32 20 37 Q6 32 6 22 L6 10 Z"/>
      <path d="M15 18 L20 28 L25 18" stroke-width="2.5"/>
      <line x1="20" y1="10" x2="20" y2="28" stroke-width="2"/>
    </svg>`,
  },
];

function renderMath() {
  if (typeof MathJax !== 'undefined' && MathJax.typesetPromise) {
    MathJax.typesetPromise().catch((err) => console.error('MathJax error:', err));
  } else { setTimeout(renderMath, 100); }
}

function getDefaultState() {
  return JSON.parse(JSON.stringify({ xp: 0, clearedNodes: [], hp: 5, maxHp: 5, batteries: 0, achievements: [], streak: 0, correctAfterLockdown: -1, deathsPerQuestion: {}, errorsInRegion: {}, lockdownsInRegion: {}, cleanRegionCount: 0, hintedQuestions: [], celebratedModules: [], maxLevelEver: 0, lastPlayDate: null, dailyStreak: 0, dailyMissionDate: null, dailyMissionProgress: 0, dailyMissionClaimed: false, endgameSeen: false, onboardingSeen: false, totalDeaths: 0, firstLockdownSeen: false }));
}

function getTodayISO() { return new Date().toISOString().slice(0, 10); }
function getYesterdayISO() { return new Date(Date.now() - 86400000).toISOString().slice(0, 10); }

const Engine = {
  state: getDefaultState(),
  currentRegionId: null,

  init: function() {
    // Načti e-mail z URL parametru (předán Thinkificem přes {{email}})
    const urlEmail = new URLSearchParams(window.location.search).get('email') || '';
    this.saveKey = urlEmail ? 'axioma_save_' + urlEmail.toLowerCase().trim() : 'axioma_save';
    // Zobraz header okamžitě, mapu až po načtení stavu (Firestore je async)
    document.getElementById('view-map').classList.add('active');
    this.loadState().then(() => {
      this.updateUI();
      this.generateBlueprint();
      this.renderXPBar();
      this.renderDailyPanel();
      if (!this.state.onboardingSeen) this.showOnboarding();
    });
  },

  showOnboarding: function() {
    const overlay = document.createElement('div');
    overlay.id = 'onboarding-overlay';
    overlay.innerHTML = `
      <div class="onboarding-box">
        <div class="onboarding-tag">[ PŘÍSTUP UDĚLEN — INICIALIZACE ]</div>
        <div class="onboarding-lines">
          <div class="onboarding-line">Klikni na libovolný sektor na mapě.</div>
          <div class="onboarding-line">Vyřeš příklad a prolom firewall.</div>
          <div class="onboarding-line">Každá chyba stojí 1 energii. Máš jich 5.</div>
          <div class="onboarding-line">Na nule nastane LOCKDOWN — trénink a reset.</div>
          <div class="onboarding-line">Za správné odpovědi sbíráš XP a postupuješ na další levely.</div>
        </div>
        <button class="btn-primary onboarding-btn" onclick="Engine.closeOnboarding()">&gt; VSTOUPIT DO SYSTÉMU</button>
      </div>`;
    document.body.appendChild(overlay);
  },

  closeOnboarding: function() {
    const overlay = document.getElementById('onboarding-overlay');
    if (overlay) overlay.remove();
    this.state.onboardingSeen = true;
    this.saveState();
  },

  showRules: function() {
    const overlay = document.createElement('div');
    overlay.id = 'onboarding-overlay';
    overlay.innerHTML = `
      <div class="onboarding-box">
        <div class="onboarding-tag">[ PRAVIDLA SYSTÉMU ]</div>
        <div class="onboarding-lines">
          <div class="onboarding-line">Klikni na libovolný sektor na mapě.</div>
          <div class="onboarding-line">Vyřeš příklad a prolom firewall.</div>
          <div class="onboarding-line">Každá chyba stojí 1 energii. Máš jich 5.</div>
          <div class="onboarding-line">Na nule nastane LOCKDOWN — trénink a reset energie na 4.</div>
          <div class="onboarding-line">Energii lze dobít: DOBÍT ENERGII (−30 XP) nebo z Baterie (získáš po každém level-upu).</div>
          <div class="onboarding-line">Za správné odpovědi sbíráš XP a postupuješ na další levely.</div>
          <div class="onboarding-line" style="color:var(--neon-red)">⚠ LOCKDOWN PENALTY: každý LOCKDOWN odečte XP — čím víc máš, tím vyšší ztráta (−5 / −20 / −50 XP). Šetři energií!</div>
        </div>
        <button class="btn-primary onboarding-btn" onclick="document.getElementById('onboarding-overlay').remove()">&gt; ZAVŘÍT</button>
      </div>`;
    document.body.appendChild(overlay);
  },

  switchView: function(viewId) {
    // Detekce: přechod na základnu z dokončeného (a dosud neslazeného) modulu
    let pendingCelebration = null;
    if (viewId === 'view-map' && this.currentRegionId && this.currentRegionId !== 'maturita') {
      const rid = this.currentRegionId;
      if (this.isRegionCleared(rid) && !this.state.celebratedModules.includes(rid)) {
        pendingCelebration = rid;
        this.state.celebratedModules.push(rid);
        this.saveState();
      }
    }
    document.querySelectorAll('.view').forEach(el => el.classList.remove('active'));
    document.getElementById(viewId).classList.add('active');
    if(viewId === 'view-map') this.generateBlueprint();
    if(viewId === 'view-arena') renderMath();
    if (pendingCelebration) this.showModuleClearedPanel(pendingCelebration);
  },

  updateUI: function() {
    const hpContainer = document.getElementById('res-hp');
    let attempts = '';
    for (let i = 0; i < this.state.maxHp; i++) {
      attempts += `<span class="attempt-box${i < this.state.hp ? '' : ' lost'}"></span>`;
    }
    const batCount = this.state.batteries || 0;
    const batHtml = batCount > 0
      ? `<span class="battery-indicator pulse" onclick="Engine.useBattery()" title="Klikni pro +3 energie">⚡×${batCount}</span>`
      : `<span class="battery-indicator dim">⚡×0</span>`;
    hpContainer.innerHTML = `ENERGY: ${attempts} ${batHtml}`;
    document.getElementById('res-xp').innerText = this.state.xp;
    const levelEl = document.getElementById('res-level');
    if (levelEl) {
      const { current } = this.getLevelInfo(this.state.xp);
      levelEl.textContent = `LVL ${current.level} // ${current.name}`;
    }
    // Restart counter
    const rcEl = document.getElementById('restart-count');
    if (rcEl) {
      const restartKey = (this.saveKey || 'axioma_save') + '_restarts';
      const count = parseInt(localStorage.getItem(restartKey) || '0');
      rcEl.textContent = count > 0 ? `↺ ${count}×` : '';
      rcEl.title = `Počet tvrdých restartů: ${count}`;
    }
  },

  getLevelInfo: function(xp) {
    let idx = 0;
    for (let i = LEVELS.length - 1; i >= 0; i--) {
      if (xp >= LEVELS[i].xp) { idx = i; break; }
    }
    return { current: LEVELS[idx], next: LEVELS[idx + 1] || null };
  },

  renderXPBar: function() {
    const container = document.getElementById('map-xp-bar');
    if (!container) return;
    const xp = this.state.xp;
    const { current, next } = this.getLevelInfo(xp);

    // Bar 1 — XP level progress
    let xpBarHTML;
    if (!next) {
      xpBarHTML = `
        <div class="xp-bar-top">
          <span class="xp-lvl-badge" style="border-color:#ffd700;color:#ffd700">LVL ${current.level}</span>
          <span class="xp-lvl-name" style="color:#ffd700">${current.name}</span>
          <span class="xp-lvl-next" style="color:#ffd700">// PŘÍSTUP: MAXIMÁLNÍ</span>
        </div>
        <div class="xp-bar-track">
          <div class="xp-bar-fill" style="width:100%;background:#ffd700;box-shadow:0 0 12px #ffd700"></div>
          <span class="xp-bar-label">${xp} XP</span>
        </div>`;
    } else {
      const fromXp = xp - current.xp;
      const totalXp = next.xp - current.xp;
      const pct = Math.min(100, Math.round((fromXp / totalXp) * 100));
      xpBarHTML = `
        <div class="xp-bar-top">
          <span class="xp-lvl-badge">LVL ${current.level}</span>
          <span class="xp-lvl-name">${current.name}</span>
          <span class="xp-lvl-next">→ ${next.name} (LVL ${next.level}) &nbsp;|&nbsp; ${next.xp - xp} XP</span>
        </div>
        <div class="xp-bar-track">
          <div class="xp-bar-fill" style="width:${pct}%"></div>
          <span class="xp-bar-label">${fromXp} / ${totalXp} XP</span>
        </div>`;
    }

    // Bar 2 — XP potenciál s barevnými segmenty úrovní
    // Maximum = práh nejvyššího levelu (CIPHER = 3500), aby segmenty správně seděly
    const totalPossibleXP = LEVELS[LEVELS.length - 1].xp;
    const potPct = totalPossibleXP > 0 ? Math.min(100, Math.round((xp / totalPossibleXP) * 100)) : 0;
    const remaining = Math.max(0, totalPossibleXP - xp);
    const levelsLeft = next ? (LEVELS.length - 1 - current.level) : 0;

    // Barva každé úrovně — postupná progrese od modré k zlaté
    const LEVEL_COLORS = [
      '#3a3a6a', // 0 GUEST
      '#0077bb', // 1 SCRIPT_KID
      '#00b4a8', // 2 INFILTRATOR
      '#2ecc8a', // 3 ANALYST
      '#8bc34a', // 4 CRACKER
      '#f7b84f', // 5 HACKER
      '#e67e22', // 6 GHOST
      '#ff6b8a', // 7 PHANTOM
      '#ffd700', // 8 CIPHER (max level — zlatá)
    ];

    // Segmenty = barevné pruhy pro každou úroveň
    const potSegments = LEVELS.map((lvl, i) => {
      if (lvl.xp >= totalPossibleXP) return '';
      const segEnd = LEVELS[i + 1] ? LEVELS[i + 1].xp : totalPossibleXP;
      const clampedEnd = Math.min(segEnd, totalPossibleXP);
      const l = ((lvl.xp / totalPossibleXP) * 100).toFixed(2);
      const w = (((clampedEnd - lvl.xp) / totalPossibleXP) * 100).toFixed(2);
      return `<div style="position:absolute;top:0;left:${l}%;width:${w}%;height:100%;background:${LEVEL_COLORS[i] || '#888'}"></div>`;
    }).join('');

    // Tenké oddělovací čáry na hranicích úrovní
    const potTicks = LEVELS.slice(1).map(lvl => {
      if (lvl.xp <= 0 || lvl.xp >= totalPossibleXP) return '';
      const l = ((lvl.xp / totalPossibleXP) * 100).toFixed(2);
      return `<div style="position:absolute;top:0;left:${l}%;width:1px;height:100%;background:rgba(0,0,0,0.55);z-index:2"></div>`;
    }).join('');

    // Tmavý přesah přes nevydělané XP
    const potOverlay = potPct < 100
      ? `<div style="position:absolute;top:0;left:${potPct}%;width:${100 - potPct}%;height:100%;background:rgba(4,7,18,0.78);z-index:3"></div>`
      : '';

    const compBarHTML = `
      <div class="xp-bar-top" style="margin-top:10px">
        <span class="xp-lvl-badge" style="border-color:#f7b84f;color:#f7b84f">POTENCIÁL</span>

        <span class="xp-lvl-next">${levelsLeft > 0 ? `ještě ${levelsLeft} levelů · ` : '// MAX LEVEL · '}zbývá ${remaining} XP</span>
      </div>
      <div class="xp-bar-track">
        ${potSegments}${potTicks}${potOverlay}
        <span class="xp-bar-label" style="z-index:4;mix-blend-mode:normal;color:#fff;text-shadow:0 1px 3px rgba(0,0,0,0.9)">${xp} / ${totalPossibleXP} XP</span>
      </div>`;

    container.innerHTML = `<div class="xp-bar-wrap">${xpBarHTML}${compBarHTML}</div>`;
  },

  showLevelUp: function(levelData) {
    // Přiděl Recharge Battery za level-up
    this.state.batteries = (this.state.batteries || 0) + 1;
    this.saveState();
    this.updateUI();

    const toast = document.getElementById('level-up-toast');
    if (!toast) return;
    toast.innerHTML = `<span class="toast-tag">[ LEVEL UP ]</span><span class="toast-lvlname">${levelData.name}</span><span class="toast-lvlnum">LVL ${levelData.level}</span><span class="toast-battery">⚡ +1 RECHARGE BATTERY (+3 energie)</span>`;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 4500);
    this.renderXPBar();
  },

  unlockAchievement: function(id) {
    if (this.state.achievements.includes(id)) return;
    const ach = ACHIEVEMENTS.find(a => a.id === id);
    if (!ach) return;
    this.state.achievements.push(id);

    // Aplikuj odměnu
    let rewardHtml = '';
    if (ach.reward) {
      const r = ach.reward;
      if (r.type === 'xp') { this.state.xp += r.amount; }
      else if (r.type === 'battery') { this.state.batteries = (this.state.batteries || 0) + r.amount; }
      else if (r.type === 'maxHp') { this.state.maxHp += r.amount; this.state.hp += r.amount; }
      rewardHtml = `<div class="ach-toast-reward" style="color:${ach.color};margin-top:4px;font-family:'DM Mono',monospace;font-size:0.85em;">▸ ${r.label}</div>`;
    }
    this.saveState();
    this.updateUI();

    // Achievement toast — small bottom-right notification
    const toast = document.getElementById('ach-toast');
    if (!toast) return;
    toast.style.borderColor = ach.color;
    toast.style.boxShadow = `0 0 20px ${ach.color}44`;
    toast.innerHTML = `
      <span class="ach-toast-icon" style="color:${ach.color}">${ach.icon}</span>
      <div>
        <div class="ach-toast-tag">[ ACHIEVEMENT UNLOCKED ]</div>
        <div class="ach-toast-name" id="ach-scramble-target" style="color:${ach.color}"></div>
        <div class="ach-toast-flavor">${ach.flavor}</div>
        ${rewardHtml}
      </div>`;
    toast.classList.add('show');

    // Scramble animace: náhodné znaky → finální název
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_#@%';
    const target = document.getElementById('ach-scramble-target');
    const finalText = ach.name;
    let iteration = 0;
    const interval = setInterval(() => {
      if (!target) { clearInterval(interval); return; }
      target.textContent = finalText.split('').map((char, i) => {
        if (char === '_') return '_';
        if (i < iteration) return finalText[i];
        return chars[Math.floor(Math.random() * chars.length)];
      }).join('');
      if (iteration >= finalText.length) clearInterval(interval);
      iteration += 0.5;
    }, 40);

    setTimeout(() => toast.classList.remove('show'), 4500);
  },

  checkAchievements: function(context) {
    const s = this.state;
    const u = (id) => !s.achievements.includes(id);

    if (context === 'correct') {
      if (u('ACH_FIRST_CORRECT')) this.unlockAchievement('ACH_FIRST_CORRECT');
      if (u('ACH_STREAK') && s.streak >= 15) this.unlockAchievement('ACH_STREAK');
      if (u('ACH_LAST_STAND') && s.hp === 1) this.unlockAchievement('ACH_LAST_STAND');
      // PERSISTENCE: correct after 2+ prior failures on same question
      const qid = Arena.currentQuestion?.id;
      if (qid && u('ACH_PERSISTENCE') && (s.deathsPerQuestion[qid] || 0) >= 2) this.unlockAchievement('ACH_PERSISTENCE');
      // PHOENIX: 3 správně v řadě po lockdownu
      if (u('ACH_PHOENIX') && s.correctAfterLockdown >= 3) this.unlockAchievement('ACH_PHOENIX');
    }
    if (context === 'training_correct') {
      s.simCount = (s.simCount || 0) + 1;
      this.saveState();
      if (u('ACH_TRAINER') && s.simCount >= 25) this.unlockAchievement('ACH_TRAINER');
    }
    if (context === 'buy_life') {
      if (u('ACH_BUY_LIFE')) this.unlockAchievement('ACH_BUY_LIFE');
    }
    if (context === 'region_clear') {
      if (u('ACH_SECTOR')) this.unlockAchievement('ACH_SECTOR');
      // GHOST_MODE: celý sektor bez jediné použité nápovědy
      if (u('ACH_NOHINT')) {
        const regionBossIds = GameData.questions
          .filter(q => q.regionId === this.currentRegionId && !q.isTraining)
          .map(q => q.id);
        if (regionBossIds.length > 0 && !regionBossIds.some(id => s.hintedQuestions.includes(id))) {
          this.unlockAchievement('ACH_NOHINT');
        }
      }
      // IRON_WILL: region cleared after having lockdown in that region
      if (u('ACH_IRON_WILL') && s.lockdownsInRegion[this.currentRegionId]) this.unlockAchievement('ACH_IRON_WILL');
      // CLEAN_SWEEP: track how many regions cleared without error
      if (!s.errorsInRegion[this.currentRegionId]) {
        s.cleanRegionCount = (s.cleanRegionCount || 0) + 1;
        this.saveState();
        if (u('ACH_CLEAN') && s.cleanRegionCount >= 3) this.unlockAchievement('ACH_CLEAN');
      }
    }
    if (context === 'xp_change') {
      const total = GameData.questions.filter(q => !q.isTraining && q.id !== 'q_placeholder_11').length;
      const solved = s.clearedNodes.filter(id => id !== 'q_placeholder_11').length;
      if (u('ACH_VETERAN') && solved >= 30) this.unlockAchievement('ACH_VETERAN');
      if (u('ACH_HALFWAY') && solved >= 60) this.unlockAchievement('ACH_HALFWAY');
      if (u('ACH_FINAL_PUSH') && solved >= 100) this.unlockAchievement('ACH_FINAL_PUSH');
      if (u('ACH_ALL') && solved >= total) {
        this.unlockAchievement('ACH_ALL');
        setTimeout(() => this.showPreEndgame(), 5000); // Po achievement toastu
      }
    }
    if (context === 'wrong') {
      const qid = Arena.currentQuestion?.id;
      if (qid) {
        s.deathsPerQuestion[qid] = (s.deathsPerQuestion[qid] || 0) + 1;
      }
      if (this.currentRegionId) s.errorsInRegion[this.currentRegionId] = true;
      this.saveState();
    }
  },

  showAchievements: function() {
    const container = document.getElementById('ach-grid');
    if (!container) return;
    const unlocked = this.state.achievements;
    container.innerHTML = ACHIEVEMENTS.map(ach => {
      const isUnlocked = unlocked.includes(ach.id);
      const isSecret = ach.secret && !isUnlocked;
      const conditionText = isSecret ? 'Podmínky utajeny.' : ach.condition;
      const rewardText = (!isSecret && ach.reward) ? `<div class="ach-reward-label">Odměna: ${ach.reward.label}</div>` : '';
      return `
        <div class="ach-card ${isUnlocked ? 'unlocked' : 'locked'}" style="${isUnlocked ? `--ach-color:${ach.color}` : ''}">
          <div class="ach-icon">${isSecret ? `<svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="2"><text x="20" y="26" font-size="18" text-anchor="middle" fill="currentColor" stroke="none">?</text></svg>` : ach.icon}</div>
          <div class="ach-info">
            <div class="ach-name">${isSecret ? '???????????' : ach.name}</div>
            <div class="ach-flavor">${isSecret ? '???' : ach.flavor}</div>
            <div class="ach-condition">${conditionText}</div>
            ${rewardText}
          </div>
          ${isUnlocked ? '<div class="ach-check">✓</div>' : ''}
        </div>`;
    }).join('');
    this.switchView('view-achievements');
  },

  getClearedModulesCount: function() {
    let count = 0;
    GameData.regions.forEach(r => {
      if (r.id !== "maturita" && this.isRegionCleared(r.id)) count++;
    });
    return count;
  },

  isRegionCleared: function(regionId) {
    const regionQs = GameData.questions.filter(q => q.regionId === regionId && !q.isTraining);
    if (regionQs.length === 0) return false;
    return regionQs.every(q => this.state.clearedNodes.includes(q.id));
  },

  getRegionProgress: function(regionId) {
    const regionQs = GameData.questions.filter(q => q.regionId === regionId && !q.isTraining);
    const total = regionQs.length;
    const solved = regionQs.filter(q => this.state.clearedNodes.includes(q.id)).length;
    return { solved, total };
  },

  isRegionUnlocked: function(region) {
    if (region.id === "maturita") {
      return this.getClearedModulesCount() >= GameData.config.modulesRequiredForCore;
    }
    return true; // Všechny moduly jsou dostupné od začátku
  },

  buyBypass: function() {
    if (this.state.hp >= this.state.maxHp) {
      alert("Energie je plná. Dobíjení není třeba.");
      return;
    }
    if (this.state.xp >= GameData.config.bypassCost) {
      this.state.xp -= GameData.config.bypassCost;
      this.state.hp += 1;
      this.saveState();
      this.updateUI();
      this.checkAchievements('buy_life');
      alert(`+1 energie. Stav: ${this.state.hp}/${this.state.maxHp}.`);
    } else {
      alert("Nedostatek XP. Vyřešte další úlohy v Síti.");
    }
  },

  useBattery: function() {
    if (Arena.lockdownMode) {
      alert("Systém zablokován. Dokonči simulaci — teprve pak bude přístup k energii obnoven.");
      return;
    }
    if (!this.state.batteries || this.state.batteries <= 0) {
      alert("Nemáte žádnou Recharge Battery.");
      return;
    }
    if (this.state.hp >= this.state.maxHp) {
      alert("Energie je plná. Baterii šetřete na později.");
      return;
    }
    this.state.batteries -= 1;
    this.state.hp = Math.min(this.state.hp + 3, this.state.maxHp);
    this.saveState();
    this.updateUI();
    alert(`Recharge Battery použita. +3 energie → ${this.state.hp}/${this.state.maxHp}.`);
  },

  generateBlueprint: function() {
    const svg = document.getElementById('blueprint-svg');

    // ── Geometrie prstenu ──────────────────────────────────────────
    const modules = GameData.regions.filter(r => r.id !== 'maturita');
    const N  = modules.length;   // dynamicky podle počtu regionů
    const cx = 375, cy = 350, R = 185;   // střed prstenu a poloměr
    const clearedCount  = this.getClearedModulesCount();
    const totalModules  = modules.length;
    const isMaturitaCleared = this.state.endgameSeen;
    const totalBossCount = GameData.questions.filter(q => !q.isTraining).length;
    const solvedBossCount = this.state.clearedNodes.length;
    const allBossesCleared = solvedBossCount >= totalBossCount;

    // Polohy uzlů rovnoměrně na kružnici (od 12 hodin po směru hodinových ručiček)
    const nodes = modules.map((_, i) => {
      const a = -Math.PI / 2 + i * 2 * Math.PI / N;
      return { x: Math.round(cx + R * Math.cos(a)), y: Math.round(cy + R * Math.sin(a)) };
    });

    // ── SVG obsah ─────────────────────────────────────────────────
    let h = `
      <defs>
        <filter id="gg" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="5" result="b"/><feComposite in="SourceGraphic" in2="b" operator="over"/>
        </filter>
        <filter id="gr" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="4" result="b"/><feComposite in="SourceGraphic" in2="b" operator="over"/>
        </filter>
        <filter id="gb" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="14" result="b"/><feComposite in="SourceGraphic" in2="b" operator="over"/>
        </filter>
        <filter id="gc" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="3" result="b"/><feComposite in="SourceGraphic" in2="b" operator="over"/>
        </filter>
        <filter id="fog1" x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur stdDeviation="22"/>
        </filter>
        <filter id="fog2" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="9"/>
        </filter>
      </defs>

      <!-- Mlhová kružnice – tři vrstvená halo -->
      <circle cx="${cx}" cy="${cy}" r="${R}" fill="none" stroke="#00d2ff" stroke-width="90" filter="url(#fog1)" opacity="0.07"/>
      <circle cx="${cx}" cy="${cy}" r="${R}" fill="none" stroke="#00b4d8" stroke-width="50" filter="url(#fog2)" opacity="0.13"/>
      <circle cx="${cx}" cy="${cy}" r="${R}" fill="none" stroke="#00d2ff" stroke-width="16" filter="url(#fog2)" opacity="0.22"/>
      <circle cx="${cx}" cy="${cy}" r="${R}" fill="none" stroke="#7ae7ff" stroke-width="2" filter="url(#gc)" opacity="0.35"/>

      <!-- Otáčející se přerušovaný prsten (CERN styl) -->
      <circle cx="${cx}" cy="${cy}" r="${R}" fill="none" stroke="#00d2ff" stroke-width="1.5"
              stroke-dasharray="7,12" class="spin-ring" opacity="0.55"/>

      <!-- Vnitřní tmavý kruh (oblast MATURITA) -->
      <circle cx="${cx}" cy="${cy}" r="135" fill="#060913" stroke="#0d1e38" stroke-width="1.5"/>
      <circle cx="${cx}" cy="${cy}" r="135" fill="none" stroke="#00d2ff" stroke-width="0.8"
              stroke-dasharray="2,16" opacity="0.18"/>

      <!-- Sonarový pulz ze středu -->
      <circle cx="${cx}" cy="${cy}" r="${R}" fill="none" stroke="#00d2ff" stroke-width="1.2" class="sonar-pulse"/>
    `;

    // ── Obloukové spoje mezi sousedními uzly ──────────────────────
    for (let i = 0; i < N; i++) {
      const j  = (i + 1) % N;
      const ni = nodes[i], nj = nodes[j];
      const cA = this.isRegionCleared(modules[i].id);
      const cB = this.isRegionCleared(modules[j].id);
      const lit = cA && cB;
      h += `<path d="M ${ni.x} ${ni.y} A ${R} ${R} 0 0 1 ${nj.x} ${nj.y}"
              fill="none" stroke="${lit ? '#2ecc8a' : '#0b1e2e'}"
              stroke-width="${lit ? 5 : 4}"
              ${lit ? 'filter="url(#gg)"' : ''}/>`;
    }

    // ── Paprsky ze středu — pod středovým textem, svítí po dořešení ─
    modules.forEach((_, idx) => {
      const pos = nodes[idx];
      h += `<line x1="${cx}" y1="${cy}" x2="${pos.x}" y2="${pos.y}"
              stroke="#00d2ff" stroke-width="0.8" opacity="0.18"/>`;
    });

    // ── Střed: MATURITA display ────────────────────────────────────
    const barW  = 182, barH = 15;
    const barX  = cx - barW / 2;
    const barY  = cy + 24;
    const fillW = Math.round(barW * Math.min(clearedCount / totalModules, 1));
    const mCol  = isMaturitaCleared ? '#7c5cfc' : (allBossesCleared ? '#ff3b6a' : '#e2e8f0');
    const mFilt = allBossesCleared ? 'filter="url(#gr)"' : '';

    h += `
      <text x="${cx}" y="${cy - 62}" fill="#64748b" font-family="DM Mono"
            font-size="9" text-anchor="middle" letter-spacing="3">CÍLOVÝ SYSTÉM</text>
      <text x="${cx}" y="${cy - 34}" fill="${mCol}" font-family="Inter"
            font-size="22" font-weight="800" text-anchor="middle" letter-spacing="4" ${mFilt}>
        ${isMaturitaCleared ? 'DOKONČENO' : 'MATURITA'}
      </text>
      <line x1="${cx-68}" y1="${cy-18}" x2="${cx+68}" y2="${cy-18}" stroke="#1a2544" stroke-width="1"/>
      <text x="${cx}" y="${cy+12}" fill="#64748b" font-family="DM Mono"
            font-size="10" text-anchor="middle">${clearedCount} / ${totalModules} modulů dokončeno</text>

      <!-- Progress bar -->
      <rect x="${barX}" y="${barY}" width="${barW}" height="${barH}" rx="4"
            fill="#0c1222" stroke="#1a2544" stroke-width="1"/>
      ${fillW > 0 ? `<rect x="${barX}" y="${barY}" width="${Math.max(fillW, 8)}" height="${barH}" rx="4"
            fill="#2ecc8a" filter="url(#gg)"/>` : ''}
      <text x="${cx}" y="${barY + barH/2 + 1}" fill="${fillW > barW/2 ? '#001a0f' : '#2ecc8a'}"
            font-family="DM Mono" font-size="10" font-weight="bold"
            text-anchor="middle" dominant-baseline="middle">
        ${Math.round((clearedCount / totalModules) * 100)} %
      </text>
    `;

    if (allBossesCleared && !isMaturitaCleared) {
      h += `
        <g onclick="Engine.showPreEndgame()" style="cursor:pointer">
          <rect x="${cx-100}" y="${barY+24}" width="200" height="34" rx="3"
                fill="rgba(255,59,106,0.12)" stroke="#ff3b6a" stroke-width="1.5" filter="url(#gr)"/>
          <text x="${cx}" y="${barY+41}" fill="#ff3b6a" font-family="Inter"
                font-size="12" font-weight="800" text-anchor="middle" dominant-baseline="middle"
                letter-spacing="2">▶ HACKNOUT MATURITU</text>
        </g>`;
    } else if (!allBossesCleared) {
      const remaining = totalBossCount - solvedBossCount;
      h += `
        <text x="${cx}" y="${barY+44}" fill="#475569" font-family="DM Mono"
              font-size="10" text-anchor="middle">Zbývá ${remaining} firewallů</text>`;
    } else if (isMaturitaCleared) {
      h += `
        <text x="${cx}" y="${barY+44}" fill="#7c5cfc" font-family="DM Mono"
              font-size="11" text-anchor="middle" filter="url(#gc)">SYSTÉM ODEMČEN ✓</text>`;
    }

    // ── Uzly modulů na prstenu ────────────────────────────────────
    const NODE_R = 20;
    const NODE_CIRC = +(2 * Math.PI * NODE_R).toFixed(3); // ~125.664

    // DEMO: pouze algebra a rovnice jsou aktivní
    const DEMO_REGIONS = ['algebra', 'rovnice'];

    modules.forEach((region, idx) => {
      const pos      = nodes[idx];
      const cleared  = this.isRegionCleared(region.id);
      const progress = this.getRegionProgress(region.id);
      const num      = String(region.moduleNum).padStart(2, '0');
      const isDemo   = !DEMO_REGIONS.includes(region.id);

      if (isDemo) {
        // Šedivý zamčený uzel — neklikatelný
        h += `
          <g class="lock-group region-disabled" data-region="${region.id}">
            <circle cx="${pos.x}" cy="${pos.y}" r="${NODE_R}" fill="#0a0c14" stroke="#2a3040"
                    stroke-width="2"/>
            <text x="${pos.x}" y="${pos.y}" fill="#2a3040" font-family="DM Mono"
                  font-size="11" font-weight="bold"
                  text-anchor="middle" dominant-baseline="middle" style="pointer-events:none">${num}</text>
          </g>`;
      } else if (cleared) {
        h += `
          <g class="lock-group" data-region="${region.id}" onclick="Engine.showRegion('${region.id}')">
            <!-- Zelené podsvícení dořešeného uzlu -->
            <circle cx="${pos.x}" cy="${pos.y}" r="${NODE_R}" fill="#09200f" stroke="#2ecc8a"
                    stroke-width="2.5" filter="url(#gg)"/>
            <!-- Pulzující zelené halo (neon glow, stejný r) -->
            <circle class="pulse-halo-green" cx="${pos.x}" cy="${pos.y}" r="${NODE_R}" fill="none"
                    stroke="#2ecc8a" stroke-width="9" opacity="0" filter="url(#fog2)"
                    style="pointer-events:none"/>
            <text x="${pos.x}" y="${pos.y}" fill="#2ecc8a" font-family="DM Mono"
                  font-size="11" font-weight="bold"
                  text-anchor="middle" dominant-baseline="middle" style="pointer-events:none"
                  filter="url(#gg)">${num}</text>
            <circle id="hl-ring-${region.id}" cx="${pos.x}" cy="${pos.y}" r="${NODE_R+8}"
                    fill="none" stroke="#00d2ff" stroke-width="2" stroke-dasharray="5,3" opacity="0"
                    style="pointer-events:none; transition: opacity 0.2s" filter="url(#gc)"/>
          </g>`;
      } else {
        // Červený základ + zelený oblouk podle progresu
        const arcLength = progress.total > 0
          ? +((progress.solved / progress.total) * NODE_CIRC).toFixed(3)
          : 0;
        const hasProgress = arcLength > 0;

        h += `
          <g class="lock-group" data-region="${region.id}" onclick="Engine.showRegion('${region.id}')">
            <title>${region.name} (${progress.solved}/${progress.total})</title>
            <!-- Červený základ -->
            <circle cx="${pos.x}" cy="${pos.y}" r="${NODE_R}" fill="#160510" stroke="#ff3b6a"
                    stroke-width="2.5" filter="url(#gr)" class="pulse-node"/>
            ${hasProgress ? `
            <!-- Zelený progress oblouk, začíná od 12 hodin -->
            <circle cx="${pos.x}" cy="${pos.y}" r="${NODE_R}" fill="none" stroke="#2ecc8a"
                    stroke-width="2.5" filter="url(#gg)"
                    stroke-dasharray="${arcLength} ${NODE_CIRC}"
                    transform="rotate(-90 ${pos.x} ${pos.y})"/>
            <!-- Smíchané halo: červená a zelená se střídají (neon glow) -->
            <circle class="pulse-halo-mix-r" cx="${pos.x}" cy="${pos.y}" r="${NODE_R}" fill="none"
                    stroke="#ff3b6a" stroke-width="9" opacity="0" filter="url(#fog2)"
                    style="pointer-events:none"/>
            <circle class="pulse-halo-mix-g" cx="${pos.x}" cy="${pos.y}" r="${NODE_R}" fill="none"
                    stroke="#2ecc8a" stroke-width="9" opacity="0" filter="url(#fog2)"
                    style="pointer-events:none"/>
            ` : `
            <!-- Čistě červené halo (žádný progress, neon glow) -->
            <circle class="pulse-halo-red" cx="${pos.x}" cy="${pos.y}" r="${NODE_R}" fill="none"
                    stroke="#ff3b6a" stroke-width="9" opacity="0" filter="url(#fog2)"
                    style="pointer-events:none"/>
            `}
            <text x="${pos.x}" y="${pos.y}" fill="#ff3b6a" font-family="DM Mono"
                  font-size="11" font-weight="bold"
                  text-anchor="middle" dominant-baseline="middle" style="pointer-events:none"
                  filter="url(#gr)">${num}</text>
            <circle id="hl-ring-${region.id}" cx="${pos.x}" cy="${pos.y}" r="${NODE_R+8}"
                    fill="none" stroke="#00d2ff" stroke-width="2" stroke-dasharray="5,3" opacity="0"
                    style="pointer-events:none; transition: opacity 0.2s" filter="url(#gc)"/>
          </g>`;
      }
    });

    // ── Legenda — HTML sidebar ──────────────────────────────────────
    const sidebar = document.getElementById('legend-sidebar');
    let legendHTML = `
      <div class="legend-header"><h3>PŘÍSTUPOVÉ KÓDY</h3></div>`;

    modules.forEach((region) => {
      const cleared   = this.isRegionCleared(region.id);
      const progress  = this.getRegionProgress(region.id);
      const col       = cleared ? '#2ecc8a' : '#ff3b6a';
      const status    = cleared
        ? '✓ HACKNUTO'
        : (progress.solved > 0 ? `${progress.solved}/${progress.total} vyřešeno` : '▶ FIREWALL AKTIVNÍ');
      const num    = String(region.moduleNum !== undefined ? region.moduleNum : 0).padStart(2, '0');
      const sName  = region.name.replace(/^\d+: /, '');

      // Progress arc v SVG kruhu (r=9)
      const LR   = 9;
      const LCIRC = +(2 * Math.PI * LR).toFixed(3);
      const arcLen = progress.total > 0
        ? +((progress.solved / progress.total) * LCIRC).toFixed(3)
        : 0;

      const arcSVG = (!cleared && arcLen > 0) ? `
        <circle cx="11" cy="11" r="${LR}" fill="none" stroke="#2ecc8a"
                stroke-width="2.5" stroke-dasharray="${arcLen} ${LCIRC}"
                transform="rotate(-90 11 11)"/>` : '';
      const glowFilter = cleared ? 'style="filter: drop-shadow(0 0 5px #2ecc8a)"' : '';

      const isLegendDemo = !DEMO_REGIONS.includes(region.id);

      legendHTML += `
        <div class="legend-item${isLegendDemo ? ' legend-disabled' : ''}" data-legend-item="${region.id}"
             ${isLegendDemo ? '' : `onclick="Engine.showRegion('${region.id}')"`}>
          <div class="legend-node" ${glowFilter}>
            <svg class="arc" width="36" height="36" viewBox="0 0 22 22">
              <circle cx="11" cy="11" r="${LR}" fill="${col}"/>
              ${arcSVG}
            </svg>
            <span class="num">${num}</span>
          </div>
          <div class="legend-texts">
            <div class="legend-name" style="color:${col}">${sName}</div>
            <div class="legend-status" style="color:${col}">${status}</div>
          </div>
        </div>`;
    });

    legendHTML += `<div class="legend-footer">${clearedCount}/${totalModules} modulů dokončeno</div>`;
    sidebar.innerHTML = legendHTML;

    svg.innerHTML = h;
    this.renderXPBar();

    // ── Hover: propojení uzlů (SVG) ↔ legenda (HTML sidebar) ──────────
    modules.forEach(region => {
      const ringEl   = svg.querySelector(`[data-region="${region.id}"]`);
      const legendEl = sidebar.querySelector(`[data-legend-item="${region.id}"]`);
      const hlRing   = svg.querySelector(`#hl-ring-${region.id}`);
      const show = () => {
        if (hlRing)   hlRing.style.opacity = '1';
        if (legendEl) legendEl.classList.add('hl');
      };
      const hide = () => {
        if (hlRing)   hlRing.style.opacity = '0';
        if (legendEl) legendEl.classList.remove('hl');
      };
      if (ringEl)   { ringEl.addEventListener('mouseenter',   show); ringEl.addEventListener('mouseleave',   hide); }
      if (legendEl) { legendEl.addEventListener('mouseenter', show); legendEl.addEventListener('mouseleave', hide); }
    });
  },

  showRegion: function(regionId) {
    this.currentRegionId = regionId;
    const region = GameData.regions.find(r => r.id === regionId);
    const questions = GameData.questions.filter(q => q.regionId === regionId && !q.isTraining);

    document.getElementById('region-detail-name').innerText = region.name;
    const list = document.getElementById('region-encounters');
    list.innerHTML = '';

    if(questions.length === 0) {
      list.innerHTML = '<p class="text-muted">Systém nenašel žádné hrozby v tomto sektoru.</p>';
    } else {
      questions.forEach((q, i) => {
        const isCleared = this.state.clearedNodes.includes(q.id);
        const card = document.createElement('div');
        card.className = 'encounter-card' + (isCleared ? ' cleared' : '');
        if (!isCleared) {
          card.onclick = () => Arena.startEncounter(q.id);
        } else {
          card.onclick = () => Arena.startReview(q.id);
          card.style.cursor = 'pointer';
        }

        card.innerHTML = `
          <div class="enc-info">
            <h3>${isCleared ? '[HACKED ✓] ' : ''}${q.monsterName}</h3>
            <span class="enc-reward">Auth: ${q.reward.xp || 0}</span>
          </div>
          <div class="enc-action">${isCleared ? '> OPAKOVAT' : '> HACKNOUT'}</div>
        `;
        list.appendChild(card);
      });
    }
    this.switchView('view-region');
  },

  returnToRegion: function() {
    Arena.reviewMode = false;
    if(this.currentRegionId) this.showRegion(this.currentRegionId);
    else this.switchView('view-map');
  },

  addResources: function(xpEarned) {
    if(!xpEarned) return;
    const oldLevel = this.getLevelInfo(this.state.xp).current.level;
    const oldXp = this.state.xp;
    this.state.xp += xpEarned;
    const newLevel = this.getLevelInfo(this.state.xp).current.level;
    const maxEver = this.state.maxLevelEver || 0;
    // Level-up celebration a battery jen při prvním překročení tohoto prahu
    // Zabraňuje smyčce nákup Single Charge → XP pod práh → správná odpověď → znovu battery
    if (newLevel > maxEver) {
      this.state.maxLevelEver = newLevel;
    }
    // Upozornění na zvýšení LOCKDOWN penalty při překročení XP prahů
    const PENALTY_MILESTONES = [
      { threshold: 300,  newPenalty: 20, label: '−20 XP' },
      { threshold: 1500, newPenalty: 50, label: '−50 XP' },
    ];
    for (const m of PENALTY_MILESTONES) {
      if (oldXp < m.threshold && this.state.xp >= m.threshold) {
        setTimeout(() => this.showPenaltyMilestone(m.label), 800);
        break;
      }
    }
    this.saveState();
    setTimeout(() => {
      this.updateUI();
      if (newLevel > oldLevel && newLevel > maxEver) this.showLevelUp(LEVELS[newLevel]);
    }, 400);
  },

  showPenaltyMilestone: function(penaltyLabel) {
    const el = document.createElement('div');
    el.style.cssText = `position:fixed;top:80px;left:50%;transform:translateX(-50%);
      background:#1a0a0a;border:1px solid var(--neon-red);border-radius:8px;
      padding:14px 22px;z-index:9999;max-width:380px;text-align:center;
      color:var(--neon-red);font-family:var(--font-mono);font-size:0.88em;
      box-shadow:0 0 18px rgba(255,40,60,0.35);animation:fadeInDown 0.3s ease;`;
    el.innerHTML = `<div style="font-weight:bold;margin-bottom:6px;">⚠ LOCKDOWN PENALTY ZVÝŠENA</div>
      <div style="color:#e2e8f0">Teď máš dost XP, aby LOCKDOWN bolel více.<br>
      Každý příští LOCKDOWN odečte <span style="color:var(--neon-red);font-weight:bold">${penaltyLabel}</span>.</div>
      <div style="margin-top:8px;font-size:0.82em;color:var(--text-muted)">Kliknutím zavřeš</div>`;
    el.onclick = () => el.remove();
    document.body.appendChild(el);
    setTimeout(() => { if (el.parentNode) el.remove(); }, 7000);
  },

  saveState: function() {
    const key = this.saveKey || 'axioma_save';
    // localStorage — záloha pro offline
    try { localStorage.setItem(key, JSON.stringify(this.state)); } catch(e) {}
    // Firestore — jen pro přihlášené žáky (saveKey obsahuje email)
    if (_db && key !== 'axioma_save') {
      _db.collection('saves').doc(key).set({ state: this.state, updated: Date.now() })
        .catch(e => console.warn('Firestore save error:', e.message));
    }
  },
  loadState: function() {
    const key = this.saveKey || 'axioma_save';
    const defaults = getDefaultState();
    const applyState = (parsed) => {
      this.state = Object.assign(defaults, parsed);
      // Migration guards pro starší uložené stavy
      if (!this.state.batteries) this.state.batteries = 0;
      if (this.state.correctAfterLockdown === undefined) this.state.correctAfterLockdown = -1;
      if (!this.state.lockdownsInRegion) this.state.lockdownsInRegion = {};
      if (this.state.maxLevelEver === undefined) this.state.maxLevelEver = 0;
      if (this.state.dailyStreak === undefined) this.state.dailyStreak = 0;
      if (this.state.lastPlayDate === undefined) this.state.lastPlayDate = null;
      if (this.state.dailyMissionDate === undefined) this.state.dailyMissionDate = null;
      if (this.state.dailyMissionProgress === undefined) this.state.dailyMissionProgress = 0;
      if (this.state.dailyMissionClaimed === undefined) this.state.dailyMissionClaimed = false;
      if (this.state.endgameSeen === undefined) this.state.endgameSeen = false;
      // Vyčisti mrtvé klíče ze starých uložení
      delete this.state.lastPlayed;
      delete this.state.completedTrainings;
      delete this.state.trainingLaunchedInRegion;
    };
    // Přihlášený žák s emailem → Firestore (cross-device)
    if (_db && key !== 'axioma_save') {
      return _db.collection('saves').doc(key).get()
        .then(doc => {
          if (doc.exists && doc.data().state) {
            applyState(doc.data().state);
          } else {
            // Nic ve Firestore → zkus localStorage (migrace starých dat)
            try {
              const local = localStorage.getItem(key);
              if (local) { applyState(JSON.parse(local)); this.saveState(); }
            } catch(e) {}
          }
        })
        .catch(() => {
          // Firestore nedostupný → fallback na localStorage
          try {
            const local = localStorage.getItem(key);
            if (local) applyState(JSON.parse(local));
          } catch(e) {}
        });
    }
    // Anonymní / bez emailu → localStorage
    return Promise.resolve().then(() => {
      try {
        const saved = localStorage.getItem(key);
        if (saved) applyState(JSON.parse(saved));
      } catch(e) {}
    });
  },

  resetGame: function() {
    if(confirm("Opravdu chcete iniciovat System Wipe? Všechna data budou smazána.")) {
      // Increment restart counter (stored separately — přežije wipe)
      const restartKey = (this.saveKey || 'axioma_save') + '_restarts';
      const prevRestarts = parseInt(localStorage.getItem(restartKey) || '0');
      localStorage.setItem(restartKey, prevRestarts + 1);
      try { localStorage.removeItem(this.saveKey || 'axioma_save'); } catch(e) {}
      if (_db && this.saveKey && this.saveKey !== 'axioma_save') {
        _db.collection('saves').doc(this.saveKey).delete().catch(() => {});
      }
      this.state = getDefaultState();
      this.updateUI();
      this.generateBlueprint();
      this.renderDailyPanel();
    }
  },

  // ── MODULE CLEARED CELEBRATION ───────────────────────────────────
  showModuleClearedPanel: function(regionId) {
    const region = GameData.regions.find(r => r.id === regionId);
    const moduleName = region ? region.name : regionId.toUpperCase();
    const moduleIdx = (GameData.regions.findIndex(r => r.id === regionId) + 1).toString().padStart(2, '0');
    const totalModuleXP = GameData.questions
      .filter(q => q.regionId === regionId && !q.isTraining)
      .reduce((sum, q) => sum + (q.reward.xp || 0), 0);
    const { current, next } = this.getLevelInfo(this.state.xp);
    const levelPct = next
      ? Math.round(((this.state.xp - current.xp) / (next.xp - current.xp)) * 100)
      : 100;

    // CSS inject (jednorázový)
    if (!document.getElementById('mcp-style')) {
      const style = document.createElement('style');
      style.id = 'mcp-style';
      style.textContent = `
        #mcp-overlay {
          position: fixed; inset: 0; z-index: 9999;
          background: rgba(0,0,0,0.88);
          display: flex; align-items: center; justify-content: center;
          animation: mcpFadeIn 0.25s ease forwards;
          cursor: pointer;
        }
        @keyframes mcpFadeIn { from { opacity:0 } to { opacity:1 } }
        #mcp-panel {
          background: #060d06;
          border: 2px solid #2ecc8a;
          box-shadow: 0 0 40px rgba(46,204,138,0.25), inset 0 0 60px rgba(0,0,0,0.6);
          width: min(520px, 90vw);
          font-family: 'Courier New', monospace;
          font-size: 0.88rem;
          color: #2ecc8a;
          animation: mcpDrop 0.35s cubic-bezier(0.22,1,0.36,1) forwards;
          cursor: default;
        }
        @keyframes mcpDrop {
          from { opacity:0; transform: translateY(-36px) }
          to   { opacity:1; transform: translateY(0) }
        }
        .mcp-header {
          padding: 14px 20px 10px;
          border-bottom: 1px solid #1a4a2e;
          display: flex; align-items: center; justify-content: space-between;
        }
        .mcp-header-title {
          font-size: 1.05rem; font-weight: bold; letter-spacing: 0.1em;
          animation: mcpBlink 0.55s step-end 6;
        }
        @keyframes mcpBlink {
          0%,100% { color:#2ecc8a } 50% { color:#00ff41 }
        }
        .mcp-header-ok {
          font-size: 0.72rem; color: #1a7a4a;
          border: 1px solid #1a4a2e; padding: 2px 8px;
        }
        .mcp-body { padding: 18px 20px; }
        .mcp-row {
          display: flex; align-items: baseline;
          margin-bottom: 6px; line-height: 1.6;
        }
        .mcp-label { color: #1a7a4a; min-width: 120px; flex-shrink: 0; }
        .mcp-value { color: #2ecc8a; }
        .mcp-value.highlight { color: #f7b84f; font-weight: bold; }
        .mcp-value.accent { color: #00ff41; }
        .mcp-divider {
          border: none; border-top: 1px solid #1a4a2e;
          margin: 12px 0;
        }
        .mcp-bar-track {
          flex: 1; height: 10px;
          background: #0d1f0d;
          border: 1px solid #1a4a2e;
          position: relative; overflow: hidden;
        }
        .mcp-bar-fill {
          height: 100%; background: #2ecc8a;
          box-shadow: 0 0 8px rgba(46,204,138,0.6);
          transition: width 0.8s ease;
          width: 0%;
        }
        .mcp-bar-pct {
          min-width: 38px; text-align: right; margin-left: 10px;
          color: #1a7a4a; font-size: 0.82rem;
        }
        .mcp-cursor {
          display: inline-block;
          animation: mcpCursorBlink 0.5s step-end infinite;
        }
        @keyframes mcpCursorBlink { 0%,100%{opacity:1} 50%{opacity:0} }
        .mcp-footer { padding: 10px 20px 16px; }
        .mcp-btn {
          display: block; width: 100%;
          background: transparent; border: 1px solid #2ecc8a;
          color: #2ecc8a; font-family: 'Courier New', monospace;
          font-size: 0.88rem; letter-spacing: 0.08em;
          padding: 9px 0; cursor: pointer;
          transition: background 0.15s, color 0.15s;
        }
        .mcp-btn:hover { background: #1a4a2e; color: #00ff41; }
        .mcp-typewriter { min-height: 1.4em; }
      `;
      document.head.appendChild(style);
    }

    // Sestavit panel HTML
    const overlay = document.createElement('div');
    overlay.id = 'mcp-overlay';
    overlay.innerHTML = `
      <div id="mcp-panel" onclick="event.stopPropagation()">
        <div class="mcp-header">
          <span class="mcp-header-title">FIREWALL NEUTRALIZOVÁN</span>
          <span class="mcp-header-ok">[ OK ]</span>
        </div>
        <div class="mcp-body">
          <div class="mcp-row">
            <span class="mcp-label">MODUL</span>
            <span class="mcp-value accent">_${moduleIdx} // ${moduleName}</span>
          </div>
          <div class="mcp-row">
            <span class="mcp-label">STATUS</span>
            <span class="mcp-value accent">██ PROLOMENO ██</span>
          </div>
          <hr class="mcp-divider">
          <div class="mcp-row">
            <span class="mcp-label">XP V MODULU</span>
            <span class="mcp-value highlight" id="mcp-xp-counter">0</span>
          </div>
          <div class="mcp-row">
            <span class="mcp-label">ÚROVEŇ</span>
            <span class="mcp-value">${current.name}</span>
          </div>
          <div class="mcp-row" style="align-items:center">
            <span class="mcp-label">POTENCIÁL</span>
            <div class="mcp-bar-track">
              <div class="mcp-bar-fill" id="mcp-lvl-bar"></div>
            </div>
            <span class="mcp-bar-pct" id="mcp-lvl-pct">0 %</span>
          </div>
          <hr class="mcp-divider">
          <div class="mcp-typewriter" id="mcp-typewriter">&gt; <span class="mcp-cursor">█</span></div>
        </div>
        <div class="mcp-footer">
          <button class="mcp-btn" id="mcp-continue-btn">&gt; POKRAČOVAT →</button>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);

    // Dismiss
    const dismiss = () => {
      overlay.style.animation = 'mcpFadeIn 0.2s ease reverse forwards';
      setTimeout(() => { if (overlay.parentNode) overlay.parentNode.removeChild(overlay); }, 200);
    };
    overlay.addEventListener('click', dismiss);
    document.getElementById('mcp-continue-btn').addEventListener('click', (e) => { e.stopPropagation(); dismiss(); });

    // XP counter animace
    const xpEl = document.getElementById('mcp-xp-counter');
    let xpAnim = 0;
    const xpStep = Math.max(1, Math.ceil(totalModuleXP / 40));
    const xpTimer = setInterval(() => {
      xpAnim = Math.min(xpAnim + xpStep, totalModuleXP);
      xpEl.textContent = '+' + xpAnim + ' XP';
      if (xpAnim >= totalModuleXP) clearInterval(xpTimer);
    }, 30);

    // Progress bar animace (spustit po 600ms)
    setTimeout(() => {
      const bar = document.getElementById('mcp-lvl-bar');
      const pct = document.getElementById('mcp-lvl-pct');
      if (bar) bar.style.width = levelPct + '%';
      if (pct) pct.textContent = levelPct + ' %';
    }, 600);

    // Typewriter
    const tw = document.getElementById('mcp-typewriter');
    const msg = '> čekám na potvrzení...';
    let twIdx = 0;
    setTimeout(() => {
      const twTimer = setInterval(() => {
        if (!document.getElementById('mcp-typewriter')) { clearInterval(twTimer); return; }
        tw.innerHTML = msg.slice(0, twIdx) + '<span class="mcp-cursor">█</span>';
        twIdx++;
        if (twIdx > msg.length) clearInterval(twTimer);
      }, 45);
    }, 800);
  },

  // ── DAILY STREAK + DAILY MISSION ─────────────────────────────────
  updateDailyProgress: function() {
    const today = getTodayISO();
    const last = this.state.lastPlayDate;

    // Streak logika
    if (last !== today) {
      if (last === getYesterdayISO()) {
        this.state.dailyStreak += 1;
      } else {
        this.state.dailyStreak = 1;
      }
      this.state.lastPlayDate = today;
    }

    // Denní mise — reset pokud nový den
    if (this.state.dailyMissionDate !== today) {
      this.state.dailyMissionDate = today;
      this.state.dailyMissionProgress = 0;
      this.state.dailyMissionClaimed = false;
    }
    this.state.dailyMissionProgress += 1;

    // Mise dokončena: +20 XP bonus
    if (this.state.dailyMissionProgress >= 10 && !this.state.dailyMissionClaimed) {
      this.state.dailyMissionClaimed = true;
      this.state.xp += 20;
      setTimeout(() => this.showDailyMissionComplete(), 600);
    }

    this.saveState();
    this.renderDailyPanel();
  },

  showDailyMissionComplete: function() {
    const toast = document.getElementById('level-up-toast');
    if (!toast) return;
    toast.innerHTML = `
      <span class="toast-tag">[ DENNÍ MISE SPLNĚNA ]</span>
      <span class="toast-lvlname" style="color:#2ecc8a">10 / 10</span>
      <span class="toast-lvlnum">+20 XP</span>`;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 4000);
  },

  renderDailyPanel: function() {
    this.renderHudDaily();
  },

  renderHudDaily: function() {
    const container = document.getElementById('hud-daily');
    if (!container) return;
    const today = getTodayISO();
    const streak = this.state.dailyStreak || 0;
    const isActiveToday = this.state.lastPlayDate === today;
    const missionDate = this.state.dailyMissionDate;
    const progress = (missionDate === today) ? (this.state.dailyMissionProgress || 0) : 0;
    const claimed = (missionDate === today) && this.state.dailyMissionClaimed;
    const streakColor = streak >= 7 ? '#f7b84f' : (streak >= 3 ? '#2ecc8a' : 'var(--neon-cyan)');
    const streakGlow = streak >= 3 ? `text-shadow: 0 0 8px ${streakColor}` : '';
    const dots = Array.from({length: 10}, (_, i) => {
      if (claimed) return `<span class="hud-dot hud-dot-done">■</span>`;
      return i < progress
        ? `<span class="hud-dot hud-dot-filled">■</span>`
        : `<span class="hud-dot hud-dot-empty">□</span>`;
    }).join('');
    container.innerHTML = `
      <div class="hud-daily-inner">
        <span class="hud-streak" style="color:${streakColor};${streakGlow}" title="Denní série">
          ${isActiveToday ? '🔥' : '⚫'}<span class="hud-streak-num">${streak}</span>
        </span>
        <span class="hud-mission-dots" title="Denní mise: ${claimed ? 'splněna' : progress + '/10'}">${dots}</span>
        <span class="hud-mission-count" style="color:${claimed ? '#2ecc8a' : 'var(--text-muted)'}">${claimed ? '✓' : progress + '/10'}</span>
      </div>`;
  },

  // ── PRE-ENDGAME (oslavná obrazovka → HACKNOUT MATURITU) ─────────
  showPreEndgame: function() {
    if (this.state.endgameSeen) return;

    // Inject CSS
    if (!document.getElementById('pre-endgame-style')) {
      const style = document.createElement('style');
      style.id = 'pre-endgame-style';
      style.textContent = `
        #pre-endgame-overlay {
          position:fixed;inset:0;z-index:99998;
          background:radial-gradient(ellipse at center, rgba(6,9,19,0.92) 0%, rgba(0,0,0,0.98) 100%);
          display:flex;align-items:center;justify-content:center;flex-direction:column;
          opacity:0;transition:opacity 0.8s ease;
        }
        #pre-endgame-overlay.visible { opacity:1; }
        .pe-particles { position:absolute;inset:0;overflow:hidden;pointer-events:none; }
        .pe-particle {
          position:absolute;width:2px;height:2px;border-radius:50%;
          animation:pe-float 3s ease-in-out infinite;
        }
        @keyframes pe-float {
          0%,100% { opacity:0;transform:translateY(0) scale(1); }
          50% { opacity:1;transform:translateY(-40px) scale(1.5); }
        }
        .pe-content {
          position:relative;z-index:10;text-align:center;
          max-width:520px;padding:0 20px;
        }
        .pe-tag {
          font-family:'DM Mono',monospace;font-size:0.75rem;
          color:#2ecc8a;letter-spacing:4px;
          opacity:0;transform:translateY(20px);
          transition:opacity 0.6s ease, transform 0.6s ease;
        }
        .pe-tag.visible { opacity:1;transform:none; }
        .pe-title {
          font-family:'Inter',sans-serif;font-size:2.2rem;font-weight:900;
          color:#fff;letter-spacing:3px;margin:18px 0 12px;
          text-shadow:0 0 40px rgba(0,210,255,0.3),0 0 80px rgba(124,92,252,0.15);
          opacity:0;transform:scale(0.8);
          transition:opacity 0.8s ease 0.3s, transform 0.8s ease 0.3s;
        }
        .pe-title.visible { opacity:1;transform:scale(1); }
        .pe-subtitle {
          font-family:'DM Mono',monospace;font-size:0.9rem;
          color:#64748b;line-height:1.6;
          opacity:0;transition:opacity 0.6s ease 0.8s;
        }
        .pe-subtitle.visible { opacity:1; }
        .pe-stats {
          display:flex;gap:32px;justify-content:center;margin:28px 0;
          opacity:0;transition:opacity 0.6s ease 1.2s;
        }
        .pe-stats.visible { opacity:1; }
        .pe-stat-num {
          font-family:'DM Mono',monospace;font-size:1.8rem;font-weight:bold;
          color:#00d2ff;display:block;
        }
        .pe-stat-label {
          font-family:'DM Mono',monospace;font-size:0.7rem;
          color:#475569;letter-spacing:1px;
        }
        .pe-hack-btn {
          margin-top:32px;
          background:transparent;border:2px solid #ff3b6a;color:#ff3b6a;
          font-family:'Inter',sans-serif;font-size:1.1rem;font-weight:800;
          letter-spacing:3px;padding:16px 48px;cursor:pointer;
          position:relative;overflow:hidden;
          opacity:0;transform:translateY(20px);
          transition:opacity 0.6s ease 1.6s, transform 0.6s ease 1.6s,
                     background 0.3s, color 0.3s, box-shadow 0.3s;
        }
        .pe-hack-btn.visible { opacity:1;transform:none; }
        .pe-hack-btn:hover {
          background:#ff3b6a;color:#060913;
          box-shadow:0 0 40px rgba(255,59,106,0.5),0 0 80px rgba(255,59,106,0.2);
        }
      `;
      document.head.appendChild(style);
    }

    const totalBosses = GameData.questions.filter(q => !q.isTraining).length;
    const achCount = this.state.achievements.length;
    const totalXP = this.state.xp;

    const overlay = document.createElement('div');
    overlay.id = 'pre-endgame-overlay';

    // Particle background
    let particles = '';
    for (let i = 0; i < 40; i++) {
      const x = Math.random() * 100;
      const y = Math.random() * 100;
      const delay = (Math.random() * 3).toFixed(1);
      const colors = ['#00d2ff','#7c5cfc','#2ecc8a','#ff3b6a','#f7b84f'];
      const c = colors[Math.floor(Math.random() * colors.length)];
      particles += `<div class="pe-particle" style="left:${x}%;top:${y}%;background:${c};animation-delay:${delay}s"></div>`;
    }

    overlay.innerHTML = `
      <div class="pe-particles">${particles}</div>
      <div class="pe-content">
        <div class="pe-tag" id="pe-tag">[ VŠECHNY FIREWALLY NEUTRALIZOVÁNY ]</div>
        <div class="pe-title" id="pe-title">MATURITA JE TVÁ</div>
        <div class="pe-subtitle" id="pe-subtitle">
          Každý firewall prolomen. Každý sektor pod kontrolou.<br>
          Systém čeká na poslední příkaz.
        </div>
        <div class="pe-stats" id="pe-stats">
          <div><span class="pe-stat-num">${totalBosses}</span><span class="pe-stat-label">FIREWALLŮ</span></div>
          <div><span class="pe-stat-num">${achCount}</span><span class="pe-stat-label">ACHIEVEMENTŮ</span></div>
          <div><span class="pe-stat-num">${totalXP}</span><span class="pe-stat-label">XP</span></div>
        </div>
        <button class="pe-hack-btn" id="pe-hack-btn" onclick="
          document.getElementById('pre-endgame-overlay').remove();
          Engine.showEndgame();
        ">▶ HACKNOUT MATURITU</button>
      </div>
    `;
    document.body.appendChild(overlay);

    // Staggered reveals
    requestAnimationFrame(() => {
      overlay.classList.add('visible');
      setTimeout(() => document.getElementById('pe-tag')?.classList.add('visible'), 300);
      setTimeout(() => document.getElementById('pe-title')?.classList.add('visible'), 300);
      setTimeout(() => document.getElementById('pe-subtitle')?.classList.add('visible'), 300);
      setTimeout(() => document.getElementById('pe-stats')?.classList.add('visible'), 300);
      setTimeout(() => document.getElementById('pe-hack-btn')?.classList.add('visible'), 300);
    });
  },

  // ── ENDGAME ─────────────────────────────────────────────────────
  showEndgame: function() {
    if (this.state.endgameSeen) return;
    this.state.endgameSeen = true;
    this.saveState();

    const totalBosses = GameData.questions.filter(q => !q.isTraining).length;
    const totalXP = this.state.xp;
    const { current } = this.getLevelInfo(totalXP);
    const streak = this.state.dailyStreak || 0;
    const restartKey = (this.saveKey || 'axioma_save') + '_restarts';
    const restarts = parseInt(localStorage.getItem(restartKey) || '0');
    const achCount = this.state.achievements.length;

    // Inject CSS
    if (!document.getElementById('endgame-style')) {
      const style = document.createElement('style');
      style.id = 'endgame-style';
      style.textContent = `
        #endgame-overlay {
          position:fixed;inset:0;z-index:99999;background:rgba(0,0,0,0.92);
          display:flex;align-items:center;justify-content:center;
          overflow:hidden;
        }
        #endgame-matrix-canvas { position:absolute;inset:0;z-index:0;opacity:0.3; }
        #endgame-panel {
          position:relative;z-index:10;
          background:#060d06;
          border:2px solid #2ecc8a;
          box-shadow:0 0 60px rgba(46,204,138,0.2),0 0 120px rgba(46,204,138,0.08),inset 0 0 60px rgba(0,0,0,0.6);
          width:min(560px,92vw);
          font-family:'Courier New',monospace;
          font-size:0.88rem;
          color:#2ecc8a;
          opacity:0;transform:translateY(-28px) scale(0.97);
          transition:opacity 0.8s ease, transform 0.8s ease;
        }
        #endgame-panel.visible { opacity:1;transform:none; }
        .eg-header {
          padding:14px 20px 10px;
          border-bottom:1px solid #1a4a2e;
          display:flex;align-items:center;justify-content:space-between;
        }
        .eg-header-tag { font-size:0.68rem;color:#1a7a4a;letter-spacing:4px; }
        .eg-header-ok { font-size:0.68rem;color:#1a7a4a;border:1px solid #1a4a2e;padding:2px 8px; }
        .eg-main-title {
          font-family:'Inter',sans-serif;font-weight:900;
          font-size:clamp(1.6rem,5vw,2.6rem);
          color:#2ecc8a;letter-spacing:6px;
          text-shadow:0 0 24px rgba(46,204,138,0.9),0 0 60px rgba(46,204,138,0.4);
          animation:egTitlePulse 1.8s ease-in-out infinite;
          text-align:center;padding:22px 20px 4px;min-height:2em;
        }
        @keyframes egTitlePulse {
          0%,100%{text-shadow:0 0 24px rgba(46,204,138,0.9),0 0 60px rgba(46,204,138,0.4)}
          50%{text-shadow:0 0 40px rgba(46,204,138,1),0 0 100px rgba(46,204,138,0.6),0 0 200px rgba(46,204,138,0.2)}
        }
        .eg-body { padding:4px 20px 16px; }
        .eg-row {
          display:flex;align-items:baseline;
          margin-bottom:5px;line-height:1.7;
        }
        .eg-label { color:#1a7a4a;min-width:130px;flex-shrink:0; }
        .eg-value { color:#2ecc8a; }
        .eg-value.hl { color:#f7b84f;font-weight:bold; }
        .eg-value.acc { color:#00ff41; }
        .eg-divider { border:none;border-top:1px solid #1a4a2e;margin:10px 0; }
        .eg-bar-wrap { display:flex;align-items:center;gap:10px;flex:1; }
        .eg-bar-track {
          flex:1;height:10px;background:#0d1f0d;
          border:1px solid #1a4a2e;position:relative;overflow:hidden;
        }
        .eg-bar-fill {
          height:100%;background:#2ecc8a;
          box-shadow:0 0 8px rgba(46,204,138,0.6);
          transition:width 1.2s ease;width:0%;
        }
        .eg-bar-pct { min-width:38px;text-align:right;color:#1a7a4a;font-size:0.8rem; }
        .eg-cursor { display:inline-block;animation:egCursor 0.5s step-end infinite; }
        @keyframes egCursor { 0%,100%{opacity:1}50%{opacity:0} }
        .eg-footer { padding:10px 20px 18px; }
        .eg-btn {
          display:block;width:100%;
          background:transparent;border:1px solid #2ecc8a;
          color:#2ecc8a;font-family:'Courier New',monospace;
          font-size:0.88rem;letter-spacing:0.08em;
          padding:10px 0;cursor:pointer;
          transition:background 0.15s,color 0.15s;
        }
        .eg-btn:hover { background:#1a4a2e;color:#00ff41; }
      `;
      document.head.appendChild(style);
    }

    const overlay = document.createElement('div');
    overlay.id = 'endgame-overlay';
    overlay.innerHTML = `
      <canvas id="endgame-matrix-canvas"></canvas>
      <div id="endgame-panel">
        <div class="eg-header">
          <span class="eg-header-tag">[ FINAL SEQUENCE // VŠECHNY FIREWALLY NEUTRALIZOVÁNY ]</span>
          <span class="eg-header-ok">[ OK ]</span>
        </div>
        <div class="eg-main-title" id="eg-title-scramble"></div>
        <div class="eg-body">
          <hr class="eg-divider">
          <div class="eg-row"><span class="eg-label">OPERÁTOR</span><span class="eg-value acc" id="eg-s-fw">0</span><span class="eg-value"> firewallů prolomeno</span></div>
          <div class="eg-row"><span class="eg-label">CELKEM XP</span><span class="eg-value hl" id="eg-s-xp">0</span><span class="eg-value"> bodů</span></div>
          <div class="eg-row"><span class="eg-label">ÚROVEŇ</span><span class="eg-value acc">LVL ${current.level} // ${current.name}</span></div>
          <div class="eg-row"><span class="eg-label">ACHIEVEMENTS</span><span class="eg-value" id="eg-s-ach">0</span><span class="eg-value"> / ${ACHIEVEMENTS.length}</span></div>
          <div class="eg-row"><span class="eg-label">STREAK</span><span class="eg-value" id="eg-s-str">0</span><span class="eg-value"> dní v řadě</span></div>
          <div class="eg-row"><span class="eg-label">RESTARTY</span><span class="eg-value" id="eg-s-rst">0</span></div>
          <hr class="eg-divider">
          <div class="eg-row" style="align-items:center">
            <span class="eg-label">POTENCIÁL</span>
            <div class="eg-bar-wrap">
              <div class="eg-bar-track"><div class="eg-bar-fill" id="eg-bar"></div></div>
              <span class="eg-bar-pct" id="eg-bar-pct">0 %</span>
            </div>
          </div>
          <hr class="eg-divider">
          <div id="eg-typewriter" style="min-height:1.4em">&gt; <span class="eg-cursor">█</span></div>
        </div>
        <div class="eg-footer">
          <button class="eg-btn" onclick="document.getElementById('endgame-overlay').remove()">
            &gt; ODPOJIT SE OD SYSTÉMU
          </button>
        </div>
      </div>`;
    document.body.appendChild(overlay);

    // Matrix rain
    const canvas = document.getElementById('endgame-matrix-canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const chars = 'AXIOMA01∑∫√πΔΩ∞≠≈±×÷SYSTEM_OVERRIDE';
    const fontSize = 14;
    const columns = Math.floor(canvas.width / fontSize);
    const drops = Array(columns).fill(1);
    function drawMatrix() {
      ctx.fillStyle = 'rgba(0,0,0,0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#00d2ff';
      ctx.font = fontSize + 'px monospace';
      for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)];
        ctx.globalAlpha = 0.3 + Math.random() * 0.4;
        ctx.fillStyle = Math.random() > 0.92 ? '#ff3b6a' : (Math.random() > 0.85 ? '#7c5cfc' : '#00d2ff');
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
      }
      if (document.getElementById('endgame-overlay')) requestAnimationFrame(drawMatrix);
    }
    drawMatrix();

    // Counter animace helper
    function egAnimCounter(elId, target, duration) {
      const el = document.getElementById(elId);
      if (!el) return;
      const start = performance.now();
      (function tick(now) {
        const t = Math.min(1, (now - start) / duration);
        el.textContent = Math.round((1 - Math.pow(1 - t, 3)) * target);
        if (t < 1) requestAnimationFrame(tick);
      })(performance.now());
    }

    // Panel fade-in
    setTimeout(() => {
      const panel = document.getElementById('endgame-panel');
      if (panel) panel.classList.add('visible');
    }, 600);

    // Scramble title
    setTimeout(() => {
      const target = document.getElementById('eg-title-scramble');
      const finalText = 'MATURITA HACKED';
      const scrambleChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_#@%&';
      let iter = 0;
      const interval = setInterval(() => {
        if (!target) { clearInterval(interval); return; }
        target.textContent = finalText.split('').map((ch, i) => {
          if (ch === ' ') return ' ';
          if (i < iter) return finalText[i];
          return scrambleChars[Math.floor(Math.random() * scrambleChars.length)];
        }).join('');
        if (iter >= finalText.length) clearInterval(interval);
        iter += 0.4;
      }, 50);
    }, 900);

    // Counters
    setTimeout(() => {
      egAnimCounter('eg-s-fw', totalBosses, 1200);
      egAnimCounter('eg-s-xp', totalXP, 1800);
      egAnimCounter('eg-s-ach', achCount, 1000);
      egAnimCounter('eg-s-str', streak, 800);
      egAnimCounter('eg-s-rst', restarts, 600);
    }, 1600);

    // Progress bar (XP / potenciál)
    setTimeout(() => {
      const totalPossibleXP = GameData.questions
        .filter(q => !q.isTraining && q.reward && q.reward.xp)
        .reduce((sum, q) => sum + q.reward.xp, 0);
      const pct = totalPossibleXP > 0 ? Math.min(100, Math.round((totalXP / totalPossibleXP) * 100)) : 100;
      const bar = document.getElementById('eg-bar');
      const barPct = document.getElementById('eg-bar-pct');
      if (bar) bar.style.width = pct + '%';
      if (barPct) barPct.textContent = pct + ' %';
    }, 2200);

    // Typewriter
    setTimeout(() => {
      const tw = document.getElementById('eg-typewriter');
      const msg = '> přístup k MATURITĚ: potvrzen. Systém kompromitován.';
      let twIdx = 0;
      const twTimer = setInterval(() => {
        if (!tw || !document.getElementById('endgame-overlay')) { clearInterval(twTimer); return; }
        tw.innerHTML = msg.slice(0, twIdx) + '<span class="eg-cursor">█</span>';
        twIdx++;
        if (twIdx > msg.length) clearInterval(twTimer);
      }, 38);
    }, 2600);
  },

  // DEV OVERRIDES
  devUnlockAll: function() {
    if(confirm("DEV MODE: Chcete odemknout všechny uzly na mapě?")) {
      GameData.questions.forEach(q => {
        if (!q.isTraining && !this.state.clearedNodes.includes(q.id)) {
          this.state.clearedNodes.push(q.id);
        }
      });
      this.state.xp += 1000;
      this.saveState();
      this.updateUI();
      this.generateBlueprint();
    }
  }
};

const Arena = {
  currentQuestion: null,
  reviewMode: false,
  hintUsedThisEncounter: false,
  lockdownMode: false,

  startEncounter: function(questionId) {
    this.reviewMode = false;
    this.hintUsedThisEncounter = false;
    this.currentQuestion = GameData.questions.find(q => q.id === questionId);
    // Pokud jde o trénink spuštěný z firewallu, zaznamenej do regionu
    if (this.currentQuestion && this.currentQuestion.isTraining && Engine.currentRegionId) {
      Engine.saveState();
    }
    if (!this.currentQuestion) return;
    // FIRST_BREACH: první vstup do arény (pouze boss otázky, ne tréninky)
    if (!this.currentQuestion.isTraining && !Engine.state.achievements.includes('ACH_FIRST')) {
      Engine.unlockAchievement('ACH_FIRST');
    }
    Engine.switchView('view-arena');
    this.resetUI();
    this.renderQuestion();
  },

  startReview: function(questionId) {
    this.reviewMode = true;
    this.currentQuestion = GameData.questions.find(q => q.id === questionId);
    if (!this.currentQuestion) return;
    Engine.checkAchievements('review');
    Engine.switchView('view-arena');
    this.resetUI();
    this.renderQuestion();
  },

  resetUI: function() {
    document.getElementById('arena-feedback').style.display = 'none';
    document.getElementById('arena-feedback').className = 'sys-alert';
    document.getElementById('btn-next-fight').style.display = 'none';
    document.getElementById('arena-training-controls').innerHTML = '';
    document.getElementById('monster-hp-fill').style.width = '100%';
  },

  renderQuestion: function() {
    const q = this.currentQuestion;
    document.getElementById('monster-name').innerText = q.monsterName;
    document.getElementById('monster-region').innerText =
      this.reviewMode ? "OPAKOVÁNÍ" : (q.isTraining ? "SIMULACE" : "OSTRÝ PROVOZ");
    document.getElementById('monster-hp-fill').style.backgroundColor = q.visual_color;

    if (q.trainingTasks && q.trainingTasks.length > 0) {
      document.getElementById('arena-training-controls').innerHTML = `
        <button onclick="Arena.startEncounter('${q.trainingTasks[0]}')" class="btn-secondary w-full">
          > SPUSTIT BEZPEČNOU SIMULACI NANEČISTO
        </button>
      `;
    }

    let stepsHTML = '';
    if (q.steps && q.steps.length > 0) {
      stepsHTML = '<div class="training-steps">';
      q.steps.forEach(step => {
        stepsHTML += `<details class="step-detail"><summary class="step-summary">${step.trigger}</summary><div class="step-content">${step.content}</div></details>`;
      });
      stepsHTML += '</div>';
    }

    let hintsHTML = '';
    if (!q.isTraining && q.hints && q.hints.length > 0) {
      const bonusXP = Math.max(2, Math.round((q.reward?.xp || 10) * 0.25));
      const hintItems = q.hints.map((h, i) =>
        `<p style="margin:5px 0"><span style="color:var(--neon-cyan);font-weight:bold;">${i+1}.</span> ${h}</p>`
      ).join('');
      hintsHTML = `
        <div id="hint-wrapper" style="margin-top:8px;">
          <div id="hint-warning" style="display:none;background:rgba(247,184,79,0.08);border-left:3px solid #f7b84f;padding:10px 12px;border-radius:4px;margin-bottom:6px;">
            <div style="color:#f7b84f;font-size:0.82em;font-weight:bold;margin-bottom:8px;letter-spacing:.03em;">[VAROVÁNÍ] Otevřením nápovědy přijdeš o bonus <strong>+${bonusXP} XP</strong> za čistý průchod.</div>
            <div style="display:flex;gap:8px;">
              <button onclick="Arena.confirmHint()" class="btn-secondary" style="font-size:0.78em;padding:4px 12px;">Zobrazit nápovědu</button>
              <button onclick="Arena.dismissHintWarning()" class="btn-secondary" style="font-size:0.78em;padding:4px 12px;">Zkusím sám</button>
            </div>
          </div>
          <details class="step-detail" id="hint-details" style="border-left-color:var(--neon-purple)">
            <summary class="step-summary" style="color:var(--neon-purple)" id="hint-summary">> NÁPOVĚDA &nbsp;<span style="font-size:0.75em;opacity:0.7;">(použití = −${bonusXP} XP bonus)</span></summary>
            <div class="step-content">${hintItems}</div>
          </details>
        </div>`;
    }

    let answerHTML = `<div class="choices" id="arena-choices">` +
      q.choices.map((c, i) =>
        `<button class="choice-btn" onclick="Arena.submitClosed('${c.value}', this)">
          <span class="choice-letter">[${String.fromCharCode(65+i)}]</span>
          <span class="choice-math">${c.label}</span>
        </button>`
      ).join('') + `</div>`;

    const reviewBanner = this.reviewMode
      ? `<div style="margin-bottom:12px;padding:6px 12px;border-left:3px solid #7c5cfc;background:rgba(124,92,252,0.08);font-family:'DM Mono',monospace;font-size:11px;color:#7c5cfc;letter-spacing:0.05em;">
           ⟳ OPAKOVÁNÍ — bez zisku XP, bez ztráty pokusů
         </div>`
      : '';

    // Diagram: u tréninkových otázek s kroky schovat za klik (výjimka: showDiagramImmediately)
    const hideDiagram = q.isTraining && q.diagram && q.steps && q.steps.length > 0 && !q.showDiagramImmediately;
    const diagramHTML = q.diagram && !hideDiagram
      ? `<div class="card-diagram" style="margin: 20px 0;">${q.diagram}</div>`
      : '';
    const diagramStepHTML = hideDiagram
      ? `<details class="step-detail" style="margin-top:6px"><summary class="step-summary">> Grafické znázornění</summary><div class="step-content" style="padding-top:8px">${q.diagram}</div></details>`
      : '';

    document.getElementById('arena-question-container').innerHTML = `
      ${reviewBanner}
      ${q.question ? `<div class="card-question">${q.question}</div>` : ''}
      ${diagramHTML}
      ${q.formula ? `<div class="card-formula">${q.formula}</div>` : ''}
      ${stepsHTML}
      ${diagramStepHTML}
      ${hintsHTML}
      ${q.instruction ? `<div class="text-muted mb-4">${q.instruction}</div>` : ''}
      ${answerHTML}
    `;
    renderMath();

    // Intercept kliknutí na nápovědu — zobraz varování místo přímého otevření
    const hintDetails = document.getElementById('hint-details');
    if (hintDetails) {
      const summary = hintDetails.querySelector('summary');
      summary.addEventListener('click', function(e) {
        if (!hintDetails.open) {
          e.preventDefault();
          document.getElementById('hint-warning').style.display = 'block';
        }
      });
    }
  },

  submitClosed: function(value, btnElement) {
    if (btnElement.disabled) return;
    const q = this.currentQuestion;
    const isCorrect = (value === q.correctAnswer);
    const customFeedback = q.choices.find(c => c.value === value)?.feedback || "Chybná odpověď.";

    if (isCorrect) {
      // Správná odpověď: zablokuj vše, označ zeleně, vyřeš
      document.querySelectorAll('#arena-choices .choice-btn').forEach(btn => btn.disabled = true);
      btnElement.classList.add('correct');
      this.resolveFight(true, customFeedback);

    } else if (q.isTraining) {
      // Špatná odpověď v tréninku: jen toto tlačítko zamkni červeně, ostatní zůstanou aktivní
      btnElement.disabled = true;
      btnElement.classList.add('wrong');
      const fb = document.getElementById('arena-feedback');
      fb.style.display = 'block';
      fb.className = 'sys-alert wrong-fb';
      fb.innerHTML = `<strong>[SIMULACE: CHYBNÁ VOLBA]</strong><br><em>Log:</em> ${customFeedback.replace(/^(Přístup odepřen\.|Chyba syntaxe\.)\s*/i, '')}`;
      const nextBtn = document.getElementById('btn-next-fight');
      nextBtn.innerText = '> RESTART SIMULACE';
      nextBtn.onclick = () => { Arena.resetUI(); Arena.renderQuestion(); };
      nextBtn.style.display = 'inline-block';
      renderMath();

    } else {
      // Špatná odpověď v ostrém provozu: zablokuj vše, standardní průběh
      document.querySelectorAll('#arena-choices .choice-btn').forEach(btn => btn.disabled = true);
      btnElement.classList.add('wrong');
      this.resolveFight(false, customFeedback);
    }
  },

  resolveFight: function(isCorrect, feedbackMessage) {
    const fb = document.getElementById('arena-feedback');
    fb.style.display = 'block';
    const nextBtn = document.getElementById('btn-next-fight');
    document.getElementById('arena-training-controls').innerHTML = '';

    if (isCorrect) {
      document.getElementById('monster-hp-fill').style.width = '0%';
      fb.className = 'sys-alert correct-fb';

      if (this.currentQuestion.isTraining) {
        Engine.updateDailyProgress();
        Engine.checkAchievements('training_correct');
        if (this.lockdownMode) {
          // Povinný trénink dokončen — teprve teď resetuj HP (částečně: 3/5)
          this.lockdownMode = false;
          Engine.state.hp = Math.min(4, Engine.state.maxHp);
          Engine.saveState();
          Engine.updateUI();
          Arena.setEndConnectionVisible(true);
          fb.innerHTML = `<strong>[SIMULACE DOKONČENA — PŘÍSTUP ČÁSTEČNĚ OBNOVEN]</strong><br>Energie doplněna na ${Engine.state.hp} náboje. Příště dobij náboj včas.<br><em>${feedbackMessage}</em>`;
          nextBtn.innerText = "> ZKUSIT FIREWALL ZNOVU";
          nextBtn.onclick = () => Arena.startEncounter(this.currentQuestion.firewallId);
        } else {
          // Řetězení SIM: zjisti, zda boss má další simulaci v řadě
          const boss = GameData.questions.find(q => q.id === this.currentQuestion.firewallId);
          const taskList = boss && boss.trainingTasks ? boss.trainingTasks : [];
          const currentIdx = taskList.indexOf(this.currentQuestion.id);
          const nextSimId = currentIdx >= 0 ? taskList[currentIdx + 1] : undefined;

          if (nextSimId) {
            fb.innerHTML = `<strong>[SIMULACE ÚSPĚŠNÁ — DALŠÍ FÁZE PŘIPRAVENA]</strong><br>${feedbackMessage}`;
            nextBtn.innerText = "> POKRAČOVAT NA DALŠÍ SIMULACI";
            nextBtn.onclick = () => Arena.startEncounter(nextSimId);
          } else {
            fb.innerHTML = `<strong>[SIMULACE ÚSPĚŠNÁ]</strong><br>${feedbackMessage}`;
            nextBtn.innerText = "> NÁVRAT K HLAVNÍMU FIREWALLU";
            nextBtn.onclick = () => Arena.startEncounter(this.currentQuestion.firewallId);
          }
        }
      } else if (this.reviewMode) {
        fb.innerHTML = `<strong>[OPAKOVÁNÍ ÚSPĚŠNÉ]</strong><br>${feedbackMessage}`;
        nextBtn.innerText = "> ZPĚT NA PŘEHLED";
        nextBtn.onclick = () => Engine.returnToRegion();
      } else {
        const baseXP = this.currentQuestion.reward.xp;
        const bonusXP = !this.hintUsedThisEncounter ? Math.max(2, Math.round(baseXP * 0.25)) : 0;
        let silentBonusXP = 0;
        let silentBonusText = '';

        // Tichý bonus: PRECISION — boss na první pokus bez nápovědy
        const qid = this.currentQuestion.id;
        const priorDeaths = Engine.state.deathsPerQuestion[qid] || 0;
        if (priorDeaths === 0 && !this.hintUsedThisEncounter) {
          silentBonusXP += 5;
          silentBonusText += `<br><span style="color:#f7b84f;font-size:0.85em;">+5 XP PRECISION — první pokus.</span>`;
        }

        if(!Engine.state.clearedNodes.includes(this.currentQuestion.id)) {
          Engine.state.clearedNodes.push(this.currentQuestion.id);
        }
        // GHOST_MODE: správně bez nápovědy = odpuštění staré nápovědy
        if (!this.hintUsedThisEncounter) {
          const idx = Engine.state.hintedQuestions.indexOf(this.currentQuestion.id);
          if (idx !== -1) { Engine.state.hintedQuestions.splice(idx, 1); }
        }
        Engine.state.streak = (Engine.state.streak || 0) + 1;

        // Tichý bonus: STREAK — každých 5 správných v řadě
        if (Engine.state.streak > 0 && Engine.state.streak % 5 === 0) {
          silentBonusXP += 10;
          silentBonusText += `<br><span style="color:#f7b84f;font-size:0.85em;">+10 XP STREAK ×${Engine.state.streak / 5} — ${Engine.state.streak} správně v řadě!</span>`;
        }

        // PHOENIX tracking: correctAfterLockdown (-1 = neaktivní, 0+ = počítáme)
        if (Engine.state.correctAfterLockdown >= 0) {
          Engine.state.correctAfterLockdown += 1;
        }

        const hintText = bonusXP > 0
          ? `<br><span style="color:var(--neon-cyan);font-size:0.88em;">+${bonusXP} XP bonus — čistý průchod bez nápovědy.</span>`
          : '';
        fb.innerHTML = `<strong>[FIREWALL PROLOMEN]</strong><br>${feedbackMessage}${hintText}${silentBonusText}`;
        Engine.addResources(baseXP + bonusXP + silentBonusXP);
        Engine.updateDailyProgress();
        Engine.checkAchievements('correct');
        Engine.checkAchievements('xp_change');
        if (Engine.isRegionCleared(Engine.currentRegionId)) Engine.checkAchievements('region_clear');
        nextBtn.innerText = "> POKRAČOVAT";
        nextBtn.onclick = () => Engine.returnToRegion();
      }
      nextBtn.style.display = 'inline-block';

    } else {
      fb.className = 'sys-alert wrong-fb';

      if (this.currentQuestion.isTraining) {
        fb.innerHTML = `<strong>[SIMULACE SELHALA - POKUSY NEODEČTENY]</strong><br><em>Log:</em> ${feedbackMessage.replace(/^(Přístup odepřen\.|Chyba syntaxe\.)\s*/i, '')}`;
        nextBtn.innerText = "> RESTART SIMULACE";
        nextBtn.onclick = () => { Arena.resetUI(); Arena.renderQuestion(); };
        nextBtn.style.display = 'inline-block';
      } else if (this.reviewMode) {
        fb.innerHTML = `<strong>[CHYBA V OPAKOVÁNÍ]</strong><br><em>Log:</em> ${feedbackMessage.replace(/^(Přístup odepřen\.|Chyba syntaxe\.)\s*/i, '')}`;
        nextBtn.innerText = "> ZKUSIT ZNOVU";
        nextBtn.onclick = () => { Arena.resetUI(); Arena.renderQuestion(); };
        nextBtn.style.display = 'inline-block';
      } else {
        Engine.state.hp -= 1;
        Engine.state.streak = 0;
        Engine.state.correctAfterLockdown = -1; // Reset PHOENIX při chybě
        Engine.state.totalDeaths = (Engine.state.totalDeaths || 0) + 1;
        Engine.checkAchievements('wrong');
        Engine.updateUI();

        if (Engine.state.hp <= 0) {
          // SYSTEM LOCKDOWN — dramatická obrazovka, -20 XP, přesměrování na trénink
          this.showLockdown(this.currentQuestion, feedbackMessage);
          return;
        } else {
          let trainingHtml = '';
          if (this.currentQuestion.trainingTasks && this.currentQuestion.trainingTasks.length > 0) {
            trainingHtml = `<br><br><button onclick="Arena.startEncounter('${this.currentQuestion.trainingTasks[0]}')" class="btn-secondary w-full">> SPUSTIT BEZPEČNOU SIMULACI</button>`;
          }
          const logFeedback = feedbackMessage.replace(/^(Přístup odepřen\.|Chyba syntaxe\.)\s*/i, '');
          // Varování při posledním životě
          let lastHpWarning = '';
          if (Engine.state.hp === 1 && !Arena.lockdownMode) {
            const hasBat = (Engine.state.batteries || 0) > 0;
            const hasXP  = Engine.state.xp >= (GameData.config.bypassCost || 30);
            let actions = '';
            if (hasBat) actions += `<button onclick="Engine.useBattery()" class="btn-primary" style="font-size:0.85em;padding:4px 10px;margin-top:4px;width:100%">⚡ POUŽÍT BATTERY (+3 HP)</button>`;
            if (hasXP)  actions += `<button onclick="Engine.buyBypass()" class="btn-secondary" style="font-size:0.85em;padding:4px 10px;margin-top:4px;width:100%">↩ SINGLE CHARGE (−30 XP, +1 HP)</button>`;
            if (!hasBat && !hasXP) actions = `<span style="color:var(--neon-red);font-size:0.85em">Žádné zásoby. Jeden další omyl = LOCKDOWN.</span>`;
            lastHpWarning = `<div style="margin-top:12px;padding:10px 12px;background:rgba(255,45,85,0.1);border:1px solid rgba(255,45,85,0.5);border-radius:6px;font-size:0.85em;color:var(--neon-red)">
              ⚠ KRITICKÁ HLADINA — ZBÝVÁ 1 HP${actions}
            </div>`;
          }
          // Hint po úplně první chybě v historii hráče
          const firstDeathHint = (Engine.state.totalDeaths === 1)
            ? `<div style="margin-top:10px;padding:8px 12px;background:rgba(247,184,79,0.07);border-left:3px solid #f7b84f;font-family:'DM Mono',monospace;font-size:0.8em;color:#f7b84f;line-height:1.6">
                // SYSTÉMOVÝ LOG: první ztráta energie detekována.<br>
                // Zbývá: ${Engine.state.hp}&nbsp;/&nbsp;${Engine.state.maxHp}. Na nule nastane LOCKDOWN.<br>
                // Energii lze dobít: DOBÍT ENERGII (−30 XP) nebo z Baterie (získáš po každém level-up).
               </div>`
            : '';
          fb.innerHTML = `<strong>[PŘÍSTUP ODEPŘEN]</strong><br><em>Log:</em> ${logFeedback}${trainingHtml}${firstDeathHint}${lastHpWarning}`;
          nextBtn.innerText = "> ZKUSIT ZNOVU";
          nextBtn.onclick = () => { Arena.resetUI(); Arena.renderQuestion(); };
          nextBtn.style.display = 'inline-block';
        }
      }
    }

    // Renderuj LaTeX ve feedback textu
    renderMath();
  },

  devInstaWin: function() {
    if(document.getElementById('btn-next-fight').style.display === 'inline-block') return;
    document.querySelectorAll('#arena-choices .choice-btn').forEach(btn => btn.disabled = true);
    this.resolveFight(true, "[DEV OVERRIDE] Ochrana úspěšně obejita bez výpočtu.");
  },

  // ── SYSTEM LOCKDOWN ──────────────────────────────────────────────
  showLockdown: function(question, feedbackMessage) {
    // Stupňovitá penalizace podle aktuálního XP
    const xp = Engine.state.xp;
    const PENALTY = xp < 300 ? 5 : (xp < 1500 ? 20 : 50);
    Engine.state.xp = Math.max(0, Engine.state.xp - PENALTY);
    // Track lockdown v regionu pro IRON_WILL
    if (Engine.currentRegionId) {
      Engine.state.lockdownsInRegion[Engine.currentRegionId] = true;
    }
    // Aktivuj PHOENIX tracking (reset počítadla na 0)
    Engine.state.correctAfterLockdown = 0;
    Engine.state.firstLockdownSeen = true;
    Engine.saveState();
    Engine.updateUI();

    Arena.setEndConnectionVisible(false);
    document.getElementById('arena-feedback').style.display = 'none';
    document.getElementById('btn-next-fight').style.display = 'none';
    document.getElementById('arena-training-controls').innerHTML = '';

    const hasTraining = question.trainingTasks && question.trainingTasks.length > 0;
    const container = document.getElementById('arena-question-container');
    container.innerHTML = `
      <div class="lockdown-screen">
        <div class="lockdown-header">
          <div class="lockdown-tag">[ CRITICAL FAILURE ]</div>
          <div class="lockdown-title">SYSTEM LOCKDOWN</div>
        </div>
        <div class="lockdown-codes" id="lockdown-codes"></div>
        <div class="lockdown-penalty">
          <span class="lockdown-penalty-label">XP DEDUCTED</span>
          <span class="lockdown-penalty-value">−${PENALTY} XP</span>
        </div>
        <div class="lockdown-reason"><em>Kritická chyba:</em> ${feedbackMessage}</div>
        ${!Engine.state.firstLockdownSeen ? `
        <div class="lockdown-first-hint">
          // PRVNÍ LOCKDOWN: dokonči simulátor níže. Energie se obnoví na 4.<br>
          // Příště to bude bez vysvětlení.
        </div>` : ''}
        <div class="lockdown-actions" id="lockdown-actions" style="opacity:0;pointer-events:none;transition:opacity 0.5s">
          ${hasTraining
            ? `<button class="btn-primary w-full" onclick="Arena.lockdownToTraining('${question.trainingTasks[0]}')">
                 > SPUSTIT POVINNOU SIMULACI
               </button>
               <div class="lockdown-hint">Po dokončení simulace bude přístup obnoven.</div>`
            : `<button class="btn-primary w-full" onclick="Arena.lockdownRetry()">
                 > OBNOVIT PŘÍSTUP A ZKUSIT ZNOVU
               </button>`
          }
        </div>
      </div>`;

    this.animateLockdownCodes(() => {
      const actions = document.getElementById('lockdown-actions');
      if (actions) { actions.style.opacity = '1'; actions.style.pointerEvents = 'auto'; }
    });
  },

  animateLockdownCodes: function(onComplete) {
    const errorLines = [
      'ERR_0x4A2F: FIREWALL_BREACH_DETECTED',
      'STACK_TRACE: auth_module.js:' + (Math.floor(Math.random() * 900) + 100),
      'EXCEPTION_CODE: 0xC000' + Math.random().toString(16).slice(2,6).toUpperCase(),
      'ACCESS_DENIED: insufficient_auth_level',
      'KERNEL_FAULT: invalid_memory_reference',
      'ERR_0x7FFF: BYPASS_SEQUENCE_FAILED',
      'ROLLBACK_INITIATED: reverting_session_state',
      'SECURITY_PROTOCOL: lockdown_v2_engaged',
      'AUTH_TOKENS: invalidated_and_purged',
      'SESSION_0x' + Math.random().toString(16).slice(2,10).toUpperCase() + ': TERMINATED',
    ];
    const el = document.getElementById('lockdown-codes');
    if (!el) { onComplete(); return; }
    let i = 0;
    const interval = setInterval(() => {
      if (!el || i >= errorLines.length) { clearInterval(interval); onComplete(); return; }
      const line = document.createElement('div');
      line.className = 'lockdown-code-line';
      line.textContent = errorLines[i];
      el.appendChild(line);
      el.scrollTop = el.scrollHeight;
      i++;
    }, 110);
  },

  confirmHint: function() {
    this.hintUsedThisEncounter = true;
    if (this.currentQuestion && !Engine.state.hintedQuestions.includes(this.currentQuestion.id)) {
      Engine.state.hintedQuestions.push(this.currentQuestion.id);
      Engine.saveState();
    }
    document.getElementById('hint-warning').style.display = 'none';
    document.getElementById('hint-details').open = true;
  },

  dismissHintWarning: function() {
    document.getElementById('hint-warning').style.display = 'none';
  },

  setEndConnectionVisible: function(visible) {
    const btn = document.getElementById('btn-end-connection');
    if (btn) btn.style.display = visible ? '' : 'none';
  },

  lockdownToTraining: function(trainingId) {
    Arena.lockdownMode = true;
    Arena.setEndConnectionVisible(false);
    Arena.startEncounter(trainingId);
  },

  lockdownRetry: function() {
    Arena.lockdownMode = false;
    Engine.state.hp = Math.min(4, Engine.state.maxHp);
    Engine.saveState();
    Engine.updateUI();
    Arena.setEndConnectionVisible(true);
    Arena.resetUI();
    Arena.renderQuestion();
  },
};

window.onload = () => Engine.init();
