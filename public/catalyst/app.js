// CATALYST — small page-wide vanilla JS sprinkles. No framework, no build
// step: kept deliberately tiny so it loads fast on slow phone connections.
(function () {
  "use strict";

  // Copy-to-clipboard: <button data-copy="text to copy">Copy</button>
  document.addEventListener("click", function (e) {
    var btn = e.target.closest("[data-copy]");
    if (!btn) return;
    var text = btn.getAttribute("data-copy");
    var done = function () {
      var original = btn.textContent;
      btn.textContent = "Copied!";
      setTimeout(function () {
        btn.textContent = original;
      }, 1500);
    };
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(done).catch(function () {
        fallbackCopy(text, done);
      });
    } else {
      fallbackCopy(text, done);
    }
  });

  function fallbackCopy(text, done) {
    var ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand("copy");
      done();
    } catch (err) {
      void err; // clipboard fallback failed silently — nothing more we can do here
    }
    document.body.removeChild(ta);
  }

  // Confirm before a destructive action: <button data-confirm="Are you sure?">
  document.addEventListener("submit", function (e) {
    var form = e.target;
    var msg = form.getAttribute && form.getAttribute("data-confirm");
    if (msg && !window.confirm(msg)) {
      e.preventDefault();
    }
  });
  document.addEventListener(
    "click",
    function (e) {
      var btn = e.target.closest("[data-confirm]");
      if (btn && btn.tagName === "BUTTON" && !btn.form) return; // handled by submit listener instead
    },
    true,
  );

  // Client-side image compression before upload — important on slow Nepal
  // mobile networks. Resizes to a max dimension and re-encodes as JPEG.
  // <input type="file" data-compress accept="image/*">
  document.addEventListener("change", function (e) {
    var input = e.target;
    if (!(input instanceof HTMLInputElement) || !input.hasAttribute("data-compress")) return;
    var file = input.files && input.files[0];
    if (!file || !file.type.startsWith("image/")) return;

    var statusEl = document.getElementById(input.id + "_status");
    if (statusEl) statusEl.textContent = "Compressing image...";

    var img = new Image();
    var reader = new FileReader();
    reader.onload = function () {
      img.onload = function () {
        var maxDim = 1400;
        var scale = Math.min(1, maxDim / Math.max(img.width, img.height));
        var canvas = document.createElement("canvas");
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        var ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        canvas.toBlob(
          function (blob) {
            if (!blob) return;
            var dt = new DataTransfer();
            var compressed = new File([blob], file.name.replace(/\.\w+$/, ".jpg"), {
              type: "image/jpeg",
            });
            dt.items.add(compressed);
            input.files = dt.files;
            if (statusEl) {
              var kb = Math.round(blob.size / 1024);
              statusEl.textContent = "Ready to upload (" + kb + " KB)";
            }
          },
          "image/jpeg",
          0.75,
        );
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });

  // Rename-via-prompt: <form data-rename-form data-team-name="Current">
  //   <input type="hidden" name="new_name" /><button data-rename-btn>Rename</button></form>
  document.addEventListener("click", function (e) {
    var btn = e.target.closest("[data-rename-btn]");
    if (!btn) return;
    var form = btn.closest("[data-rename-form]");
    if (!form) return;
    var current = form.getAttribute("data-team-name") || "";
    var next = window.prompt("New team name:", current);
    if (!next || !next.trim() || next.trim() === current) return;
    form.querySelector('input[name="new_name"]').value = next.trim();
    form.submit();
  });

  // Upload progress feedback for forms with a file input + data-upload-form.
  document.addEventListener("submit", function (e) {
    var form = e.target;
    if (!form.hasAttribute || !form.hasAttribute("data-upload-form")) return;
    var btn = form.querySelector('button[type="submit"]');
    if (btn) {
      btn.disabled = true;
      btn.dataset.originalText = btn.textContent;
      btn.textContent = "Uploading...";
    }
  });
})();
