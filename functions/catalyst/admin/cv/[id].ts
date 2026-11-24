import type { Env, PagesFunction } from "../../_lib/env";

export const onRequestGet: PagesFunction<Env, "id"> = async ({ env, params }) => {
  const participantId = Number(params.id);
  const participant = await env.CATALYST_DB
    .prepare("SELECT cv_key, name FROM participants WHERE id = ?1")
    .bind(participantId)
    .first<{ cv_key: string | null; name: string }>();

  if (!participant?.cv_key) return new Response("Not found", { status: 404 });

  const object = await env.CATALYST_UPLOADS.get(participant.cv_key);
  if (!object) return new Response("Not found", { status: 404 });

  return new Response(object.body, {
    headers: {
      "Content-Type": "application/pdf",
      "Cache-Control": "private, max-age=300",
    },
  });
};
