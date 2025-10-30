# 🤝 Contributing to GroundWire

Thank you for your interest in improving **GroundWire: Student Voices for Loudoun**!  
This project demonstrates how students can use technology for civic engagement and transparency.  

---

## 🧭 How to Contribute

### 1. Clone or Fork this Repository
```bash
git clone https://github.com/<yourusername>/groundwire.git
cd groundwire
```

### 2. Set Up Google Sheets and Glide
- Open the `powerlines-10-29.xlsx` file or import the data into **Google Sheets**.
- Connect the Google Sheet to **Glide** ([https://glideapps.com](https://glideapps.com)).
- Verify tabs like `About`, `Alerts`, `Officials`, `Volunteer Sign-Up`, and `Media Coverage`.

### 3. Deploy Apps Script (for Automation)
1. In Google Sheets → **Extensions → Apps Script**.  
2. Paste the contents of [`apps_script_code.gs`](apps_script_code.gs).  
3. Deploy it as a **Web App**:  
   - Execute as: *Me*  
   - Who has access: *Anyone*  
4. Copy the **Web App URL** and use it in Glide's **"Call Webhook"** action.

### 4. Test Features
- Submit the volunteer form → verify instant email.  
- Add a news article link → confirm it appears in the `Media Coverage` tab automatically.  
- Ensure all data syncs live with Glide.

### 5. Make Changes
If you add new features (e.g., dashboard, multiple projects), please:
- Comment your changes clearly in the script.  
- Follow formatting in `glide_formulas.md`.  
- Test before submitting a pull request.

### 6. Submit a Pull Request
- Create a new branch for your feature or fix.  
- Commit descriptive messages.  
- Open a pull request explaining your improvement or bug fix.

---

## 💡 Guidelines
- Be respectful of community-driven contributions.  
- Avoid committing personal or private data (emails, phone numbers).  
- Keep Glide and Google Sheets URLs public-read-only when sharing examples.  
- Use meaningful variable names and add short docstrings for new scripts.

---

## 🧠 Future Ideas
If you'd like to contribute, consider:
- Adding charts for petition and volunteer analytics.  
- Translating the app into multiple languages.  
- Integrating map views of affected communities.  
- Creating educational resources for students learning civic engagement tech.

---

### 🙌 Acknowledgments
Built for the **2025 Congressional App Challenge** by [Your Name], Rock Ridge High School / AET, Loudoun County, VA.

