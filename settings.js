/* ================================================
   PAYNEST settings.js — Settings Page
   Sidebar · Topbar · Dark Mode · Clock · Photo
================================================ */

document.addEventListener("DOMContentLoaded", function () {

  /* Restore dark mode */
  if (sessionStorage.getItem("paynest_darkmode") === "true") {
    document.body.classList.add("dark-mode");
  }

  initSettingsSidebar();
  initSettingsTopbar();
  initSettingsDarkMode();
  initSettingsClock();
  initSettingsPhotoUpload();
});


/* ══════════════════════════════
   SIDEBAR — hover + pin
══════════════════════════════ */
function initSettingsSidebar() {
  var sidebar = document.getElementById("sidebar");
  var pinBtn  = document.getElementById("sbPinBtn");
  var tooltip = document.getElementById("sbTooltip");
  if (!sidebar) return;

  var pinned = JSON.parse(sessionStorage.getItem("sb_pinned") || "false");
  if (pinned) sidebar.classList.add("pinned");

  if (pinBtn) {
    pinBtn.querySelector("span").textContent = pinned ? "Pinned ✓" : "Keep Open";
    pinBtn.addEventListener("click", function () {
      var p = sidebar.classList.toggle("pinned");
      sessionStorage.setItem("sb_pinned", p);
      pinBtn.querySelector("span").textContent = p ? "Pinned ✓" : "Keep Open";
    });
  }

  if (tooltip) {
    sidebar.querySelectorAll(".sb-item").forEach(function (item) {
      item.addEventListener("mouseenter", function () {
        if (sidebar.classList.contains("pinned") || sidebar.matches(":hover")) return;
        var lbl = item.querySelector(".sb-label");
        if (!lbl) return;
        tooltip.textContent = lbl.textContent.trim();
        var rect = item.getBoundingClientRect();
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
   TOPBAR — user dropdown + page select
══════════════════════════════ */
function initSettingsTopbar() {
  var user    = sessionStorage.getItem("paynest_user") || "Arindam";
  var initial = user.charAt(0).toUpperCase();

  ["tbName", "udName"].forEach(function (id) {
    var el = document.getElementById(id);
    if (el) el.textContent = user;
  });
  ["tbAvatar", "udAvatar"].forEach(function (id) {
    var el = document.getElementById(id);
    if (el) el.textContent = initial;
  });

  /* Page select dropdown */
  var pageBtn  = document.getElementById("pageSelectBtn");
  var pageDrop = document.getElementById("pageDropdown");
  if (pageBtn && pageDrop) {
    pageBtn.addEventListener("click", function (e) {
      e.stopPropagation();
      pageDrop.classList.toggle("open");
    });
    pageDrop.addEventListener("click", function (e) { e.stopPropagation(); });
  }

  /* User dropdown */
  var userBtn  = document.getElementById("userDropdownBtn");
  var userDrop = document.getElementById("userDropdown");
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
}


/* ══════════════════════════════
   DARK MODE
══════════════════════════════ */
function initSettingsDarkMode() {
  var btn = document.getElementById("darkModeBtn");
  if (!btn) return;
  btn.addEventListener("click", function () {
    var isDark = document.body.classList.toggle("dark-mode");
    sessionStorage.setItem("paynest_darkmode", isDark);
  });
}


/* ══════════════════════════════
   LIVE CLOCK
══════════════════════════════ */
function initSettingsClock() {
  var timeEl = document.getElementById("tbClockTime");
  var dateEl = document.getElementById("tbClockDate");
  if (!timeEl || !dateEl) return;

  var DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  var MONS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
              "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  function tick() {
    var now = new Date();
    var hh  = String(now.getHours()).padStart(2, "0");
    var mm  = String(now.getMinutes()).padStart(2, "0");
    var ss  = String(now.getSeconds()).padStart(2, "0");
    timeEl.innerHTML = hh + ":" + mm + ":<span class='tb-clock-seconds'>" + ss + "</span>";
    dateEl.textContent = DAYS[now.getDay()] + ", " +
      String(now.getDate()).padStart(2, "0") + " " +
      MONS[now.getMonth()] + " " + now.getFullYear();
  }

  tick();
  setInterval(tick, 1000);
}


/* ══════════════════════════════
   PHOTO UPLOAD
══════════════════════════════ */
function initSettingsPhotoUpload() {
  var input = document.getElementById("photoUpload");
  if (!input) return;
  input.addEventListener("change", function () {
    var file = this.files[0];
    if (!file) return;
    var reader = new FileReader();
    reader.onload = function (e) {
      var src = e.target.result;
      ["tbAvatar", "udAvatar"].forEach(function (id) {
        var el = document.getElementById(id);
        if (el) el.innerHTML = '<img src="' + src + '" alt="Avatar" style="width:100%;height:100%;object-fit:cover;border-radius:50%;" />';
      });
    };
    reader.readAsDataURL(file);
  });
}


/* ══════════════════════════════
   LOGOUT
══════════════════════════════ */
function logout() {
  sessionStorage.clear();
  window.location.replace("index.html");
}
