import type { Env, PagesFunction } from "../_lib/env";
import { getAdminSession } from "../_lib/auth";
import { redirect } from "../_lib/html";

// Guards every /catalyst/admin/* route except the login page itself.
export const onRequest: PagesFunction<Env> = async ({ request, env, next, data }) => {
  const url = new URL(request.url);
  if (url.pathname === "/catalyst/admin/login") return next();

  const session = await getAdminSession(request, env.SESSION_SECRET);
  if (!session) return redirect("/catalyst/admin/login");

  data.admin = session;

  // Volunteers only get the scanner + badge pages — everything else in the
  // admin area (payments, participants, config, exports, audit log) is
  // admin-only.
  const volunteerAllowed = ["/catalyst/admin/scan", "/catalyst/admin/badges"];
  if (session.role === "volunteer" && !volunteerAllowed.some((p) => url.pathname.startsWith(p))) {
    return redirect("/catalyst/admin/scan");
  }

  return next();
};
