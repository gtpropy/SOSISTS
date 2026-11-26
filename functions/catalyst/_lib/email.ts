import { connect } from "cloudflare:sockets";
import type { Env } from "./env";

export interface EmailMessage {
  to: string;
  toName?: string;
  subject: string;
  html: string;
  text: string;
}

async function readSmtpResponse(reader: ReadableStreamDefaultReader<string>): Promise<string> {
  let buffer = "";
  // SMTP multi-line responses end on a line like "250 ..." (space, not
  // hyphen) — keep reading chunks until we see that.
  while (!/(?:^|\r\n)\d{3} [^\r\n]*\r\n$/.test(buffer)) {
    const { value, done } = await reader.read();
    if (done) throw new Error("SMTP connection closed unexpectedly");
    buffer += value;
  }
  return buffer;
}

function buildMimeMessage(from: string, msg: EmailMessage): string {
  const boundary = `catalyst-${crypto.randomUUID()}`;
  const toHeader = msg.toName ? `"${msg.toName.replace(/["\r\n]/g, "")}" <${msg.to}>` : msg.to;
  const lines = [
    `From: ISTS CATALYST <${from}>`,
    `To: ${toHeader}`,
    `Subject: ${msg.subject}`,
    `Date: ${new Date().toUTCString()}`,
    `MIME-Version: 1.0`,
    `Content-Type: multipart/alternative; boundary="${boundary}"`,
    ``,
    `--${boundary}`,
    `Content-Type: text/plain; charset="UTF-8"`,
    ``,
    msg.text,
    ``,
    `--${boundary}`,
    `Content-Type: text/html; charset="UTF-8"`,
    ``,
    msg.html,
    ``,
    `--${boundary}--`,
  ].join("\r\n");

  // Dot-stuffing: a line starting with "." would otherwise be read by the
  // server as the end-of-DATA marker.
  return lines.replace(/\r\n\./g, "\r\n..");
}

/**
 * Sends an email via Gmail SMTP (implicit TLS, port 465) using a raw TCP
 * socket — Cloudflare Pages Functions have no SMTP library available, and
 * this avoids needing a separate third-party email service account.
 *
 * No-ops silently if GMAIL_ADDRESS/GMAIL_APP_PASSWORD aren't configured yet
 * (set via `wrangler pages secret put`), so the rest of the app works fine
 * before an organizer sets up email.
 */
export async function sendEmail(env: Env, msg: EmailMessage): Promise<void> {
  const user = env.GMAIL_ADDRESS;
  const pass = env.GMAIL_APP_PASSWORD;
  if (!user || !pass) return;

  const socket = connect({ hostname: "smtp.gmail.com", port: 465 }, { secureTransport: "on" });
  const writer = socket.writable.getWriter();
  // TS's lib.dom types TextDecoderStream's writable side as BufferSource
  // rather than Uint8Array, which doesn't line up with ReadableStream<Uint8Array>
  // even though this is exactly its intended use at runtime.
  const reader = socket.readable
    .pipeThrough(new TextDecoderStream() as unknown as ReadableWritablePair<string, Uint8Array>)
    .getReader();
  const enc = new TextEncoder();

  const send = (line: string) => writer.write(enc.encode(`${line}\r\n`));
  const expect = async (okPrefix = "2") => {
    const resp = await readSmtpResponse(reader);
    const lastLine = resp.trim().split("\r\n").pop() ?? "";
    if (!lastLine.startsWith(okPrefix)) throw new Error(`SMTP error: ${resp.trim()}`);
    return resp;
  };

  try {
    await expect(); // server greeting
    await send("EHLO catalyst.sosists.pages.dev");
    await expect();
    await send("AUTH LOGIN");
    await expect("3");
    await send(btoa(user));
    await expect("3");
    await send(btoa(pass));
    await expect();
    await send(`MAIL FROM:<${user}>`);
    await expect();
    await send(`RCPT TO:<${msg.to}>`);
    await expect();
    await send("DATA");
    await expect("3");
    await writer.write(enc.encode(`${buildMimeMessage(user, msg)}\r\n.\r\n`));
    await expect();
    await send("QUIT");
  } finally {
    await writer.close().catch(() => {});
    await socket.close().catch(() => {});
  }
}
