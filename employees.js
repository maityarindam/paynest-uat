/* ================================================
   PAYNEST employees.js — Employees Module
   Overview · Directory · Profile · Org Tree
================================================ */

/* ══════════════════════════════
   DATA STORE  (sessionStorage)
══════════════════════════════ */
const EMP_KEY = "paynest_employees";

/* ══════════════════════════════
   MASTERS HELPER
   Reads from masters.js sessionStorage key.
   Falls back to built-in defaults so employees.js
   works even if masters.js hasn't run yet.
══════════════════════════════ */
const MASTER_STORAGE_KEY = "paynest_masters";

const MASTER_FALLBACKS = {
  gender:      ["Male","Female","Other","Prefer not to say"],
  status:      ["Active","On Probation","Inactive","On Leave","Resigned","Terminated"],
  empType:     ["Full-Time","Part-Time","Contract","Intern","Freelance","Consultant"],
  department:  ["Payroll","HR","Finance","IT","Operations","Sales","Marketing","Admin"],
  designation: ["CEO","CTO","Manager","Senior Manager","Executive","Senior Executive","Analyst","Senior Analyst","Developer","Senior Developer","Coordinator","Sales Executive","Intern"],
  blood:       ["A+","A-","B+","B-","O+","O-","AB+","AB-"],
  marital:     ["Single","Married","Divorced","Widowed","Separated"],
  location:    ["Kolkata","Mumbai","Delhi","Bengaluru","Ahmedabad","Chennai","Hyderabad","Pune","Lucknow","Jaipur"]
};

function getMasterValues(key) {
  try {
    var raw = sessionStorage.getItem(MASTER_STORAGE_KEY);
    if (raw) {
      var all  = JSON.parse(raw);
      var list = all[key] || [];
      var active = list.filter(function(m){ return m.active !== false; }).map(function(m){ return m.value; });
      if (active.length) return active;
    }
  } catch(e) {}
  return MASTER_FALLBACKS[key] || [];
}

/* Populate a <select> element from a master key */
function populateMasterSelect(selectId, masterKey, blankLabel) {
  var el = document.getElementById(selectId);
  if (!el) return;
  var current = el.value;
  var values  = getMasterValues(masterKey);
  el.innerHTML = '<option value="">' + (blankLabel || "Select " + masterKey) + '</option>' +
    values.map(function(v){ return '<option value="'+v+'">' + v + '</option>'; }).join("");
  if (current) el.value = current; /* restore selected value */
}

const SEED_EMPLOYEES = [
  {
    id:"EMP001",empCode:"EMP001",
    firstName:"Arindam",lastName:"Maity",
    gender:"Male",dob:"1990-04-15",marital:"Married",blood:"B+",
    email:"arindam.maity@abcltd.com",mobile:"9876543210",
    emergency:"Sunita Maity (Wife) - 9876500001",
    currentAddr:"12, Park Street, Kolkata, WB - 700016",
    permAddr:"12, Park Street, Kolkata, WB - 700016",
    dept:"Payroll",desig:"Manager",doj:"2025-04-01",
    empType:"Full-Time",status:"Active",manager:"",location:"Kolkata",ctc:"1200000",
    pan:"ABCDE1234F",aadhaar:"123456789012",uan:"100123456789",esi:"",
    bank:"123456789012",ifsc:"SBIN0001234"
  },
  {
    id:"EMP002",empCode:"EMP002",
    firstName:"Rohit",lastName:"Sharma",
    gender:"Male",dob:"1992-07-22",marital:"Single",blood:"O+",
    email:"rohit.sharma@abcltd.com",mobile:"9123456780",
    emergency:"Ramesh Sharma (Father) - 9123400000",
    currentAddr:"45, MG Road, Bengaluru, KA - 560001",
    permAddr:"45, MG Road, Bengaluru, KA - 560001",
    dept:"HR",desig:"Executive",doj:"2025-04-15",
    empType:"Full-Time",status:"Active",manager:"Arindam Maity",location:"Bengaluru",ctc:"600000",
    pan:"BCDEF2345G",aadhaar:"234567890123",uan:"100234567890",esi:"",
    bank:"234567890123",ifsc:"HDFC0001234"
  },
  {
    id:"EMP003",empCode:"EMP003",
    firstName:"Sneha",lastName:"Das",
    gender:"Female",dob:"1994-11-05",marital:"Single",blood:"A+",
    email:"sneha.das@abcltd.com",mobile:"9234567891",
    emergency:"Biplab Das (Father) - 9234500000",
    currentAddr:"7, Lake View, Kolkata, WB - 700029",
    permAddr:"7, Lake View, Kolkata, WB - 700029",
    dept:"Finance",desig:"Analyst",doj:"2025-04-20",
    empType:"Full-Time",status:"Active",manager:"Arindam Maity",location:"Kolkata",ctc:"700000",
    pan:"CDEFG3456H",aadhaar:"345678901234",uan:"100345678901",esi:"",
    bank:"345678901234",ifsc:"ICIC0001234"
  },
  {
    id:"EMP004",empCode:"EMP004",
    firstName:"Vikram",lastName:"Patel",
    gender:"Male",dob:"1988-03-12",marital:"Married",blood:"AB+",
    email:"vikram.patel@abcltd.com",mobile:"9345678902",
    emergency:"Kavita Patel (Wife) - 9345500000",
    currentAddr:"22, Satellite Road, Ahmedabad, GJ - 380015",
    permAddr:"22, Satellite Road, Ahmedabad, GJ - 380015",
    dept:"IT",desig:"Developer",doj:"2025-05-01",
    empType:"Full-Time",status:"On Probation",manager:"Arindam Maity",location:"Ahmedabad",ctc:"900000",
    pan:"DEFGH4567I",aadhaar:"456789012345",uan:"100456789012",esi:"",
    bank:"456789012345",ifsc:"AXIS0001234"
  },
  {
    id:"EMP005",empCode:"EMP005",
    firstName:"Neha",lastName:"Kumari",
    gender:"Female",dob:"1996-08-30",marital:"Single",blood:"B-",
    email:"neha.kumari@abcltd.com",mobile:"9456789013",
    emergency:"Suresh Kumari (Father) - 9456500000",
    currentAddr:"33, Gomti Nagar, Lucknow, UP - 226010",
    permAddr:"33, Gomti Nagar, Lucknow, UP - 226010",
    dept:"Operations",desig:"Coordinator",doj:"2025-05-05",
    empType:"Full-Time",status:"On Probation",manager:"Rohit Sharma",location:"Lucknow",ctc:"480000",
    pan:"EFGHI5678J",aadhaar:"567890123456",uan:"100567890123",esi:"",
    bank:"567890123456",ifsc:"PNB00012345"
  },
  {
    id:"EMP006",empCode:"EMP006",
    firstName:"Pritam",lastName:"Shaw",
    gender:"Male",dob:"1991-06-10",marital:"Married",blood:"O-",
    email:"pritam.shaw@abcltd.com",mobile:"9567890124",
    emergency:"Ananya Shaw (Wife) - 9567500000",
    currentAddr:"5, New Alipore, Kolkata, WB - 700053",
    permAddr:"5, New Alipore, Kolkata, WB - 700053",
    dept:"Sales",desig:"Sales Executive",doj:"2025-05-10",
    empType:"Full-Time",status:"Active",manager:"Arindam Maity",location:"Kolkata",ctc:"550000",
    pan:"FGHIJ6789K",aadhaar:"678901234567",uan:"100678901234",esi:"",
    bank:"678901234567",ifsc:"SBIN0005678"
  },
  {
    id:"EMP007",empCode:"EMP007",
    firstName:"Ananya",lastName:"Gupta",
    gender:"Female",dob:"1995-06-15",marital:"Single",blood:"O+",
    email:"ananya.gupta@abcltd.com",mobile:"9876543210",
    emergency:"Rakesh Gupta (Father) - 9876500000",
    currentAddr:"123, Green Park, Delhi, India",
    permAddr:"123, Green Park, Delhi, India",
    dept:"Finance",desig:"Analyst",doj:"2025-06-01",
    empType:"Full-Time",status:"Active",manager:"Sneha Das",location:"Delhi",ctc:"650000",
    pan:"GHIJK7890L",aadhaar:"789012345678",uan:"100789012345",esi:"",
    bank:"789012345678",ifsc:"HDFC0005678"
  }
];

function getEmployees() {
  const raw = sessionStorage.getItem(EMP_KEY);
  if (!raw) {
    sessionStorage.setItem(EMP_KEY, JSON.stringify(SEED_EMPLOYEES));
    return SEED_EMPLOYEES;
  }
  return JSON.parse(raw);
}
function saveEmployees(list) {
  sessionStorage.setItem(EMP_KEY, JSON.stringify(list));
}
function nextEmpId(list) {
  const nums = list.map(e => parseInt(e.id.replace("EMP",""), 10)).filter(n => !isNaN(n));
  const max  = nums.length ? Math.max(...nums) : 0;
  return "EMP" + String(max + 1).padStart(3, "0");
}

/* ══════════════════════════════
   STATE
══════════════════════════════ */
let currentTab       = "overview";
let currentProfileId = null;
let drawerMode       = "add";
let drawerStep       = 1;
let deleteTargetId   = null;
let dirPage          = 1;
const DIR_PAGE_SIZE  = 10;
let filteredEmployees = [];

let ovHeadcountChart = null;
let ovGenderChart    = null;
let ovDeptHiringChart    = null;
let ovDeptAttritionChart = null;
let profSearchResults = [];

/* ══════════════════════════════
   INIT
══════════════════════════════ */
document.addEventListener("DOMContentLoaded", function () {

  /* Restore dark mode */
  if (sessionStorage.getItem("paynest_darkmode") === "true") {
    document.body.classList.add("dark-mode");
  }

  initSidebarEmp();
  initTopbarEmp();
  initDarkModeEmp();
  initProfSearch();
  initGlobalSearchEmp();
  initClockEmp();
  initOvCustomizer();

  /* Module tab nav */
  document.querySelectorAll(".emp-tab").forEach(function (btn) {
    btn.addEventListener("click", function () {
      if (btn.classList.contains("emp-tab-disabled")) return;
      switchTab(btn.dataset.tab);
    });
  });

  /* Profile sub-tabs */
  document.querySelectorAll(".prof-tab").forEach(function (btn) {
    btn.addEventListener("click", function () {
      document.querySelectorAll(".prof-tab").forEach(t => t.classList.remove("active"));
      document.querySelectorAll(".prof-panel").forEach(p => p.classList.remove("active"));
      btn.classList.add("active");
      const panel = document.getElementById("ptab-" + btn.dataset.ptab);
      if (panel) panel.classList.add("active");
    });
  });

  /* Drawer step nav */
  document.querySelectorAll(".dstep").forEach(function (btn) {
    btn.addEventListener("click", function () {
      goToDrawerStep(parseInt(btn.dataset.step));
    });
  });

  /* Initial render */
  switchTab("overview");

  /* Handle URL params */
  var urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get("action") === "add") {
    switchTab("directory");
    setTimeout(openAddDrawer, 200);
    history.replaceState(null, "", window.location.pathname);
  } else if (urlParams.get("profile")) {
    viewProfile(urlParams.get("profile"));
    history.replaceState(null, "", window.location.pathname);
  } else if (urlParams.get("search")) {
    switchTab("directory");
    var srchEl = document.getElementById("dirSearch");
    if (srchEl) {
      srchEl.value = urlParams.get("search");
      filterDirectory();
    }
    history.replaceState(null, "", window.location.pathname);
  }
});

