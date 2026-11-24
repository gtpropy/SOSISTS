import type { Env, PagesFunction } from "./_lib/env";
import { clearSessionCookie } from "./_lib/auth";

export const onRequestPost: PagesFunction<Env> = async () => {
  return new Response(null, {
    status: 303,
    headers: { Location: "/catalyst", "Set-Cookie": clearSessionCookie("participant") },
  });
};

export const onRequestGet: PagesFunction<Env> = onRequestPost;
