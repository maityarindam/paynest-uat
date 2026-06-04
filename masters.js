/* ================================================
   PAYNEST masters.js — Employee Masters Module
   Manages: Gender · Status · Employment Type ·
            Department · Designation · Blood Group ·
            Marital Status · Location
   Storage: sessionStorage (browser cache)
================================================ */

/* ══════════════════════════════
   MASTER DEFINITIONS
══════════════════════════════ */
const MASTERS_CONFIG = {
  gender: {
    label: "Gender",
    icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="7" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>`,
    color: "#7C3AED",
    colorBg: "rgba(124,58,237,.1)",
    seed: ["Male", "Female", "Other", "Prefer not to say"]
  },
  status: {
    label: "Employment Status",
    icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M9 12l2 2 4-4"/></svg>`,
    color: "#10B981",
    colorBg: "rgba(16,185,129,.1)",
    seed: ["Active", "On Probation", "Inactive", "On Leave", "Resigned", "Terminated"]
  },
  empType: {
    label: "Employment Type",
    icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>`,
    color: "#06B6D4",
    colorBg: "rgba(6,182,212,.1)",
    seed: ["Full-Time", "Part-Time", "Contract", "Intern", "Freelance", "Consultant"]
  },
  department: {
    label: "Department",
    icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`,
    color: "#F59E0B",
    colorBg: "rgba(245,158,11,.1)",
    seed: ["Payroll", "HR", "Finance", "IT", "Operations", "Sales", "Marketing", "Admin", "Legal", "Procurement"]
  },
  designation: {
    label: "Designation",
    icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,
    color: "#EC4899",
    colorBg: "rgba(236,72,153,.1)",
    seed: ["CEO", "CTO", "CFO", "Manager", "Senior Manager", "Executive", "Senior Executive",
           "Analyst", "Senior Analyst", "Developer", "Senior Developer", "Lead Developer",
           "Coordinator", "Sales Executive", "HR Executive", "Intern"]
  },
  blood: {
    label: "Blood Group",
    icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2C6 8 4 12 4 15a8 8 0 0 0 16 0c0-3-2-7-8-13z"/></svg>`,
    color: "#EF4444",
    colorBg: "rgba(239,68,68,.1)",
    seed: ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"]
  },
  marital: {
    label: "Marital Status",
    icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>`,
    color: "#6366F1",
    colorBg: "rgba(99,102,241,.1)",
    seed: ["Single", "Married", "Divorced", "Widowed", "Separated"]
  },
  location: {
    label: "Location",
    icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>`,
    color: "#14B8A6",
    colorBg: "rgba(20,184,166,.1)",
    seed: ["Kolkata", "Mumbai", "Delhi", "Bengaluru", "Ahmedabad", "Chennai", "Hyderabad", "Pune", "Lucknow", "Jaipur"]
  }
};

const MASTER_STORAGE_KEY = "paynest_masters";

/* ══════════════════════════════
   STATE
══════════════════════════════ */
let activeMasterTab   = "gender";
let masterEditTarget  = null; // { key, index } when editing
let masterDeleteTarget = null;

