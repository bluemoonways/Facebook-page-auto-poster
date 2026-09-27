# Facebook Page Auto Poster

Automated Facebook Page publishing system built with **Google Apps Script**, **Google Sheets**, **Google Drive**, and the **Facebook Graph API**.

## Features

- Automated Facebook Page posting
- Daily scheduled publishing
- Google Sheets content queue
- Optional Google Drive images
- Automatic GitHub project link
- Automatic portfolio link
- Facebook Page access-token validation
- Publishing status tracking
- Published timestamp tracking
- Failed-post handling
- Script Lock protection
- Text and image posts

## Workflow

```text
Google Sheet
     ↓
Find next unpublished post
     ↓
Prepare content
     ├── GitHub Link
     ├── Portfolio Link
     └── Optional Drive Image
     ↓
Facebook Graph API
     ↓
Facebook Page
     ↓
Update Sheet
Published / Failed
```

## Google Sheet Headers

The script searches for these header names:

| Header | Purpose |
|---|---|
| Post Content | Main Facebook post |
| GitHub Link | Project/repository URL |
| Image Link | Google Drive image URL |
| Facebook Status | Publishing status |
| Published At | Publication date/time |
| Repo | Optional repository/reference |
| Serial | Optional serial number |

## Required Script Properties

The public-safe version keeps private configuration out of the GitHub repository.

In Google Apps Script:

**Project Settings → Script Properties**

Add:

```text
FB_PAGE_ID=your_facebook_page_id
FB_PAGE_ACCESS_TOKEN=your_page_access_token
FACEBOOK_POSTS_SPREADSHEET_ID=your_google_spreadsheet_id
```

Do not put real values in `Code.gs`.

## Security

Never commit:

- Facebook Page Access Tokens
- API keys
- Passwords
- OAuth secrets
- Private Google credentials
- Service-account files
- Private spreadsheet IDs

The public version reads Facebook credentials and the Google Spreadsheet ID from Apps Script Script Properties.

## Portfolio

The script currently appends the following public portfolio URL to posts:

```text
https://bluemoonways.vercel.app/
```

Update the URL in `Code.gs` if your portfolio changes.

## Scheduling

Run:

```text
setupDailyFacebookTrigger()
```

to create the daily publishing trigger.

Run:

```text
removeDailyFacebookTrigger()
```

to remove it.

## Testing

Check Facebook authorization:

```text
checkFacebookAuthorization()
```

Test a Facebook post:

```text
testFacebookPost()
```

## Main Functions

- `getFacebookPageId_()` — reads the Facebook Page ID
- `getFacebookAccessToken_()` — reads the Page Access Token
- `hasValidFacebookAccessToken_()` — validates Page access
- `checkFacebookAuthorization()` — manual authorization check
- `getDriveFileIdFromUrl_()` — extracts a Drive file ID
- `getImageBlobFromDrive_()` — retrieves a Drive image
- `postToFacebookPage_()` — publishes a text/image post
- `testFacebookPost()` — publishes a test post
- `setupDailyFacebookTrigger()` — creates daily publishing
- `removeDailyFacebookTrigger()` — removes the publishing trigger
- `publishNextFacebookPost()` — publishes the next queued post

## Tech Stack

- Google Apps Script
- JavaScript
- Google Sheets
- Google Drive
- Facebook Graph API
- Facebook Pages
- Apps Script Script Properties
- Apps Script Time-based Triggers

## Author

**Faheem Abbas**

AI Automation | n8n | Workflow Automation | Google Apps Script
