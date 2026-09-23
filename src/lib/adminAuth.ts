/**
 * Admin key verification for the site's hidden admin mode (currently used to
 * let an admin fix sideways/upside-down photos in the SIC gallery directly
 * on the live site — see AdminProvider + EventGallery).
 *
 * This is a static, client-only site with no backend, so this is NOT real
 * security: the hash below ships inside the public JS bundle, and anyone
 * who reads the bundle and brute-forces (or is simply told) the passphrase
 * can unlock it. It's a soft gate to keep the control hidden from casual
 * visitors, not a defense against a determined one. Don't use it to guard
 * anything sensitive.
 *
 * The current passphrase is "ists-sic-fix-2026". To change it, compute a
 * new SHA-256 hex digest of the new passphrase and swap ADMIN_KEY_HASH:
 *   node -e "console.log(require('crypto').createHash('sha256').update('your-new-passphrase').digest('hex'))"
 */
export const ADMIN_KEY_HASH =
  "4f07dd6b5cf39b7370c87e77248eb26df80043daeae29d5810d8183834481515";

export async function sha256Hex(text: string): Promise<string> {
  const bytes = new TextEncoder().encode(text);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function verifyAdminKey(input: string): Promise<boolean> {
  if (!input) return false;
  const hash = await sha256Hex(input.trim());
  return hash === ADMIN_KEY_HASH;
}