/* ══════════════════════════════
   STORAGE
══════════════════════════════ */
function getMasters() {
  try {
    const raw = sessionStorage.getItem(MASTER_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch(e) {}
  // Seed defaults
  const defaults = {};
  Object.keys(MASTERS_CONFIG).forEach(function(key) {
    defaults[key] = MASTERS_CONFIG[key].seed.map(function(v, i) {
      return { id: key + "_" + i, value: v, active: true };
    });
  });
  sessionStorage.setItem(MASTER_STORAGE_KEY, JSON.stringify(defaults));
  return defaults;
}

function saveMasters(data) {
  sessionStorage.setItem(MASTER_STORAGE_KEY, JSON.stringify(data));
}

/* Public helper — used by employees.js to get values for a master */
function getMasterValues(key) {
  const all = getMasters();
  const list = all[key] || [];
  return list.filter(function(m) { return m.active !== false; }).map(function(m) { return m.value; });
}

/* ══════════════════════════════
   INIT
══════════════════════════════ */
document.addEventListener("DOMContentLoaded", function() {
  // Restore dark mode
  if (sessionStorage.getItem("paynest_darkmode") === "true") {
    document.body.classList.add("dark-mode");
  }

  initMasterSidebar();
  initMasterTopbar();
  initMasterDarkMode();
  initMasterClock();
  buildMasterTabs();
  switchMasterTab("gender");
  initMasterSearch();
});

/* ══════════════════════════════
   SIDEBAR
══════════════════════════════ */
function initMasterSidebar() {
  var sidebar = document.getElementById("sidebar");
  var pinBtn  = document.getElementById("sbPinBtn");
  var tooltip = document.getElementById("sbTooltip");
  if (!sidebar) return;

  var pinned = JSON.parse(sessionStorage.getItem("sb_pinned") || "false");
  if (pinned) sidebar.classList.add("pinned");
  if (pinBtn) {
    pinBtn.querySelector("span").textContent = pinned ? "Pinned ✓" : "Keep Open";
    pinBtn.addEventListener("click", function() {
      var p = sidebar.classList.toggle("pinned");
      sessionStorage.setItem("sb_pinned", p);
      pinBtn.querySelector("span").textContent = p ? "Pinned ✓" : "Keep Open";
    });
  }
  if (tooltip) {
    sidebar.querySelectorAll(".sb-item").forEach(function(item) {
      item.addEventListener("mouseenter", function() {
        if (sidebar.classList.contains("pinned") || sidebar.matches(":hover")) return;
        var lbl = item.querySelector(".sb-label");
        if (!lbl) return;
        tooltip.textContent = lbl.textContent.trim();
        var rect = item.getBoundingClientRect();
        tooltip.style.top = (rect.top + rect.height / 2 - 12) + "px";
        tooltip.style.opacity = "1";
      });
      item.addEventListener("mouseleave", function() { tooltip.style.opacity = "0"; });
    });
  }
}

/* ══════════════════════════════
   TOPBAR
══════════════════════════════ */
function initMasterTopbar() {
  var user    = sessionStorage.getItem("paynest_user") || "Arindam";
  var initial = user.charAt(0).toUpperCase();
  ["tbName","udName"].forEach(function(id) { var el = document.getElementById(id); if (el) el.textContent = user; });
  ["tbAvatar","udAvatar"].forEach(function(id) { var el = document.getElementById(id); if (el) el.textContent = initial; });

  var pageBtn  = document.getElementById("pageSelectBtn");
  var pageDrop = document.getElementById("pageDropdown");
  if (pageBtn && pageDrop) {
    pageBtn.addEventListener("click", function(e) { e.stopPropagation(); pageDrop.classList.toggle("open"); });
    pageDrop.addEventListener("click", function(e) { e.stopPropagation(); });
  }
  var userBtn  = document.getElementById("userDropdownBtn");
  var userDrop = document.getElementById("userDropdown");
  if (userBtn && userDrop) {
    userBtn.addEventListener("click", function(e) { e.stopPropagation(); userDrop.classList.toggle("open"); });
    userDrop.addEventListener("click", function(e) { e.stopPropagation(); });
  }
  document.addEventListener("click", function() {
    if (pageDrop) pageDrop.classList.remove("open");
    if (userDrop) userDrop.classList.remove("open");
  });
  var photoInput = document.getElementById("photoUpload");
  if (photoInput) {
    photoInput.addEventListener("change", function() {
      var file = this.files[0]; if (!file) return;
      var reader = new FileReader();
      reader.onload = function(e) {
        var src = e.target.result;
        ["tbAvatar","udAvatar"].forEach(function(id) {
          var el = document.getElementById(id);
          if (el) el.innerHTML = '<img src="'+src+'" alt="Avatar" style="width:100%;height:100%;object-fit:cover;border-radius:50%;" />';
        });
      };
      reader.readAsDataURL(file);
    });
  }
}

/* ══════════════════════════════
   DARK MODE
══════════════════════════════ */
function initMasterDarkMode() {
  var btn = document.getElementById("darkModeBtn");
  if (!btn) return;
  btn.addEventListener("click", function() {
    var isDark = document.body.classList.toggle("dark-mode");
    sessionStorage.setItem("paynest_darkmode", isDark);
  });
}

/* ══════════════════════════════
   CLOCK
══════════════════════════════ */
function initMasterClock() {
  var timeEl = document.getElementById("tbClockTime");
  var dateEl = document.getElementById("tbClockDate");
  if (!timeEl || !dateEl) return;
  var DAYS = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
  var MONS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  function tick() {
    var now = new Date();
    var hh = String(now.getHours()).padStart(2,"0");
    var mm = String(now.getMinutes()).padStart(2,"0");
    var ss = String(now.getSeconds()).padStart(2,"0");
    timeEl.innerHTML = hh+":"+mm+":<span class='tb-clock-seconds'>"+ss+"</span>";
    dateEl.textContent = DAYS[now.getDay()]+", "+String(now.getDate()).padStart(2,"0")+" "+MONS[now.getMonth()]+" "+now.getFullYear();
  }
  tick(); setInterval(tick, 1000);
}

/* ══════════════════════════════
   BUILD SIDEBAR TABS
══════════════════════════════ */
function buildMasterTabs() {
  var nav = document.getElementById("masterTabNav");
  if (!nav) return;
  nav.innerHTML = Object.keys(MASTERS_CONFIG).map(function(key) {
    var cfg = MASTERS_CONFIG[key];
    return '<button class="master-tab-btn" data-key="'+key+'" onclick="switchMasterTab(\''+key+'\')">'+
      '<span class="mt-icon" style="color:'+cfg.color+'">'+cfg.icon+'</span>'+
      '<span class="mt-label">'+cfg.label+'</span>'+
      '<span class="mt-count" id="mtCount-'+key+'">0</span>'+
    '</button>';
  }).join("");
  updateAllTabCounts();
}

function updateAllTabCounts() {
  var all = getMasters();
  Object.keys(MASTERS_CONFIG).forEach(function(key) {
    var el = document.getElementById("mtCount-"+key);
    if (el) el.textContent = (all[key] || []).filter(function(m){ return m.active !== false; }).length;
  });
}

/* ══════════════════════════════
   SWITCH TAB
══════════════════════════════ */
function switchMasterTab(key) {
  activeMasterTab = key;
  document.querySelectorAll(".master-tab-btn").forEach(function(b) {
    b.classList.toggle("active", b.dataset.key === key);
  });
  renderMasterPanel(key);
}

/* ══════════════════════════════
   RENDER PANEL
══════════════════════════════ */
function renderMasterPanel(key) {
  var cfg  = MASTERS_CONFIG[key];
  var all  = getMasters();
  var list = all[key] || [];

  var panel = document.getElementById("masterPanel");
  if (!panel) return;

  var q = (document.getElementById("masterSearch") ? document.getElementById("masterSearch").value : "").toLowerCase().trim();
  var filtered = q ? list.filter(function(m){ return m.value.toLowerCase().includes(q); }) : list;

  panel.innerHTML =
    '<div class="mp-header">'+
      '<div class="mp-header-left">'+
        '<div class="mp-icon-wrap" style="background:'+cfg.colorBg+';color:'+cfg.color+'">'+cfg.icon+'</div>'+
        '<div>'+
          '<div class="mp-title">'+cfg.label+'</div>'+
          '<div class="mp-subtitle">'+list.length+' values · '+list.filter(function(m){return m.active!==false;}).length+' active</div>'+
        '</div>'+
      '</div>'+
      '<button class="mp-add-btn" onclick="openAddMaster(\''+key+'\')">'+
        '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>'+
        'Add Value'+
      '</button>'+
    '</div>'+

    (filtered.length === 0 ?
      '<div class="mp-empty">'+
        '<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" style="opacity:.25"><rect x="3" y="3" width="18" height="18" rx="3"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="12" y1="8" x2="12" y2="16"/></svg>'+
        '<p>'+(q ? 'No results for "'+escMasterHtml(q)+'"' : 'No values yet. Add your first one.')+'</p>'+
      '</div>'
    :
      '<div class="mp-list">'+
        '<div class="mp-list-head">'+
          '<span>#</span><span>Value</span><span>Status</span><span>Actions</span>'+
        '</div>'+
        filtered.map(function(item, i) {
          var realIdx = list.indexOf(item);
          var isActive = item.active !== false;
          return '<div class="mp-list-row '+(!isActive?"mp-row-inactive":"")+'">'+
            '<span class="mp-row-num">'+(i+1)+'</span>'+
            '<span class="mp-row-val">'+
              '<span class="mp-color-dot" style="background:'+cfg.color+'"></span>'+
              escMasterHtml(item.value)+
            '</span>'+
            '<span>'+
              '<span class="mp-status-badge '+(isActive?"mp-active":"mp-inactive")+'" onclick="toggleMasterActive(\''+key+'\','+realIdx+')">'+
                (isActive ? "Active" : "Inactive")+
              '</span>'+
            '</span>'+
            '<span class="mp-actions">'+
              '<button class="mp-action-btn" title="Edit" onclick="openEditMaster(\''+key+'\','+realIdx+')">'+
                '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>'+
              '</button>'+
              '<button class="mp-action-btn mp-action-danger" title="Delete" onclick="openDeleteMaster(\''+key+'\','+realIdx+')">'+
                '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/></svg>'+
              '</button>'+
            '</span>'+
          '</div>';
        }).join("")+
      '</div>'
    );
}

/* ══════════════════════════════
   SEARCH
══════════════════════════════ */
function initMasterSearch() {
  var input = document.getElementById("masterSearch");
  if (!input) return;
  input.addEventListener("input", function() {
    renderMasterPanel(activeMasterTab);
  });
}

/* ══════════════════════════════
   ADD / EDIT MODAL
══════════════════════════════ */
function openAddMaster(key) {
  masterEditTarget = null;
  var cfg = MASTERS_CONFIG[key];
  var modal = document.getElementById("masterModal");
  var title = document.getElementById("masterModalTitle");
  var input = document.getElementById("masterModalInput");
  var hint  = document.getElementById("masterModalHint");
  if (!modal) return;
  title.textContent = "Add " + cfg.label + " Value";
  hint.textContent  = "Enter a new value for " + cfg.label;
  input.value = "";
  input.placeholder = "e.g. " + (cfg.seed[0] || "Value");
  document.getElementById("masterModalErr").textContent = "";
  modal.style.display = "flex";
  setTimeout(function() { input.focus(); }, 80);
}

function openEditMaster(key, idx) {
  masterEditTarget = { key: key, index: idx };
  var cfg  = MASTERS_CONFIG[key];
  var all  = getMasters();
  var item = (all[key] || [])[idx];
  if (!item) return;
  var modal = document.getElementById("masterModal");
  var title = document.getElementById("masterModalTitle");
  var input = document.getElementById("masterModalInput");
  var hint  = document.getElementById("masterModalHint");
  title.textContent = "Edit " + cfg.label + " Value";
  hint.textContent  = "Update the value for " + cfg.label;
  input.value = item.value;
  document.getElementById("masterModalErr").textContent = "";
  modal.style.display = "flex";
  setTimeout(function() { input.focus(); input.select(); }, 80);
}

function closeMasterModal() {
  var modal = document.getElementById("masterModal");
  if (modal) modal.style.display = "none";
  masterEditTarget = null;
}

function saveMasterModal() {
  var input = document.getElementById("masterModalInput");
  var errEl = document.getElementById("masterModalErr");
  var val   = input.value.trim();
  errEl.textContent = "";

  if (!val) { errEl.textContent = "Value cannot be empty."; input.focus(); return; }

  var key = masterEditTarget ? masterEditTarget.key : activeMasterTab;
  var all = getMasters();
  if (!all[key]) all[key] = [];

  // Duplicate check
  var isDup = all[key].some(function(m, i) {
    if (masterEditTarget && i === masterEditTarget.index) return false;
    return m.value.toLowerCase() === val.toLowerCase();
  });
  if (isDup) { errEl.textContent = "This value already exists."; input.focus(); return; }

  if (masterEditTarget) {
    all[key][masterEditTarget.index].value = val;
    showMasterToast("Value updated successfully!", "success");
  } else {
    all[key].push({ id: key + "_" + Date.now(), value: val, active: true });
    showMasterToast("Value added successfully!", "success");
  }

  saveMasters(all);
  closeMasterModal();
  renderMasterPanel(key);
  updateAllTabCounts();
}

/* Enter key saves */
document.addEventListener("DOMContentLoaded", function() {
  var input = document.getElementById("masterModalInput");
  if (input) {
    input.addEventListener("keydown", function(e) {
      if (e.key === "Enter") saveMasterModal();
      if (e.key === "Escape") closeMasterModal();
    });
  }
});

/* ══════════════════════════════
   TOGGLE ACTIVE
══════════════════════════════ */
function toggleMasterActive(key, idx) {
  var all  = getMasters();
  var item = (all[key] || [])[idx];
  if (!item) return;
  item.active = item.active === false ? true : false;
  saveMasters(all);
  renderMasterPanel(key);
  updateAllTabCounts();
  showMasterToast(item.value + (item.active ? " activated." : " deactivated."), "info");
}

/* ══════════════════════════════
   DELETE MODAL
══════════════════════════════ */
function openDeleteMaster(key, idx) {
  masterDeleteTarget = { key: key, index: idx };
  var all  = getMasters();
  var item = (all[key] || [])[idx];
  var nameEl = document.getElementById("masterDeleteName");
  if (nameEl && item) nameEl.textContent = '"' + item.value + '"';
  var modal = document.getElementById("masterDeleteModal");
  if (modal) modal.style.display = "flex";
}

function closeMasterDeleteModal() {
  masterDeleteTarget = null;
  var modal = document.getElementById("masterDeleteModal");
  if (modal) modal.style.display = "none";
}

function confirmMasterDelete() {
  if (!masterDeleteTarget) return;
  var all  = getMasters();
  var key  = masterDeleteTarget.key;
  var idx  = masterDeleteTarget.index;
  var item = (all[key] || [])[idx];
  if (!item) { closeMasterDeleteModal(); return; }
  var val  = item.value;
  all[key].splice(idx, 1);
  saveMasters(all);
  closeMasterDeleteModal();
  renderMasterPanel(key);
  updateAllTabCounts();
  showMasterToast('"' + val + '" deleted.', "danger");
}

/* ══════════════════════════════
   RESET TO DEFAULTS
══════════════════════════════ */
function resetMasterToDefaults(key) {
  if (!confirm("Reset \"" + MASTERS_CONFIG[key].label + "\" to default values? Current values will be replaced.")) return;
  var all = getMasters();
  all[key] = MASTERS_CONFIG[key].seed.map(function(v, i) {
    return { id: key + "_" + i, value: v, active: true };
  });
  saveMasters(all);
  renderMasterPanel(key);
  updateAllTabCounts();
  showMasterToast("Reset to defaults.", "info");
}

/* ══════════════════════════════
   TOAST
══════════════════════════════ */
function showMasterToast(msg, type) {
  var colors = { success: "#10B981", info: "#6B7280", danger: "#EF4444" };
  var bg = colors[type] || "#6B7280";
  var toast = document.createElement("div");
  toast.style.cssText = "position:fixed;bottom:24px;right:24px;z-index:9999;background:"+bg+";color:white;padding:11px 18px;border-radius:10px;font-size:13px;font-weight:600;box-shadow:0 4px 20px rgba(0,0,0,.18);display:flex;align-items:center;gap:8px;font-family:var(--font);animation:masterToastIn .25s ease;";
  toast.innerHTML = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5"><path d="M9 12l2 2 4-4M22 12A10 10 0 1 1 2 12a10 10 0 0 1 20 0z"/></svg>' + msg;
  document.body.appendChild(toast);
  setTimeout(function() { toast.remove(); }, 2800);
}

function escMasterHtml(str) {
  return String(str).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
}

/* Public logout fallback */
if (typeof window.logout === "undefined") {
  window.logout = function() { sessionStorage.clear(); window.location.replace("index.html"); };
}