/* ══════════════════════════════
   SIDEBAR
══════════════════════════════ */
function initSidebarEmp() {
  const sidebar = document.getElementById("sidebar");
  const pinBtn  = document.getElementById("sbPinBtn");
  const tooltip = document.getElementById("sbTooltip");
  if (!sidebar) return;

  const pinned = JSON.parse(sessionStorage.getItem("sb_pinned") || "false");
  if (pinned) sidebar.classList.add("pinned");

  if (pinBtn) {
    pinBtn.querySelector("span").textContent = pinned ? "Pinned ✓" : "Keep Open";
    pinBtn.addEventListener("click", function () {
      const p = sidebar.classList.toggle("pinned");
      sessionStorage.setItem("sb_pinned", p);
      pinBtn.querySelector("span").textContent = p ? "Pinned ✓" : "Keep Open";
    });
  }

  if (tooltip) {
    sidebar.querySelectorAll(".sb-item").forEach(function (item) {
      item.addEventListener("mouseenter", function () {
        if (sidebar.classList.contains("pinned")) return;
        if (sidebar.matches(":hover")) return;
        const lbl = item.querySelector(".sb-label");
        if (!lbl) return;
        tooltip.textContent = lbl.textContent.trim();
        const rect = item.getBoundingClientRect();
        tooltip.style.top = (rect.top + rect.height / 2 - 12) + "px";
        tooltip.style.opacity = "1";
      });
      item.addEventListener("mouseleave", function () {
        tooltip.style.opacity = "0";
      });
    });
  }
}

/* ══════════════════════════════
   LIVE CLOCK (employees page)
══════════════════════════════ */
function initClockEmp() {
  const timeEl = document.getElementById("tbClockTime");
  const dateEl = document.getElementById("tbClockDate");
  if (!timeEl || !dateEl) return;

  const DAY_NAMES = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
  const MON_NAMES = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

  function tick() {
    const now = new Date();
    const hh  = String(now.getHours()).padStart(2, "0");
    const mm  = String(now.getMinutes()).padStart(2, "0");
    const ss  = String(now.getSeconds()).padStart(2, "0");
    timeEl.innerHTML = hh + ":" + mm + ":<span class='tb-clock-seconds'>" + ss + "</span>";

    const day  = DAY_NAMES[now.getDay()];
    const date = String(now.getDate()).padStart(2, "0");
    const mon  = MON_NAMES[now.getMonth()];
    const yr   = now.getFullYear();
    dateEl.textContent = day + ", " + date + " " + mon + " " + yr;
  }

  tick();
  setInterval(tick, 1000);
}


/* ══════════════════════════════
   OVERVIEW CUSTOMIZER
══════════════════════════════ */
function initOvCustomizer() {
  var btn   = document.getElementById("ovCustomizeBtn");
  var panel = document.getElementById("ovCustomizerPanel");
  if (!btn || !panel) return;

  /* Toggle panel */
  btn.addEventListener("click", function (e) {
    e.stopPropagation();
    var isOpen = panel.classList.toggle("open");
    btn.classList.toggle("active", isOpen);
  });

  /* Close on outside click */
  document.addEventListener("click", function (e) {
    if (!btn.contains(e.target) && !panel.contains(e.target)) {
      panel.classList.remove("open");
      btn.classList.remove("active");
    }
  });

  /* Section toggles (stat grid + charts row) */
  panel.querySelectorAll("input[data-ovsection]").forEach(function (cb) {
    cb.addEventListener("change", function () {
      var el = document.getElementById(this.dataset.ovsection);
      if (el) el.style.display = this.checked ? "" : "none";
    });
  });

  /* Widget toggles (individual cards) */
  panel.querySelectorAll("input[data-ovwidget]").forEach(function (cb) {
    cb.addEventListener("change", function () {
      var el = document.getElementById(this.dataset.ovwidget);
      if (el) el.style.display = this.checked ? "" : "none";
      /* Hide the whole widgets row if all 4 are hidden */
      updateOvWidgetsRowVisibility();
    });
  });
}

function updateOvWidgetsRowVisibility() {
  var widgetIds = ["ovWidgetBirthdays","ovWidgetAnniversaries","ovWidgetConfirmation","ovWidgetJoiners"];
  var widgetsRow = document.querySelector(".ov-widgets-row");
  if (!widgetsRow) return;
  var anyVisible = widgetIds.some(function (id) {
    var el = document.getElementById(id);
    return el && el.style.display !== "none";
  });
  widgetsRow.style.display = anyVisible ? "" : "none";

  /* Also hide dept row if both dept charts hidden */
  var deptRow = document.getElementById("ovDeptChartsRow");
  if (deptRow) {
    var deptVisible = ["ovChartDeptHiring","ovChartDeptAttrition"].some(function(id) {
      var el = document.getElementById(id);
      return el && el.style.display !== "none";
    });
    deptRow.style.display = deptVisible ? "" : "none";
  }
}


/* ══════════════════════════════
   TOPBAR
══════════════════════════════ */
function initTopbarEmp() {
  const user    = sessionStorage.getItem("paynest_user") || "Arindam Maity";
  const initial = user.charAt(0).toUpperCase();
  ["tbName","udName"].forEach(id => { const el = document.getElementById(id); if (el) el.textContent = user; });
  ["tbAvatar","udAvatar"].forEach(id => { const el = document.getElementById(id); if (el) el.textContent = initial; });

  /* Page select dropdown */
  const pageBtn  = document.getElementById("pageSelectBtn");
  const pageDrop = document.getElementById("pageDropdown");
  if (pageBtn && pageDrop) {
    pageBtn.addEventListener("click", function (e) {
      e.stopPropagation();
      pageDrop.classList.toggle("open");
    });
    pageDrop.addEventListener("click", function (e) { e.stopPropagation(); });
  }

  /* User dropdown */
  const userBtn  = document.getElementById("userDropdownBtn");
  const userDrop = document.getElementById("userDropdown");
  if (userBtn && userDrop) {
    userBtn.addEventListener("click", function (e) {
      e.stopPropagation();
      userDrop.classList.toggle("open");
    });
    userDrop.addEventListener("click", function (e) { e.stopPropagation(); });
  }

  document.addEventListener("click", function () {
    if (pageDrop) pageDrop.classList.remove("open");
    if (userDrop) userDrop.classList.remove("open");
  });

  /* Photo upload */
  const photoInput = document.getElementById("photoUpload");
  if (photoInput) {
    photoInput.addEventListener("change", function () {
      const file = this.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = function (e) {
        const src = e.target.result;
        ["tbAvatar","udAvatar"].forEach(id => {
          const el = document.getElementById(id);
          if (el) el.innerHTML = '<img src="' + src + '" alt="Avatar" style="width:100%;height:100%;object-fit:cover;border-radius:50%;" />';
        });
      };
      reader.readAsDataURL(file);
    });
  }
}

/* ══════════════════════════════
   DARK MODE
══════════════════════════════ */
function initDarkModeEmp() {
  const btn = document.getElementById("darkModeBtn");
  if (!btn) return;
  btn.addEventListener("click", function () {
    const isDark = document.body.classList.toggle("dark-mode");
    sessionStorage.setItem("paynest_darkmode", isDark);
    /* Re-render charts to update colours */
    if (ovHeadcountChart)    { ovHeadcountChart.destroy();    ovHeadcountChart    = null; }
    if (ovGenderChart)       { ovGenderChart.destroy();       ovGenderChart       = null; }
    if (ovDeptHiringChart)   { ovDeptHiringChart.destroy();   ovDeptHiringChart   = null; }
    if (ovDeptAttritionChart){ ovDeptAttritionChart.destroy();ovDeptAttritionChart= null; }
    if (currentTab === "overview") renderOverview();
  });
}

/* ══════════════════════════════
   TAB SWITCHING
══════════════════════════════ */
function switchTab(tab) {
  currentTab = tab;
  document.querySelectorAll(".emp-tab").forEach(b => b.classList.remove("active"));
  document.querySelectorAll(".tab-content").forEach(c => c.classList.remove("active"));

  const activeBtn = document.querySelector('.emp-tab[data-tab="' + tab + '"]');
  if (activeBtn) activeBtn.classList.add("active");

  const activeContent = document.getElementById("tab-" + tab);
  if (activeContent) activeContent.classList.add("active");

  if (tab === "overview")  renderOverview();
  if (tab === "directory") renderDirectory();
  if (tab === "profile")   renderProfile();
  if (tab === "org")       renderOrgTree();
}

/* ══════════════════════════════
   OVERVIEW
══════════════════════════════ */
function renderOverview() {
  const emps  = getEmployees();
  const today = new Date();

  const total     = emps.length;
  const active    = emps.filter(e => e.status === "Active").length;
  const thisMonth = emps.filter(e => {
    const d = new Date(e.doj);
    return d.getMonth() === today.getMonth() && d.getFullYear() === today.getFullYear();
  }).length;
  const probation = emps.filter(e => e.status === "On Probation").length;
  const depts     = [...new Set(emps.map(e => e.dept).filter(Boolean))].length;

  const confirmDue = emps.filter(e => {
    if (e.status !== "On Probation") return false;
    const conf = new Date(e.doj);
    conf.setDate(conf.getDate() + 90);
    const diff = Math.round((conf - today) / (1000*60*60*24));
    return diff >= 0 && diff <= 30;
  }).length;

  setText("statTotal",     total);
  setText("statActive",    active);
  setText("statJoiners",   thisMonth);
  setText("statConfirm",   confirmDue);
  setText("statProbation", probation);
  setText("statResigned",  0);
  setText("statDepts",     depts);

  renderHeadcountChart(emps);
  renderGenderChart(emps);
  renderDeptHiringChart(emps);
  renderDeptAttritionChart(emps);
  renderBirthdays(emps);
  renderAnniversaries(emps);
  renderConfirmationDue(emps, today);
  renderRecentJoiners(emps, today);
}

function statCardClick(filter) {
  /* Switch to directory and apply the right filter */
  switchTab("directory");
  var emps  = getEmployees();
  var today = new Date();

  /* Reset all filters first */
  var srch = document.getElementById("dirSearch");
  var fdep = document.getElementById("filterDept");
  var fdes = document.getElementById("filterDesig");
  var fst  = document.getElementById("filterStatus");
  if (srch) srch.value = "";
  if (fdep) fdep.value = "";
  if (fdes) fdes.value = "";
  if (fst)  fst.value  = "";

  if (filter === "all") {
    filteredEmployees = emps;
  } else if (filter === "Active" || filter === "On Probation" || filter === "Inactive") {
    if (fst) fst.value = filter;
    filteredEmployees = emps.filter(function(e) { return e.status === filter; });
  } else if (filter === "joiners") {
    filteredEmployees = emps.filter(function(e) {
      if (!e.doj) return false;
      var d = new Date(e.doj);
      return d.getMonth() === today.getMonth() && d.getFullYear() === today.getFullYear();
    });
    /* Show "This Month Joiners" in search box as label */
    if (srch) srch.value = "";
  } else if (filter === "confirm") {
    filteredEmployees = emps.filter(function(e) {
      if (e.status !== "On Probation" || !e.doj) return false;
      var conf = new Date(e.doj);
      conf.setDate(conf.getDate() + 90);
      var diff = Math.round((conf - today) / (1000*60*60*24));
      return diff >= 0 && diff <= 30;
    });
  } else if (filter === "depts") {
    filteredEmployees = emps;
  } else {
    filteredEmployees = emps;
  }

  dirPage = 1;
  renderDirTable();
}

