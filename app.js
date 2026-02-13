// Painel Carvalho — mock front (SPA simples com router por hash)
// - Sem backend. Dados mock em memória + persistência leve em localStorage.
// - Inclui: Vendas (listagem + lançar via modal), CRUD em todas abas, filtros e mobile.
//
// Login: senha 'carvalho'

const STORAGE_KEY = "painel_carvalho_mock_session";
const DB_KEY = "painel_carvalho_mock_db_v4";

const ICONS = {
  home: "⌂",
  reports: "⎙",
  sales: "◎",
  managers: "👤",
  consultants: "👥",
  secretaries: "🗂",
  prospection: "◌",
  hiring: "✚",
  marketing: "📣",
  funnel: "▤",
  commissions: "₢",
  logout: "⟲",
};

const PAGES = [
  { id: "home", label: "Início", icon: ICONS.home },
  { id: "reports", label: "Relatórios", icon: ICONS.reports },
  { id: "sales", label: "Vendas", icon: ICONS.sales },
  { id: "managers", label: "Gestores", icon: ICONS.managers },
  { id: "consultants", label: "Consultores", icon: ICONS.consultants },
  { id: "secretaries", label: "Secretárias", icon: ICONS.secretaries },
  { id: "prospection", label: "Prospecção", icon: ICONS.prospection },
  { id: "hiring", label: "Contratação", icon: ICONS.hiring },
  { id: "marketing", label: "Marketing", icon: ICONS.marketing },
  { id: "funnel", label: "Funil", icon: ICONS.funnel },
  { id: "commissions", label: "Comissões", icon: ICONS.commissions },
];

function nowBR() {
  return new Intl.DateTimeFormat("pt-BR", { dateStyle: "medium", timeStyle: "short" }).format(new Date());
}
function moneyBR(value) {
  const n = Number(value || 0);
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 2 }).format(n);
}
function dateBR(iso) {
  if (!iso) return "";
  // iso YYYY-MM-DD
  const [y,m,d] = String(iso).slice(0,10).split("-");
  if (!y || !m || !d) return String(iso);
  return `${d}/${m}/${y}`;
}

function getSession() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "null"); } catch { return null; }
}
function setSession(s) { localStorage.setItem(STORAGE_KEY, JSON.stringify(s)); }
function clearSession() { localStorage.removeItem(STORAGE_KEY); }

function setHash(pageId) { window.location.hash = `#/${pageId}`; }
function getPageFromHash() {
  const h = window.location.hash || "";
  const m = h.match(/^#\/([a-z-]+)$/i);
  return m ? m[1] : "home";
}

function el(html) {
  const t = document.createElement("template");
  t.innerHTML = html.trim();
  return t.content.firstElementChild;
}
function mount(node) {
  const root = document.querySelector("#app");
  root.innerHTML = "";
  root.appendChild(node);
}
function escapeHtml(str) {
  return String(str)
    .replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;")
    .replaceAll('"',"&quot;").replaceAll("'","&#039;");
}

function toast(message) {
  const existing = document.querySelector("#toast");
  if (existing) existing.remove();
  const node = el(`
    <div id="toast" style="position:fixed;right:18px;bottom:18px;z-index:9999;
      border:1px solid rgba(255,255,255,.10);
      background: rgba(17,19,26,.72);
      backdrop-filter: blur(10px);
      box-shadow: 0 18px 50px rgba(0,0,0,.55);
      border-radius: 18px;
      padding: 12px 14px;
      max-width: 360px;
      color: rgba(238,240,246,.92);
      font-size: 12px;">
      <div style="display:flex;gap:10px;align-items:flex-start">
        <div style="width:10px;height:10px;border-radius:999px;background: var(--red);box-shadow:0 0 0 4px rgba(227,6,19,.15);margin-top:4px"></div>
        <div>
          <div style="font-weight:800;margin-bottom:4px">Painel Carvalho</div>
          <div>${escapeHtml(message)}</div>
        </div>
      </div>
    </div>
  `);
  document.body.appendChild(node);
  setTimeout(() => node.remove(), 2400);
}

/* ====== Mock DB (localStorage) ====== */
function seedDb() {
  return {
    sales: [
      { id: "S-1001", date: "2026-01-29", consultant: "David Oliveira", team: "Luan e Raissa", office: "Alphaville", modality: "LAR", value: 1648026.48 },
      { id: "S-1002", date: "2026-01-22", consultant: "David Oliveira", team: "Luan e Raissa", office: "Alphaville", modality: "MOTORS", value: 190000.00 },
      { id: "S-1003", date: "2026-01-21", consultant: "Izabela Floriano", team: "Luan e Raissa", office: "Alphaville", modality: "LAR", value: 220000.00 },
      { id: "S-1004", date: "2026-01-18", consultant: "Carlos Silva", team: "Gestor Exemplo", office: "Campinas", modality: "MOTORS", value: 45000.00 },
      { id: "S-1005", date: "2026-01-12", consultant: "Maria Souza", team: "Gestor Exemplo", office: "Campinas", modality: "LAR", value: 87000.00 },
      { id: "S-0999", date: "2025-12-28", consultant: "David Oliveira", team: "Luan e Raissa", office: "Alphaville", modality: "LAR", value: 90000.00 },
      { id: "S-0998", date: "2025-12-20", consultant: "Izabela Floriano", team: "Luan e Raissa", office: "Alphaville", modality: "MOTORS", value: 60000.00 },
      { id: "S-0997", date: "2025-12-10", consultant: "Carlos Silva", team: "Gestor Exemplo", office: "Campinas", modality: "LAR", value: 45000.00 },
    ],
    managers: [
      { id: "M-1", name: "Luan e Raissa", office: "Alphaville", company: "Carvalho", phones: "5512999999223", status: "Ativo" },
      { id: "M-2", name: "Gestor Exemplo", office: "Campinas", company: "Carvalho", phones: "5519988888111", status: "Ativo" },
    ],
    consultants: [
      { id: "C-1", name: "Izabela Floriano", nick: "Izabela", team: "Luan e Raissa", office: "Alphaville", status: "Ativo" },
      { id: "C-2", name: "David Oliveira", nick: "David", team: "Luan e Raissa", office: "Alphaville", status: "Ativo" },
      { id: "C-3", name: "Carlos Silva", nick: "Carlos", team: "Gestor Exemplo", office: "Campinas", status: "Ativo" },
      { id: "C-4", name: "Maria Souza", nick: "Maria", team: "Gestor Exemplo", office: "Campinas", status: "Inativo" },
    ],
    secretaries: [
      { id: "S-SEC-1", name: "Secretária 1", linkedTo: "Luan e Raissa", phone: "5511988887777", status: "Ativo" },
      { id: "S-SEC-2", name: "Secretária 2", linkedTo: "Gestor Exemplo", phone: "5519999888333", status: "Ativo" },
    ],
    reports: [
      { id: crypto.randomUUID(), type: "Mensal", reference: "Janeiro/2026", generatedAt: new Date(Date.now()-86400000*2).toISOString(), status: "Pronto", file: "KPI Mensal Janeiro-2026.pdf" },
      { id: crypto.randomUUID(), type: "Diário", reference: "Hoje", generatedAt: new Date(Date.now()-86400000*1).toISOString(), status: "Pronto", file: "KPI Diário.pdf" },
    ],
  };
}

function getDb() {
  const raw = localStorage.getItem(DB_KEY);
  if (!raw) {
    const seed = seedDb();
    localStorage.setItem(DB_KEY, JSON.stringify(seed));
    return seed;
  }
  try { return JSON.parse(raw); } catch {
    const seed = seedDb();
    localStorage.setItem(DB_KEY, JSON.stringify(seed));
    return seed;
  }
}
function setDb(db) { localStorage.setItem(DB_KEY, JSON.stringify(db)); }

/* ====== Modal ====== */
function openModal({ title, bodyHtml, onSave, saveLabel="Salvar" }) {
  closeModal({ immediate: true });

  const backdrop = el(`
    <div class="modal-backdrop" id="modalBackdrop" role="dialog" aria-modal="true">
      <div class="modal">
        <div class="modal__hd">
          <h3>${escapeHtml(title)}</h3>
          <button class="btn btn--ghost btn--small" id="modalClose">Fechar</button>
        </div>
        <div class="modal__bd">
          ${bodyHtml}
        </div>
        <div class="modal__ft">
          <button class="btn btn--ghost" id="modalCancel">Cancelar</button>
          <button class="btn btn--red" id="modalSave">${escapeHtml(saveLabel)}</button>
        </div>
      </div>
    </div>
  `);

  document.body.appendChild(backdrop);
  requestAnimationFrame(() => backdrop.classList.add("show"));

  const close = () => closeModal();
  backdrop.addEventListener("click", (e) => { if (e.target === backdrop) close(); });
  backdrop.querySelector("#modalClose").addEventListener("click", close);
  backdrop.querySelector("#modalCancel").addEventListener("click", close);
  backdrop.querySelector("#modalSave").addEventListener("click", async () => {
    try {
      await onSave?.(backdrop);
      close();
    } catch (err) {
      toast(String(err?.message || err || "Erro ao salvar"));
    }
  });
}
function closeModal({ immediate = false } = {}) {
  const m = document.querySelector("#modalBackdrop");
  if (!m) return;
  if (immediate) {
    m.remove();
    return;
  }
  m.classList.remove("show");
  m.classList.add("closing");
  setTimeout(() => {
    if (m.isConnected) m.remove();
  }, 180);
}

/* ====== App rendering ====== */
function render() {
  const session = getSession();
  if (!session) {
    mount(LoginView());
    return;
  }
  const pageId = getPageFromHash();
  const valid = PAGES.some(p => p.id === pageId) ? pageId : "home";
  mount(AppShell(session, valid));
}

function LoginView() {
  const node = el(`
    <div class="auth">
      <div class="auth__wrap">
        <section class="hero">
          <div class="brand">
            <div class="brand__mark"></div>
            <div class="brand__name">
              <strong>Painel Carvalho</strong>
              <span>Mock visual • UI minimalista</span>
            </div>
          </div>
          <h1>Gestão, KPIs e relatórios em um só lugar.</h1>
          <p>
            Prévia visual do painel online para gestores, consultores e secretárias.
            O objetivo é demonstrar o estilo, a navegação e fluxos de gestão — sem backend.
          </p>
          <div class="chips">
            <span class="badge">⚡ KPIs sob demanda</span>
            <span class="badge">📦 Vendas via painel</span>
            <span class="badge">🔎 Filtros por tela</span>
            <span class="badge">📱 Mobile-first</span>
          </div>
          <div class="hr"></div>
          <div class="sub">Dica: use qualquer e-mail e a senha <strong>carvalho</strong>.</div>
        </section>

        <section class="auth__card">
          <div class="auth__title">
            <div class="brand__mark"></div>
            <div>
              <div class="h1">Painel Carvalho</div>
              <div class="sub">Acesso do gestor / equipe</div>
            </div>
          </div>

          <form class="form" id="loginForm">
            <div class="field">
              <label for="email">E-mail</label>
              <input class="input" id="email" name="email" type="email" placeholder="gestor@carvalho.com" autocomplete="email" required />
            </div>

            <div class="field">
              <label for="password">Senha</label>
              <input class="input" id="password" name="password" type="password" placeholder="••••••••" autocomplete="current-password" required />
            </div>

            <button class="btn btn--red" type="submit">Entrar</button>
            <div class="helper">*Mock visual:* autenticação local (localStorage).</div>

            <div class="alert" id="loginAlert">Senha inválida. Use <strong>carvalho</strong>.</div>
          </form>
        </section>
      </div>
    </div>
  `);

  const form = node.querySelector("#loginForm");
  const alert = node.querySelector("#loginAlert");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const data = new FormData(form);
    const email = String(data.get("email") || "").trim();
    const password = String(data.get("password") || "");
    if (password !== "carvalho") {
      alert.style.display = "block";
      return;
    }
    alert.style.display = "none";
    setSession({ email, role: "Gestor", team: "Equipe Alphaville", lastLogin: new Date().toISOString() });
    if (!localStorage.getItem(DB_KEY)) getDb();
    setHash("home");
    render();
  });

  return node;
}

