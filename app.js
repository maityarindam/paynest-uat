/* ================================================
   PAYNEST app.js  — v3
   Covers: Login · Forgot Password · Dashboard
================================================ */

/* ══════════════════════════════
   UTILITY
══════════════════════════════ */
function $(id) { return document.getElementById(id); }


/* ══════════════════════════════
   PASSWORD TOGGLE  (login page)
══════════════════════════════ */
function togglePassword() {
  const pw = $("password");
  if (!pw) return;
  pw.type = pw.type === "password" ? "text" : "password";
}


/* ══════════════════════════════
   LOGIN FORM
══════════════════════════════ */
document.addEventListener("DOMContentLoaded", function () {

  /* ── login ── */
  const loginForm = $("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const username      = $("username");
      const password      = $("password");
      const usernameError = $("usernameError");
      const passwordError = $("passwordError");
      const loginBtn      = $("loginBtn");
      const loader        = $("loader");

      usernameError.textContent = "";
      passwordError.textContent = "";

      let valid = true;

      if (!username.value.trim()) {
        usernameError.textContent = "Please enter username";
        valid = false;
      }
      if (!password.value.trim()) {
        passwordError.textContent = "Please enter password";
        valid = false;
      } else if (password.value.length < 8) {
        passwordError.textContent = "Password must be at least 8 characters";
        valid = false;
      }
      if (!valid) return;

      loginBtn.disabled = true;
      loginBtn.innerHTML = `<span class="spinner"></span> Signing In...`;
      if (loader) loader.classList.remove("hidden");

      setTimeout(function () {
        sessionStorage.setItem("paynest_user", username.value);
        window.location.href = "dashboard.html";
      }, 1200);
    });
    return;
  }

  /* ── dashboard init ── */
  if ($("chartsSection")) {
    initDashboard();
  }
});


/* ══════════════════════════════
   FORGOT PASSWORD
══════════════════════════════ */
function sendResetLink() {
  const username = $("forgotUsername");
  const email    = $("forgotEmail");
  if (!username || !email) return;

  if (!username.value.trim()) { alert("Please enter username."); return; }
  if (!email.value.trim())    { alert("Please enter registered email."); return; }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
    alert("Please enter a valid email address."); return;
  }
  alert("Password reset link sent successfully.");
  username.value = "";
  email.value = "";
}


/* ══════════════════════════════
   LOGOUT
══════════════════════════════ */
function logout() {
  sessionStorage.clear();
  window.location.replace("index.html");
}


/* ══════════════════════════════
   DASHBOARD INIT
══════════════════════════════ */
function initDashboard() {
  initDarkMode();
  initGreeting();
  initSidebar();
  initTopbar();
  initWelcomeToggles();
  initWidgetManager();
  initKPICards();
  initCharts();
  initChartScroll();
  initTasks();
  initPhotoUpload();
  initGlobalSearch();
  initHolidays();
  initClock();
}


