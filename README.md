# 📘 Facebook Page Auto Poster

🚀 Automated Facebook Page publishing system built with **Google Apps Script**, **Google Sheets**, **Google Drive**, and the **Facebook Graph API**.

This system reads queued posts from Google Sheets, prepares the content, optionally retrieves images from Google Drive, publishes posts to a Facebook Page, and updates the publishing status automatically.

---

## ✨ Features

- 📤 Automated Facebook Page posting
- ⏰ Daily scheduled publishing
- 📊 Google Sheets content queue
- 🖼️ Optional Google Drive images
- 🔗 Automatic GitHub project link
- 🌐 Automatic portfolio link
- 🔐 Facebook Page access-token validation
- 📌 Publishing status tracking
- 🕒 Published timestamp tracking
- ⚠️ Failed-post handling
- 🔒 Script Lock protection
- 📝 Text and image posts

---

## 🔄 Workflow

```text
📊 Google Sheet
      ↓
🔎 Find Next Unpublished Post
      ↓
📝 Prepare Post Content
      ├── 🔗 GitHub Link
      ├── 🌐 Portfolio Link
      └── 🖼️ Optional Drive Image
      ↓
📡 Facebook Graph API
      ↓
📘 Facebook Page
      ↓
📊 Update Google Sheet
      ├── ✅ Published
      └── ❌ Failed
```

---

## 📊 Google Sheet Structure

The script automatically searches for the following header names:

| Header | Purpose |
|---|---|
| 📝 Post Content | Main Facebook post content |
| 🔗 GitHub Link | Project/repository URL |
| 🖼️ Image Link | Google Drive image URL |
| 📌 Facebook Status | Publishing status |
| 🕒 Published At | Publication date and time |
| 📁 Repo | Optional repository/reference |
| 🔢 Serial | Optional post serial number |

---

## ⚙️ Configuration

The project uses Google Apps Script Script Properties for secure configuration.

Required properties:

```text
FB_PAGE_ID=your_facebook_page_id
FB_PAGE_ACCESS_TOKEN=your_page_access_token
FACEBOOK_POSTS_SPREADSHEET_ID=your_google_spreadsheet_id
```

⚠️ **Never put real values inside `Code.gs`.**

---

## ⏰ Scheduling

The project supports automated daily publishing through an Apps Script time-based trigger.

### Create Daily Trigger

```text
setupDailyFacebookTrigger()
```

### Remove Daily Trigger

```text
removeDailyFacebookTrigger()
```

The current trigger is configured to run around **2 PM** according to the Apps Script project's timezone.

---

## 🧪 Testing

### 🔍 Check Facebook Authorization

Run:

```text
checkFacebookAuthorization()
```

This checks whether the configured Facebook Page Access Token can access the Page.

### 📤 Test Facebook Post

Run:

```text
testFacebookPost()
```

This publishes a test post to the Facebook Page.

---

## 🛠️ Main Functions

| Function | Purpose |
|---|---|
| 🆔 `getFacebookPageId_()` | Reads the Facebook Page ID |
| 🔑 `getFacebookAccessToken_()` | Reads the Facebook Page Access Token |
| ✅ `hasValidFacebookAccessToken_()` | Validates Facebook Page access |
| 🔍 `checkFacebookAuthorization()` | Manually checks authorization |
| 🆔 `getDriveFileIdFromUrl_()` | Extracts a Google Drive file ID |
| 🖼️ `getImageBlobFromDrive_()` | Retrieves an image from Google Drive |
| 📤 `postToFacebookPage_()` | Publishes text or image posts |
| 🧪 `testFacebookPost()` | Publishes a test post |
| ⏰ `setupDailyFacebookTrigger()` | Creates the daily publishing trigger |
| 🗑️ `removeDailyFacebookTrigger()` | Removes the publishing trigger |
| 🚀 `publishNextFacebookPost()` | Publishes the next queued post |

---

## 💻 Tech Stack

- 🟨 Google Apps Script
- 💛 JavaScript
- 📊 Google Sheets
- 📁 Google Drive
- 📘 Facebook Graph API
- 📄 Facebook Pages
- 🔐 Apps Script Script Properties
- ⏰ Apps Script Time-based Triggers

---

## 🚀 Project Implementation

Built to automate Facebook Page publishing using **Google Apps Script, Google Sheets, Google Drive, and the Facebook Graph API**.

The system provides a spreadsheet-based content queue, automated publishing, optional image handling, status tracking, and scheduled Facebook Page posting.

👉 [View / Download Apps Script Code](Code.gs)

---

## 👨‍💻 Author

**Faheem Abbas**

🤖 AI Automation Specialist | ⚙️ n8n Expert | 🧠 AI Agents | 🚀 AI-Powered Business Automation | 🎯 Lead Generation | 🔗 API Integrations | 📞 Calling Agents

### 📩 Contact

For custom implementation or commercial use, please contact me:

<br>

<a href="https://wa.me/923002120566">
  <img src="https://img.shields.io/badge/WhatsApp-25D366?style=for-the-badge&logo=whatsapp&logoColor=white" alt="WhatsApp">
</a>

<a href="https://www.linkedin.com/in/faheem-abbas-ai-automation-specialist/">
  <img src="https://img.shields.io/badge/LinkedIn-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white" alt="LinkedIn">
</a>

<a href="mailto:info.bluemoonways@gmail.com">
  <img src="https://img.shields.io/badge/Gmail-D14836?style=for-the-badge&logo=gmail&logoColor=white" alt="Gmail">
</a>

<br><br>