function AppShell(session, pageId) {
  const node = el(`
    <div class="shell">
      <div class="overlay" id="overlay"></div>

      <aside class="sidebar" id="sidebar">
        <div class="brand">
          <div class="brand__mark"></div>
          <div class="brand__name">
            <strong>Painel Carvalho</strong>
            <span>Gestão & KPIs</span>
          </div>
        </div>
        <nav class="nav" id="nav"></nav>

        <div class="sidebar__footer">
          <div class="badge">🕒 ${nowBR()}</div>
          <div style="height:10px"></div>
          <div class="sub">Mock UI — sem backend.</div>
        </div>
      </aside>

      <main class="main">
        <header class="mobilebar">
          <button class="hamburger" id="hamb"><span></span></button>
          <div style="display:flex;flex-direction:column;gap:2px">
            <div class="h1" id="mTitle">—</div>
            <div class="sub">Equipe: <strong>${escapeHtml(session.team)}</strong></div>
          </div>
          <button class="btn btn--ghost btn--small" id="mLogout">${ICONS.logout}</button>
        </header>

        <header class="topbar">
          <div class="topbar__left">
            <div class="h1" id="pageTitle">—</div>
            <div class="sub">Equipe: <strong>${escapeHtml(session.team)}</strong></div>
          </div>
          <div class="topbar__right">
            <div class="pill">
              <span class="avatar"></span>
              <span>
                <strong>${escapeHtml(session.role)}</strong>
                <span class="muted"> • </span>
                <span class="muted">${escapeHtml(session.email)}</span>
              </span>
            </div>
            <button class="btn" id="logoutBtn" title="Sair">${ICONS.logout} Sair</button>
          </div>
        </header>

        <div class="content-wrap">
          <section class="content" id="content"></section>
        </div>
      </main>
    </div>
  `);

  const nav = node.querySelector("#nav");
  const content = node.querySelector("#content");
  const pageTitle = node.querySelector("#pageTitle");
  const mTitle = node.querySelector("#mTitle");

  nav.append(...PAGES.map(p => NavItem(p, pageId)));
  const page = PAGES.find(p => p.id === pageId) || PAGES[0];
  pageTitle.textContent = page.label;
  mTitle.textContent = page.label;
  content.appendChild(PageView(pageId));

  // Mobile sidebar toggles
  const sidebar = node.querySelector("#sidebar");
  const overlay = node.querySelector("#overlay");
  const closeSide = () => { sidebar.classList.remove("open"); overlay.classList.remove("show"); };
  node.querySelector("#hamb").addEventListener("click", () => {
    sidebar.classList.add("open"); overlay.classList.add("show");
  });
  overlay.addEventListener("click", closeSide);
  nav.addEventListener("click", (e) => { if (e.target.closest("a")) closeSide(); });

  const doLogout = () => {
    clearSession();
    window.location.hash = "";
    render();
  };
  node.querySelector("#logoutBtn").addEventListener("click", doLogout);
  node.querySelector("#mLogout").addEventListener("click", doLogout);

  return node;
}

function NavItem(page, activeId) {
  return el(`
    <a href="#/${page.id}" class="${page.id === activeId ? "active" : ""}">
      <span class="ico">${page.icon}</span>
      <span class="label">${escapeHtml(page.label)}</span>
    </a>
  `);
}

function PageView(id) {
  switch (id) {
    case "home": return HomePage();
    case "reports": return ReportsPage();
    case "sales": return SalesPage();
    case "managers": return ManagersPage();
    case "consultants": return ConsultantsPage();
    case "secretaries": return SecretariesPage();
    case "prospection": return ProspectionPage();
    case "hiring": return HiringPage();
    case "marketing": return MarketingPage();
    case "funnel": return FunnelPage();
    case "commissions": return CommissionsPage();
    default: return HomePage();
  }
}

/* ====== Pages ====== */