function renderHeadcountChart(emps) {
  const ctx = document.getElementById("ovHeadcountChart");
  if (!ctx) return;
  if (ovHeadcountChart) { ovHeadcountChart.destroy(); ovHeadcountChart = null; }

  const months  = ["Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec","Jan","Feb","Mar"];
  const fyStart = new Date("2025-04-01");
  const counts  = months.map((_, i) => {
    const cutoff = new Date(fyStart);
    cutoff.setMonth(cutoff.getMonth() + i + 1);
    return emps.filter(e => e.doj && new Date(e.doj) < cutoff).length;
  });

  const isDark = document.body.classList.contains("dark-mode");
  ovHeadcountChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: months,
      datasets: [{
        label: "Headcount",
        data: counts,
        borderColor: "#7C3AED",
        backgroundColor: "rgba(124,58,237,.12)",
        borderWidth: 2.5,
        pointBackgroundColor: "#7C3AED",
        pointRadius: 4, pointHoverRadius: 6,
        tension: 0.4, fill: true
      }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        x: { grid: { display: false }, ticks: { font: { size: 10 }, color: isDark ? "#9CA3AF" : "#6B7280" } },
        y: {
          beginAtZero: false,
          grid: { color: isDark ? "rgba(255,255,255,.06)" : "rgba(0,0,0,.05)" },
          ticks: { font: { size: 10 }, color: isDark ? "#9CA3AF" : "#6B7280" }
        }
      }
    }
  });
}

function renderGenderChart(emps) {
  const male   = emps.filter(e => e.gender === "Male").length;
  const female = emps.filter(e => e.gender === "Female").length;
  const other  = emps.filter(e => e.gender !== "Male" && e.gender !== "Female").length;
  const total  = emps.length;

  setText("ovGenderTotal", total);

  const legendEl = document.getElementById("ovGenderLegend");
  if (legendEl) {
    legendEl.innerHTML = [
      { label:"Male",   val:male,   color:"#7C3AED" },
      { label:"Female", val:female, color:"#EC4899" },
      { label:"Others", val:other,  color:"#F59E0B" }
    ].map(g => `
      <div class="ov-gender-legend-item">
        <div class="ov-gender-dot" style="background:${g.color}"></div>
        <span style="font-weight:600">${g.label}</span>
        <span style="margin-left:auto;color:var(--muted);">${total ? Math.round(g.val/total*100) : 0}% (${g.val})</span>
      </div>
    `).join("");
  }

  const ctx = document.getElementById("ovGenderChart");
  if (!ctx) return;
  if (ovGenderChart) { ovGenderChart.destroy(); ovGenderChart = null; }

  ovGenderChart = new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: ["Male","Female","Other"],
      datasets: [{
        data: [male, female, other],
        backgroundColor: ["#7C3AED","#EC4899","#F59E0B"],
        borderWidth: 2, borderColor: "transparent", hoverOffset: 6
      }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      cutout: "68%",
      plugins: { legend: { display: false } }
    }
  });
}

function renderDeptHiringChart(emps) {
  const ctx = document.getElementById("ovDeptHiringChart");
  if (!ctx) return;
  if (ovDeptHiringChart) { ovDeptHiringChart.destroy(); ovDeptHiringChart = null; }

  const FY_START = new Date("2025-04-01");
  const FY_END   = new Date("2026-03-31");

  /* Count joiners per dept within current FY */
  const deptMap = {};
  emps.forEach(function(e) {
    if (!e.doj || !e.dept) return;
    const d = new Date(e.doj);
    if (d >= FY_START && d <= FY_END) {
      deptMap[e.dept] = (deptMap[e.dept] || 0) + 1;
    }
  });

  /* Fallback seed data if no employees in FY yet */
  const depts  = Object.keys(deptMap).length
    ? Object.keys(deptMap).sort()
    : ["Payroll","HR","Finance","IT","Operations","Sales"];
  const counts = depts.map(d => deptMap[d] || Math.floor(Math.random() * 8) + 1);

  const COLORS = ["#7C3AED","#EC4899","#F59E0B","#10B981","#06B6D4","#6366F1","#EF4444","#14B8A6"];
  const isDark = document.body.classList.contains("dark-mode");

  ovDeptHiringChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: depts,
      datasets: [{
        label: "Hired",
        data: counts,
        backgroundColor: depts.map((_, i) => COLORS[i % COLORS.length]),
        borderRadius: 5,
        borderSkipped: false
      }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        x: { grid: { display: false }, ticks: { font: { size: 9 }, color: isDark ? "#9CA3AF" : "#6B7280" } },
        y: {
          beginAtZero: true,
          grid: { color: isDark ? "rgba(255,255,255,.06)" : "rgba(0,0,0,.05)" },
          ticks: { stepSize: 1, font: { size: 9 }, color: isDark ? "#9CA3AF" : "#6B7280" }
        }
      }
    }
  });
}

function renderDeptAttritionChart(emps) {
  const ctx = document.getElementById("ovDeptAttritionChart");
  if (!ctx) return;
  if (ovDeptAttritionChart) { ovDeptAttritionChart.destroy(); ovDeptAttritionChart = null; }

  /* Count inactive employees per dept */
  const deptMap = {};
  emps.forEach(function(e) {
    if (!e.dept) return;
    if (e.status === "Inactive") {
      deptMap[e.dept] = (deptMap[e.dept] || 0) + 1;
    }
  });

  /* Fallback illustrative data */
  const allDepts = [...new Set(emps.map(e => e.dept).filter(Boolean))].sort();
  const depts    = allDepts.length ? allDepts : ["Payroll","HR","Finance","IT","Operations","Sales"];
  const counts   = depts.map(d => deptMap[d] || 0);

  /* If all zeros (no attrition in seed data), show illustrative */
  const hasData  = counts.some(v => v > 0);
  const display  = hasData ? counts : [1, 0, 1, 2, 0, 1];

  const isDark = document.body.classList.contains("dark-mode");

  ovDeptAttritionChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: hasData ? depts : ["Payroll","HR","Finance","IT","Operations","Sales"],
      datasets: [{
        label: "Attrition",
        data: display,
        backgroundColor: "rgba(239,68,68,.75)",
        borderRadius: 5,
        borderSkipped: false,
        hoverBackgroundColor: "#EF4444"
      }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        x: { grid: { display: false }, ticks: { font: { size: 9 }, color: isDark ? "#9CA3AF" : "#6B7280" } },
        y: {
          beginAtZero: true,
          grid: { color: isDark ? "rgba(255,255,255,.06)" : "rgba(0,0,0,.05)" },
          ticks: { stepSize: 1, font: { size: 9 }, color: isDark ? "#9CA3AF" : "#6B7280" }
        }
      }
    }
  });
}


function renderBirthdays(emps) {
  const el = document.getElementById("birthdayList");
  if (!el) return;
  const today = new Date();
  const upcoming = emps
    .filter(e => e.dob)
    .map(e => {
      const dob = new Date(e.dob);
      let next  = new Date(today.getFullYear(), dob.getMonth(), dob.getDate());
      if (next < today) next.setFullYear(today.getFullYear() + 1);
      const diff = Math.round((next - today) / (1000*60*60*24));
      return { ...e, diff, bdLabel: diff === 0 ? "Today 🎂" : formatShortDate(next) };
    })
    .sort((a,b) => a.diff - b.diff)
    .slice(0, 4);

  el.innerHTML = upcoming.map(e => `
    <div class="ov-widget-item">
      <div class="ov-widget-avatar">${e.firstName[0]}${e.lastName[0]}</div>
      <div>
        <div class="ov-widget-name">${e.firstName} ${e.lastName}</div>
        <div class="ov-widget-meta">${e.dept}</div>
      </div>
      <span class="ov-widget-date">${e.bdLabel}</span>
    </div>
  `).join("") || '<div style="font-size:12px;color:var(--muted);padding:8px 0">No upcoming birthdays</div>';
}

function renderAnniversaries(emps) {
  const el = document.getElementById("anniversaryList");
  if (!el) return;
  const today = new Date();
  const upcoming = emps
    .filter(e => e.doj)
    .map(e => {
      const doj  = new Date(e.doj);
      let next   = new Date(today.getFullYear(), doj.getMonth(), doj.getDate());
      if (next < today) next.setFullYear(today.getFullYear() + 1);
      const diff  = Math.round((next - today) / (1000*60*60*24));
      const years = today.getFullYear() - doj.getFullYear() + (next.getFullYear() !== today.getFullYear() ? 1 : 0);
      return { ...e, diff, annLabel: formatShortDate(next), years };
    })
    .sort((a,b) => a.diff - b.diff)
    .slice(0, 3);

  el.innerHTML = upcoming.map(e => `
    <div class="ov-widget-item">
      <div class="ov-widget-avatar">${e.firstName[0]}${e.lastName[0]}</div>
      <div>
        <div class="ov-widget-name">${e.firstName} ${e.lastName}</div>
        <div class="ov-widget-meta">${e.years} Year${e.years!==1?"s":""} on ${e.annLabel}</div>
      </div>
    </div>
  `).join("") || '<div style="font-size:12px;color:var(--muted);padding:8px 0">No upcoming anniversaries</div>';
}

function renderConfirmationDue(emps, today) {
  const el = document.getElementById("confirmList");
  if (!el) return;
  const list = emps
    .filter(e => e.status === "On Probation" && e.doj)
    .map(e => {
      const conf = new Date(e.doj);
      conf.setDate(conf.getDate() + 90);
      const diff = Math.round((conf - today) / (1000*60*60*24));
      return { ...e, conf, diff };
    })
    .sort((a,b) => a.diff - b.diff)
    .slice(0, 4);

  if (!list.length) {
    el.innerHTML = '<div style="font-size:12px;color:var(--muted);padding:8px 0">No confirmations due</div>';
    return;
  }
  el.innerHTML = list.map(e => {
    const cls = e.diff <= 7 ? "urgent" : e.diff <= 15 ? "soon" : "ok";
    const lbl = e.diff < 0 ? Math.abs(e.diff) + " Days Ago" : e.diff + " Days";
    return `<div class="ov-confirm-row">
      <span class="ov-confirm-name">${e.firstName} ${e.lastName}</span>
      <span class="ov-confirm-date">${formatShortDate(e.conf)}</span>
      <span class="ov-days-badge ${cls}">${lbl}</span>
    </div>`;
  }).join("");
}

