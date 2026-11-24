import type { Env, PagesFunction } from "./_lib/env";
import { esc, htmlResponse, page } from "./_lib/html";

export const onRequestGet: PagesFunction<Env> = async ({ request }) => {
  const url = new URL(request.url);
  const next = url.searchParams.get("next");
  const gated = Boolean(next); // arrived here because signup requires it first
  const ackUrl = `/catalyst/rules-ack?next=${encodeURIComponent(next || "/catalyst/signup")}`;

  const body = `
    <h1>Rules &amp; Conditions</h1>
    ${gated ? `<div class="cat-banner cat-banner-warn">Read through this once before you register — you'll be able to continue at the bottom.</div>` : ""}
    <p class="cat-muted">These rules apply to every participant of ISTS CATALYST, the first interschool hackathon in Pokhara (Sat 12 Dec build day, Sun 13 Dec showcase), organised by ISTSSOS at SOS Hermann Gmeiner Secondary School Gandaki and supported by Business Promotion Center (BPC).</p>

    <div class="card">
      <h3>1. Eligibility, teams and registration</h3>
      <ul>
        <li>Open to students of Class 10, 11 and 12 and gap-year students of Pokhara city. Class 9 and Class 13 are not eligible.</li>
        <li>Join solo or in a team of up to 4. Team members may come from different schools.</li>
        <li>Each person may be in one team only.</li>
        <li>Register only at sosists.pages.dev/catalyst, with your own Reg.No and name. One person per login.</li>
        <li>The fee is NPR 700 per person, whether you are solo or in a team of up to 4. It covers all three food rounds.</li>
        <li>A person is confirmed only after the organisers verify their payment. A team is complete when every member is confirmed.</li>
        <li>Registration closes when seats are full or on the closing date announced on the site, whichever comes first.</li>
        <li>The fee is not refunded once payment is verified, unless ISTSSOS cancels or postpones the event.</li>
      </ul>
    </div>

    <div class="card">
      <h3>2. Schedule</h3>
      <p>Day 1 is a 14-hour build sprint (08:00–22:00); Day 2 is the public showcase. Participants go home each night, so no overnight stay.</p>
      <div class="cat-table-wrap">
        <table class="cat-table">
          <tr><th>Time</th><th>Day 1, Sat 12 Dec</th><th>Food</th></tr>
          <tr><td>07:30</td><td>Reporting, ID check, seating</td><td></td></tr>
          <tr><td>08:00</td><td>Opening and rules briefing, sprint starts</td><td></td></tr>
          <tr><td>13:00</td><td>Lunch served: collect it and eat at your table (13:00–14:00)</td><td>Lunch</td></tr>
          <tr><td>16:00</td><td>Snacks served: collect them to your table (16:00–17:00)</td><td>Snacks</td></tr>
          <tr><td>19:30</td><td>Biscuits and tea served at your tables</td><td>Biscuits and tea</td></tr>
          <tr><td>21:00</td><td>Final-hour call, submission links opened</td><td></td></tr>
          <tr><td>22:00</td><td>Sprint ends, code freeze, submissions locked</td><td></td></tr>
        </table>
      </div>
      <div class="cat-table-wrap" style="margin-top:14px">
        <table class="cat-table">
          <tr><th>Time</th><th>Day 2, Sun 13 Dec</th><th>Food</th></tr>
          <tr><td>09:00</td><td>Teams set up stalls and demos</td><td></td></tr>
          <tr><td>10:00</td><td>Public showcase opens</td><td></td></tr>
          <tr><td>10:30–14:00</td><td>Judging rounds, 4 judges, live Q&amp;A</td><td></td></tr>
          <tr><td>15:30</td><td>Winners announced and prizes given</td><td></td></tr>
        </table>
      </div>
    </div>

    <div class="card">
      <h3>3. Food and refreshments</h3>
      <ul>
        <li>The NPR 700 fee covers three food rounds on Day 1: lunch, snacks, and biscuits and tea served at 19:30.</li>
        <li>Food is ordered on the day, so only confirmed participants (payment verified) are counted and served.</li>
        <li>Each participant gets one portion per round, collected with their participant ID. No portions are kept for absentees.</li>
        <li>Food is served only at the given times: lunch 13:00–14:00, snacks 16:00–17:00, biscuits and tea at 19:30. Collect it from the serving table within that time and take it to your own table. Food not collected in time is not kept.</li>
        <li>Rest breaks are your own: take them whenever you like. The sprint clock never stops, and there are no fixed team breaks.</li>
        <li>Eat at your own table, but keep food and drinks away from laptops, boards and wiring. Clear your own cups and wrappers.</li>
        <li>Tell the organisers at registration about any food allergy or dietary need (vegetarian, for example). We will try to match it but cannot promise special meals.</li>
        <li>Outside food and energy drinks may be brought for personal use. Sharing them is at your own risk.</li>
        <li>Drinking water is free and available all day.</li>
      </ul>
    </div>

    <div class="card">
      <h3>4. Build rules (Day 1)</h3>
      <ul>
        <li>All work on the project starts after the 08:00 sprint start. Ideas, research and sketches made before are fine; code, designs, circuits and models built before are not.</li>
        <li>Only your own team builds the project. Teams cannot swap members after the sprint starts and cannot take outside help with the build.</li>
        <li>Mentors, if present, may guide and answer questions. They do not write or fix your code.</li>
        <li>Open-source libraries, frameworks, public datasets and AI assistants are allowed. You must be able to explain every part of your project, and you must say in your submission what was reused or AI-assisted.</li>
        <li>Copying another team's work, or submitting an existing product as your own, is cheating.</li>
        <li>Bring your own laptops, chargers, boards, sensors and tools. The school provides internet, power backup and tables. CATALYST may give basic parts if we have them in stock. This is not guaranteed, so plan to bring what your project needs.</li>
        <li>Keep to the school's Wi-Fi rules: no hacking, scanning or attacking the network or other teams' devices.</li>
        <li>Soldering, batteries above 5V and tools with heat or blades are used only in the hardware zone, with eye protection, and under a staff member's eye.</li>
        <li>At 22:00 the sprint ends. Submit your repository or project folder link and a 1-minute demo video or photo through the site. Anything pushed after 22:00 is ignored.</li>
        <li>Every team must show a working prototype on Day 2. A slide-only entry is not accepted.</li>
      </ul>
    </div>

    <div class="card">
      <h3>5. Showcase, judging and prizes (Day 2)</h3>
      <p>Four prizes of NPR 10,000 each, NPR 40,000 in total, one per category:</p>
      <div class="cat-table-wrap">
        <table class="cat-table">
          <tr><th>Category</th><th>What judges look for</th></tr>
          <tr><td>Best Technical Execution</td><td>Works as shown, clean build, sound engineering</td></tr>
          <tr><td>Best Innovation / Originality</td><td>A fresh idea or a new way to solve a known problem</td></tr>
          <tr><td>Best Real-World Impact</td><td>Solves a real problem for real people in Nepal</td></tr>
          <tr><td>Best Hardware Integration</td><td>Hardware and software working well together</td></tr>
        </table>
      </div>
      <ul style="margin-top:14px">
        <li>Four judges score each team on the four categories after a live demo and Q&amp;A. The highest score in a category wins it.</li>
        <li>One team may win more than one category.</li>
        <li>Every member of the team must be present at the stall during judging. Questions go to the whole team, not one speaker.</li>
        <li>The showcase is open to the public. Visitors may ask questions but may not touch or power on demos without the team's permission.</li>
        <li>Judges' decisions are final. Ties are settled by the head judge. Scoring sheets are not shared.</li>
        <li>Prizes are shared equally among the members of the winning team and given as a cheque or bank transfer after the event. Participants receive certificates.</li>
      </ul>
    </div>

    <div class="card">
      <h3>6. Conduct, safety, disqualification and consent</h3>
      <ul>
        <li>Wear your school uniform or ID card and keep your participant ID visible. Only registered participants, staff and volunteers enter the build hall on Day 1.</li>
        <li>Be respectful to teammates, other teams, volunteers, judges and staff. Harassment, bullying and abusive language are not tolerated.</li>
        <li>No smoking, vaping, alcohol or drugs on campus. Follow the school's rules at all times.</li>
        <li>Leave the campus only with permission from a staff member, and sign out and in at the desk. The sprint clock does not stop for you.</li>
        <li>Look after school property and other teams' equipment. Damage must be reported and may be charged to the team.</li>
        <li>You are responsible for your own devices and belongings. The school and ISTSSOS are not liable for loss or damage.</li>
        <li>Organisers may disqualify a team, without refund, for cheating, plagiarism, unsafe behaviour, damage, rule-breaking after one warning, or a serious conduct issue. The decision is final.</li>
        <li>Teams keep ownership of their projects. By taking part, you allow ISTSSOS, the school and BPC to show your project name, team name and photos or videos of the event in reports and promotion.</li>
        <li>Participants under 18 need a parent or guardian's consent on the registration site before they can join. Photos and videos are taken at public events, and a guardian can ask the organisers not to feature their child.</li>
        <li>Organisers can change the schedule or rules for safety or logistics. Changes are announced on the site and at the briefing.</li>
      </ul>
    </div>

    ${
      gated
        ? `<a class="cat-btn cat-btn-primary cat-btn-block" href="${esc(ackUrl)}">I've read this — continue to registration</a>`
        : `<p style="text-align:center"><a href="/catalyst">&larr; Back to CATALYST</a></p>`
    }
  `;

  return htmlResponse(page({ title: "Rules & Conditions — CATALYST", body }));
};