function HomePage() {
  const db = getDb();

  // --------- Helpers (mês atual baseado na data de hoje) ----------
  const todayIso = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
  const [cy, cm] = todayIso.split("-"); // current year/month

  const isSameMonth = (iso, y, m) => String(iso || "").startsWith(`${y}-${m}`);

  const salesThisMonth = (db.sales || []).filter(s => isSameMonth(s.date, cy, cm));
  const salesPrevMonth = (db.sales || []).filter(s => {
    const dt = new Date(`${cy}-${cm}-01T00:00:00Z`);
    dt.setUTCMonth(dt.getUTCMonth() - 1);
    const py = String(dt.getUTCFullYear());
    const pm = String(dt.getUTCMonth() + 1).padStart(2, "0");
    return isSameMonth(s.date, py, pm);
  });

  const qtdVendasMes = salesThisMonth.length;
  const valorMes = salesThisMonth.reduce((acc, s) => acc + Number(s.value || 0), 0);

  // --------- Meta (mock) ----------
  const meta = 5_000_000;
  const pctMeta = meta > 0 ? (valorMes / meta) : 0;

  // --------- Cross-selling (mock) ----------
  const byConsultant = new Map();
  for (const s of salesThisMonth) {
    if (!s.consultant) continue;
    if (!byConsultant.has(s.consultant)) byConsultant.set(s.consultant, new Set());
    byConsultant.get(s.consultant).add(String(s.modality || "").toUpperCase());
  }
  const consultoresComVendaMes = byConsultant.size;
  const consultoresComCross = [...byConsultant.values()].filter(set => set.has("LAR") && set.has("MOTORS")).length;
  const pctCross = consultoresComVendaMes > 0 ? (consultoresComCross / consultoresComVendaMes) : 0;

  // --------- Crescimento (MoM) ----------
  const valorPrev = salesPrevMonth.reduce((acc, s) => acc + Number(s.value || 0), 0);
  const crescimento = valorPrev > 0 ? ((valorMes - valorPrev) / valorPrev) : null;

  // --------- Tabela Total Carvalho ----------
  const offices = unique((db.sales || []).map(s => s.office));
  const teams = unique((db.sales || []).map(s => s.team));
  const periods = unique((db.sales || []).map(s => String(s.date || "").slice(0, 7))).sort().reverse();

  const node = el(`
    <div class="grid cards">

      <div class="card" style="grid-column: span 12;">
        <div class="card__hd">
          <div>
            <h3>Bem-vindo ao Painel Carvalho</h3>
            <p>Visão rápida do mês atual</p>
          </div>
          <span class="tag tag--ok"><span class="dot"></span> Online</span>
        </div>
        <div class="card__bd">
          <div style="display:grid;gap:8px">
            <div style="font-size:14px;font-weight:800;letter-spacing:.2px">
              Bora pra cima 🚀
            </div>
            <div class="sub">
              Aqui você acompanha o desempenho do mês e o consolidado por líder e vendedores.
              (Mock UI — sem backend)
            </div>
          </div>
        </div>
      </div>

      <div class="card" style="grid-column: span 4;">
        <div class="card__hd">
          <div><h3>Qtd. vendas (mês)</h3><p>${cm}/${cy}</p></div>
        </div>
        <div class="card__bd kpi">
          <div class="kpi__value">${qtdVendasMes}</div>
          <div class="kpi__meta">
            <span class="muted">${consultoresComVendaMes} consultores</span>
          </div>
        </div>
      </div>

      <div class="card" style="grid-column: span 4;">
        <div class="card__hd">
          <div><h3>Total vendido (mês)</h3><p>${cm}/${cy}</p></div>
        </div>
        <div class="card__bd kpi">
          <div class="kpi__value">${moneyBR(valorMes)}</div>
          <div class="kpi__meta">
            <span class="muted">Ticket médio: ${qtdVendasMes ? moneyBR(valorMes / qtdVendasMes) : moneyBR(0)}</span>
          </div>
        </div>
      </div>

      <div class="card" style="grid-column: span 4;">
        <div class="card__hd">
          <div><h3>Meta (mês)</h3><p>Mock</p></div>
        </div>
        <div class="card__bd kpi">
          <div class="kpi__value">${moneyBR(meta)}</div>
          <div class="kpi__meta">
            <span class="muted">Atingido: ${(pctMeta * 100).toFixed(1)}%</span>
          </div>
        </div>
      </div>

      <div class="card" style="grid-column: span 6;">
        <div class="card__hd">
          <div><h3>Cross-selling</h3><p>LAR + MOTORS</p></div>
        </div>
        <div class="card__bd kpi">
          <div class="kpi__value">${(pctCross * 100).toFixed(1)}%</div>
          <div class="kpi__meta">
            <span class="muted">${consultoresComCross} / ${consultoresComVendaMes} consultores</span>
          </div>
        </div>
      </div>

      <div class="card" style="grid-column: span 6;">
        <div class="card__hd">
          <div><h3>Crescimento</h3><p>vs mês anterior</p></div>
        </div>
        <div class="card__bd kpi">
          <div class="kpi__value">
            ${crescimento === null ? "n/a" : `${(crescimento * 100).toFixed(1)}%`}
          </div>
          <div class="kpi__meta">
            <span class="muted">Mês anterior: ${moneyBR(valorPrev)}</span>
          </div>
        </div>
      </div>

      <div class="card" style="grid-column: span 12;">
        <div class="card__hd">
          <div><h3>Total Carvalho</h3><p>Consolidado por líder e vendedores</p></div>
        </div>
        <div class="card__bd">
          <div class="toolbar">
            <div class="toolbar__left">
              <select class="select" id="fOffice">
                <option value="">Escritório (todos)</option>
                ${offices.map(o => `<option value="${escapeHtml(o)}">${escapeHtml(o)}</option>`).join("")}
              </select>
              <select class="select" id="fTeam">
                <option value="">Equipe (todas)</option>
                ${teams.map(t => `<option value="${escapeHtml(t)}">${escapeHtml(t)}</option>`).join("")}
              </select>
              <select class="select" id="fDate">
                <option value="">Data (todos)</option>
                ${periods.map(p => `<option value="${escapeHtml(p)}" ${p === `${cy}-${cm}` ? "selected" : ""}>${escapeHtml(p)}</option>`).join("")}
              </select>
            </div>
            <div class="toolbar__right">
              <span class="tag" id="totalLeadersTag">—</span>
            </div>
          </div>
          <div id="carvalhoTable"></div>
        </div>
      </div>

    </div>
  `);

  const fOffice = node.querySelector("#fOffice");
  const fTeam = node.querySelector("#fTeam");
  const fDate = node.querySelector("#fDate");
  const totalLeadersTag = node.querySelector("#totalLeadersTag");
  const carvalhoTable = node.querySelector("#carvalhoTable");
  const expandedLeaders = new Set();
  let initializedExpanded = false;

  const moneyOrDash = (n) => {
    const val = Number(n || 0);
    return val > 0 ? moneyBR(val) : "—";
  };

  const renderCarvalhoTable = () => {
    const filterOffice = String(fOffice.value || "").trim();
    const filterTeam = String(fTeam.value || "").trim();
    const filterDate = String(fDate.value || "").trim();

    const sales = (getDb().sales || []).filter(s => {
      const okOffice = !filterOffice || s.office === filterOffice;
      const okTeam = !filterTeam || s.team === filterTeam;
      const okMonth = !filterDate || String(s.date || "").startsWith(filterDate);
      return okOffice && okTeam && okMonth;
    });

    const leaders = new Map();
    for (const sale of sales) {
      const leaderName = String(sale.team || "Sem equipe");
      if (!leaders.has(leaderName)) leaders.set(leaderName, []);
      leaders.get(leaderName).push(sale);
    }

    const leaderRows = [...leaders.entries()]
      .map(([leader, leaderSales]) => {
        const bySeller = new Map();
        for (const sale of leaderSales) {
          const seller = String(sale.consultant || "Sem consultor");
          if (!bySeller.has(seller)) bySeller.set(seller, []);
          bySeller.get(seller).push(sale);
        }

        const sellerRows = [...bySeller.entries()]
          .map(([seller, sellerSales]) => {
            const lar = sellerSales
              .filter(s => String(s.modality || "").toUpperCase() === "LAR")
              .reduce((sum, s) => sum + Number(s.value || 0), 0);
            const motors = sellerSales
              .filter(s => String(s.modality || "").toUpperCase() === "MOTORS")
              .reduce((sum, s) => sum + Number(s.value || 0), 0);
            const total = sellerSales.reduce((sum, s) => sum + Number(s.value || 0), 0);
            return { seller, lar, motors, total };
          })
          .sort((a, b) => b.total - a.total);

        const total = leaderSales.reduce((sum, s) => sum + Number(s.value || 0), 0);
        const lar = leaderSales
          .filter(s => String(s.modality || "").toUpperCase() === "LAR")
          .reduce((sum, s) => sum + Number(s.value || 0), 0);
        const motors = leaderSales
          .filter(s => String(s.modality || "").toUpperCase() === "MOTORS")
          .reduce((sum, s) => sum + Number(s.value || 0), 0);
        return { leader, lar, motors, total, sellerRows };
      })
      .sort((a, b) => b.total - a.total);

    if (!initializedExpanded) {
      leaderRows.slice(0, 2).forEach(row => expandedLeaders.add(row.leader));
      initializedExpanded = true;
    }

    const totalLar = leaderRows.reduce((sum, row) => sum + row.lar, 0);
    const totalMotors = leaderRows.reduce((sum, row) => sum + row.motors, 0);
    const totalGeral = leaderRows.reduce((sum, row) => sum + row.total, 0);

    totalLeadersTag.textContent = `${leaderRows.length} líder(es) • ${moneyBR(totalGeral)}`;

    if (!leaderRows.length) {
      carvalhoTable.innerHTML = `
        <table class="table table--carvalho">
          <thead>
            <tr>
              <th colspan="2">S/U/M de valor</th>
              <th colspan="2">Modalidade</th>
              <th class="right">Total geral</th>
            </tr>
            <tr>
              <th>Equipe</th>
              <th>Vendedor</th>
              <th class="right">LAR</th>
              <th class="right">MOTORS</th>
              <th class="right">Total geral</th>
            </tr>
          </thead>
          <tbody>
            <tr><td colspan="5" class="center muted">Nenhum dado para os filtros selecionados.</td></tr>
          </tbody>
        </table>
      `;
      return;
    }

    const tbodyRows = [];
    leaderRows.forEach((row) => {
      const isOpen = expandedLeaders.has(row.leader);
      if (isOpen) {
        row.sellerRows.forEach((seller, idx) => {
          tbodyRows.push(`
            <tr class="seller-row">
              <td>${idx === 0 ? `<span class="leader-label">${escapeHtml(row.leader)}</span>` : ""}</td>
              <td>${escapeHtml(seller.seller)}</td>
              <td class="right">${moneyOrDash(seller.lar)}</td>
              <td class="right">${moneyOrDash(seller.motors)}</td>
              <td class="right">${moneyBR(seller.total)}</td>
            </tr>
          `);
        });
      }
      tbodyRows.push(`
        <tr class="subtotal-row">
          <td colspan="2">
            <button class="row-toggle" data-toggle-leader="${escapeHtml(row.leader)}" type="button">
              <span class="caret">${isOpen ? "−" : "+"}</span>
              <strong>${escapeHtml(row.leader)} Total</strong>
            </button>
          </td>
          <td class="right"><strong>${moneyOrDash(row.lar)}</strong></td>
          <td class="right"><strong>${moneyOrDash(row.motors)}</strong></td>
          <td class="right"><strong>${moneyBR(row.total)}</strong></td>
        </tr>
      `);
    });

    carvalhoTable.innerHTML = `
      <table class="table table--carvalho">
        <thead>
          <tr>
            <th colspan="2">S/U/M de valor</th>
            <th colspan="2">Modalidade</th>
            <th class="right">Total geral</th>
          </tr>
          <tr>
            <th>Equipe</th>
            <th>Vendedor</th>
            <th class="right">LAR</th>
            <th class="right">MOTORS</th>
            <th class="right">Total geral</th>
          </tr>
        </thead>
        <tbody>
          ${tbodyRows.join("")}
          <tr class="grand-total-row">
            <td colspan="2"><strong>Total geral</strong></td>
            <td class="right"><strong>${moneyOrDash(totalLar)}</strong></td>
            <td class="right"><strong>${moneyOrDash(totalMotors)}</strong></td>
            <td class="right"><strong>${moneyBR(totalGeral)}</strong></td>
          </tr>
        </tbody>
      </table>
    `;
  };

  [fOffice, fTeam, fDate].forEach(sel => sel.addEventListener("change", renderCarvalhoTable));

  node.addEventListener("click", (e) => {
    const btn = e.target.closest?.("[data-toggle-leader]");
    if (!btn) return;
    const leader = btn.getAttribute("data-toggle-leader");
    if (!leader) return;
    if (expandedLeaders.has(leader)) expandedLeaders.delete(leader);
    else expandedLeaders.add(leader);
    renderCarvalhoTable();
  });

  renderCarvalhoTable();
  return node;
}