function renderRecentJoiners(emps, today) {
  const el = document.getElementById("recentJoinersList");
  if (!el) return;
  const cutoff = new Date(today); cutoff.setDate(cutoff.getDate() - 30);
  const list = emps
    .filter(e => e.doj && new Date(e.doj) >= cutoff)
    .sort((a,b) => new Date(b.doj) - new Date(a.doj))
    .slice(0, 4);

  el.innerHTML = list.map(e => `
    <div class="ov-widget-item">
      <div class="ov-widget-avatar">${e.firstName[0]}${e.lastName[0]}</div>
      <div>
        <div class="ov-widget-name">${e.firstName} ${e.lastName}</div>
        <div class="ov-widget-meta">${e.desig}, ${e.dept}</div>
      </div>
      <span class="ov-widget-date">${formatShortDate(new Date(e.doj))}</span>
    </div>
  `).join("") || '<div style="font-size:12px;color:var(--muted);padding:8px 0">No recent joiners</div>';
}

/* ══════════════════════════════
   DIRECTORY
══════════════════════════════ */
function renderDirectory() {
  populateFilterDropdowns();
  filteredEmployees = getEmployees();
  dirPage = 1;
  renderDirTable();
}

function populateFilterDropdowns() {
  const emps   = getEmployees();
  const depts  = [...new Set(emps.map(e => e.dept).filter(Boolean))].sort();
  const desigs = [...new Set(emps.map(e => e.desig).filter(Boolean))].sort();

  const dEl  = document.getElementById("filterDept");
  const dgEl = document.getElementById("filterDesig");
  if (dEl)  dEl.innerHTML  = '<option value="">Department: All</option>'  + depts.map(d  => '<option value="' + d  + '">' + d  + '</option>').join("");
  if (dgEl) dgEl.innerHTML = '<option value="">Designation: All</option>' + desigs.map(d => '<option value="' + d  + '">' + d  + '</option>').join("");
}

function filterDirectory() {
  const q      = (document.getElementById("dirSearch")?.value || "").toLowerCase();
  const dept   = document.getElementById("filterDept")?.value   || "";
  const desig  = document.getElementById("filterDesig")?.value  || "";
  const status = document.getElementById("filterStatus")?.value || "";
  const emps   = getEmployees();

  filteredEmployees = emps.filter(e => {
    const name   = (e.firstName + " " + e.lastName).toLowerCase();
    const code   = (e.empCode || "").toLowerCase();
    const email  = (e.email   || "").toLowerCase();
    const matchQ = !q      || name.includes(q) || code.includes(q) || email.includes(q);
    const matchD = !dept   || e.dept   === dept;
    const matchG = !desig  || e.desig  === desig;
    const matchS = !status || e.status === status;
    return matchQ && matchD && matchG && matchS;
  });
  dirPage = 1;
  renderDirTable();
}

function clearFilters() {
  ["dirSearch","filterDept","filterDesig","filterStatus"].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = "";
  });
  filterDirectory();
}

function renderDirTable() {
  const tbody = document.getElementById("dirTableBody");
  if (!tbody) return;

  const total  = filteredEmployees.length;
  const pages  = Math.max(1, Math.ceil(total / DIR_PAGE_SIZE));
  dirPage      = Math.min(dirPage, pages);
  const start  = (dirPage - 1) * DIR_PAGE_SIZE;
  const slice  = filteredEmployees.slice(start, start + DIR_PAGE_SIZE);

  if (!slice.length) {
    tbody.innerHTML = '<tr><td colspan="9" style="text-align:center;padding:32px;color:var(--muted);">No employees found</td></tr>';
  } else {
    tbody.innerHTML = slice.map(function(e, i) {
      const cls = e.status === "Active" ? "status-active" :
                  e.status === "On Probation" ? "status-probation" : "status-inactive";
      return '<tr>' +
        '<td>' + (start + i + 1) + '</td>' +
        '<td><div class="dir-emp-avatar">' + (e.photo ? '<img src="'+e.photo+'" style="width:100%;height:100%;object-fit:cover;border-radius:50%;" />' : e.firstName[0]+e.lastName[0]) + '</div></td>' +
        '<td style="font-weight:600;color:var(--primary)">' + (e.empCode || e.id) + '</td>' +
        '<td><span class="dir-emp-name">' + e.firstName + ' ' + e.lastName + '</span></td>' +
        '<td>' + (e.dept  || "—") + '</td>' +
        '<td>' + (e.desig || "—") + '</td>' +
        '<td>' + (e.doj   ? formatDisplayDate(e.doj) : "—") + '</td>' +
        '<td><span class="status-badge ' + cls + '">' + e.status + '</span></td>' +
        '<td><div class="dir-actions">' +
          '<button class="dir-action-btn" title="View Profile" onclick="viewProfile(\'' + e.id + '\')">' +
            '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>' +
          '</button>' +
          '<button class="dir-action-btn" title="Edit" onclick="viewAndEdit(\'' + e.id + '\')">' +
            '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>' +
          '</button>' +
          '<button class="dir-action-btn danger" title="Delete" onclick="openDeleteModal(\'' + e.id + '\')">' +
            '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/></svg>' +
          '</button>' +
        '</div></td>' +
      '</tr>';
    }).join("");
  }

  const fromN = total ? start + 1 : 0;
  const toN   = Math.min(start + DIR_PAGE_SIZE, total);
  setText("dirShowing", "Showing " + fromN + " to " + toN + " of " + total + " entries");
  renderPagination(pages);
}

function renderPagination(pages) {
  const el = document.getElementById("dirPageBtns");
  if (!el) return;
  let html = '<button class="dir-page-btn" onclick="changeDirPage(' + (dirPage-1) + ')" ' + (dirPage===1?"disabled":"") + '>‹</button>';
  for (let p = 1; p <= pages; p++) {
    html += '<button class="dir-page-btn ' + (p===dirPage?"active":"") + '" onclick="changeDirPage(' + p + ')">' + p + '</button>';
  }
  html += '<button class="dir-page-btn" onclick="changeDirPage(' + (dirPage+1) + ')" ' + (dirPage===pages?"disabled":"") + '>›</button>';
  el.innerHTML = html;
}

function changeDirPage(p) {
  const pages = Math.ceil(filteredEmployees.length / DIR_PAGE_SIZE);
  if (p < 1 || p > pages) return;
  dirPage = p;
  renderDirTable();
}

/* ══════════════════════════════
   PROFILE
══════════════════════════════ */
function viewProfile(id) {
  currentProfileId = id;
  /* Pre-fill profile search with employee name */
  const emps = getEmployees();
  const emp  = emps.find(e => e.id === id);
  if (emp) {
    const psEl = document.getElementById("profSearch");
    if (psEl) psEl.value = emp.firstName + " " + emp.lastName;
    profSearchResults = [];
    const psDropEl = document.getElementById("profSearchDrop");
    if (psDropEl) psDropEl.style.display = "none";
  }
  switchTab("profile");
}

function viewAndEdit(id) {
  viewProfile(id);
  /* Small delay to let profile render before opening drawer */
  setTimeout(function() { openEditDrawerById(id); }, 80);
}

function renderProfile() {
  const emptyState  = document.getElementById("profEmptyState");
  const profHero    = document.getElementById("profHero");
  const profTabsBar = document.getElementById("profTabsBar");
  const profPanels  = document.querySelectorAll(".prof-panel");
  const profBackRow = document.getElementById("profBackRow");

  if (!currentProfileId) {
    if (emptyState)  emptyState.style.display  = "flex";
    if (profHero)    profHero.style.display     = "none";
    if (profTabsBar) profTabsBar.style.display  = "none";
    profPanels.forEach(p => p.style.display = "none");
    if (profBackRow) profBackRow.style.display  = "none";
    return;
  }

  if (emptyState)  emptyState.style.display  = "none";
  if (profHero)    profHero.style.display     = "flex";
  if (profTabsBar) profTabsBar.style.display  = "flex";
  profPanels.forEach(p => p.style.display = "");
  if (profBackRow) profBackRow.style.display  = "";

  const emps = getEmployees();
  const emp  = emps.find(e => e.id === currentProfileId);
  if (!emp) return;

  setText("profName",   emp.firstName + " " + emp.lastName);

  /* Avatar — photo or initials */
  const avatarEl = document.getElementById("profAvatar");
  if (avatarEl) {
    if (emp.photo) {
      avatarEl.innerHTML = '<img src="' + emp.photo + '" alt="Photo" style="width:100%;height:100%;object-fit:cover;border-radius:50%;" />';
    } else {
      avatarEl.textContent = emp.firstName[0] + emp.lastName[0];
    }
  }

  const badgeBg = emp.status === "Active" ? "#10B981" :
                  emp.status === "On Probation" ? "#F59E0B" : "#6B7280";
  const badge = document.getElementById("profStatusBadge");
  if (badge) { badge.textContent = emp.status; badge.style.background = badgeBg; }

  const meta = document.getElementById("profMeta");
  if (meta) {
    const age  = calcAge(emp.dob);
    meta.innerHTML = [
      emp.empCode || emp.id,
      emp.gender,
      emp.dob ? formatDisplayDate(emp.dob) + " (" + age + " Yrs)" : null,
      emp.desig,
      emp.dept,
      emp.doj ? "Joined on " + formatDisplayDate(emp.doj) : null
    ].filter(Boolean).map((t, i, arr) =>
      '<span class="prof-meta-item">' + t + '</span>' +
      (i < arr.length - 1 ? '<span class="prof-meta-dot"></span>' : "")
    ).join("");
  }

  const pf = document.getElementById("profPersonalFields");
  if (pf) pf.innerHTML = profileFields([
    ["Employee Code",  emp.empCode || emp.id],
    ["First Name",     emp.firstName],
    ["Last Name",      emp.lastName],
    ["Gender",         emp.gender],
    ["Date of Birth",  emp.dob ? formatDisplayDate(emp.dob) : "—"],
    ["Marital Status", emp.marital],
    ["Blood Group",    emp.blood],
  ]);

  const cf = document.getElementById("profContactFields");
  if (cf) cf.innerHTML = profileFields([
    ["Email",             emp.email],
    ["Mobile Number",     emp.mobile],
    ["Current Address",   emp.currentAddr],
    ["Permanent Address", emp.permAddr],
    ["Emergency Contact", emp.emergency],
  ]);

  const ef = document.getElementById("profEmploymentFields");
  if (ef) ef.innerHTML = profileFields([
    ["Department",        emp.dept],
    ["Designation",       emp.desig],
    ["Date of Joining",   emp.doj ? formatDisplayDate(emp.doj) : "—"],
    ["Employment Type",   emp.empType],
    ["Status",            emp.status],
    ["Reporting Manager", emp.manager],
    ["Location",          emp.location],
    ["CTC (Annual)",      emp.ctc ? "₹" + parseInt(emp.ctc).toLocaleString("en-IN") : "—"],
  ]);

  setText("pf-pan",     emp.pan     || "—");
  setText("pf-aadhaar", emp.aadhaar || "—");
  setText("pf-uan",     emp.uan     || "—");
  setText("pf-esi",     emp.esi     || "—");
  setText("pf-bank",    emp.bank    || "—");
  setText("pf-ifsc",    emp.ifsc    || "—");

  /* Reset to first sub-tab */
  document.querySelectorAll(".prof-tab").forEach(t => t.classList.remove("active"));
  document.querySelectorAll(".prof-panel").forEach(p => p.classList.remove("active"));
  const firstTab   = document.querySelector(".prof-tab[data-ptab='personal']");
  const firstPanel = document.getElementById("ptab-personal");
  if (firstTab)   firstTab.classList.add("active");
  if (firstPanel) firstPanel.classList.add("active");
}

