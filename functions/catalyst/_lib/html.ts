/**
 * Hand-rolled HTML templating — Pages Functions return raw Response
 * objects, there's no React/JSX runtime here. Every piece of user-supplied
 * text MUST go through esc() before being interpolated; nothing else
 * guards against XSS in this file.
 */

export function esc(value: unknown): string {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function html(strings: TemplateStringsArray, ...values: unknown[]): string {
  return strings.reduce((out, s, i) => out + s + (i < values.length ? String(values[i]) : ""), "");
}

export interface PageOptions {
  title: string;
  body: string;
  /** Extra <head> content (rarely needed). */
  head?: string;
  /** Extra <script> tags right before </body> (page-specific JS). */
  scripts?: string;
  /** Hide the global CATALYST header (used for the plain ticket/badge print views). */
  bare?: boolean;
}

export function page(opts: PageOptions): string {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${esc(opts.title)}</title>
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Caveat:wght@600;700&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
<link rel="stylesheet" href="/catalyst/notebook.css" />
${opts.head ?? ""}
</head>
<body>
${opts.bare ? opts.body : shell(opts.body)}
<script src="/catalyst/app.js"></script>
${opts.scripts ?? ""}
</body>
</html>`;
}

function shell(body: string): string {
  return `
<header class="cat-header">
  <a href="/catalyst" class="cat-brand">CATALYST<span class="cat-brand-dot">.</span></a>
  <span class="cat-header-sub">by ISTSOS &middot; Supported by BPC</span>
</header>
<main class="cat-main">${body}</main>
<footer class="cat-footer">
  <p>ISTS CATALYST &middot; SOS Hermann Gmeiner Secondary School Gandaki, Pokhara</p>
  <p class="cat-footer-sponsor">Supported by BPC</p>
</footer>`;
}

/** Renders the "Step X of Y" onboarding progress header. */
export function wizardSteps(current: number, labels: string[]): string {
  const total = labels.length;
  const pct = Math.round((current / total) * 100);
  return `<div class="cat-wizard">
    <p class="cat-wizard-label">Step ${current} of ${total} &middot; ${esc(labels[current - 1] ?? "")}</p>
    <div class="cat-wizard-bar"><div class="cat-wizard-fill" style="width:${pct}%"></div></div>
  </div>`;
}

export function redirect(location: string, init?: ResponseInit): Response {
  return new Response(null, { status: 303, headers: { Location: location, ...(init?.headers ?? {}) } });
}

export function htmlResponse(markup: string, init?: ResponseInit): Response {
  return new Response(markup, {
    status: init?.status ?? 200,
    headers: { "Content-Type": "text/html; charset=utf-8", ...(init?.headers ?? {}) },
  });
}

export function jsonResponse(data: unknown, init?: ResponseInit): Response {
  return new Response(JSON.stringify(data), {
    status: init?.status ?? 200,
    headers: { "Content-Type": "application/json", ...(init?.headers ?? {}) },
  });
}

/** Renders a flash/error banner block, or an empty string if no message. */
export function banner(message: string | null | undefined, kind: "bad" | "good" | "warn" = "bad"): string {
  if (!message) return "";
  return `<div class="cat-banner cat-banner-${kind}">${esc(message)}</div>`;
}

export function field(opts: {
  label: string;
  name: string;
  type?: string;
  value?: string;
  required?: boolean;
  placeholder?: string;
  options?: { value: string; label: string }[];
  help?: string;
  pattern?: string;
  maxLength?: number;
  autocomplete?: string;
}): string {
  const req = opts.required ? "required" : "";
  const id = `f_${opts.name}`;
  let control: string;
  if (opts.options) {
    control = `<select id="${id}" name="${esc(opts.name)}" ${req} class="cat-input">
      <option value="" disabled ${opts.value ? "" : "selected"}>Choose...</option>
      ${opts.options
        .map(
          (o) =>
            `<option value="${esc(o.value)}" ${o.value === opts.value ? "selected" : ""}>${esc(o.label)}</option>`,
        )
        .join("")}
    </select>`;
  } else {
    control = `<input id="${id}" name="${esc(opts.name)}" type="${esc(opts.type ?? "text")}"
      value="${esc(opts.value ?? "")}" ${req}
      ${opts.placeholder ? `placeholder="${esc(opts.placeholder)}"` : ""}
      ${opts.pattern ? `pattern="${esc(opts.pattern)}"` : ""}
      ${opts.maxLength ? `maxlength="${opts.maxLength}"` : ""}
      ${opts.autocomplete ? `autocomplete="${esc(opts.autocomplete)}"` : 'autocomplete="off"'}
      class="cat-input" />`;
  }
  return `<label class="cat-field" for="${id}">
    <span class="cat-field-label">${esc(opts.label)}${opts.required ? " *" : ""}</span>
    ${control}
    ${opts.help ? `<span class="cat-field-help">${esc(opts.help)}</span>` : ""}
  </label>`;
}

export function button(label: string, opts: { type?: "submit" | "button"; variant?: "primary" | "ghost" | "danger"; name?: string; value?: string; id?: string; attrs?: string } = {}): string {
  const variant = opts.variant ?? "primary";
  return `<button type="${opts.type ?? "submit"}" class="cat-btn cat-btn-${variant}" ${opts.name ? `name="${esc(opts.name)}"` : ""} ${opts.value ? `value="${esc(opts.value)}"` : ""} ${opts.id ? `id="${esc(opts.id)}"` : ""} ${opts.attrs ?? ""}>${esc(label)}</button>`;
}

export function card(innerHtml: string, extraClass = ""): string {
  return `<div class="card cat-card ${extraClass}">${innerHtml}</div>`;
}

export function statusPill(label: string, kind: "good" | "bad" | "warn" | "neutral" = "neutral"): string {
  return `<span class="cat-pill cat-pill-${kind}">${esc(label)}</span>`;
}