/* ══════════════════════════════
   LIVE CLOCK
══════════════════════════════ */
function initClock() {
  const timeEl = document.getElementById("tbClockTime");
  const dateEl = document.getElementById("tbClockDate");
  if (!timeEl || !dateEl) return;

  const DAY_NAMES  = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
  const MON_NAMES  = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

  function tick() {
    const now  = new Date();
    const hh   = String(now.getHours()).padStart(2, "0");
    const mm   = String(now.getMinutes()).padStart(2, "0");
    const ss   = String(now.getSeconds()).padStart(2, "0");
    /* Seconds in primary colour via a span */
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
   DARK MODE
══════════════════════════════ */
function initDarkMode() {
  const btn  = $("darkModeBtn");
  if (!btn) return;

  /* restore saved preference */
  const saved = sessionStorage.getItem("paynest_darkmode") === "true";
  if (saved) document.body.classList.add("dark-mode");

  btn.addEventListener("click", function () {
    const isDark = document.body.classList.toggle("dark-mode");
    sessionStorage.setItem("paynest_darkmode", isDark);
    /* Update Chart.js default colours to match mode */
    updateChartDefaults(isDark);
    /* Re-render all charts so they pick up new colors */
    if (window._paynestCharts) {
      window._paynestCharts.forEach(function(c) { c.update(); });
    }
  });
}

function updateChartDefaults(isDark) {
  if (!window.Chart) return;
  Chart.defaults.color = isDark ? "#9CA3AF" : "#6B7280";
  Chart.defaults.borderColor = isDark ? "#2D2B3D" : "rgba(0,0,0,.06)";
}


/* ══════════════════════════════
   GREETING  (time-based)
══════════════════════════════ */
function initGreeting() {
  const user   = sessionStorage.getItem("paynest_user") || "Arindam";
  const hour   = new Date().getHours();
  const period = hour < 12 ? "Morning" : hour < 17 ? "Afternoon" : "Evening";
  const emoji  = hour < 12 ? "👋" : hour < 17 ? "☀️" : "🌙";

  const el = $("welcomeHeading");
  if (el) el.textContent = `Good ${period}, ${user}! ${emoji}`;

  const tbName   = $("tbName");
  const udName   = $("udName");
  const tbAvatar = $("tbAvatar");
  const udAvatar = $("udAvatar");
  const initial  = user.charAt(0).toUpperCase();
  if (tbName)   tbName.textContent   = user;
  if (udName)   udName.textContent   = user;
  if (tbAvatar) tbAvatar.textContent = initial;
  if (udAvatar) udAvatar.textContent = initial;
}


/* ══════════════════════════════
   SIDEBAR — hover + pin
══════════════════════════════ */
function initSidebar() {
  const sidebar = $("sidebar");
  const pinBtn  = $("sbPinBtn");
  if (!sidebar) return;

  let pinned = JSON.parse(sessionStorage.getItem("sb_pinned") || "false");
  if (pinned) sidebar.classList.add("pinned");

  pinBtn.addEventListener("click", function () {
    pinned = !pinned;
    sessionStorage.setItem("sb_pinned", pinned);
    sidebar.classList.toggle("pinned", pinned);
    pinBtn.querySelector("span").textContent = pinned ? "Pinned ✓" : "Keep Open";
  });

  const items   = sidebar.querySelectorAll(".sb-item");
  const tooltip = $("sbTooltip");
  items.forEach(function (item) {
    item.addEventListener("mouseenter", function () {
      /* Never show tooltip when sidebar is expanded, hovered-open, or pinned */
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


/* ══════════════════════════════
   TOPBAR — dropdowns
══════════════════════════════ */
function initTopbar() {
  const pageBtn  = $("pageSelectBtn");
  const pageDrop = $("pageDropdown");
  if (pageBtn && pageDrop) {
    pageBtn.addEventListener("click", function (e) {
      e.stopPropagation();
      pageDrop.classList.toggle("open");
    });
  }

  const userBtn  = $("userDropdownBtn");
  const userDrop = $("userDropdown");
  if (userBtn && userDrop) {
    userBtn.addEventListener("click", function (e) {
      e.stopPropagation();
      userDrop.classList.toggle("open");
    });
  }

  document.addEventListener("click", function () {
    if (pageDrop) pageDrop.classList.remove("open");
    if (userDrop) userDrop.classList.remove("open");
    const wm = $("widgetManager");
    if (wm) wm.classList.remove("open");
  });

  [pageDrop, userDrop].forEach(function (el) {
    if (el) el.addEventListener("click", function (e) { e.stopPropagation(); });
  });
}


/* ══════════════════════════════
   WELCOME TOGGLES
══════════════════════════════ */
function initWelcomeToggles() {
  const toggleGreeting = $("toggleGreeting");
  const toggleQuote    = $("toggleQuote");
  const toggleBg       = $("toggleBg");
  const welcomeHeading = $("welcomeHeading");
  const welcomeQuote   = $("welcomeQuote");
  const welcomeBg      = $("welcomeBgGraphic");

  if (toggleGreeting && welcomeHeading) {
    toggleGreeting.addEventListener("change", function () {
      welcomeHeading.style.display = this.checked ? "" : "none";
      const sub = welcomeHeading.nextElementSibling;
      if (sub) sub.style.display = this.checked ? "" : "none";
    });
  }
  if (toggleQuote && welcomeQuote) {
    toggleQuote.addEventListener("change", function () {
      welcomeQuote.style.display = this.checked ? "" : "none";
    });
  }
  if (toggleBg && welcomeBg) {
    toggleBg.addEventListener("change", function () {
      welcomeBg.style.display = this.checked ? "" : "none";
    });
  }
}


/* ══════════════════════════════
   WIDGET MANAGER
   — now handles both widgets AND individual charts
══════════════════════════════ */
function initWidgetManager() {
  const manageBtn = $("manageWidgetsBtn");
  const wm        = $("widgetManager");
  if (!manageBtn || !wm) return;

  manageBtn.addEventListener("click", function (e) {
    e.stopPropagation();
    wm.classList.toggle("open");
  });
  wm.addEventListener("click", function (e) { e.stopPropagation(); });

  /* Widget (section) toggles */
  const widgetMap = {
    kpicards:     "kpiCardsWidget",
    tasks:        "tasksWidget",
    quickactions: "quickactionsWidget",
    activities:   "activitiesWidget",
    holidays:     "holidaysWidget"
  };
  wm.querySelectorAll("input[data-widget]").forEach(function (cb) {
    cb.addEventListener("change", function () {
      const el = $(widgetMap[this.dataset.widget]);
      if (el) el.style.display = this.checked ? "" : "none";
    });
  });

  /* Individual chart toggles — update serial numbers after change */
  wm.querySelectorAll("input[data-chart]").forEach(function (cb) {
    cb.addEventListener("change", function () {
      const cardId = "chartCard-" + this.dataset.chart;
      const card   = $(cardId);
      if (card) card.style.display = this.checked ? "" : "none";
      updateChartSerialNumbers();
    });
  });
}

/* ══════════════════════════════
   CHART SERIAL NUMBERS — dynamic
══════════════════════════════ */
function updateChartSerialNumbers() {
  /* Chart cards in DOM order, only visible ones get sequential numbers */
  const allCards = document.querySelectorAll(".chart-card[id^='chartCard-']");
  let serial = 1;
  allCards.forEach(function (card) {
    const titleEl = card.querySelector(".cc-title");
    if (!titleEl) return;
    /* Strip existing serial prefix like "1. " or "2. " */
    const rawTitle = titleEl.textContent.replace(/^\d+\.\s*/, "");
    if (card.style.display === "none") {
      /* Hidden — keep raw title (no serial) so it looks right if re-shown */
      titleEl.textContent = rawTitle;
    } else {
      titleEl.textContent = serial + ". " + rawTitle;
      serial++;
    }
  });
}


/* ══════════════════════════════
   CHART SCROLL — arrow buttons
══════════════════════════════ */
function initChartScroll() {
  const track = $("chartsScrollTrack");
  const left  = $("csArrowLeft");
  const right = $("csArrowRight");
  if (!track || !left || !right) return;

  const STEP = 300;

  left.addEventListener("click", function () {
    track.scrollBy({ left: -STEP, behavior: "smooth" });
  });
  right.addEventListener("click", function () {
    track.scrollBy({ left: STEP, behavior: "smooth" });
  });

  /* Show/hide arrows based on scroll position */
  function updateArrows() {
    left.style.opacity  = track.scrollLeft > 0 ? "1" : "0.35";
    right.style.opacity = track.scrollLeft < track.scrollWidth - track.clientWidth - 2 ? "1" : "0.35";
  }
  track.addEventListener("scroll", updateArrows, { passive: true });
  updateArrows();
}


/* ══════════════════════════════
   KPI CARDS — Payroll Cost
══════════════════════════════ */
function initKPICards() {
  const EMP_KEY = "paynest_employees";
  function getEmps() {
    try { return JSON.parse(sessionStorage.getItem(EMP_KEY) || "[]"); } catch(e) { return []; }
  }

  const emps = getEmps();
  const FY_START = new Date("2025-04-01");
  const today    = new Date();

  /* Monthly payroll cost — derive from CTC (annual / 12) per employee */
  /* For the current FY, count months from April 2025 up to today */
  const fyMonths = Math.min(12, Math.max(1,
    (today.getFullYear() - FY_START.getFullYear()) * 12
    + (today.getMonth() - FY_START.getMonth()) + 1
  ));

  /* Active employees' annual CTC */
  const activeEmps = emps.filter(e => e.status === "Active" && e.ctc);
  const totalAnnualCTC = activeEmps.reduce((s, e) => s + parseFloat(e.ctc || 0), 0);

  /* Overall: all employees' annual CTC summed (simplified representation) */
  const allCTC = emps.filter(e => e.ctc).reduce((s, e) => s + parseFloat(e.ctc || 0), 0);

  /* Current FY payroll cost = (sum of monthly salaries processed so far) */
  const monthlyAvg    = totalAnnualCTC / 12;
  const fyPayrollCost = monthlyAvg * fyMonths;
  const overallCost   = allCTC; /* simplified — treat as cumulative annual */
  const cpe           = activeEmps.length ? totalAnnualCTC / activeEmps.length : 0;

  /* Format ₹ with Indian numbering */
  function fmtINR(n) {
    if (n >= 1e7)      return "₹" + (n / 1e7).toFixed(2) + " Cr";
    if (n >= 1e5)      return "₹" + (n / 1e5).toFixed(2) + " L";
    return "₹" + Math.round(n).toLocaleString("en-IN");
  }

  const fyEl      = document.getElementById("kpiFYValue");
  const overallEl = document.getElementById("kpiOverallValue");
  const avgEl     = document.getElementById("kpiAvgValue");
  const cpeEl     = document.getElementById("kpiCPEValue");
  const fySubEl   = document.getElementById("kpiFYSub");
  const fyTrendEl = document.getElementById("kpiFYTrendVal");
  const avgTrEl   = document.getElementById("kpiAvgTrendVal");

  if (fyEl)      fyEl.textContent      = fmtINR(fyPayrollCost);
  if (overallEl) overallEl.textContent = fmtINR(overallCost);
  if (avgEl)     avgEl.textContent     = fmtINR(monthlyAvg);
  if (cpeEl)     cpeEl.textContent     = fmtINR(cpe);
  if (fySubEl)   fySubEl.textContent   = "FY 2025-26 · " + fyMonths + " month" + (fyMonths !== 1 ? "s" : "") + " processed";
  if (fyTrendEl) fyTrendEl.textContent = fyMonths + " of 12 months";
  if (avgTrEl)   avgTrEl.textContent   = activeEmps.length + " active employees";
}


/* ══════════════════════════════
   CHARTS
══════════════════════════════ */
function initCharts() {
  const isDark = document.body.classList.contains("dark-mode");
  Chart.defaults.font.family = "'Plus Jakarta Sans', 'Segoe UI', sans-serif";
  Chart.defaults.font.size   = 10;
  Chart.defaults.color       = isDark ? "#9CA3AF" : "#6B7280";

  const months = ["Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec","Jan","Feb","Mar"];

  /* Store refs for dark-mode live updates */
  window._paynestCharts = [];

  /* Grid line color helper */
  function gridColor() {
    return document.body.classList.contains("dark-mode")
      ? "rgba(255,255,255,.06)" : "rgba(0,0,0,.05)";
  }

  /* ── Chart 1: Employee Addition ── */
  window._paynestCharts.push(new Chart($("chartEmpAdd"), {
    type: "line",
    data: {
      labels: months,
      datasets: [{
        label: "Joined",
        data: [14,18,22,16,24,20,28,18,22,26,30,24],
        borderColor: "#7C3AED",
        backgroundColor: "rgba(124,58,237,.12)",
        borderWidth: 2.5,
        pointBackgroundColor: "#7C3AED",
        pointRadius: 3, pointHoverRadius: 5,
        tension: 0.4, fill: true
      }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        x: { grid: { display: false }, ticks: { font: { size: 9 } } },
        y: {
          beginAtZero: true,
          grid: { color: gridColor() },
          ticks: { stepSize: 10, font: { size: 9 } }
        }
      }
    }
  }));


  /* ── Chart 2: Years in Service ── */
  window._paynestCharts.push(new Chart($("chartYearsService"), {
    type: "doughnut",
    data: {
      labels: ["0-2 Years","3-5 Years","6-10 Years","10+ Years"],
      datasets: [{
        data: [87, 69, 50, 42],
        backgroundColor: ["#7C3AED","#EC4899","#F59E0B","#10B981"],
        borderWidth: 2,
        borderColor: "transparent",
        hoverOffset: 6
      }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      cutout: "68%",
      layout: { padding: { top: 4, bottom: 4 } },
      plugins: {
        legend: {
          position: "bottom",
          labels: {
            boxWidth: 10, boxHeight: 10,
            padding: 8,
            font: { size: 10 },
            generateLabels: function(chart) {
              const data = chart.data;
              return data.labels.map(function(label, i) {
                const val = data.datasets[0].data[i];
                const pct = Math.round(val / 248 * 100);
                return {
                  text: `${label}  ${pct}% (${val})`,
                  fillStyle: data.datasets[0].backgroundColor[i],
                  index: i
                };
              });
            }
          }
        }
      }
    }
  }));


  /* ── Chart 3: Gender ── */
  window._paynestCharts.push(new Chart($("chartGender"), {
    type: "doughnut",
    data: {
      labels: ["Male","Female","Other"],
      datasets: [{
        data: [144, 99, 5],
        backgroundColor: ["#7C3AED","#EC4899","#F59E0B"],
        borderWidth: 2,
        borderColor: "transparent",
        hoverOffset: 6
      }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      cutout: "68%",
      layout: { padding: { top: 4, bottom: 4 } },
      plugins: {
        legend: {
          position: "bottom",
          labels: {
            boxWidth: 10, boxHeight: 10,
            padding: 8,
            font: { size: 10 },
            generateLabels: function(chart) {
              const data = chart.data;
              return data.labels.map(function(label, i) {
                const val = data.datasets[0].data[i];
                const pct = Math.round(val / 248 * 100);
                return {
                  text: `${label}  ${pct}% (${val})`,
                  fillStyle: data.datasets[0].backgroundColor[i],
                  index: i
                };
              });
            }
          }
        }
      }
    }
  }));


  /* ── Chart 4: Age Distribution ── */
  window._paynestCharts.push(new Chart($("chartAge"), {
    type: "bar",
    data: {
      labels: ["20-30","31-40","41-50","51-60","60+"],
      datasets: [{
        label: "Employees",
        data: [28, 85, 78, 42, 15],
        backgroundColor: "#7C3AED",
        borderRadius: 6,
        hoverBackgroundColor: "#6D28D9"
      }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        x: { grid: { display: false }, ticks: { font: { size: 9 } } },
        y: {
          beginAtZero: true,
          grid: { color: gridColor() },
          ticks: { stepSize: 20, font: { size: 9 } },
          max: 100
        }
      }
    }
  }));


  /* ── Chart 5: Employee Count Trend ── */
  window._paynestCharts.push(new Chart($("chartEmpCount"), {
    type: "line",
    data: {
      labels: months,
      datasets: [{
        label: "Headcount",
        data: [205,208,214,218,220,225,228,230,235,240,244,248],
        borderColor: "#7C3AED",
        backgroundColor: "rgba(124,58,237,.1)",
        borderWidth: 2.5,
        pointBackgroundColor: "#7C3AED",
        pointRadius: 3, pointHoverRadius: 5,
        tension: 0.4, fill: true
      }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        x: { grid: { display: false }, ticks: { font: { size: 9 } } },
        y: {
          beginAtZero: false, min: 180,
          grid: { color: gridColor() },
          ticks: { stepSize: 50, font: { size: 9 } }
        }
      }
    }
  }));


  /* ── Chart 6: Payroll Cost Trend ── */
  (function() {
    const EMP_KEY = "paynest_employees";
    function getEmps() {
      try { return JSON.parse(sessionStorage.getItem(EMP_KEY) || "[]"); } catch(e) { return []; }
    }
    const emps = getEmps();
    const activeEmps = emps.filter(e => e.status === "Active" && e.ctc);
    const totalAnnual = activeEmps.reduce((s, e) => s + parseFloat(e.ctc || 0), 0);
    const baseMonthly = totalAnnual / 12;

    /* Simulate slight monthly variation ±3% around base */
    const variance  = [0.98, 1.00, 1.02, 0.99, 1.01, 1.03, 1.00, 0.98, 1.02, 1.01, 1.00, 1.03];
    const costData  = months.map((_, i) => Math.round(baseMonthly * variance[i]));
    const fyTotal   = costData.reduce((s, v) => s + v, 0);

    function fmtINR(n) {
      if (n >= 1e7) return "₹" + (n / 1e7).toFixed(2) + " Cr";
      if (n >= 1e5) return "₹" + (n / 1e5).toFixed(2) + " L";
      return "₹" + Math.round(n).toLocaleString("en-IN");
    }

    const totalEl = document.getElementById("payrollCostTotal");
    const deltaEl = document.getElementById("payrollCostDelta");
    if (totalEl) totalEl.innerHTML = fmtINR(fyTotal) + ' <span class="cc-delta positive" id="payrollCostDelta">FY Total</span>';

    const ctx6 = $("chartPayrollCost");
    if (!ctx6) return;

    window._paynestCharts.push(new Chart(ctx6, {
      type: "bar",
      data: {
        labels: months,
        datasets: [{
          label: "Payroll Cost",
          data: costData,
          backgroundColor: months.map((_, i) =>
            i % 2 === 0 ? "rgba(124,58,237,.75)" : "rgba(236,72,153,.65)"
          ),
          borderRadius: 5,
          hoverBackgroundColor: "#7C3AED"
        }]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: function(ctx) {
                const v = ctx.parsed.y;
                if (v >= 1e7) return "₹" + (v/1e7).toFixed(2) + " Cr";
                if (v >= 1e5) return "₹" + (v/1e5).toFixed(2) + " L";
                return "₹" + v.toLocaleString("en-IN");
              }
            }
          }
        },
        scales: {
          x: { grid: { display: false }, ticks: { font: { size: 9 } } },
          y: {
            beginAtZero: false,
            grid: { color: gridColor() },
            ticks: {
              font: { size: 9 },
              callback: function(v) {
                if (v >= 1e5) return "₹" + (v/1e5).toFixed(0) + "L";
                return "₹" + (v/1000).toFixed(0) + "K";
              }
            }
          }
        }
      }
    }));
  })();
}


/* ══════════════════════════════
   TASKS  (per-user in sessionStorage)
══════════════════════════════ */
function initTasks() {
  const addBtn    = $("addTaskBtn");
  const form      = $("addTaskForm");
  const saveBtn   = $("saveTaskBtn");
  const cancelBtn = $("cancelTaskBtn");
  const taskText  = $("newTaskText");
  const taskDate  = $("newTaskDate");
  if (!addBtn) return;

  const user = sessionStorage.getItem("paynest_user") || "default";
  const key  = "tasks_" + user;
  let tasks  = JSON.parse(sessionStorage.getItem(key) || "null");
  if (!tasks) {
    tasks = [
      { id: 1, text: "Review payroll for April 2026", date: "2026-04-30", done: false },
      { id: 2, text: "Approve leave requests",        date: "2026-05-02", done: false },
      { id: 3, text: "Update employee documents",     date: "2026-05-05", done: false },
      { id: 4, text: "Team meeting with HR",          date: "2026-05-07", done: false }
    ];
    saveTasks(tasks, key);
  }
  renderTasks(tasks, key);

  addBtn.addEventListener("click", function () {
    form.classList.toggle("open");
    if (form.classList.contains("open")) taskText.focus();
  });
  cancelBtn.addEventListener("click", function () {
    form.classList.remove("open");
    taskText.value = "";
    taskDate.value = "";
  });
  saveBtn.addEventListener("click", function () {
    const txt = taskText.value.trim();
    if (!txt) { taskText.focus(); return; }
    tasks.push({ id: Date.now(), text: txt, date: taskDate.value, done: false });
    saveTasks(tasks, key);
    renderTasks(tasks, key);
    form.classList.remove("open");
    taskText.value = "";
    taskDate.value = "";
  });
}

function saveTasks(tasks, key) {
  sessionStorage.setItem(key, JSON.stringify(tasks));
}

function renderTasks(tasks, key) {
  const list = $("tasksList");
  if (!list) return;
  list.innerHTML = "";
  const today = new Date().toISOString().slice(0, 10);

  tasks.forEach(function (t) {
    const row     = document.createElement("div");
    row.className = "task-row";
    const overdue  = t.date && t.date < today && !t.done;
    const dateDisp = t.date ? formatDate(t.date) : "";
    row.innerHTML = `
      <div class="task-checkbox ${t.done ? "checked" : ""}" data-id="${t.id}"></div>
      <span class="task-row-text ${t.done ? "done" : ""}">${escHtml(t.text)}</span>
      <span class="task-row-date ${overdue ? "overdue" : ""}">${dateDisp}</span>
    `;
    row.querySelector(".task-checkbox").addEventListener("click", function () {
      t.done = !t.done;
      saveTasks(tasks, key);
      renderTasks(tasks, key);
    });
    list.appendChild(row);
  });
}

function formatDate(iso) {
  if (!iso) return "";
  const [y, m, d] = iso.split("-");
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  return `${d} ${months[parseInt(m,10)-1]} ${y}`;
}

function escHtml(str) {
  return str.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
}


/* ══════════════════════════════
   GLOBAL SEARCH
══════════════════════════════ */
function initGlobalSearch() {
  const input = $("globalSearch");
  if (!input) return;

  /* Build dropdown container */
  const drop = document.createElement("div");
  drop.id = "globalSearchDrop";
  drop.style.cssText = "position:absolute;top:calc(100% + 6px);left:0;right:0;background:var(--white);border:1px solid var(--border);border-radius:var(--radius);box-shadow:var(--shadow-lg);z-index:9999;display:none;overflow:hidden;max-height:320px;overflow-y:auto;";
  input.parentElement.style.position = "relative";
  input.parentElement.appendChild(drop);

  const EMP_KEY = "paynest_employees";
  function getEmps() {
    try { return JSON.parse(sessionStorage.getItem(EMP_KEY) || "[]"); } catch(e) { return []; }
  }

  input.addEventListener("input", function() {
    const q = this.value.trim().toLowerCase();
    drop.innerHTML = "";
    if (!q) { drop.style.display = "none"; return; }

    const emps = getEmps();
    const hits = emps.filter(function(e) {
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

    /* Section header */
    drop.innerHTML = '<div style="padding:8px 16px 4px;font-size:10px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:.5px;border-bottom:1px solid var(--border);">Employees</div>';

    hits.forEach(function(e) {
      const statusCls = e.status === "Active" ? "status-active" : e.status === "On Probation" ? "status-probation" : "status-inactive";
      const avatarHtml = e.photo
        ? '<img src="' + e.photo + '" style="width:100%;height:100%;object-fit:cover;border-radius:50%;" />'
        : (e.firstName[0] + e.lastName[0]);
      const row = document.createElement("div");
      row.style.cssText = "display:flex;align-items:center;gap:12px;padding:10px 16px;cursor:pointer;border-bottom:1px solid var(--bg);transition:background .15s;";
      row.innerHTML =
        '<div style="width:34px;height:34px;border-radius:50%;background:linear-gradient(135deg,#7C3AED,#EC4899);color:white;font-size:12px;font-weight:700;display:flex;align-items:center;justify-content:center;flex-shrink:0;overflow:hidden;">' + avatarHtml + '</div>' +
        '<div style="flex:1;min-width:0;">' +
          '<div style="font-size:13px;font-weight:600;color:var(--text);">' + e.firstName + ' ' + e.lastName + '</div>' +
          '<div style="font-size:11px;color:var(--muted);">' + (e.empCode || e.id) + ' · ' + (e.desig || "—") + ' · ' + (e.dept || "—") + '</div>' +
        '</div>' +
        '<span class="status-badge ' + statusCls + '" style="flex-shrink:0;">' + e.status + '</span>';
      row.addEventListener("mouseenter", function() { this.style.background = "rgba(124,58,237,.04)"; });
      row.addEventListener("mouseleave", function() { this.style.background = ""; });
      row.addEventListener("click", function() {
        /* Navigate to employee profile */
        window.location.href = "employees.html?profile=" + e.id;
      });
      drop.appendChild(row);
    });

    /* Footer link */
    const footer = document.createElement("div");
    footer.style.cssText = "padding:10px 16px;font-size:12px;font-weight:600;color:var(--primary);cursor:pointer;border-top:1px solid var(--border);text-align:center;";
    footer.textContent = "View all results in Employee Directory →";
    footer.addEventListener("click", function() {
      window.location.href = "employees.html?search=" + encodeURIComponent(input.value.trim());
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
      window.location.href = "employees.html?search=" + encodeURIComponent(this.value.trim());
    }
  });
}


/* ══════════════════════════════
   PHOTO UPLOAD
══════════════════════════════ */
function initPhotoUpload() {
  const input = $("photoUpload");
  if (!input) return;
  input.addEventListener("change", function () {
    const file = this.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function (e) {
      const src = e.target.result;
      [$("tbAvatar"), $("udAvatar")].forEach(function (el) {
        if (!el) return;
        el.innerHTML = `<img src="${src}" alt="Avatar" />`;
      });
    };
    reader.readAsDataURL(file);
  });
}


/* ══════════════════════════════
   HOLIDAYS  (FY 2025-26, India)
══════════════════════════════ */
const HOLIDAYS = [
  // National
  { date:"2025-08-15", name:"Independence Day",         type:"national",  desc:"India's 79th Independence Day" },
  { date:"2025-10-02", name:"Gandhi Jayanti",            type:"national",  desc:"Birth anniversary of Mahatma Gandhi" },
  { date:"2026-01-26", name:"Republic Day",              type:"national",  desc:"India's 77th Republic Day" },
  // Regional / gazetted
  { date:"2025-04-14", name:"Dr. Ambedkar Jayanti",     type:"regional",  desc:"Birth anniversary of B. R. Ambedkar" },
  { date:"2025-04-18", name:"Good Friday",               type:"regional",  desc:"Christian observance" },
  { date:"2025-05-12", name:"Buddha Purnima",            type:"regional",  desc:"Birth of Gautama Buddha" },
  { date:"2025-06-07", name:"Eid ul-Adha",               type:"regional",  desc:"Feast of Sacrifice" },
  { date:"2025-07-06", name:"Muharram",                  type:"regional",  desc:"Islamic New Year" },
  { date:"2025-08-27", name:"Janmashtami",               type:"regional",  desc:"Birth of Lord Krishna" },
  { date:"2025-10-02", name:"Mahatma Gandhi Jayanti",    type:"national",  desc:"National holiday" },
  { date:"2025-10-20", name:"Dussehra",                  type:"regional",  desc:"Victory of Lord Rama over Ravana" },
  { date:"2025-11-01", name:"Diwali",                    type:"regional",  desc:"Festival of Lights" },
  { date:"2025-11-05", name:"Bhai Dooj",                 type:"regional",  desc:"Sibling bond celebration" },
  { date:"2025-11-15", name:"Guru Nanak Jayanti",        type:"regional",  desc:"Birth anniversary of Guru Nanak Dev Ji" },
  { date:"2025-12-25", name:"Christmas Day",             type:"national",  desc:"Birth of Jesus Christ" },
  { date:"2026-01-14", name:"Makar Sankranti",           type:"regional",  desc:"Harvest festival" },
  { date:"2026-02-26", name:"Maha Shivratri",            type:"regional",  desc:"Festival of Lord Shiva" },
  { date:"2026-03-02", name:"Holi",                      type:"regional",  desc:"Festival of Colors" },
  { date:"2026-03-20", name:"Eid ul-Fitr",               type:"regional",  desc:"End of Ramadan" },
  { date:"2026-03-30", name:"Ram Navami",                type:"regional",  desc:"Birth of Lord Rama" },
  // Optional
  { date:"2025-04-11", name:"Id-ul-Fitr (Optional)",    type:"optional",  desc:"Optional holiday" },
  { date:"2025-09-05", name:"Onam (Optional)",           type:"optional",  desc:"Kerala harvest festival" },
  { date:"2025-10-31", name:"Sardar Patel Jayanti",      type:"optional",  desc:"Birth anniversary of Sardar Patel" },
  { date:"2026-01-01", name:"New Year's Day (Optional)", type:"optional",  desc:"Optional holiday" },
];

const HOL_TYPE_CONFIG = {
  national: { color:"#7C3AED", bg:"rgba(124,58,237,.1)", label:"National" },
  regional: { color:"#10B981", bg:"rgba(16,185,129,.1)", label:"Regional" },
  optional: { color:"#F59E0B", bg:"rgba(245,158,11,.1)",  label:"Optional" },
};

const HOL_MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const HOL_DAYS   = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

function parseHolDate(iso) { return new Date(iso + "T00:00:00"); }

function formatHolDate(iso) {
  const d = parseHolDate(iso);
  return HOL_DAYS[d.getDay()] + ", " + HOL_MONTHS[d.getMonth()] + " " + d.getDate() + ", " + d.getFullYear();
}

function daysUntil(iso) {
  const today = new Date(); today.setHours(0,0,0,0);
  const d = parseHolDate(iso);
  return Math.round((d - today) / 86400000);
}

function initHolidays() {
  renderHolidayCards();
}

function renderHolidayCards() {
  const track = $("holCardsTrack");
  if (!track) return;

  const today = new Date(); today.setHours(0,0,0,0);
  /* Sort and pick upcoming (≥ today), limit to next 6 */
  const upcoming = HOLIDAYS
    .map(h => ({ ...h, diff: daysUntil(h.date) }))
    .filter(h => h.diff >= 0)
    .sort((a,b) => a.diff - b.diff)
    .slice(0, 6);

  if (!upcoming.length) {
    track.innerHTML = '<div style="font-size:13px;color:var(--muted);padding:12px 0;">No upcoming holidays in this financial year.</div>';
    return;
  }

  track.innerHTML = upcoming.map(function (h) {
    const cfg = HOL_TYPE_CONFIG[h.type];
    const d   = parseHolDate(h.date);
    const diffLabel = h.diff === 0 ? "Today! 🎉" : h.diff === 1 ? "Tomorrow" : h.diff + " days away";
    const isToday   = h.diff === 0;
    const isSoon    = h.diff <= 7;

    return `<div class="hol-card ${isToday ? "hol-card-today" : ""}">
      <div class="hol-card-date-col">
        <div class="hol-card-month">${HOL_MONTHS[d.getMonth()]}</div>
        <div class="hol-card-day">${d.getDate()}</div>
        <div class="hol-card-dow">${HOL_DAYS[d.getDay()]}</div>
      </div>
      <div class="hol-card-info">
        <div class="hol-card-name">${h.name}</div>
        <div class="hol-card-desc">${h.desc}</div>
        <div class="hol-card-meta">
          <span class="hol-type-badge" style="background:${cfg.bg};color:${cfg.color};">${cfg.label}</span>
          <span class="hol-diff ${isToday ? "hol-diff-today" : isSoon ? "hol-diff-soon" : ""}">${diffLabel}</span>
        </div>
      </div>
      ${isToday ? '<div class="hol-card-pulse"></div>' : ""}
    </div>`;
  }).join("");
}

/* Modal */
let _holFilter = "all";

function openHolidayModal() {
  const overlay = $("holModalOverlay");
  if (!overlay) return;
  _holFilter = "all";
  /* Reset filter buttons */
  document.querySelectorAll(".hol-filter-btn").forEach(function (b) {
    b.classList.toggle("active", b.dataset.filter === "all");
  });
  renderHolModalStats();
  renderHolModalBody();
  overlay.style.display = "flex";
  document.body.style.overflow = "hidden";
}

function closeHolidayModal() {
  const overlay = $("holModalOverlay");
  if (overlay) overlay.style.display = "none";
  document.body.style.overflow = "";
}

function filterHolidays(btn) {
  _holFilter = btn.dataset.filter;
  document.querySelectorAll(".hol-filter-btn").forEach(function (b) {
    b.classList.toggle("active", b === btn);
  });
  renderHolModalBody();
}

function renderHolModalStats() {
  const el = $("holModalStats");
  if (!el) return;
  const total    = HOLIDAYS.length;
  const national = HOLIDAYS.filter(h => h.type === "national").length;
  const regional = HOLIDAYS.filter(h => h.type === "regional").length;
  const optional = HOLIDAYS.filter(h => h.type === "optional").length;
  const today = new Date(); today.setHours(0,0,0,0);
  const upcoming = HOLIDAYS.filter(h => daysUntil(h.date) >= 0).length;

  el.innerHTML = [
    { label:"Total", val:total, color:"#7C3AED" },
    { label:"National", val:national, color:"#7C3AED" },
    { label:"Regional", val:regional, color:"#10B981" },
    { label:"Optional", val:optional, color:"#F59E0B" },
    { label:"Upcoming", val:upcoming, color:"#06B6D4" },
  ].map(s => `<div class="hol-stat"><div class="hol-stat-num" style="color:${s.color}">${s.val}</div><div class="hol-stat-lbl">${s.label}</div></div>`).join("");
}

function renderHolModalBody() {
  const el = $("holModalBody");
  if (!el) return;

  const filtered = _holFilter === "all"
    ? HOLIDAYS
    : HOLIDAYS.filter(h => h.type === _holFilter);

  /* Group by month */
  const byMonth = {};
  filtered.forEach(function (h) {
    const d     = parseHolDate(h.date);
    const key   = d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0");
    const label = HOL_MONTHS[d.getMonth()] + " " + d.getFullYear();
    if (!byMonth[key]) byMonth[key] = { label, items: [] };
    byMonth[key].items.push(h);
  });

  const today = new Date(); today.setHours(0,0,0,0);
  const sortedKeys = Object.keys(byMonth).sort();

  if (!sortedKeys.length) {
    el.innerHTML = '<div style="padding:40px;text-align:center;color:var(--muted);font-size:13px;">No holidays in this category.</div>';
    return;
  }

  el.innerHTML = sortedKeys.map(function (key) {
    const group = byMonth[key];
    const rows  = group.items.map(function (h) {
      const cfg  = HOL_TYPE_CONFIG[h.type];
      const diff = daysUntil(h.date);
      const d    = parseHolDate(h.date);
      const isPast   = diff < 0;
      const isToday  = diff === 0;

      return `<div class="hol-modal-row ${isPast ? "hol-row-past" : ""} ${isToday ? "hol-row-today" : ""}">
        <div class="hol-modal-row-date">
          <span class="hol-modal-date-num">${d.getDate()}</span>
          <span class="hol-modal-date-dow">${HOL_DAYS[d.getDay()]}</span>
        </div>
        <div class="hol-modal-row-info">
          <div class="hol-modal-row-name">${h.name}</div>
          <div class="hol-modal-row-desc">${h.desc}</div>
        </div>
        <div class="hol-modal-row-right">
          <span class="hol-type-badge" style="background:${cfg.bg};color:${cfg.color};">${cfg.label}</span>
          ${isToday ? '<span class="hol-today-tag">Today</span>' : ""}
          ${isPast ? '<span class="hol-past-tag">Passed</span>' : ""}
        </div>
      </div>`;
    }).join("");

    return `<div class="hol-modal-month-group">
      <div class="hol-modal-month-header">${group.label}</div>
      ${rows}
    </div>`;
  }).join("");
}
