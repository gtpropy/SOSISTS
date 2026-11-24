import type { Env, PagesFunction } from "./_lib/env";

// Marks "has seen the rules page and clicked continue" so /catalyst/signup
// can require it — not a login, no account involved, so a plain GET link is
// fine (nothing meaningful to CSRF here, just a UX gate flag).
export const onRequestGet: PagesFunction<Env> = async ({ request }) => {
  const url = new URL(request.url);
  let next = url.searchParams.get("next") || "/catalyst/signup";
  if (!next.startsWith("/catalyst/")) next = "/catalyst/signup"; // never redirect off-site

  return new Response(null, {
    status: 303,
    headers: {
      Location: next,
      "Set-Cookie": "catalyst_rules_ack=1; Path=/catalyst; HttpOnly; Secure; SameSite=Lax; Max-Age=31536000",
    },
  });
};
