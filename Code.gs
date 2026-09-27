/**
 * ==========================================
 * FACEBOOK PAGE POSTING - GOOGLE APPS SCRIPT
 * ==========================================
 */

const FB_GRAPH_VERSION_ = 'v19.0';


/**
 * Get Facebook Page ID from Script Properties
 */
function getFacebookPageId_() {
  const props = PropertiesService.getScriptProperties();
  const pageId = props.getProperty('FB_PAGE_ID');

  if (!pageId) {
    throw new Error(
      'FB_PAGE_ID not set in Script Properties.'
    );
  }

  return pageId;
}


/**
 * Get Facebook Page Access Token from Script Properties
 */
function getFacebookAccessToken_() {
  const props = PropertiesService.getScriptProperties();
  const token = props.getProperty('FB_PAGE_ACCESS_TOKEN');

  if (!token) {
    throw new Error(
      'FB_PAGE_ACCESS_TOKEN not set in Script Properties. Please add it first.'
    );
  }

  return token;
}


/**
 * Check whether the Facebook Page access token is usable
 */
function hasValidFacebookAccessToken_() {

  try {

    const pageId = getFacebookPageId_();
    const token = getFacebookAccessToken_();

    const url =
      'https://graph.facebook.com/' +
      FB_GRAPH_VERSION_ +
      '/' +
      pageId +
      '?fields=id,name&access_token=' +
      encodeURIComponent(token);

    const response =
      UrlFetchApp.fetch(url, { muteHttpExceptions: true });

    const statusCode =
      response.getResponseCode();

    if (statusCode !== 200) {
      Logger.log(
        'Facebook token check failed: ' +
        response.getContentText()
      );
    }

    return statusCode === 200;

  } catch (err) {
    Logger.log('Facebook token check error: ' + err);
    return false;
  }
}


/**
 * Check Facebook authorization (manual test function)
 */
function checkFacebookAuthorization() {

  if (hasValidFacebookAccessToken_()) {
    Logger.log('SUCCESS: Facebook Page access token is valid.');
  } else {
    Logger.log('NOT AUTHORIZED / ACCESS TOKEN INVALID.');
  }
}


// ==========================================
// FIXED PORTFOLIO LINK
// ==========================================
const PORTFOLIO_LINK_ = 'https://bluemoonways.vercel.app/';


/**
 * Extract Google Drive file ID from a share link
 */
function getDriveFileIdFromUrl_(url) {

  if (!url) {
    return null;
  }

  const match =
    String(url).match(/\/d\/([a-zA-Z0-9_-]+)/);

  if (match && match[1]) {
    return match[1];
  }

  const altMatch =
    String(url).match(/[?&]id=([a-zA-Z0-9_-]+)/);

  if (altMatch && altMatch[1]) {
    return altMatch[1];
  }

  return null;
}


/**
 * Get image blob from a Google Drive link
 * (tries DriveApp first, falls back to public download URL)
 */
function getImageBlobFromDrive_(driveImageUrl) {

  try {

    const fileId =
      getDriveFileIdFromUrl_(driveImageUrl);

    if (!fileId) {
      Logger.log(
        'Could not extract Drive file ID from: ' + driveImageUrl
      );
      return null;
    }

    let blob = null;

    try {

      const file = DriveApp.getFileById(fileId);
      blob = file.getBlob();

      Logger.log(
        'Image fetched via DriveApp for file ID: ' + fileId
      );

    } catch (driveErr) {

      Logger.log(
        'DriveApp access failed (' + driveErr +
        '), falling back to public download URL.'
      );

      const downloadUrl =
        'https://drive.google.com/uc?export=download&id=' + fileId;

      const downloadResponse =
        UrlFetchApp.fetch(downloadUrl, { muteHttpExceptions: true });

      const downloadStatus =
        downloadResponse.getResponseCode();

      if (downloadStatus !== 200) {
        Logger.log(
          'Public download fallback also failed. HTTP ' +
          downloadStatus + '. Skipping image.'
        );
        return null;
      }

      blob = downloadResponse.getBlob();

      Logger.log(
        'Image fetched via public download URL for file ID: ' + fileId
      );
    }

    return blob;

  } catch (err) {
    Logger.log('Image fetch threw an error, skipping image: ' + err);
    return null;
  }
}


