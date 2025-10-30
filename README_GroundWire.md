# 🌎 GroundWire: Student Voices for Loudoun

**A student-built civic engagement app helping Loudoun County residents take action on the Dominion Energy Golden-to-Mars 500 kV transmission line project — and future infrastructure developments.**

🔗 **Live App:** [https://groundwirestudenthub.glide.page](https://groundwirestudenthub.glide.page)

---

## 📱 Overview
GroundWire is a no-code / low-code civic-tech app built with **Glide**, **Google Sheets**, and **Google Apps Script**.  
It helps residents:
- Track SCC alerts, hearings, and comment deadlines  
- View environmental & economic reasons to underground power lines  
- Contact elected officials directly  
- Volunteer & sign petitions  
- Explore verified media coverage about the Golden-to-Mars project  

---

## ⚙️ Architecture

| Layer | Purpose |
|-------|----------|
| **Glide App** | Front-end user interface (cards, lists, forms, actions) |
| **Google Sheets** | Live data store (tabs = tables → About, Alerts, Take Action, Officials, Volunteers, Media Coverage) |
| **Google Apps Script** | Handles webhooks for email + media-coverage automation |
| **Glide JavaScript Columns** | Generate thumbnails and format data (e.g., image URLs) |

---

## 🧩 Behind the Scenes

### 🔹 1. Data Structure
- Tabs: `About`, `Alerts`, `Officials`, `Volunteer Sign-Up`, `Media Coverage`
- Key columns:  
  `Order`, `Category`, `Image_URL`, `Contact_Link`, `Pinned`, `Level`
- Relations & Lookups link officials to their government levels (county, state, federal).

### 🔹 2. JavaScript Column Example
Automatically convert shared links into display-ready images.

```js
function imageUrl(url) {
  if (!url) return "";
  const yt = url.match(/(?:v=|youtu\.be\/)([A-Za-z0-9_-]{11})/);
  if (yt) return `https://img.youtube.com/vi/${yt[1]}/hqdefault.jpg`;
  const fb = url.match(/(?:v=|\/videos\/|video_id=|story_fbid=)(\d+)/);
  if (fb) return `https://graph.facebook.com/${fb[1]}/picture?width=1200`;
  const gd = url.match(/\/d\/(?:[-\w]{25,})|[?&]id=([-\w]{25,})/);
  if (gd) return `https://drive.google.com/uc?export=view&id=${gd[1]||gd[2]}`;
  return "";
}
```

This keeps cards colorful and visual in Glide’s grid view.

---

## 📧 Instant Email Notifications (Apps Script)

### `Code.gs`
```javascript
function doPost(e) {
  const data = JSON.parse(e.postData.contents || "{}");

  // 1️⃣ Send Email
  if (data.type === "email") {
    MailApp.sendEmail({
      to: data.to,
      subject: data.subject,
      body: data.body
    });
    return ContentService.createTextOutput("ok");
  }

  // 2️⃣ Add Media Coverage
  if (data.type === "addCoverage" && data.url) {
    const html = UrlFetchApp.fetch(data.url).getContentText();
    const getOG = prop => {
      const m = html.match(
        new RegExp(`<meta[^>]+property=["']og:${prop}["'][^>]+content=["']([^"']+)["']`, "i")
      );
      return m ? m[1] : "";
    };
    const title = getOG("title") || html.match(/<title[^>]*>([^<]+)<\/title>/i)?.[1];
    const desc  = getOG("description") || "";
    const image = getOG("image") || "";
    const src   = (data.url.match(/^https?:\/\/([^/]+)/i)?.[1] || "").replace(/^www\./,"");
    const sh    = SpreadsheetApp.getActive().getSheetByName("Media Coverage");
    sh.appendRow([new Date(), title, src, data.url, image, desc]);
    return ContentService.createTextOutput("added");
  }
}
```

### Glide → Webhook Example
- URL: *your deployed Apps Script web-app URL*  
- JSON:
```json
{
  "type": "email",
  "to": "you@example.com",
  "subject": "New Volunteer Signup",
  "body": "Name: [Name]\nEmail: [Email]\nRole: [Preferred Role]"
}
```

---

## 📰 Adding Media Coverage Automatically

When a URL is submitted through Glide:
1. `doPost()` fetches HTML.  
2. Parses **Open Graph** meta tags (`og:title`, `og:description`, `og:image`).  
3. Appends a new row to `Media Coverage` with title, source, date, and image.  
4. Glide displays it instantly as a new card.

---

## 💡 Example Workflow

1. **Volunteer submits** form in app  
   → Glide triggers webhook → Apps Script → immediate email to admin.  
2. **Student adds** a news link in “Media Coverage” tab  
   → Apps Script fetches page → auto-fills title + thumbnail → new card appears in app.

---

## 🛡️ Privacy & Security
- Public data only; no personal emails shown in the app.  
- Volunteer emails stored privately in Sheets.  
- No third-party analytics or cookies.

---

## 🧠 Future Improvements (Version 2.0)
- Push notifications for new SCC filings  
- Data-visualization dashboard (petition growth, volunteer count)  
- Language translation & accessibility support  
- Integration for multiple infrastructure projects (not just Golden-to-Mars)

---

## 🧾 License
MIT License — free to use, adapt, and extend for civic-tech or educational purposes.

---

### 👩‍💻 Author
**[Your Name]**, 10th Grade  
Rock Ridge High School / Academy of Engineering & Technology, VA  
📧 Contact: [your email (optional)]  

---

### 🏛️ Congressional App Challenge 2025
> This repository is part of my submission for the **Congressional App Challenge 2025**, showcasing how students can use low-code tools and automation to empower civic engagement in their communities.
