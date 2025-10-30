// ===== GroundWire Apps Script (Code.gs) =====
// Deploy as Web App (Execute as: Me, Access: Anyone) to receive webhooks from Glide.
// Features:
// 1) Send email instantly (type: "email").
// 2) Add media coverage from a URL by parsing Open Graph tags (type: "addCoverage").
// 3) Optional: onFormSubmit trigger if writing directly to Google Sheets (no webhook needed).

/** Main webhook handler for Glide "Call webhook" action */
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents || "{}");

    // 1) Send an email immediately
    if (data.type === "email") {
      MailApp.sendEmail({
        to: data.to,
        subject: data.subject || "GroundWire Notification",
        body: data.body || "New event from GroundWire."
      });
      return jsonOut({ ok: true, action: "email" });
    }

    // 2) Add a media coverage row programmatically
    if (data.type === "addCoverage" && data.url) {
      const out = addMediaCoverage(data.url);
      return jsonOut({ ok: true, action: "addCoverage", ...out });
    }

    return jsonOut({ ok: false, error: "Unknown or missing type" });
  } catch (err) {
    return jsonOut({ ok: false, error: String(err) });
  }
}

/** Helper: parse a page's HTML for Open Graph tags and append to 'Media Coverage' sheet. */
function addMediaCoverage(url) {
  const html = UrlFetchApp.fetch(url, { muteHttpExceptions: true }).getContentText();

  const og = (prop) => {
    const re = new RegExp(`<meta[^>]+property=["']og:${prop}["'][^>]+content=["']([^"']+)["']`, "i");
    const m = html.match(re);
    return m ? m[1] : "";
  };

  const title = og("title") || (html.match(/<title[^>]*>([^<]+)<\/title>/i)?.[1] || "");
  const description = og("description") || "";
  const image = og("image") || "";
  const source = (url.match(/^https?:\/\/([^/]+)/i)?.[1] || "").replace(/^www\./, "");

  const ss = SpreadsheetApp.getActive();
  let sh = ss.getSheetByName("Media Coverage");
  if (!sh) {
    sh = ss.insertSheet("Media Coverage");
    sh.appendRow(["Date", "Title", "Source", "URL", "Image_URL", "Description"]);
  }
  sh.appendRow([new Date(), title, source, url, image, description]);

  return { title, source, image };
}

/** Optional: if the Volunteer form writes straight into Sheets (no webhook) */
function onFormSubmit(e) {
  // e.namedValues contains an object mapping header -> array of values
  const r = e.namedValues || {};
  const to = "you@example.com"; // <-- change to your admin email
  const subject = `New Volunteer: ${safe(r.Name)}`;
  const body = [
    `Name: ${safe(r.Name)}`,
    `Email: ${safe(r.Email)}`,
    `Phone: ${safe(r.Phone)}`,
    `Preferred Role: ${safe(r["Preferred Role"])}`,
    `Availability: ${safe(r.Availability)}`,
    `Notes: ${safe(r.Notes)}`
  ].join("\n");
  MailApp.sendEmail(to, subject, body);
}

/** Utility helpers */
function safe(v) {
  if (Array.isArray(v)) return v[0] || "";
  return v || "";
}
function jsonOut(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

// ====== Deployment Instructions ======
// 1) In your Google Sheet: Extensions -> Apps Script. Paste this code as Code.gs.
// 2) Top-right: Deploy -> New deployment -> Type: Web app.
// 3) Execute as: Me. Who has access: Anyone. Click Deploy and Authorize.
// 4) Copy the Web App URL (use it as the Glide "Call webhook" URL).
// 5) In Glide, create a button or form On Submit -> Add action -> Call webhook.
//    For emails, send JSON like:
//    {
//      "type": "email",
//      "to": "you@example.com",
//      "subject": "New Volunteer: [Name]",
//      "body": "Name: [Name]\\nEmail: [Email]\\nRole: [Preferred Role]"
//    }
//    For adding media coverage from a URL, send JSON like:
//    {
//      "type": "addCoverage",
//      "url": "[Article_URL]"
//    }