function ReportsPage() {
  const db = getDb();
  const managers = unique((db.managers || []).map(m => m.name));
  const defaultDate = new Date().toISOString().slice(0, 10);

  const node = el(`
    <div class="card">
      <div class="card__hd">
        <div><h3>Relatórios</h3><p>Histórico e geração sob demanda (mock)</p></div>
        <div style="display:flex;gap:10px;flex-wrap:wrap">
          <button class="btn btn--red" id="genDaily">Gerar KPI diário</button>
          <button class="btn btn--red" id="genMonthly">Gerar KPI mensal</button>
        </div>
      </div>
      <div class="card__bd">
        <div class="toolbar" style="margin-bottom:14px">
          <div class="toolbar__left">
            <div class="field" style="min-width:190px">
              <label for="reportDate">Data de referência</label>
              <input class="input" id="reportDate" type="date" value="${defaultDate}" />
            </div>
            <div class="field" style="min-width:220px">
              <label for="reportManager">Gestor</label>
              <select class="select" id="reportManager">
                <option value="">Todos</option>
                ${managers.map(name => `<option value="${escapeHtml(name)}">${escapeHtml(name)}</option>`).join("")}
              </select>
            </div>
          </div>
        </div>

        <div style="display:flex;gap:10px;flex-wrap:wrap;margin-bottom:12px">
          <span class="tag">Equipe Alphaville</span>
          <span class="tag">GMT-3</span>
          <span class="tag">WhatsApp integrado</span>
        </div>
        <div id="table"></div>
        <div class="sub" style="margin-top:12px">
          No produto real: PDFs no S3, permissões por perfil e auditoria (quem gerou, quando, filtro).
        </div>
      </div>
    </div>
  `);

  const reportDate = node.querySelector("#reportDate");
  const reportManager = node.querySelector("#reportManager");
  const renderTable = () => node.querySelector("#table").innerHTML = ReportsTable({ compact: false });

  const pushReport = (type) => {
    const selectedDate = String(reportDate.value || "").trim();
    if (!selectedDate) {
      toast("Selecione uma data para gerar o KPI.");
      return;
    }
    const manager = String(reportManager.value || "").trim() || "Todos";
    const monthRef = selectedDate.slice(0, 7);
    const dateRef = dateBR(selectedDate);

    const db = getDb();
    const stamp = new Date();
    const fileSuffix = manager === "Todos" ? "Todos" : manager;
    db.reports.unshift({
      id: crypto.randomUUID(),
      type,
      reference: type === "Mensal" ? monthRef : dateRef,
      manager,
      generatedAt: stamp.toISOString(),
      status: "Pronto",
      file: type === "Mensal" ? `KPI Mensal ${monthRef} - ${fileSuffix}.pdf` : `KPI Diário ${dateRef} - ${fileSuffix}.pdf`,
    });
    setDb(db);
    renderTable();

    const typeLabel = type === "Mensal" ? "mensal" : "diário";
    toast(`KPI ${typeLabel} gerado para ${dateRef} • Gestor: ${manager}.`);
  };

  node.querySelector("#genDaily").addEventListener("click", () => { pushReport("Diário"); });
  node.querySelector("#genMonthly").addEventListener("click", () => { pushReport("Mensal"); });

  renderTable();
  return node;
}

