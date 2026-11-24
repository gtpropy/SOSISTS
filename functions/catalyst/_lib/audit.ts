import type { D1Database } from "./env";

export async function logAction(
  db: D1Database,
  adminId: number | null,
  action: string,
  target?: string,
  detail?: string,
): Promise<void> {
  await db
    .prepare("INSERT INTO audit_log (admin_id, action, target, detail) VALUES (?1, ?2, ?3, ?4)")
    .bind(adminId, action, target ?? null, detail ?? null)
    .run();
}
