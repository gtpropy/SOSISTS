import { esc } from "./html";

/** Email clients strip <style> blocks unreliably, so every rule here is
 * inlined. Table-based layout for Outlook compatibility. */
export function paymentVerifiedEmail(opts: { name: string; regNo: string; teamName: string | null; ticketUrl: string }) {
  const firstName = esc(opts.name.split(" ")[0]);
  const html = `<!doctype html>
<html>
<head><meta charset="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1" /></head>
<body style="margin:0;padding:0;background:#faf6ec;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#faf6ec;padding:32px 16px;">
    <tr><td align="center">
      <table role="presentation" width="100%" style="max-width:480px;background:#fffdf7;border:1.5px solid #ddd0ad;border-radius:14px;overflow:hidden;">
        <tr><td style="background:#1d2436;padding:24px 28px;">
          <span style="font-family:Georgia,serif;font-size:1.6rem;font-weight:700;color:#ffffff;">CATALYST<span style="color:#f3c777;">.</span></span>
          <div style="color:#8b8fa3;font-size:0.8rem;margin-top:4px;">by ISTSOS &middot; Supported by BPC</div>
        </td></tr>
        <tr><td style="padding:32px 28px 8px;">
          <div style="display:inline-block;background:#e4f3e8;color:#2f7d4f;font-weight:700;font-size:0.75rem;letter-spacing:0.03em;text-transform:uppercase;padding:5px 14px;border-radius:999px;">Payment verified</div>
          <h1 style="font-family:Georgia,serif;font-size:1.8rem;color:#1d2436;margin:16px 0 4px;">You're confirmed, ${firstName}!</h1>
          <p style="color:#52597a;font-size:0.95rem;line-height:1.5;margin:0 0 20px;">Your payment for ISTS CATALYST has been verified. Your spot is locked in${opts.teamName ? ` with team <strong>${esc(opts.teamName)}</strong>` : " as a solo participant"}.</p>
        </td></tr>
        <tr><td style="padding:0 28px;">
          <table role="presentation" width="100%" style="background:#fdf0da;border-radius:12px;">
            <tr><td style="padding:18px 20px;text-align:center;">
              <div style="color:#9c6b14;font-size:0.78rem;font-weight:700;text-transform:uppercase;letter-spacing:0.04em;">Your Reg.No</div>
              <div style="font-family:Georgia,serif;font-size:2.2rem;font-weight:700;color:#c97a1a;letter-spacing:0.04em;margin-top:4px;">${esc(opts.regNo)}</div>
            </td></tr>
          </table>
        </td></tr>
        <tr><td style="padding:24px 28px 32px;text-align:center;">
          <a href="${esc(opts.ticketUrl)}" style="display:inline-block;background:#1d2436;color:#ffffff;font-weight:600;font-size:1rem;padding:14px 32px;border-radius:999px;text-decoration:none;">View your ticket &amp; QR code</a>
        </td></tr>
        <tr><td style="padding:0 28px 28px;">
          <p style="color:#8b8fa3;font-size:0.82rem;line-height:1.5;margin:0;">Bring this ticket (printed, or just a screenshot on your phone) to check in on event day. See you there!</p>
        </td></tr>
        <tr><td style="background:#faf6ec;padding:18px 28px;border-top:1.5px solid #ddd0ad;">
          <p style="color:#8b8fa3;font-size:0.76rem;margin:0;text-align:center;">ISTS CATALYST &middot; SOS Hermann Gmeiner Secondary School Gandaki, Pokhara</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

  const text = `You're confirmed, ${opts.name.split(" ")[0]}!\n\nYour payment for ISTS CATALYST has been verified.${opts.teamName ? ` Team: ${opts.teamName}.` : " You're registered as a solo participant."}\n\nYour Reg.No: ${opts.regNo}\n\nView your ticket: ${opts.ticketUrl}\n\nBring this ticket (printed or as a screenshot) to check in on event day.\n\nISTS CATALYST · SOS Hermann Gmeiner Secondary School Gandaki, Pokhara`;

  return { html, text };
}