function profileFields(pairs) {
  return pairs.map(function(pair) {
    return '<div class="prof-field">' +
      '<span class="prof-field-label">' + pair[0] + '</span>' +
      '<span class="prof-field-val">'   + (pair[1] || "—") + '</span>' +
    '</div>';
  }).join("");
}

/* ══════════════════════════════
   GLOBAL SEARCH (employees page)
══════════════════════════════ */
function initGlobalSearchEmp() {
  var input = document.getElementById("globalSearch");
  if (!input) return;

  var drop = document.createElement("div");
  drop.id = "globalSearchDrop";
  drop.style.cssText = "position:absolute;top:calc(100% + 6px);left:0;right:0;background:var(--white);border:1px solid var(--border);border-radius:var(--radius);box-shadow:var(--shadow-lg);z-index:9999;display:none;overflow:hidden;max-height:320px;overflow-y:auto;";
  input.parentElement.style.position = "relative";
  input.parentElement.appendChild(drop);

  input.addEventListener("input", function() {
    var q = this.value.trim().toLowerCase();
    drop.innerHTML = "";
    if (!q) { drop.style.display = "none"; return; }

    var emps = getEmployees();
    var hits = emps.filter(function(e) {
      return (e.firstName + " " + e.lastName).toLowerCase().includes(q)
          || (e.empCode || "").toLowerCase().includes(q)
          || (e.dept   || "").toLowerCase().includes(q)
          || (e.desig  || "").toLowerCase().includes(q)
          || (e.email  || "").toLowerCase().includes(q);
    }).slice(0, 8);

    if (!hits.length) {
      drop.innerHTML = '<div style="padding:14px 16px;font-size:13px;color:var(--muted);">No employees found</div>';
      drop.style.display = "block";
      return;
    }

    drop.innerHTML = '<div style="padding:8px 16px 4px;font-size:10px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:.5px;border-bottom:1px solid var(--border);">Employees</div>';

    hits.forEach(function(e) {
      var statusCls = e.status === "Active" ? "status-active" : e.status === "On Probation" ? "status-probation" : "status-inactive";
      var av = e.photo
        ? '<img src="' + e.photo + '" style="width:100%;height:100%;object-fit:cover;border-radius:50%;" />'
        : (e.firstName[0] + e.lastName[0]);
      var row = document.createElement("div");
      row.style.cssText = "display:flex;align-items:center;gap:12px;padding:10px 16px;cursor:pointer;border-bottom:1px solid var(--bg);transition:background .15s;";
      row.innerHTML =
        '<div style="width:34px;height:34px;border-radius:50%;background:linear-gradient(135deg,#7C3AED,#EC4899);color:white;font-size:12px;font-weight:700;display:flex;align-items:center;justify-content:center;flex-shrink:0;overflow:hidden;">' + av + '</div>' +
        '<div style="flex:1;min-width:0;">' +
          '<div style="font-size:13px;font-weight:600;color:var(--text);">' + e.firstName + ' ' + e.lastName + '</div>' +
          '<div style="font-size:11px;color:var(--muted);">' + (e.empCode || e.id) + ' · ' + (e.desig || "—") + ' · ' + (e.dept || "—") + '</div>' +
        '</div>' +
        '<span class="status-badge ' + statusCls + '" style="flex-shrink:0;">' + e.status + '</span>';
      row.addEventListener("mouseenter", function() { this.style.background = "rgba(124,58,237,.04)"; });
      row.addEventListener("mouseleave", function() { this.style.background = ""; });
      row.addEventListener("click", function() {
        drop.style.display = "none";
        input.value = "";
        viewProfile(e.id);
      });
      drop.appendChild(row);
    });

    var footer = document.createElement("div");
    footer.style.cssText = "padding:10px 16px;font-size:12px;font-weight:600;color:var(--primary);cursor:pointer;border-top:1px solid var(--border);text-align:center;";
    footer.textContent = "Show all results in Directory →";
    footer.addEventListener("click", function() {
      drop.style.display = "none";
      switchTab("directory");
      var srchEl = document.getElementById("dirSearch");
      if (srchEl) { srchEl.value = input.value.trim(); filterDirectory(); }
      input.value = "";
    });
    drop.appendChild(footer);
    drop.style.display = "block";
  });

  document.addEventListener("click", function(e) {
    if (!input.parentElement.contains(e.target)) drop.style.display = "none";
  });

  input.addEventListener("keydown", function(e) {
    if (e.key === "Escape") { drop.style.display = "none"; input.blur(); }
    if (e.key === "Enter" && this.value.trim()) {
      drop.style.display = "none";
      switchTab("directory");
      var srchEl = document.getElementById("dirSearch");
      if (srchEl) { srchEl.value = this.value.trim(); filterDirectory(); }
      this.value = "";
    }
  });
}



function initProfSearch() {
  const input = document.getElementById("profSearch");
  const drop  = document.getElementById("profSearchDrop");
  if (!input || !drop) return;

  input.addEventListener("input", function () {
    const q = this.value.trim().toLowerCase();
    if (!q) { drop.style.display = "none"; profSearchResults = []; return; }
    const emps = getEmployees();
    profSearchResults = emps.filter(e =>
      (e.firstName + " " + e.lastName).toLowerCase().includes(q) ||
      (e.empCode || e.id).toLowerCase().includes(q)
    ).slice(0, 8);

    if (!profSearchResults.length) { drop.style.display = "none"; return; }
    drop.innerHTML = profSearchResults.map(e => `
      <div class="prof-search-item" onclick="selectProfSearch('${e.id}')">
        <div class="prof-search-avatar">${e.photo ? '<img src="'+e.photo+'" style="width:100%;height:100%;object-fit:cover;border-radius:50%;" />' : e.firstName[0]+e.lastName[0]}</div>
        <div>
          <div class="prof-search-name">${e.firstName} ${e.lastName}</div>
          <div class="prof-search-meta">${e.empCode||e.id} · ${e.desig||"—"} · ${e.dept||"—"}</div>
        </div>
        <span class="status-badge ${e.status==='Active'?'status-active':e.status==='On Probation'?'status-probation':'status-inactive'}" style="margin-left:auto;flex-shrink:0">${e.status}</span>
      </div>
    `).join("");
    drop.style.display = "block";
  });

  document.addEventListener("click", function (e) {
    if (!input.contains(e.target) && !drop.contains(e.target)) {
      drop.style.display = "none";
    }
  });
}

function selectProfSearch(id) {
  const emps = getEmployees();
  const emp  = emps.find(e => e.id === id);
  if (!emp) return;
  currentProfileId = id;
  const input = document.getElementById("profSearch");
  const drop  = document.getElementById("profSearchDrop");
  if (input) input.value = emp.firstName + " " + emp.lastName;
  if (drop)  drop.style.display = "none";
  renderProfile();
}

/* ══════════════════════════════
   ORG TREE  — SVG connector approach with arrowheads
   Connectors drawn after layout; arrowheads point down
   toward each child card. Multiple roots shown side-by-side.
══════════════════════════════ */
function renderOrgTree() {
  var wrap = document.getElementById("orgTreeWrap");
  if (!wrap) return;

  var emps = getEmployees();
  if (!emps.length) {
    wrap.innerHTML = '<div style="padding:60px;text-align:center;color:var(--muted);font-size:14px;">No employees to display.</div>';
    return;
  }

  var levelColors = [
    { avatar:"#7C3AED", desig:"#7C3AED", badge:"rgba(124,58,237,.1)", badgeText:"#7C3AED" },
    { avatar:"#06B6D4", desig:"#06B6D4", badge:"rgba(6,182,212,.1)",  badgeText:"#06B6D4" },
    { avatar:"#F59E0B", desig:"#F59E0B", badge:"rgba(245,158,11,.1)", badgeText:"#F59E0B" },
    { avatar:"#10B981", desig:"#10B981", badge:"rgba(16,185,129,.1)", badgeText:"#10B981" },
  ];
  function lc(depth) { return levelColors[Math.min(depth, levelColors.length - 1)]; }

  var isDark     = document.body.classList.contains("dark-mode");
  var LINE_COLOR = isDark ? "#4B5563" : "#CBD5E1";
  var ARROW_COLOR= isDark ? "#6B7280" : "#94A3B8";
  var VERT_GAP   = 56;  /* space between card bottom and children top */
  var ARROW_SIZE = 7;   /* arrowhead size in px */

  var allNames = emps.map(function (e) {
    return (e.firstName + " " + e.lastName).toLowerCase();
  });

  /* Find root employees (no manager, or manager not found in list) */
  var roots = emps.filter(function (e) {
    return !e.manager || !e.manager.trim() || !allNames.includes(e.manager.toLowerCase());
  });

  /* Build card inner HTML */
  function cardInner(emp, depth) {
    var c  = lc(depth);
    var av = emp.photo
      ? '<img src="' + emp.photo + '" style="width:100%;height:100%;object-fit:cover;border-radius:50%;" />'
      : (emp.firstName[0] + emp.lastName[0]);
    return '<div class="org-node-avatar" style="background:' + c.avatar + ';">' + av + '</div>' +
      '<div class="org-node-body">' +
        '<div class="org-node-name">' + emp.firstName + ' ' + emp.lastName + '</div>' +
        '<div class="org-node-desig" style="color:' + c.desig + ';">' + (emp.desig || '—') + '</div>' +
        '<span class="org-node-dept-badge" style="background:' + c.badge + ';color:' + c.badgeText + ';">' + (emp.dept || '—') + '</span>' +
      '</div>';
  }

  /* SVG helper: draw a line */
  function svgLine(svg, x1, y1, x2, y2, color, w) {
    var el = document.createElementNS("http://www.w3.org/2000/svg", "line");
    el.setAttribute("x1", x1); el.setAttribute("y1", y1);
    el.setAttribute("x2", x2); el.setAttribute("y2", y2);
    el.setAttribute("stroke", color);
    el.setAttribute("stroke-width", w || "2");
    el.setAttribute("stroke-linecap", "round");
    svg.appendChild(el);
  }

  /* SVG helper: draw downward filled arrowhead at (cx, cy) */
  function svgArrow(svg, cx, cy, color) {
    var s = ARROW_SIZE;
    var pts = (cx - s) + "," + (cy - s) + " " + cx + "," + cy + " " + (cx + s) + "," + (cy - s);
    var el = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
    el.setAttribute("points", pts);
    el.setAttribute("fill", color);
    el.setAttribute("stroke", "none");
    svg.appendChild(el);
  }

  /* Recursively build a node DOM element */
  function buildNode(emp, depth) {
    var reports = emps.filter(function (e) {
      return e.manager && e.manager.toLowerCase() === (emp.firstName + ' ' + emp.lastName).toLowerCase();
    });

    var nodeWrap = document.createElement("div");
    nodeWrap.className = "org-node-wrap" + (depth === 0 ? " org-root" : "");

    var card = document.createElement("div");
    card.className = "org-node-card";
    card.innerHTML = cardInner(emp, depth);
    card.addEventListener("click", function () { viewProfile(emp.id); });
    nodeWrap.appendChild(card);

    if (!reports.length) return nodeWrap;

    /* SVG connector gap */
    var svgEl = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svgEl.classList.add("org-connector-svg");
    svgEl.setAttribute("height", String(VERT_GAP));
    svgEl.setAttribute("overflow", "visible");
    svgEl.style.cssText = "width:100%;display:block;flex-shrink:0;overflow:visible;";

    /* Children row */
    var childRow = document.createElement("div");
    childRow.className = "org-children-row";

    var childCols = reports.map(function (child) {
      var col = document.createElement("div");
      col.className = "org-child-col";
      col.appendChild(buildNode(child, depth + 1));
      return col;
    });
    childCols.forEach(function (col) { childRow.appendChild(col); });

    nodeWrap.appendChild(svgEl);
    nodeWrap.appendChild(childRow);

    /* Draw connectors after layout is complete */
    requestAnimationFrame(function () {
      setTimeout(function () {
        drawConnectors(svgEl, card, childCols);
      }, 0);
    });

    return nodeWrap;
  }

  /* Draw connectors for one parent → children group */
  function drawConnectors(svgEl, parentCard, childCols) {
    var svgRect    = svgEl.getBoundingClientRect();
    var parentRect = parentCard.getBoundingClientRect();

    if (svgRect.width < 1) return;

    while (svgEl.firstChild) svgEl.removeChild(svgEl.firstChild);

    var parentMid = parentRect.left + parentRect.width / 2 - svgRect.left;
    var stemY     = Math.round(VERT_GAP / 2);

    var childMids = childCols.map(function (col) {
      var r = col.getBoundingClientRect();
      return Math.round(r.left + r.width / 2 - svgRect.left);
    });

    /* Vertical stem from parent down to horizontal bar */
    svgLine(svgEl, parentMid, 0, parentMid, stemY, LINE_COLOR);

    if (childMids.length === 1) {
      /* Single child: extend stem straight down */
      svgLine(svgEl, childMids[0], stemY, childMids[0], VERT_GAP, LINE_COLOR);
      svgArrow(svgEl, childMids[0], VERT_GAP, ARROW_COLOR);
    } else {
      /* Horizontal bar across all children */
      var leftX  = Math.min.apply(null, childMids);
      var rightX = Math.max.apply(null, childMids);
      svgLine(svgEl, leftX, stemY, rightX, stemY, LINE_COLOR);

      /* Vertical drops with arrowheads */
      childMids.forEach(function (mx) {
        svgLine(svgEl, mx, stemY, mx, VERT_GAP, LINE_COLOR);
        svgArrow(svgEl, mx, VERT_GAP, ARROW_COLOR);
      });
    }
  }

  /* Build the container — multiple roots go side-by-side */
  var container = document.createElement("div");
  container.className = "org-tree-root";

  if (roots.length > 1) {
    /* Wrap multiple roots in a horizontal row */
    var rootRow = document.createElement("div");
    rootRow.style.cssText = "display:flex;flex-direction:row;align-items:flex-start;gap:40px;";
    roots.forEach(function (r) { rootRow.appendChild(buildNode(r, 0)); });
    container.appendChild(rootRow);
  } else if (roots.length === 1) {
    container.appendChild(buildNode(roots[0], 0));
  } else {
    /* Fallback: show all employees as roots if hierarchy is broken */
    emps.forEach(function (e) { container.appendChild(buildNode(e, 0)); });
  }

  wrap.innerHTML = "";
  wrap.style.overflow = "auto";
  wrap.style.padding  = "24px 16px";
  wrap.appendChild(container);

  /* Redraw on resize */
  var resizeTimer;
  wrap._orgResizeHandler && window.removeEventListener("resize", wrap._orgResizeHandler);
  wrap._orgResizeHandler = function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () { renderOrgTree(); }, 220);
  };
  window.addEventListener("resize", wrap._orgResizeHandler);
}

