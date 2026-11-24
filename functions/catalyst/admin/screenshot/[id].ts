import type { Env, PagesFunction } from "../../_lib/env";

export const onRequestGet: PagesFunction<Env, "id"> = async ({ env, params }) => {
  const paymentId = Number(params.id);
  const payment = await env.CATALYST_DB
    .prepare("SELECT screenshot_key FROM payments WHERE id = ?1")
    .bind(paymentId)
    .first<{ screenshot_key: string | null }>();

  if (!payment?.screenshot_key) return new Response("Not found", { status: 404 });

  const object = await env.CATALYST_UPLOADS.get(payment.screenshot_key);
  if (!object) return new Response("Not found", { status: 404 });

  return new Response(object.body, {
    headers: {
      "Content-Type": object.httpMetadata?.contentType ?? "application/octet-stream",
      "Cache-Control": "private, max-age=300",
    },
  });
};
