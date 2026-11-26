import type { Env, PagesFunction } from "../../_lib/env";

export const onRequestGet: PagesFunction<Env, "id"> = async ({ env, params }) => {
  const participantId = Number(params.id);
  const participant = await env.CATALYST_DB
    .prepare("SELECT eligibility_doc_key FROM participants WHERE id = ?1")
    .bind(participantId)
    .first<{ eligibility_doc_key: string | null }>();

  if (!participant?.eligibility_doc_key) return new Response("Not found", { status: 404 });

  const object = await env.CATALYST_UPLOADS.get(participant.eligibility_doc_key);
  if (!object) return new Response("Not found", { status: 404 });

  return new Response(object.body, {
    headers: {
      "Content-Type": object.httpMetadata?.contentType ?? "application/octet-stream",
      "Cache-Control": "private, max-age=300",
    },
  });
};