/* ══════════════════════════════
   ADD / EDIT DRAWER
══════════════════════════════ */
/* ══════════════════════════════
   POPULATE DRAWER DROPDOWNS FROM MASTERS
   excludeId: employee being edited (excluded from manager list)
══════════════════════════════ */
function populateDrawerDropdowns(excludeId) {
  populateMasterSelect("df-gender",   "gender",      "Select gender");
  populateMasterSelect("df-marital",  "marital",     "Select marital status");
  populateMasterSelect("df-blood",    "blood",       "Select blood group");
  populateMasterSelect("df-dept",     "department",  "Select department");
  populateMasterSelect("df-empType",  "empType",     "Select type");
  populateMasterSelect("df-status",   "status",      "Select status");
  populateMasterSelect("df-location", "location",    "Select location");

  /* Designation is a free-text input, but populate its datalist */
  populateDesigDatalist();

  /* Reporting Manager — employee picker */
  initManagerPicker(excludeId);
}

function populateDesigDatalist() {
  var dl = document.getElementById("df-desig-list");
  if (!dl) return;
  var vals = getMasterValues("designation");
  dl.innerHTML = vals.map(function(v){ return '<option value="'+v+'">'; }).join("");
}

/* ══════════════════════════════
   REPORTING MANAGER PICKER
   Typeahead over existing employees
══════════════════════════════ */
var _managerPickerExcludeId = null;

function initManagerPicker(excludeId) {
  _managerPickerExcludeId = excludeId || null;
  var input = document.getElementById("df-manager");
  var drop  = document.getElementById("df-manager-drop");
  if (!input || !drop) return;

  /* Remove old listeners by replacing element clone */
  var newInput = input.cloneNode(true);
  input.parentNode.replaceChild(newInput, input);
  input = newInput;

  input.setAttribute("autocomplete", "off");
  input.setAttribute("placeholder", "Search employee name...");

  input.addEventListener("input", function() {
    var q = this.value.trim().toLowerCase();
    renderManagerDrop(q, drop);
  });
  input.addEventListener("focus", function() {
    var q = this.value.trim().toLowerCase();
    renderManagerDrop(q, drop);
  });
  document.addEventListener("click", function(e) {
    if (!input.contains(e.target) && !drop.contains(e.target)) {
      drop.style.display = "none";
    }
  });
  input.addEventListener("keydown", function(e) {
    if (e.key === "Escape") drop.style.display = "none";
  });
}

function renderManagerDrop(q, drop) {
  var emps = getEmployees().filter(function(e) {
    if (_managerPickerExcludeId && e.id === _managerPickerExcludeId) return false;
    if (e.status === "Inactive") return false;
    var name = (e.firstName + " " + e.lastName).toLowerCase();
    return !q || name.includes(q) || (e.empCode||"").toLowerCase().includes(q);
  }).slice(0, 8);

  if (!emps.length) {
    drop.style.display = "none";
    return;
  }

  drop.innerHTML = emps.map(function(e) {
    var av = e.photo
      ? '<img src="'+e.photo+'" style="width:100%;height:100%;object-fit:cover;border-radius:50%;" />'
      : (e.firstName[0]+e.lastName[0]);
    var statusCls = e.status === "Active" ? "status-active" : "status-probation";
    return '<div class="mgr-drop-item" data-name="'+e.firstName+' '+e.lastName+'" onclick="selectManager(this)">'+
      '<div class="mgr-drop-avatar">'+av+'</div>'+
      '<div class="mgr-drop-info">'+
        '<div class="mgr-drop-name">'+e.firstName+' '+e.lastName+'</div>'+
        '<div class="mgr-drop-meta">'+(e.empCode||e.id)+' · '+(e.desig||'—')+' · '+(e.dept||'—')+'</div>'+
      '</div>'+
      '<span class="status-badge '+statusCls+'">'+e.status+'</span>'+
    '</div>';
  }).join("");

  drop.style.display = "block";
}

function selectManager(el) {
  var name  = el.dataset.name;
  var input = document.getElementById("df-manager");
  var drop  = document.getElementById("df-manager-drop");
  if (input) input.value = name;
  if (drop)  drop.style.display = "none";
}

/* Clear manager field button */
function clearManagerField() {
  var input = document.getElementById("df-manager");
  var drop  = document.getElementById("df-manager-drop");
  if (input) { input.value = ""; input.focus(); }
  if (drop)  renderManagerDrop("", drop);
}

function openAddDrawer() {
  drawerMode = "add";
  drawerStep = 1;
  clearDrawerForm();
  populateDrawerDropdowns(null);
  const nextId = nextEmpId(getEmployees());
  setVal("df-empCode", nextId);
  setText("drawerTitle", "Add New Employee");
  document.getElementById("drawerCancelBtn").textContent = "Cancel";
  document.getElementById("drawerNextBtn").textContent   = "Next";
  updateDrawerStepUI();
  openDrawer();
}

function openEditDrawer() {
  if (!currentProfileId) return;
  openEditDrawerById(currentProfileId);
}

function openEditDrawerById(id) {
  const emp = getEmployees().find(e => e.id === id);
  if (!emp) return;
  drawerMode       = "edit";
  drawerStep       = 1;
  currentProfileId = id;
  setText("drawerTitle", "Edit Employee — " + emp.firstName + " " + emp.lastName);
  populateDrawerDropdowns(id);
  fillDrawerForm(emp);
  updateDrawerStepUI();
  openDrawer();
}

function fillDrawerForm(emp) {
  const map = {
    "df-empCode":emp.empCode||emp.id,"df-firstName":emp.firstName,"df-lastName":emp.lastName,
    "df-gender":emp.gender,"df-dob":emp.dob,"df-marital":emp.marital,"df-blood":emp.blood,
    "df-email":emp.email,"df-mobile":emp.mobile,"df-emergency":emp.emergency,
    "df-currentAddr":emp.currentAddr,"df-permAddr":emp.permAddr,
    "df-dept":emp.dept,"df-desig":emp.desig,"df-doj":emp.doj,"df-empType":emp.empType,
    "df-status":emp.status,"df-manager":emp.manager,"df-location":emp.location,"df-ctc":emp.ctc,
    "df-pan":emp.pan,"df-aadhaar":emp.aadhaar,"df-uan":emp.uan,"df-esi":emp.esi,
    "df-bank":emp.bank,"df-ifsc":emp.ifsc
  };
  Object.keys(map).forEach(id => setVal(id, map[id]));
  /* Show existing photo if available */
  const preview = document.getElementById("df-photoPreview");
  const placeholder = document.getElementById("df-photoPlaceholder");
  if (preview && placeholder) {
    if (emp.photo) {
      preview.src = emp.photo;
      preview.style.display = "block";
      placeholder.style.display = "none";
    } else {
      preview.src = "";
      preview.style.display = "none";
      placeholder.style.display = "flex";
    }
  }
}

function clearDrawerForm() {
  ["df-empCode","df-firstName","df-lastName","df-gender","df-dob","df-marital","df-blood",
   "df-email","df-mobile","df-emergency","df-currentAddr","df-permAddr",
   "df-dept","df-desig","df-doj","df-empType","df-status","df-manager","df-location","df-ctc",
   "df-pan","df-aadhaar","df-uan","df-esi","df-bank","df-ifsc"
  ].forEach(id => setVal(id, ""));
  setVal("df-status", "Active");
  /* Reset photo */
  const preview = document.getElementById("df-photoPreview");
  const placeholder = document.getElementById("df-photoPlaceholder");
  const photoInput = document.getElementById("df-photoInput");
  if (preview)     { preview.src = ""; preview.style.display = "none"; }
  if (placeholder) placeholder.style.display = "flex";
  if (photoInput)  photoInput.value = "";
}