/**
 * Post a message (with optional image) to the Facebook Page
 * Returns the created post ID.
 */
function postToFacebookPage_(message, imageBlob) {

  const pageId = getFacebookPageId_();
  const token = getFacebookAccessToken_();

  let url;
  let payload;

  if (imageBlob) {

    // Photo post -> /photos endpoint
    url =
      'https://graph.facebook.com/' +
      FB_GRAPH_VERSION_ +
      '/' + pageId + '/photos';

    payload = {
      caption: message,
      access_token: token,
      source: imageBlob,
      published: true // <-- Yahan explicitly TRUE pass karein
    };

  } else {

    // Text-only post -> /feed endpoint
    url =
      'https://graph.facebook.com/' +
      FB_GRAPH_VERSION_ +
      '/' + pageId + '/feed';

    payload = {
      message: message,
      access_token: token,
      published: true // <-- Yahan bhi explicitly TRUE pass karein
    };
  }

  const options = {
    method: 'post',
    payload: payload,
    muteHttpExceptions: true
  };

  const response =
    UrlFetchApp.fetch(url, options);

  const statusCode =
    response.getResponseCode();

  const responseText =
    response.getContentText();

  Logger.log('Facebook HTTP Status: ' + statusCode);
  Logger.log('Facebook Response: ' + responseText);

  if (statusCode !== 200) {
    throw new Error(
      'Facebook post failed. HTTP ' +
      statusCode + ': ' + responseText
    );
  }

  const data = JSON.parse(responseText);

  return data.id || data.post_id || '';
}
/**
 * Test Facebook text post
 */
function testFacebookPost() {

  const postId =
    postToFacebookPage_(
      '🚀 Testing my Facebook Page automation with Google Apps Script.\n\n' +
      'This is a test post.',
      null
    );

  Logger.log(
    'SUCCESS: Facebook test post published. Post ID: ' + postId
  );
}


/**
 * Setup a daily trigger for publishNextFacebookPost() at 2 PM
 */
function setupDailyFacebookTrigger() {

  const triggers = ScriptApp.getProjectTriggers();

  triggers.forEach(function(trigger) {
    if (trigger.getHandlerFunction() === 'publishNextFacebookPost') {
      ScriptApp.deleteTrigger(trigger);
    }
  });

  ScriptApp.newTrigger('publishNextFacebookPost')
    .timeBased()
    .atHour(14)
    .everyDays(1)
    .create();

  Logger.log(
    'Daily trigger set: publishNextFacebookPost will run around 2 PM every day.'
  );
}


/**
 * Remove the daily Facebook publishing trigger
 */
function removeDailyFacebookTrigger() {

  const triggers = ScriptApp.getProjectTriggers();
  let removedCount = 0;

  triggers.forEach(function(trigger) {
    if (trigger.getHandlerFunction() === 'publishNextFacebookPost') {
      ScriptApp.deleteTrigger(trigger);
      removedCount++;
    }
  });

  Logger.log(removedCount + ' trigger(s) removed.');
}


/**
 * Publish the next unpublished Facebook post
 *
 * Sheet:
 * D = Post Content
 * E = GitHub Link
 * G = Image Link
 * H = Original status       <-- DO NOT TOUCH
 * I = Facebook Status
 * J = Published At
 */