function SalesPage() {
  // filtros: search, modalidade, escritório, equipe
  const node = el(`
    <div class="card">
      <div class="card__hd">
        <div><h3>Vendas</h3><p>Listagem (mock) + lançamento via painel</p></div>
        <div style="display:flex;gap:10px;flex-wrap:wrap">
          <button class="btn btn--red" id="addSale">Lançar venda</button>
          <button class="btn" id="reset">Reset mock</button>
        </div>
      </div>
      <div class="card__bd">
        <div class="toolbar">
          <div class="toolbar__left">
            <div class="search">
              🔎 <input id="q" placeholder="Buscar por consultor, equipe, escritório, id..." />
            </div>
            <select class="select" id="fMod">
              <option value="">Modalidade (todas)</option>
              <option value="LAR">LAR</option>
              <option value="MOTORS">MOTORS</option>
            </select>
            <select class="select" id="fOffice">
              <option value="">Escritório (todos)</option>
            </select>
            <select class="select" id="fTeam">
              <option value="">Equipe (todas)</option>
            </select>
          </div>
          <div class="toolbar__right">
            <span class="tag" id="countTag">—</span>
          </div>
        </div>

        <div id="table"></div>
        <div class="sub" style="margin-top:12px">
          No produto real: essa tela faria CRUD no Postgres e registraria auditoria (quem lançou/editou e quando).
        </div>
      </div>
    </div>
  `);

  const q = node.querySelector("#q");
  const fMod = node.querySelector("#fMod");
  const fOffice = node.querySelector("#fOffice");
  const fTeam = node.querySelector("#fTeam");
  const table = node.querySelector("#table");
  const countTag = node.querySelector("#countTag");

  const refreshFilterOptions = () => {
    const db = getDb();
    const offices = [...new Set(db.sales.map(s => s.office))].sort();
    const teams = [...new Set(db.sales.map(s => s.team))].sort();

    fOffice.innerHTML = `<option value="">Escritório (todos)</option>` + offices.map(o => `<option value="${escapeHtml(o)}">${escapeHtml(o)}</option>`).join("");
    fTeam.innerHTML = `<option value="">Equipe (todas)</option>` + teams.map(t => `<option value="${escapeHtml(t)}">${escapeHtml(t)}</option>`).join("");
  };

  const getFiltered = () => {
    const db = getDb();
    const needle = (q.value || "").toLowerCase().trim();
    return db.sales.filter(s => {
      const okNeedle = !needle || [s.id, s.date, s.consultant, s.team, s.office, s.modality].some(v => String(v||"").toLowerCase().includes(needle));
      const okMod = !fMod.value || s.modality === fMod.value;
      const okOffice = !fOffice.value || s.office === fOffice.value;
      const okTeam = !fTeam.value || s.team === fTeam.value;
      return okNeedle && okMod && okOffice && okTeam;
    });
  };

  const renderTable = () => {
    const rows = getFiltered().sort((a,b) => String(b.date).localeCompare(String(a.date)));
    countTag.textContent = `${rows.length} venda(s)`;

    table.innerHTML = `
      <table class="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Data</th>
            <th>Consultor</th>
            <th>Equipe</th>
            <th>Escritório</th>
            <th>Modalidade</th>
            <th class="right">Valor</th>
            <th class="center">Ações</th>
          </tr>
        </thead>
        <tbody>
          ${rows.map(s => `
            <tr>
              <td>${escapeHtml(s.id)}</td>
              <td>${escapeHtml(dateBR(s.date))}</td>
              <td>${escapeHtml(s.consultant)}</td>
              <td>${escapeHtml(s.team)}</td>
              <td>${escapeHtml(s.office)}</td>
              <td><span class="tag">${escapeHtml(s.modality)}</span></td>
              <td class="right">${escapeHtml(moneyBR(s.value))}</td>
              <td class="center">
                <button class="btn btn--small" data-edit-sale="${escapeHtml(s.id)}">Editar</button>
                <button class="btn btn--small btn--danger" data-del-sale="${escapeHtml(s.id)}">Excluir</button>
              </td>
            </tr>
          `).join("") || `<tr><td colspan="8" class="center muted">Nenhuma venda encontrada.</td></tr>`}
        </tbody>
      </table>
    `;
  };

  const openSaleModal = (mode, saleId=null) => {
    const db = getDb();
    const sale = saleId ? db.sales.find(x => x.id === saleId) : null;

    const defaultId = `S-${Math.floor(1000 + Math.random()*9000)}`;
    const consultants = db.consultants.map(c => c.nick || c.name).sort();
    const teams = [...new Set(db.managers.map(m => m.name))].sort();
    const offices = [...new Set(db.managers.map(m => m.office))].sort();

    openModal({
      title: mode === "edit" ? `Editar venda (${saleId})` : "Lançar venda",
      saveLabel: mode === "edit" ? "Salvar alterações" : "Lançar",
      bodyHtml: `
        <div class="formgrid">
          <div class="col-4">
            <div class="field">
              <label>ID</label>
              <input class="input" id="id" value="${escapeHtml(sale?.id || defaultId)}" ${mode==="edit" ? "readonly" : ""}/>
            </div>
          </div>
          <div class="col-4">
            <div class="field">
              <label>Data</label>
              <input class="input" id="date" type="date" value="${escapeHtml((sale?.date || new Date().toISOString().slice(0,10)))}"/>
            </div>
          </div>
          <div class="col-4">
            <div class="field">
              <label>Modalidade</label>
              <select class="select" id="mod">
                <option value="LAR" ${sale?.modality==="LAR" ? "selected":""}>LAR</option>
                <option value="MOTORS" ${sale?.modality==="MOTORS" ? "selected":""}>MOTORS</option>
              </select>
            </div>
          </div>

          <div class="col-6">
            <div class="field">
              <label>Consultor</label>
              <input class="input" id="consultant" list="consultants" value="${escapeHtml(sale?.consultant || "")}" placeholder="Ex: Izabela Floriano"/>
              <datalist id="consultants">
                ${consultants.map(n => `<option value="${escapeHtml(n)}"></option>`).join("")}
              </datalist>
            </div>
          </div>

          <div class="col-3">
            <div class="field">
              <label>Equipe</label>
              <input class="input" id="team" list="teams" value="${escapeHtml(sale?.team || "")}" placeholder="Ex: Luan e Raissa"/>
              <datalist id="teams">
                ${teams.map(n => `<option value="${escapeHtml(n)}"></option>`).join("")}
              </datalist>
            </div>
          </div>

          <div class="col-3">
            <div class="field">
              <label>Escritório</label>
              <input class="input" id="office" list="offices" value="${escapeHtml(sale?.office || "")}" placeholder="Ex: Alphaville"/>
              <datalist id="offices">
                ${offices.map(n => `<option value="${escapeHtml(n)}"></option>`).join("")}
              </datalist>
            </div>
          </div>

          <div class="col-6">
            <div class="field">
              <label>Valor (R$)</label>
              <input class="input" id="value" inputmode="decimal" value="${escapeHtml(String(sale?.value ?? ""))}" placeholder="Ex: 120000"/>
            </div>
          </div>

          <div class="col-12">
            <div class="sub">
              *Mock:* aqui, no produto real, esse lançamento poderia disparar webhook/integração (ou só gravar no BD).
            </div>
          </div>
        </div>
      `,
      onSave: () => {
        const id = document.querySelector("#modalBackdrop #id").value.trim();
        const date = document.querySelector("#modalBackdrop #date").value.trim();
        const modality = document.querySelector("#modalBackdrop #mod").value.trim();
        const consultant = document.querySelector("#modalBackdrop #consultant").value.trim();
        const team = document.querySelector("#modalBackdrop #team").value.trim();
        const office = document.querySelector("#modalBackdrop #office").value.trim();
        const valueRaw = document.querySelector("#modalBackdrop #value").value.trim().replace(",", ".");
        const value = Number(valueRaw);

        if (!id || !date || !consultant || !team || !office || !modality) throw new Error("Preencha todos os campos obrigatórios.");
        if (!Number.isFinite(value) || value < 0) throw new Error("Valor inválido.");

        const db = getDb();
        if (mode === "edit") {
          const idx = db.sales.findIndex(x => x.id === saleId);
          if (idx < 0) throw new Error("Venda não encontrada.");
          db.sales[idx] = { id, date, consultant, team, office, modality, value };
          setDb(db);
          toast("Venda atualizada (mock).");
        } else {
          if (db.sales.some(x => x.id === id)) throw new Error("ID já existe. Use outro.");
          db.sales.unshift({ id, date, consultant, team, office, modality, value });
          setDb(db);
          toast("Venda lançada (mock).");
        }
        refreshFilterOptions();
        renderTable();
      }
    });
  };

  node.querySelector("#addSale").addEventListener("click", () => openSaleModal("add"));

  node.querySelector("#reset").addEventListener("click", () => {
    localStorage.removeItem(DB_KEY);
    getDb();
    refreshFilterOptions();
    renderTable();
    toast("Mock resetado.");
  });

  // delegation actions
  node.addEventListener("click", (e) => {
    const edit = e.target.closest?.("[data-edit-sale]");
    if (edit) return openSaleModal("edit", edit.getAttribute("data-edit-sale"));

    const del = e.target.closest?.("[data-del-sale]");
    if (del) {
      const id = del.getAttribute("data-del-sale");
      openModal({
        title: "Excluir venda",
        saveLabel: "Excluir",
        bodyHtml: `<div class="sub">Tem certeza que deseja excluir a venda <strong>${escapeHtml(id)}</strong>? (mock)</div>`,
        onSave: () => {
          const db = getDb();
          db.sales = db.sales.filter(s => s.id !== id);
          setDb(db);
          refreshFilterOptions();
          renderTable();
          toast("Venda excluída (mock).");
        }
      });
    }
  });

  // filter listeners
  [q, fMod, fOffice, fTeam].forEach(inp => inp.addEventListener("input", renderTable));
  [fMod, fOffice, fTeam].forEach(sel => sel.addEventListener("change", renderTable));

  refreshFilterOptions();
  renderTable();
  return node;
}