function openDrawer() {
  document.getElementById("empDrawer").classList.add("open");
  document.getElementById("drawerOverlay").classList.add("open");
  document.body.style.overflow = "hidden";
}

function handleEmpPhotoUpload(input) {
  const file = input.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function (e) {
    const src = e.target.result;
    const preview     = document.getElementById("df-photoPreview");
    const placeholder = document.getElementById("df-photoPlaceholder");
    if (preview)     { preview.src = src; preview.style.display = "block"; }
    if (placeholder) placeholder.style.display = "none";
  };
  reader.readAsDataURL(file);
}

function closeDrawer() {
  document.getElementById("empDrawer").classList.remove("open");
  document.getElementById("drawerOverlay").classList.remove("open");
  document.body.style.overflow = "";
}

function handleDrawerBack() {
  if (drawerStep > 1) { goToDrawerStep(drawerStep - 1); }
  else { closeDrawer(); }
}

function handleDrawerNext() {
  if (!validateDrawerStep(drawerStep)) return;
  if (drawerStep < 5) { goToDrawerStep(drawerStep + 1); }
  else { saveDrawerEmployee(); }
}

function validateDrawerStep(step) {
  const required = { 1:["df-empCode","df-firstName","df-lastName","df-gender","df-dob"], 2:["df-email","df-mobile"], 3:["df-dept","df-desig","df-doj"] };
  const fields   = required[step];
  if (!fields) return true;
  let valid = true;
  fields.forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    el.classList.remove("error-field");
    if (!el.value.trim()) { el.classList.add("error-field"); valid = false; }
  });
  if (!valid) {
    const first = fields.find(id => !document.getElementById(id)?.value.trim());
    if (first) document.getElementById(first)?.focus();
  }
  return valid;
}

function goToDrawerStep(step) {
  drawerStep = step;
  updateDrawerStepUI();
}

function updateDrawerStepUI() {
  document.querySelectorAll(".dstep").forEach(function (btn) {
    const s = parseInt(btn.dataset.step);
    btn.classList.remove("active","done");
    if (s === drawerStep)    btn.classList.add("active");
    else if (s < drawerStep) btn.classList.add("done");
  });
  document.querySelectorAll(".drawer-step-panel").forEach(p => p.classList.remove("active"));
  const panel = document.getElementById("dstep-" + drawerStep);
  if (panel) panel.classList.add("active");

  const cancelBtn = document.getElementById("drawerCancelBtn");
  const nextBtn   = document.getElementById("drawerNextBtn");
  if (cancelBtn) cancelBtn.textContent = drawerStep > 1 ? "Back" : "Cancel";
  if (nextBtn)   nextBtn.textContent   = drawerStep === 5 ? (drawerMode === "add" ? "Save Employee" : "Update Employee") : "Next";
}

function saveDrawerEmployee() {
  const emps = getEmployees();
  const photoPreview = document.getElementById("df-photoPreview");
  const photoSrc = photoPreview && photoPreview.src && photoPreview.src.startsWith("data:") ? photoPreview.src : null;

  const data = {
    empCode:getVal("df-empCode"),firstName:getVal("df-firstName"),lastName:getVal("df-lastName"),
    gender:getVal("df-gender"),dob:getVal("df-dob"),marital:getVal("df-marital"),blood:getVal("df-blood"),
    email:getVal("df-email"),mobile:getVal("df-mobile"),emergency:getVal("df-emergency"),
    currentAddr:getVal("df-currentAddr"),permAddr:getVal("df-permAddr"),
    dept:getVal("df-dept"),desig:getVal("df-desig"),doj:getVal("df-doj"),
    empType:getVal("df-empType"),status:getVal("df-status")||"Active",
    manager:getVal("df-manager"),location:getVal("df-location"),ctc:getVal("df-ctc"),
    pan:getVal("df-pan"),aadhaar:getVal("df-aadhaar"),uan:getVal("df-uan"),
    esi:getVal("df-esi"),bank:getVal("df-bank"),ifsc:getVal("df-ifsc"),
  };

  if (drawerMode === "add") {
    const newId = nextEmpId(emps);
    data.id = newId;
    if (!data.empCode) data.empCode = newId;
    if (photoSrc) data.photo = photoSrc;
    emps.push(data);
    saveEmployees(emps);
    showToast("Employee added successfully!", "success");
    closeDrawer();
    /* Go directly to new employee's profile */
    viewProfile(newId);
  } else {
    const idx = emps.findIndex(e => e.id === currentProfileId);
    if (idx !== -1) {
      data.id = currentProfileId;
      /* Preserve existing photo if no new one uploaded */
      data.photo = photoSrc || emps[idx].photo || null;
      emps[idx] = data;
    }
    saveEmployees(emps);
    showToast("Employee updated successfully!", "success");
    closeDrawer();
    /* Return to profile view */
    renderProfile();
  }
}

/* ══════════════════════════════
   DELETE
══════════════════════════════ */
function openDeleteModal(id) {
  deleteTargetId = id;
  document.getElementById("deleteModal").style.display = "flex";
}
function closeDeleteModal() {
  deleteTargetId = null;
  document.getElementById("deleteModal").style.display = "none";
}
function confirmDelete() {
  if (!deleteTargetId) return;
  let emps = getEmployees().filter(e => e.id !== deleteTargetId);
  saveEmployees(emps);
  if (currentProfileId === deleteTargetId) currentProfileId = null;
  deleteTargetId = null;
  closeDeleteModal();
  populateFilterDropdowns();
  filterDirectory();
  showToast("Employee deleted.", "info");
}

/* ══════════════════════════════
   IMPORT — TEMPLATE COLUMNS
══════════════════════════════ */
const IMPORT_COLUMNS = [
  { key:"empCode",     label:"Emp Code",         required:true  },
  { key:"firstName",   label:"First Name",        required:true  },
  { key:"lastName",    label:"Last Name",         required:true  },
  { key:"gender",      label:"Gender",            required:true  },
  { key:"dob",         label:"Date of Birth",     required:true  },
  { key:"marital",     label:"Marital Status",    required:false },
  { key:"blood",       label:"Blood Group",       required:false },
  { key:"email",       label:"Email",             required:true  },
  { key:"mobile",      label:"Mobile",            required:true  },
  { key:"currentAddr", label:"Current Address",   required:false },
  { key:"permAddr",    label:"Permanent Address", required:false },
  { key:"emergency",   label:"Emergency Contact", required:false },
  { key:"dept",        label:"Department",        required:true  },
  { key:"desig",       label:"Designation",       required:true  },
  { key:"doj",         label:"Date of Joining",   required:true  },
  { key:"empType",     label:"Employment Type",   required:false },
  { key:"status",      label:"Status",            required:false },
  { key:"manager",     label:"Reporting Manager", required:false },
  { key:"location",    label:"Location",          required:false },
  { key:"ctc",         label:"CTC (Annual)",      required:false },
  { key:"pan",         label:"PAN Number",        required:false },
  { key:"aadhaar",     label:"Aadhaar Number",    required:false },
  { key:"uan",         label:"UAN Number",        required:false },
  { key:"bank",        label:"Bank Account",      required:false },
  { key:"ifsc",        label:"IFSC Code",         required:false },
];

/* ── State ── */
let importStep       = 1;
let importParsedRows = [];   // raw parsed objects from file
let importValidRows  = [];   // validated employee objects
let importErrorRows  = [];   // {row, errors[]}

/* ── Open / Close ── */
function openImportModal() {
  importStep       = 1;
  importParsedRows = [];
  importValidRows  = [];
  importErrorRows  = [];
  _syncImportStepUI();
  _renderColumnsList();
  /* Reset file input */
  const fi = document.getElementById("importFileInput");
  if (fi) fi.value = "";
  document.getElementById("importFileChosen").style.display = "none";
  document.getElementById("importDropZone").style.display   = "flex";
  document.getElementById("importModal").style.display      = "flex";
  document.body.style.overflow = "hidden";
}
function closeImportModal() {
  document.getElementById("importModal").style.display = "none";
  document.body.style.overflow = "";
}

/* ── Column list (step 1) ── */
function _renderColumnsList() {
  const el = document.getElementById("importColumnsList");
  if (!el) return;
  el.innerHTML = IMPORT_COLUMNS.map(function(c) {
    return '<span class="import-col-tag ' + (c.required ? "required" : "") + '">' +
      (c.required ? '<span class="import-col-req-dot"></span>' : "") +
      c.label +
    '</span>';
  }).join("");
}

/* ── Download template (generates a real XLSX via SheetJS) ── */
function downloadTemplate() {
  /* Build header row and one sample data row */
  const headers = IMPORT_COLUMNS.map(function(c) { return c.label; });
  const sample  = [
    "EMP008","Rahul","Verma","Male","1995-06-20","Single","O+",
    "rahul.verma@abcltd.com","9988776655","123 MG Road, Mumbai",
    "123 MG Road, Mumbai","Sunita Verma (Mother) - 9988700000",
    "IT","Developer","2025-07-01","Full-Time","Active",
    "Arindam Maity","Mumbai","750000",
    "ABCDE1234F","123456789012","100123456789","123456789012","SBIN0001234"
  ];
  const instructionRow = IMPORT_COLUMNS.map(function(c) {
    return c.required ? "REQUIRED" : "Optional";
  });

  /* Use SheetJS if available, else fall back to CSV */
  if (window.XLSX) {
    const wb = XLSX.utils.book_new();
    const wsData = [
      ["PayNest Employee Import Template — Do NOT change column headers"],
      [],
      instructionRow,
      headers,
      sample
    ];
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    /* Style header row (row index 3, 0-based) */
    ws["!cols"] = headers.map(function() { return { wch: 22 }; });
    ws["!merges"] = [{ s:{r:0,c:0}, e:{r:0,c:headers.length-1} }];
    XLSX.utils.book_append_sheet(wb, ws, "Employees");
    XLSX.writeFile(wb, "PayNest_Employee_Import_Template.xlsx");
  } else {
    /* Fallback CSV download */
    const csv = [headers, sample].map(function(r) {
      return r.map(function(v) { return '"' + (v||"") + '"'; }).join(",");
    }).join("\n");
    const blob = new Blob([csv], { type:"text/csv" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href = url; a.download = "PayNest_Employee_Import_Template.csv"; a.click();
    URL.revokeObjectURL(url);
  }
  showToast("Template downloaded!", "success");
}

/* ── File handling ── */
function handleImportDrop(event) {
  event.preventDefault();
  document.getElementById("importDropZone").classList.remove("dragover");
  const file = event.dataTransfer.files[0];
  if (file) _processImportFile(file);
}
function handleImportFile(input) {
  const file = input.files[0];
  if (file) _processImportFile(file);
}
function removeImportFile() {
  importParsedRows = [];
  const fi = document.getElementById("importFileInput");
  if (fi) fi.value = "";
  document.getElementById("importFileChosen").style.display = "none";
  document.getElementById("importDropZone").style.display   = "flex";
}

function _processImportFile(file) {
  const ext = file.name.split(".").pop().toLowerCase();
  if (!["xlsx","xls","csv"].includes(ext)) {
    showToast("Unsupported file type. Use .xlsx, .xls or .csv", "error");
    return;
  }
  if (file.size > 5 * 1024 * 1024) {
    showToast("File too large (max 5MB).", "error");
    return;
  }

  document.getElementById("importDropZone").style.display   = "none";
  document.getElementById("importFileChosen").style.display = "flex";
  document.getElementById("importFileName").textContent     = file.name;

  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      if (ext === "csv") {
        _parseCSV(e.target.result);
      } else {
        if (!window.XLSX) {
          /* Dynamically load SheetJS if not already present */
          const script = document.createElement("script");
          script.src = "https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js";
          script.onload = function() { _parseXLSX(e.target.result); };
          document.head.appendChild(script);
        } else {
          _parseXLSX(e.target.result);
        }
      }
    } catch(err) {
      showToast("Error reading file: " + err.message, "error");
    }
  };
  if (ext === "csv") {
    reader.readAsText(file);
  } else {
    reader.readAsArrayBuffer(file);
  }
}

