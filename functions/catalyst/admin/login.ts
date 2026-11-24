import type { Env, PagesFunction } from "../_lib/env";
import { createAdminSession, hashSecret, isSameOrigin, verifySecret } from "../_lib/auth";
import { banner, button, field, htmlResponse, page } from "../_lib/html";
import { logAction } from "../_lib/audit";

async function adminCount(env: Env): Promise<number> {
  const row = await env.CATALYST_DB.prepare("SELECT COUNT(*) as n FROM admins").first<{ n: number }>();
  return row?.n ?? 0;
}

function renderBootstrap(error?: string | null) {
  return `
    ${banner(error)}
    <div class="card">
      <h1>Set up CATALYST admin</h1>
      <p class="cat-muted">No admin account exists yet. Create the first one now — you'll use this to verify payments, manage teams, and run event-day check-in.</p>
      <form method="post" action="/catalyst/admin/login">
        <input type="hidden" name="action" value="bootstrap" />
        ${field({ label: "Username", name: "username", required: true })}
        ${field({ label: "Password", name: "password", type: "password", required: true, help: "At least 8 characters. Keep this somewhere safe — there's no email recovery." })}
        ${button("Create admin account", { type: "submit" })}
      </form>
    </div>
  `;
}

function renderLogin(error?: string | null) {
  return `
    ${banner(error)}
    <div class="card">
      <h1>Organizer login</h1>
      <form method="post" action="/catalyst/admin/login">
        <input type="hidden" name="action" value="login" />
        ${field({ label: "Username", name: "username", required: true })}
        ${field({ label: "Password", name: "password", type: "password", required: true })}
        ${button("Log in", { type: "submit" })}
      </form>
    </div>
  `;
}

export const onRequestGet: PagesFunction<Env> = async ({ env }) => {
  const count = await adminCount(env);
  return htmlResponse(
    page({ title: "Admin login — CATALYST", body: count === 0 ? renderBootstrap() : renderLogin() }),
  );
};

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  if (!isSameOrigin(request)) return new Response("Bad request", { status: 400 });

  const form = await request.formData();
  const action = String(form.get("action") ?? "");
  const username = String(form.get("username") ?? "").trim();
  const password = String(form.get("password") ?? "");

  if (action === "bootstrap") {
    const count = await adminCount(env);
    if (count > 0) {
      // Someone else already finished bootstrap — don't let a second
      // "first admin" slip in. Fall through to normal login instead.
      return htmlResponse(page({ title: "Admin login — CATALYST", body: renderLogin() }));
    }
    if (!username || password.length < 8) {
      return htmlResponse(
        page({ title: "Admin login — CATALYST", body: renderBootstrap("Username required; password needs 8+ characters.") }),
        { status: 400 },
      );
    }
    const hash = await hashSecret(password);
    const insert = await env.CATALYST_DB
      .prepare("INSERT INTO admins (username, password_hash, role) VALUES (?1, ?2, 'admin')")
      .bind(username, hash)
      .run();
    const adminId = insert.meta.last_row_id;
    if (!adminId) return new Response("Could not create admin account.", { status: 500 });

    await logAction(env.CATALYST_DB, adminId, "bootstrap_admin", `admin:${adminId}`, `username=${username}`);
    const cookie = await createAdminSession(adminId, "admin", env.SESSION_SECRET);
    return new Response(null, {
      status: 303,
      headers: { Location: "/catalyst/admin", "Set-Cookie": cookie },
    });
  }

  // Normal login
  const admin = await env.CATALYST_DB
    .prepare("SELECT * FROM admins WHERE username = ?1")
    .bind(username)
    .first<{ id: number; username: string; password_hash: string; role: "admin" | "volunteer" }>();

  const ok = admin ? await verifySecret(password, admin.password_hash) : false;
  if (!admin || !ok) {
    return htmlResponse(
      page({ title: "Admin login — CATALYST", body: renderLogin("Username or password didn't match.") }),
      { status: 401 },
    );
  }

  const cookie = await createAdminSession(admin.id, admin.role, env.SESSION_SECRET);
  const dest = admin.role === "volunteer" ? "/catalyst/admin/scan" : "/catalyst/admin";
  return new Response(null, { status: 303, headers: { Location: dest, "Set-Cookie": cookie } });
};