function ManagersPage() {
  return CrudListPage({
    entity: "Gestor",
    storageKey: "managers",
    title: "Gestores",
    subtitle: "Cadastro e telefones de notificação (mock)",
    filters: [
      { id: "office", label: "Escritório", optionsFrom: (db) => unique(db.managers.map(m => m.office)) },
      { id: "company", label: "Empresa", optionsFrom: (db) => unique(db.managers.map(m => m.company)) },
      { id: "status", label: "Status", options: ["Ativo", "Inativo"] },
    ],
    columns: [
      { key:"name", label:"Gestor" },
      { key:"office", label:"Escritório" },
      { key:"company", label:"Empresa" },
      { key:"phones", label:"Telefones" },
      { key:"status", label:"Status", render: (v) => (v || "Ativo") === "Ativo" ? `<span class="tag tag--ok">Ativo</span>` : `<span class="tag tag--warn">Inativo</span>` },
    ],
    form: [
      { key:"id", label:"ID", type:"text", col:3, readonlyOnEdit:true, default: () => `M-${Math.floor(1+Math.random()*999)}` },
      { key:"name", label:"Nome", type:"text", col:9 },
      { key:"office", label:"Escritório", type:"text", col:6 },
      { key:"company", label:"Empresa", type:"text", col:6, default: () => "Carvalho" },
      { key:"phones", label:"Telefones (csv)", type:"text", col:12, placeholder:"5511..., 5519..." },
      { key:"status", label:"Status", type:"select", col:6, options:["Ativo","Inativo"], default:()=> "Ativo" },
    ],
  });
}

function ConsultantsPage() {
  return CrudListPage({
    entity: "Consultor",
    storageKey: "consultants",
    title: "Consultores",
    subtitle: "Gestão de consultores por equipe (mock)",
    filters: [
      { id: "team", label: "Equipe", optionsFrom: (db) => unique(db.consultants.map(c => c.team)) },
      { id: "office", label: "Escritório", optionsFrom: (db) => unique(db.consultants.map(c => c.office)) },
      { id: "status", label: "Status", options: ["Ativo", "Inativo"] },
    ],
    columns: [
      { key:"name", label:"Nome" },
      { key:"nick", label:"Como chamar" },
      { key:"team", label:"Equipe" },
      { key:"office", label:"Escritório" },
      { key:"status", label:"Status", render: (v) => v === "Ativo" ? `<span class="tag tag--ok">Ativo</span>` : `<span class="tag tag--warn">Inativo</span>` },
    ],
    form: [
      { key:"id", label:"ID", type:"text", col:3, readonlyOnEdit:true, default: () => `C-${Math.floor(1+Math.random()*9999)}` },
      { key:"name", label:"Nome", type:"text", col:9 },
      { key:"nick", label:"Como chamar", type:"text", col:6 },
      { key:"team", label:"Equipe", type:"text", col:6, datalistFrom:(db)=>unique(db.managers.map(m=>m.name)) },
      { key:"office", label:"Escritório", type:"text", col:6, datalistFrom:(db)=>unique(db.managers.map(m=>m.office)) },
      { key:"status", label:"Status", type:"select", col:6, options:["Ativo","Inativo"], default:()=> "Ativo" },
    ],
  });
}

function SecretariesPage() {
  return CrudListPage({
    entity: "Secretária",
    storageKey: "secretaries",
    title: "Secretárias",
    subtitle: "Vínculos e permissões operacionais (mock)",
    filters: [
      { id: "linkedTo", label: "Vinculada a", optionsFrom: (db) => unique(db.secretaries.map(s => s.linkedTo)) },
      { id: "status", label: "Status", options: ["Ativo", "Inativo"] },
    ],
    columns: [
      { key:"name", label:"Nome" },
      { key:"linkedTo", label:"Vinculada a" },
      { key:"phone", label:"Telefone" },
      { key:"status", label:"Status", render: (v) => v === "Ativo" ? `<span class="tag tag--ok">Ativo</span>` : `<span class="tag tag--warn">Inativo</span>` },
    ],
    form: [
      { key:"id", label:"ID", type:"text", col:4, readonlyOnEdit:true, default: () => `SEC-${Math.floor(1+Math.random()*9999)}` },
      { key:"name", label:"Nome", type:"text", col:8 },
      { key:"linkedTo", label:"Vinculada a", type:"text", col:6, datalistFrom:(db)=>unique(db.managers.map(m=>m.name)) },
      { key:"phone", label:"Telefone", type:"text", col:6, placeholder:"55 + DDD + número" },
      { key:"status", label:"Status", type:"select", col:6, options:["Ativo","Inativo"], default:()=> "Ativo" },
    ],
  });
}

function CommissionsPage() {
  const node = el(`
    <div class="card">
      <div class="card__hd">
        <div><h3>Comissões</h3><p>Gestores e consultores com valor recebido (mock)</p></div>
        <button class="btn btn--red" id="calcBtn">Calcular comissões</button>
      </div>
      <div class="card__bd">
        <div class="sub">Regra mock: consultor 2,0% por venda própria e gestor 1,0% sobre vendas da equipe.</div>
        <div class="hr"></div>
        <div id="commissionsTable"></div>
      </div>
    </div>
  `);

  const COMMISSION_RATE_CONSULTANT = 0.02;
  const COMMISSION_RATE_MANAGER = 0.01;
  const table = node.querySelector("#commissionsTable");

  const normalized = (v) => String(v || "").trim().toLowerCase();

  const renderCommissionsTable = () => {
    const db = getDb();
    const sales = db.sales || [];
    const managers = db.managers || [];
    const consultants = db.consultants || [];

    const rowsManagers = managers.map((m) => {
      const teamSalesTotal = sales
        .filter(s => normalized(s.team) === normalized(m.name))
        .reduce((sum, s) => sum + Number(s.value || 0), 0);
      const commission = teamSalesTotal * COMMISSION_RATE_MANAGER;
      return {
        type: "Gestor",
        name: m.name || "-",
        team: m.name || "-",
        office: m.office || "-",
        status: m.status || "Ativo",
        commission,
      };
    });

    const rowsConsultants = consultants.map((c) => {
      const ownSalesTotal = sales
        .filter(s => {
          const saleConsultant = normalized(s.consultant);
          return saleConsultant && (saleConsultant === normalized(c.name) || saleConsultant === normalized(c.nick));
        })
        .reduce((sum, s) => sum + Number(s.value || 0), 0);
      const commission = ownSalesTotal * COMMISSION_RATE_CONSULTANT;
      return {
        type: "Consultor",
        name: c.name || "-",
        team: c.team || "-",
        office: c.office || "-",
        status: c.status || "Ativo",
        commission,
      };
    });

    const rows = [...rowsManagers, ...rowsConsultants].sort((a, b) => b.commission - a.commission);
    const totalCommission = rows.reduce((sum, row) => sum + row.commission, 0);

    table.innerHTML = `
      <table class="table">
        <thead>
          <tr>
            <th>Tipo</th>
            <th>Nome</th>
            <th>Equipe</th>
            <th>Escritório</th>
            <th class="center">Status</th>
            <th class="right">Comissão recebida</th>
          </tr>
        </thead>
        <tbody>
          ${rows.map(row => `
            <tr>
              <td>${escapeHtml(row.type)}</td>
              <td>${escapeHtml(row.name)}</td>
              <td>${escapeHtml(row.team)}</td>
              <td>${escapeHtml(row.office)}</td>
              <td class="center">${row.status === "Ativo" ? `<span class="tag tag--ok">Ativo</span>` : `<span class="tag tag--warn">Inativo</span>`}</td>
              <td class="right"><strong>${moneyBR(row.commission)}</strong></td>
            </tr>
          `).join("") || `<tr><td colspan="6" class="center muted">Nenhum gestor/consultor cadastrado.</td></tr>`}
          <tr>
            <td colspan="5"><strong>Total de comissões</strong></td>
            <td class="right"><strong>${moneyBR(totalCommission)}</strong></td>
          </tr>
        </tbody>
      </table>
    `;
  };

  node.querySelector("#calcBtn").addEventListener("click", () => {
    renderCommissionsTable();
    toast("Comissões recalculadas (mock).");
  });

  renderCommissionsTable();
  return node;
}

