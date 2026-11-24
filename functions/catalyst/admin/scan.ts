import type { Env, PagesFunction } from "../_lib/env";
import { htmlResponse, page } from "../_lib/html";

const MODES = [
  { value: "checkin_d1", label: "Day 1 Check-in" },
  { value: "checkin_d2", label: "Day 2 Check-in" },
  { value: "food_1", label: "Food Round 1" },
  { value: "food_2", label: "Food Round 2" },
  { value: "food_3", label: "Food Round 3" },
];

export const onRequestGet: PagesFunction<Env> = async ({ env }) => {
  const counts = await Promise.all(
    MODES.map((m) =>
      env.CATALYST_DB.prepare("SELECT COUNT(*) as n FROM scans WHERE kind = ?1").bind(m.value).first<{ n: number }>(),
    ),
  );

  const body = `
    <h1>Scanner</h1>
    <div class="cat-grid-3" id="mode-buttons" style="margin-bottom:14px">
      ${MODES.map(
        (m, i) =>
          `<button type="button" class="cat-btn cat-btn-ghost mode-btn" data-mode="${m.value}" data-count="${counts[i]?.n ?? 0}">${m.label}<br><span class="count" style="font-weight:400">${counts[i]?.n ?? 0} so far</span></button>`,
      ).join("")}
    </div>
    <p style="text-align:center" class="cat-muted">Mode: <strong id="current-mode-label">${MODES[0].label}</strong></p>

    <div id="scan-result" style="display:none"></div>

    <div class="card" style="text-align:center">
      <button id="cam-btn" type="button" class="cat-btn cat-btn-primary cat-btn-block">Start camera scan</button>
      <video id="cam-video" style="width:100%;border-radius:10px;margin-top:10px;display:none" muted playsinline></video>
      <p class="cat-muted" id="cam-note" style="margin-top:8px"></p>
    </div>

    <div class="card">
      <h3>Or type Reg.No</h3>
      <form id="manual-form">
        <input class="cat-input" id="manual-regno" placeholder="CAT-XXXX" autocomplete="off" autocapitalize="characters" autofocus />
        <button type="submit" class="cat-btn cat-btn-primary cat-btn-block" style="margin-top:8px">Submit</button>
      </form>
    </div>
  `;

  const scripts = `
<script>
(function () {
  var mode = "${MODES[0].value}";
  var modeLabels = ${JSON.stringify(Object.fromEntries(MODES.map((m) => [m.value, m.label])))};
  var buttons = document.querySelectorAll(".mode-btn");
  buttons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      mode = btn.getAttribute("data-mode");
      document.getElementById("current-mode-label").textContent = modeLabels[mode];
    });
  });

  function showResult(ok, message, name, team) {
    var el = document.getElementById("scan-result");
    el.style.display = "block";
    el.className = ok ? "good" : "bad";
    el.textContent = ""; // clear previous content safely

    var icon = document.createTextNode(ok ? "✅ " : "❌ ");
    el.appendChild(icon);

    if (name) {
      var nameDiv = document.createElement("div");
      nameDiv.textContent = name + (team ? " · " + team : "");
      el.appendChild(nameDiv);
    }

    var msgDiv = document.createElement("div");
    msgDiv.style.fontSize = "1rem";
    msgDiv.style.fontWeight = "500";
    msgDiv.textContent = message; // textContent, never innerHTML — name/message come
    // straight from user-submitted signup data (participant names), so this
    // must never be inserted as HTML.
    el.appendChild(msgDiv);
  }

  async function submitScan(regNo) {
    try {
      var res = await fetch("/catalyst/admin/scan-api", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reg_no: regNo, kind: mode }),
      });
      var data = await res.json();
      showResult(data.ok, data.message, data.name, data.team);
      if (data.ok && typeof data.count === "number") {
        var btn = document.querySelector('.mode-btn[data-mode="' + mode + '"] .count');
        if (btn) btn.textContent = data.count + " so far";
      }
    } catch (e) {
      showResult(false, "Network error — check your connection and try again.");
    }
  }

  var manualForm = document.getElementById("manual-form");
  manualForm.addEventListener("submit", function (e) {
    e.preventDefault();
    var input = document.getElementById("manual-regno");
    var val = input.value.trim().toUpperCase();
    if (!val) return;
    submitScan(val);
    input.value = "";
    input.focus();
  });

  // Camera scanning via the native BarcodeDetector API where available.
  // Falls back to manual entry only (still fully usable) elsewhere.
  var camBtn = document.getElementById("cam-btn");
  var video = document.getElementById("cam-video");
  var camNote = document.getElementById("cam-note");
  var stream = null;
  var scanning = false;

  if (!("BarcodeDetector" in window)) {
    camBtn.disabled = true;
    camBtn.textContent = "Camera scan not supported on this browser";
    camNote.textContent = "Use the Reg.No box below instead.";
  } else {
    camBtn.addEventListener("click", async function () {
      if (scanning) {
        scanning = false;
        if (stream) stream.getTracks().forEach(function (t) { t.stop(); });
        video.style.display = "none";
        camBtn.textContent = "Start camera scan";
        return;
      }
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
        video.srcObject = stream;
        video.style.display = "block";
        await video.play();
        scanning = true;
        camBtn.textContent = "Stop camera scan";
        var detector = new window.BarcodeDetector({ formats: ["qr_code"] });
        var lastValue = "";
        var lastAt = 0;
        (function loop() {
          if (!scanning) return;
          detector
            .detect(video)
            .then(function (codes) {
              if (codes.length > 0) {
                var val = codes[0].rawValue.trim().toUpperCase();
                var now = Date.now();
                if (val !== lastValue || now - lastAt > 2500) {
                  lastValue = val;
                  lastAt = now;
                  submitScan(val);
                }
              }
            })
            .catch(function () {})
            .finally(function () {
              if (scanning) requestAnimationFrame(loop);
            });
        })();
      } catch (e) {
        camNote.textContent = "Couldn't access the camera — use the Reg.No box below.";
      }
    });
  }
})();
</script>`;

  return htmlResponse(page({ title: "Scanner — CATALYST Admin", body, scripts }));
};