function _parseXLSX(arrayBuffer) {
  const workbook  = XLSX.read(arrayBuffer, { type:"array" });
  const sheetName = workbook.SheetNames[0];
  const sheet     = workbook.Sheets[sheetName];
  const rows      = XLSX.utils.sheet_to_json(sheet, { defval:"" });
  _mapAndValidateRows(rows);
}

function _parseCSV(text) {
  const lines   = text.trim().split(/\r?\n/);
  if (lines.length < 2) { showToast("CSV is empty or has no data rows.", "error"); return; }
  const headers = _splitCSVLine(lines[0]);
  const rows    = [];
  for (var i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue;
    const vals = _splitCSVLine(lines[i]);
    const obj  = {};
    headers.forEach(function(h, idx) { obj[h.trim()] = (vals[idx] || "").trim(); });
    rows.push(obj);
  }
  _mapAndValidateRows(rows);
}

function _splitCSVLine(line) {
  const result = []; let cur = ""; let inQ = false;
  for (var i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') { inQ = !inQ; }
    else if (ch === "," && !inQ) { result.push(cur); cur = ""; }
    else { cur += ch; }
  }
  result.push(cur);
  return result.map(function(s) { return s.replace(/^"|"$/g,"").trim(); });
}

/* Map spreadsheet columns → employee object keys */
function _mapAndValidateRows(rawRows) {
  /* Build a label→key map (case-insensitive) */
  const labelToKey = {};
  IMPORT_COLUMNS.forEach(function(c) {
    labelToKey[c.label.toLowerCase()]     = c.key;
    labelToKey[c.key.toLowerCase()]       = c.key;    // also accept key directly
  });

  importParsedRows = [];
  importValidRows  = [];
  importErrorRows  = [];

  const existingEmps = getEmployees();
  const existingCodes = existingEmps.map(function(e) { return (e.empCode||e.id).toLowerCase(); });
  let nextIdNum = existingEmps.reduce(function(max, e) {
    var n = parseInt((e.id||"").replace("EMP",""), 10);
    return isNaN(n) ? max : Math.max(max, n);
  }, existingEmps.length);

  rawRows.forEach(function(raw, rowIdx) {
    /* Normalise keys */
    var emp = {};
    Object.keys(raw).forEach(function(k) {
      var mapped = labelToKey[k.toLowerCase().trim()];
      if (mapped) emp[mapped] = String(raw[k]).trim();
    });

    /* Validate required fields */
    var errors = [];
    IMPORT_COLUMNS.forEach(function(c) {
      if (c.required && !emp[c.key]) {
        errors.push(c.label + " is required");
      }
    });

    /* Check duplicate emp code */
    if (emp.empCode && existingCodes.includes(emp.empCode.toLowerCase())) {
      errors.push('Emp Code "' + emp.empCode + '" already exists');
    }

    /* Assign new ID */
    nextIdNum++;
    emp.id     = emp.empCode || ("EMP" + String(nextIdNum).padStart(3,"0"));
    emp.status = emp.status || "Active";

    if (errors.length) {
      importErrorRows.push({ rowIdx: rowIdx + 1, emp: emp, errors: errors });
    } else {
      importValidRows.push(emp);
    }
    importParsedRows.push({ rowIdx: rowIdx + 1, emp: emp, errors: errors });
  });
}

/* ── Navigation ── */
function importStepNext() {
  if (importStep === 1) {
    importStep = 2;
    _syncImportStepUI();
    return;
  }
  if (importStep === 2) {
    if (!importParsedRows.length) {
      showToast("Please upload a file first.", "error");
      return;
    }
    importStep = 3;
    _renderReviewStep();
    _syncImportStepUI();
    return;
  }
  if (importStep === 3) {
    _doImport();
  }
}
function importStepBack() {
  if (importStep > 1) { importStep--; _syncImportStepUI(); }
}

function _syncImportStepUI() {
  /* Step indicators */
  [1,2,3].forEach(function(n) {
    var ind = document.getElementById("impStep" + n + "Ind");
    if (!ind) return;
    ind.classList.remove("active","done");
    if (n < importStep)       ind.classList.add("done");
    else if (n === importStep) ind.classList.add("active");
  });

  /* Panels */
  [1,2,3].forEach(function(n) {
    var p = document.getElementById("impPanel" + n);
    if (p) p.classList.toggle("active", n === importStep);
  });

  /* Footer buttons */
  var backBtn = document.getElementById("impBackBtn");
  var nextBtn = document.getElementById("impNextBtn");
  if (backBtn) backBtn.style.display = importStep > 1 ? "" : "none";
  if (nextBtn) {
    if (importStep === 3) {
      var canImport = importValidRows.length > 0;
      nextBtn.textContent = "Import " + importValidRows.length + " Employees";
      nextBtn.disabled    = !canImport;
      nextBtn.style.opacity = canImport ? "1" : ".5";
    } else {
      nextBtn.textContent  = "Next →";
      nextBtn.disabled     = false;
      nextBtn.style.opacity = "1";
    }
  }
}

/* ── Review step rendering ── */
function _renderReviewStep() {
  /* Stats chips */
  const statsEl = document.getElementById("importReviewStats");
  if (statsEl) {
    statsEl.innerHTML =
      '<div class="import-stat-chip total"><div class="import-stat-num">' + importParsedRows.length + '</div><div>Total Rows</div></div>' +
      '<div class="import-stat-chip valid"><div class="import-stat-num">' + importValidRows.length + '</div><div>Valid</div></div>' +
      '<div class="import-stat-chip errors"><div class="import-stat-num">' + importErrorRows.length + '</div><div>Errors</div></div>';
  }

  /* Error list */
  const errEl = document.getElementById("importReviewErrors");
  if (errEl) {
    if (importErrorRows.length) {
      errEl.style.display = "";
      errEl.innerHTML = '<strong style="display:block;margin-bottom:4px;">⚠ Rows with errors (will be skipped):</strong>' +
        importErrorRows.map(function(e) {
          return '<div class="import-err-row">Row ' + e.rowIdx + ' — ' + e.errors.join("; ") + '</div>';
        }).join("");
    } else {
      errEl.style.display = "none";
    }
  }

  /* Preview table — show all parsed rows */
  const previewCols = ["empCode","firstName","lastName","dept","desig","doj","status","email","mobile"];
  const previewLabels = ["Emp Code","First Name","Last Name","Department","Designation","DOJ","Status","Email","Mobile"];

  const tableEl = document.getElementById("importPreviewTable");
  if (!tableEl) return;

  const thead = "<thead><tr><th>#</th>" + previewLabels.map(function(l) {
    return "<th>" + l + "</th>";
  }).join("") + "<th>Status</th></tr></thead>";

  const tbody = "<tbody>" + importParsedRows.map(function(r) {
    var hasError = r.errors.length > 0;
    var cls      = hasError ? "row-error" : "row-ok";
    var statusCell = hasError
      ? '<td style="color:#EF4444;font-weight:700;">⚠ Skip</td>'
      : '<td style="color:#10B981;font-weight:700;">✓ Import</td>';
    return "<tr class='" + cls + "'><td>" + r.rowIdx + "</td>" +
      previewCols.map(function(k) { return "<td>" + escHtml(r.emp[k] || "—") + "</td>"; }).join("") +
      statusCell + "</tr>";
  }).join("") + "</tbody>";

  tableEl.innerHTML = thead + tbody;
}

/* ── Actually save valid rows ── */
function _doImport() {
  if (!importValidRows.length) { showToast("No valid rows to import.", "error"); return; }
  const emps    = getEmployees();
  const newEmps = emps.concat(importValidRows);
  saveEmployees(newEmps);
  closeImportModal();
  renderDirectory();
  populateFilterDropdowns();
  filterDirectory();
  showToast(importValidRows.length + " employee" + (importValidRows.length !== 1 ? "s" : "") + " imported successfully!", "success");
}

/* ══════════════════════════════
   EXPORT
══════════════════════════════ */
function exportEmployees() {
  const emps    = getEmployees();
  const headers = ["Emp ID","Name","Department","Designation","DOJ","Status","Email","Mobile"];
  const rows    = emps.map(e => [
    e.empCode||e.id, e.firstName+" "+e.lastName,
    e.dept,e.desig, e.doj?formatDisplayDate(e.doj):"", e.status,e.email,e.mobile
  ]);
  const csv  = [headers,...rows].map(r => r.map(v => '"'+(v||"")+'"').join(",")).join("\n");
  const blob = new Blob([csv], { type:"text/csv" });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement("a"); a.href=url; a.download="employees.csv"; a.click();
  URL.revokeObjectURL(url);
  showToast("Exported successfully!", "success");
}

/* ══════════════════════════════
   TOAST
══════════════════════════════ */
function showToast(msg, type) {
  const toast = document.createElement("div");
  const bg    = type==="success"?"#10B981":type==="info"?"#6B7280":"#EF4444";
  toast.style.cssText = "position:fixed;bottom:24px;right:24px;z-index:9999;background:" + bg + ";color:white;padding:12px 20px;border-radius:10px;font-size:13px;font-weight:600;box-shadow:0 4px 20px rgba(0,0,0,.2);display:flex;align-items:center;gap:8px;font-family:var(--font);";
  toast.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5"><path d="M9 12l2 2 4-4M22 12A10 10 0 1 1 2 12a10 10 0 0 1 20 0z"/></svg>' + msg;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

/* ══════════════════════════════
   UTILITY
══════════════════════════════ */
function setText(id, val) { const el=document.getElementById(id); if(el) el.textContent=val; }
function getVal(id)       { const el=document.getElementById(id); return el?el.value.trim():""; }
function setVal(id, val)  { const el=document.getElementById(id); if(el) el.value=val||""; }

function formatDisplayDate(iso) {
  if (!iso) return "—";
  const [y,m,d] = iso.split("-");
  const months  = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  return d + " " + months[parseInt(m,10)-1] + " " + y;
}
function formatShortDate(date) {
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  return String(date.getDate()).padStart(2,"0") + " " + months[date.getMonth()];
}
function calcAge(dob) {
  if (!dob) return "—";
  const today = new Date(), d = new Date(dob);
  let age = today.getFullYear() - d.getFullYear();
  if (today.getMonth() - d.getMonth() < 0 || (today.getMonth()===d.getMonth() && today.getDate()<d.getDate())) age--;
  return age;
}

function escHtml(str) {
  return String(str).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
}

/* Logout — works even if app.js not loaded */
if (typeof window.logout === "undefined") {
  window.logout = function () { sessionStorage.clear(); window.location.replace("index.html"); };
}