function ProspectionPage() {
  return el(`
    <div class="card">
      <div class="card__hd">
        <div><h3>Prospecção</h3><p>Área reservada</p></div>
      </div>
      <div class="card__bd">
        <div class="sub">Tela vazia para evolução futura do módulo de prospecção.</div>
      </div>
    </div>
  `);
}

function HiringPage() {
  return el(`
    <div class="card">
      <div class="card__hd">
        <div><h3>Contratação</h3><p>Área reservada</p></div>
      </div>
      <div class="card__bd">
        <div class="sub">Tela vazia para evolução futura do módulo de contratação.</div>
      </div>
    </div>
  `);
}

function MarketingPage() {
  const platformSummary = [
    { platform: "Google Ads", status: "Ativo", spend: 4820, leads: 74, cpl: 65.14, conv: 9.4 },
    { platform: "Meta Ads", status: "Ativo", spend: 3910, leads: 62, cpl: 63.06, conv: 8.7 },
    { platform: "Instagram", status: "Otimização", spend: 2140, leads: 31, cpl: 69.03, conv: 6.2 },
    { platform: "Facebook", status: "Pausado", spend: 980, leads: 11, cpl: 89.09, conv: 3.4 },
  ];

  const campaigns = [
    { name: "Carvalho Residencial | Captação", platform: "Google Ads", objective: "Leads", budget: 180, status: "Ativo" },
    { name: "Lookalike Alto Ticket", platform: "Meta Ads", objective: "Conversão", budget: 140, status: "Ativo" },
    { name: "Reels Institucional", platform: "Instagram", objective: "Engajamento", budget: 85, status: "Otimização" },
    { name: "Remarketing Imóveis", platform: "Facebook", objective: "Tráfego", budget: 70, status: "Pausado" },
  ];

  return el(`
    <div class="grid cards">
      <div class="card" style="grid-column: span 12;">
        <div class="card__hd">
          <div><h3>Marketing</h3><p>Resumo mock de anúncios por plataforma</p></div>
          <span class="tag">Atualizado: ${nowBR()}</span>
        </div>
        <div class="card__bd">
          <div class="mkt-grid">
            ${platformSummary.map(item => `
              <article class="mkt-item">
                <div class="mkt-item__top">
                  <strong>${escapeHtml(item.platform)}</strong>
                  <span class="tag ${item.status === "Ativo" ? "tag--ok" : "tag--warn"}">${escapeHtml(item.status)}</span>
                </div>
                <div class="mkt-item__row"><span>Investimento</span><strong>${moneyBR(item.spend)}</strong></div>
                <div class="mkt-item__row"><span>Leads</span><strong>${item.leads}</strong></div>
                <div class="mkt-item__row"><span>CPL</span><strong>${moneyBR(item.cpl)}</strong></div>
                <div class="mkt-item__row"><span>Conversão</span><strong>${item.conv.toFixed(1)}%</strong></div>
              </article>
            `).join("")}
          </div>
        </div>
      </div>

      <div class="card" style="grid-column: span 12;">
        <div class="card__hd">
          <div><h3>Campanhas</h3><p>Snapshot mock das campanhas em execução</p></div>
        </div>
        <div class="card__bd">
          <table class="table">
            <thead>
              <tr>
                <th>Campanha</th>
                <th>Plataforma</th>
                <th>Objetivo</th>
                <th class="right">Orçamento/dia</th>
                <th class="center">Status</th>
              </tr>
            </thead>
            <tbody>
              ${campaigns.map(c => `
                <tr>
                  <td>${escapeHtml(c.name)}</td>
                  <td>${escapeHtml(c.platform)}</td>
                  <td>${escapeHtml(c.objective)}</td>
                  <td class="right">${moneyBR(c.budget)}</td>
                  <td class="center">${c.status === "Ativo" ? `<span class="tag tag--ok">Ativo</span>` : `<span class="tag tag--warn">${escapeHtml(c.status)}</span>`}</td>
                </tr>
              `).join("")}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `);
}

function FunnelPage() {
  const stages = [
    {
      name: "Lead",
      color: "var(--warn)",
      deals: [
        { title: "Família Almeida", source: "Meta Ads", consultant: "David", value: 320000 },
        { title: "Carlos Fonseca", source: "Google Ads", consultant: "Izabela", value: 185000 },
      ],
    },
    {
      name: "Qualificação",
      color: "#4f8cff",
      deals: [
        { title: "Condomínio Verona", source: "Instagram", consultant: "Carlos", value: 540000 },
        { title: "Lar Prime", source: "Indicação", consultant: "David", value: 420000 },
      ],
    },
    {
      name: "Proposta",
      color: "#8b7dff",
      deals: [
        { title: "Grupo Mota", source: "Google Ads", consultant: "Izabela", value: 890000 },
      ],
    },
    {
      name: "Fechamento",
      color: "var(--ok)",
      deals: [
        { title: "Residencial Solaris", source: "Meta Ads", consultant: "David", value: 1240000 },
      ],
    },
  ];

  return el(`
    <div class="card">
      <div class="card__hd">
        <div><h3>Funil de vendas</h3><p>Kanban básico de oportunidades (mock)</p></div>
        <span class="tag">Atualizado: ${nowBR()}</span>
      </div>
      <div class="card__bd">
        <div class="funnel-board">
          ${stages.map(stage => {
            const total = stage.deals.reduce((sum, d) => sum + Number(d.value || 0), 0);
            return `
              <section class="funnel-col">
                <header class="funnel-col__hd">
                  <div class="funnel-col__title">
                    <span class="funnel-dot" style="background:${stage.color}"></span>
                    <strong>${escapeHtml(stage.name)}</strong>
                  </div>
                  <span class="tag">${stage.deals.length}</span>
                </header>
                <div class="funnel-col__sum">${moneyBR(total)}</div>
                <div class="funnel-col__list">
                  ${stage.deals.map(deal => `
                    <article class="funnel-card">
                      <strong>${escapeHtml(deal.title)}</strong>
                      <div class="funnel-card__meta">
                        <span>${escapeHtml(deal.source)}</span>
                        <span>${escapeHtml(deal.consultant)}</span>
                      </div>
                      <div class="funnel-card__value">${moneyBR(deal.value)}</div>
                    </article>
                  `).join("")}
                </div>
              </section>
            `;
          }).join("")}
        </div>
      </div>
    </div>
  `);
}

/* ====== CRUD Generic Page ====== */

function unique(arr) {
  return [...new Set((arr||[]).map(x => String(x||"").trim()).filter(Boolean))].sort();
}