function publishNextFacebookPost() {

  const lock = LockService.getScriptLock();

  if (!lock.tryLock(30000)) {
    throw new Error(
      'Another Facebook publishing process is already running.'
    );
  }

  try {

    const props = PropertiesService.getScriptProperties();

    const spreadsheetId =
      props.getProperty('FACEBOOK_POSTS_SPREADSHEET_ID');

    if (!spreadsheetId) {
      throw new Error(
        'FACEBOOK_POSTS_SPREADSHEET_ID not set in Script Properties.'
      );
    }

    const sheet =
      SpreadsheetApp.openById(spreadsheetId).getSheets()[0];

    const data = sheet.getDataRange().getValues();

    if (data.length < 2) {
      throw new Error('No posts found in the Google Sheet.');
    }

    const headers = data[0].map(function(header) {
      return String(header).trim().toLowerCase();
    });

    const postContentColumn = headers.indexOf('post content');
    const githubLinkColumn = headers.indexOf('github link');
    const imageLinkColumn = headers.indexOf('image link');
    const facebookStatusColumn = headers.indexOf('facebook status');
    const publishedAtColumn = headers.indexOf('published at');
    const repoColumn = headers.indexOf('repo');
    const serialColumn = headers.indexOf('serial');

    if (postContentColumn === -1) {
      throw new Error('Post Content column was not found.');
    }
    if (githubLinkColumn === -1) {
      throw new Error('GitHub Link column was not found.');
    }
    if (facebookStatusColumn === -1) {
      throw new Error('Facebook Status column was not found.');
    }
    if (publishedAtColumn === -1) {
      throw new Error('Published At column was not found.');
    }

    let targetRow = -1;

    for (let i = 1; i < data.length; i++) {

      const postContent =
        String(data[i][postContentColumn] || '').trim();

      const facebookStatus =
        String(data[i][facebookStatusColumn] || '')
          .trim()
          .toLowerCase();

      if (
        postContent &&
        facebookStatus !== 'published' &&
        facebookStatus !== 'publishing'
      ) {
        targetRow = i + 1;
        break;
      }
    }

    if (targetRow === -1) {
      Logger.log('No unpublished Facebook posts remaining.');
      return;
    }

    const rowData =
      sheet.getRange(targetRow, 1, 1, data[0].length).getValues()[0];

    const postContent =
      String(rowData[postContentColumn] || '').trim();

    const githubLink =
      String(rowData[githubLinkColumn] || '').trim();

    const imageLink =
      imageLinkColumn !== -1
        ? String(rowData[imageLinkColumn] || '').trim()
        : '';

    const serial =
      serialColumn !== -1 ? rowData[serialColumn] : targetRow - 1;

    const repo =
      repoColumn !== -1 ? rowData[repoColumn] : '';

    let finalPostContent = postContent;

    if (githubLink) {
      finalPostContent +=
        '\n\n🔗 View Project:\n' + githubLink;
    }

    finalPostContent +=
      '\n\n🌐 Portfolio:\n' + PORTFOLIO_LINK_;

    Logger.log('====================================');
    Logger.log('Preparing Facebook post');
    Logger.log('Sheet row: ' + targetRow);
    Logger.log('Serial: ' + serial);
    Logger.log('Repo: ' + repo);
    Logger.log('Image Link: ' + (imageLink || 'None'));
    Logger.log('----- FINAL CONTENT START -----');
    Logger.log(finalPostContent);
    Logger.log('----- FINAL CONTENT END -----');
    Logger.log('====================================');

    // Mark as Publishing
    sheet.getRange(targetRow, facebookStatusColumn + 1)
      .setValue('Publishing');
    SpreadsheetApp.flush();

    let imageBlob = null;

    if (imageLink) {
      imageBlob = getImageBlobFromDrive_(imageLink);
    }

    try {

      const postId =
        postToFacebookPage_(finalPostContent, imageBlob);

      sheet.getRange(targetRow, facebookStatusColumn + 1)
        .setValue('Published');

      sheet.getRange(targetRow, publishedAtColumn + 1)
        .setValue(new Date());

      SpreadsheetApp.flush();

      Logger.log(
        'SUCCESS: Post published. Facebook Post ID: ' + postId
      );

    } catch (postErr) {

      sheet.getRange(targetRow, facebookStatusColumn + 1)
        .setValue('Failed');

      SpreadsheetApp.flush();

      throw postErr;
    }

  } finally {
    lock.releaseLock();
  }
}