function CrudListPage({ entity, storageKey, title, subtitle, filters, columns, form }) {
  const node = el(`
    <div class="card">
      <div class="card__hd">
        <div><h3>${escapeHtml(title)}</h3><p>${escapeHtml(subtitle)}</p></div>
        <div style="display:flex;gap:10px;flex-wrap:wrap">
          <button class="btn btn--red" id="add">Adicionar ${escapeHtml(entity)}</button>
        </div>
      </div>
      <div class="card__bd">
        <div class="toolbar">
          <div class="toolbar__left" id="filters">
            <div class="search">🔎 <input id="q" placeholder="Buscar..." /></div>
          </div>
          <div class="toolbar__right"><span class="tag" id="countTag">—</span></div>
        </div>
        <div id="table"></div>
        <div class="sub" style="margin-top:12px">*Mock:* CRUD local. No produto real: Postgres + RBAC + auditoria.</div>
      </div>
    </div>
  `);

  const q = node.querySelector("#q");
  const filtersWrap = node.querySelector("#filters");
  const table = node.querySelector("#table");
  const countTag = node.querySelector("#countTag");

  const filterState = {};
  const filterEls = {};

  // create selects
  (filters || []).forEach(f => {
    const sel = el(`
      <select class="select" id="f_${escapeHtml(f.id)}">
        <option value="">${escapeHtml(f.label)} (todos)</option>
      </select>
    `);
    filtersWrap.appendChild(sel);
    filterEls[f.id] = sel;
    filterState[f.id] = "";
    sel.addEventListener("change", () => { filterState[f.id] = sel.value; renderTable(); });
  });

  const fillFilterOptions = () => {
    const db = getDb();
    (filters || []).forEach(f => {
      const sel = filterEls[f.id];
      const opts = (f.optionsFrom ? f.optionsFrom(db) : (f.options || [])) || [];
      const current = sel.value;
      sel.innerHTML = `<option value="">${escapeHtml(f.label)} (todos)</option>` + opts.map(o => `<option value="${escapeHtml(o)}">${escapeHtml(o)}</option>`).join("");
      sel.value = current || "";
    });
  };

  const getItems = () => {
    const db = getDb();
    return (db[storageKey] || []).slice();
  };

  const setItems = (items) => {
    const db = getDb();
    db[storageKey] = items;
    setDb(db);
  };

  const applyFilters = (items) => {
    const needle = (q.value || "").toLowerCase().trim();
    return items.filter(it => {
      const okNeedle = !needle || Object.values(it).some(v => String(v||"").toLowerCase().includes(needle));
      const okSelects = (filters || []).every(f => {
        const val = filterState[f.id];
        if (!val) return true;
        const raw = it[f.id] ?? it[f.key ?? f.id] ?? "";
        const normalized = f.id === "status" && !String(raw).trim() ? "Ativo" : raw;
        return String(normalized).trim() === val;
      });
      return okNeedle && okSelects;
    });
  };

  const renderTable = () => {
    const items = applyFilters(getItems());
    countTag.textContent = `${items.length} registro(s)`;

    table.innerHTML = `
      <table class="table">
        <thead>
          <tr>
            ${columns.map(c => `<th>${escapeHtml(c.label)}</th>`).join("")}
            <th class="center">Ações</th>
          </tr>
        </thead>
        <tbody>
          ${items.map(it => `
            <tr>
              ${columns.map(c => {
                const val = it[c.key];
                const txt = c.render ? c.render(val, it) : escapeHtml(String(val ?? ""));
                const cls = c.align === "right" ? "right" : (c.align === "center" ? "center" : "");
                return `<td class="${cls}">${txt}</td>`;
              }).join("")}
              <td class="center">
                <button class="btn btn--small" data-edit="${escapeHtml(it.id)}">Editar</button>
                <button class="btn btn--small btn--danger" data-del="${escapeHtml(it.id)}">Excluir</button>
              </td>
            </tr>
          `).join("") || `<tr><td colspan="${columns.length+1}" class="center muted">Nenhum registro encontrado.</td></tr>`}
        </tbody>
      </table>
    `;
  };

  const openEntityModal = (mode, id=null) => {
    const items = getItems();
    const current = id ? items.find(x => x.id === id) : null;

    const db = getDb();
    const inputsHtml = form.map(field => {
      const col = field.col ? `col-${field.col}` : "col-6";
      const key = field.key;
      const label = field.label;
      const type = field.type || "text";
      const placeholder = field.placeholder || "";
      const readonly = (mode === "edit" && field.readonlyOnEdit) ? "readonly" : "";

      const value = (mode === "edit")
        ? (current?.[key] ?? "")
        : (typeof field.default === "function" ? field.default(db) : (field.default ?? ""));

      // datalist
      const listId = field.datalistFrom ? `dl_${storageKey}_${key}` : "";
      const datalist = field.datalistFrom ? `<datalist id="${listId}">${(field.datalistFrom(db)||[]).map(v=>`<option value="${escapeHtml(v)}"></option>`).join("")}</datalist>` : "";

      if (type === "select") {
        const options = (field.options || []).map(o => {
          const sel = String(o) === String(value) ? "selected" : "";
          return `<option value="${escapeHtml(o)}" ${sel}>${escapeHtml(o)}</option>`;
        }).join("");
        return `
          <div class="${col}">
            <div class="field">
              <label>${escapeHtml(label)}</label>
              <select class="select" id="${escapeHtml(key)}">${options}</select>
            </div>
          </div>
        `;
      }

      return `
        <div class="${col}">
          <div class="field">
            <label>${escapeHtml(label)}</label>
            <input class="input" id="${escapeHtml(key)}" ${readonly} placeholder="${escapeHtml(placeholder)}" value="${escapeHtml(String(value))}" list="${listId}" />
            ${datalist}
          </div>
        </div>
      `;
    }).join("");

    openModal({
      title: mode === "edit" ? `Editar ${entity}` : `Adicionar ${entity}`,
      saveLabel: mode === "edit" ? "Salvar alterações" : "Adicionar",
      bodyHtml: `<div class="formgrid">${inputsHtml}</div>`,
      onSave: () => {
        const data = {};
        form.forEach(f => {
          const v = document.querySelector(`#modalBackdrop #${CSS.escape(f.key)}`)?.value ?? "";
          data[f.key] = String(v).trim();
        });

        if (!data.id) throw new Error("ID é obrigatório.");
        // validação simples: nome obrigatório se existir
        const nameKey = form.find(x => x.key === "name") ? "name" : null;
        if (nameKey && !data[nameKey]) throw new Error("Nome é obrigatório.");

        const items = getItems();
        if (mode === "edit") {
          const idx = items.findIndex(x => x.id === id);
          if (idx < 0) throw new Error(`${entity} não encontrado.`);
          items[idx] = { ...items[idx], ...data };
          setItems(items);
          toast(`${entity} atualizado (mock).`);
        } else {
          if (items.some(x => x.id === data.id)) throw new Error("ID já existe.");
          setItems([data, ...items]);
          toast(`${entity} adicionado (mock).`);
        }
        fillFilterOptions();
        renderTable();
      }
    });
  };

  node.querySelector("#add").addEventListener("click", () => openEntityModal("add"));

  node.addEventListener("click", (e) => {
    const edit = e.target.closest?.("[data-edit]");
    if (edit) return openEntityModal("edit", edit.getAttribute("data-edit"));

    const del = e.target.closest?.("[data-del]");
    if (del) {
      const id = del.getAttribute("data-del");
      openModal({
        title: `Excluir ${entity}`,
        saveLabel: "Excluir",
        bodyHtml: `<div class="sub">Tem certeza que deseja excluir <strong>${escapeHtml(id)}</strong>? (mock)</div>`,
        onSave: () => {
          const items = getItems().filter(x => x.id !== id);
          setItems(items);
          fillFilterOptions();
          renderTable();
          toast(`${entity} excluído (mock).`);
        }
      });
    }
  });

  q.addEventListener("input", renderTable);

  fillFilterOptions();
  renderTable();
  return node;
}

/* ====== Tables ====== */

function ReportsTable({ compact }) {
  const db = getDb();
  const reports = (db.reports || []);
  const rows = (compact ? reports.slice(0,5) : reports).map(r => {
    const dt = new Date(r.generatedAt);
    const when = new Intl.DateTimeFormat("pt-BR", { dateStyle: "short", timeStyle: "short" }).format(dt);
    const statusTag = r.status === "Pronto" ? `<span class="tag tag--ok">Pronto</span>` : `<span class="tag tag--warn">Gerando</span>`;
    const manager = r.manager || "Todos";
    return `
      <tr>
        <td>${escapeHtml(r.type)}</td>
        <td>${escapeHtml(r.reference)}</td>
        <td>${escapeHtml(manager)}</td>
        <td>${escapeHtml(when)}</td>
        <td class="center">${statusTag}</td>
        <td class="right"><button class="btn btn--small" data-dl="${escapeHtml(r.file)}">Baixar</button></td>
      </tr>
    `;
  }).join("");

  return `
    <table class="table">
      <thead>
        <tr>
          <th>Tipo</th>
          <th>Referência</th>
          <th>Gestor</th>
          <th>Gerado em</th>
          <th class="center">Status</th>
          <th class="right">Ação</th>
        </tr>
      </thead>
      <tbody>
        ${rows || `<tr><td colspan="6" class="center muted">Nenhum relatório ainda.</td></tr>`}
      </tbody>
    </table>
  `;
}

// Download buttons delegation
document.addEventListener("click", (e) => {
  const btn = e.target?.closest?.("button[data-dl]");
  if (!btn) return;
  toast(`Download: ${btn.getAttribute("data-dl")} (mock).`);
});

window.addEventListener("hashchange", render);
window.addEventListener("DOMContentLoaded", () => {
  if (getSession() && !window.location.hash) setHash("home");
  render();
});
