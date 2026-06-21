// =============================================
// CEDRICK'S PORTFOLIO GUESTBOOK - APPS SCRIPT
// =============================================
// HOW TO DEPLOY:
// 1. Go to https://script.google.com
// 2. Click "New Project"
// 3. Paste this entire file in
// 4. Click "Deploy" > "New Deployment"
// 5. Type: Web App
// 6. Execute as: Me
// 7. Who has access: Anyone
// 8. Click Deploy, copy the URL
// 9. Paste the URL into script.js where it says YOUR_APPS_SCRIPT_URL_HERE
//
// ⚠️  AFTER EDITING THIS FILE, ALWAYS:
//     Deploy → Manage Deployments → Edit → New Version → Deploy
//     (just re-deploying is not enough — you must bump the version)
// =============================================

const SHEET_NAME = 'Guestbook';

function getSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow(['Date', 'Name', 'From', 'Message']);
    sheet.setFrozenRows(1);
  }
  return sheet;
}

// READ — supports JSONP via ?callback=xxx to bypass CORS
function doGet(e) {
  const sheet    = getSheet();
  const rows     = sheet.getDataRange().getValues();
  const callback = e.parameter.callback;

  const entries = rows.slice(1).reverse().map(row => ({
    date:    row[0] ? Utilities.formatDate(new Date(row[0]), Session.getScriptTimeZone(), 'MMM d, yyyy') : '',
    name:    row[1] || '',
    from:    row[2] || '',
    message: row[3] || ''
  }));

  const json = JSON.stringify(entries);

  // If a callback name is provided, wrap in JSONP
  if (callback) {
    return ContentService
      .createTextOutput(callback + '(' + json + ')')
      .setMimeType(ContentService.MimeType.JAVASCRIPT);
  }

  // Plain JSON fallback
  return ContentService
    .createTextOutput(json)
    .setMimeType(ContentService.MimeType.JSON);
}

// WRITE — POST from portfolio uses no-cors so no response body needed
function doPost(e) {
  try {
    const data    = JSON.parse(e.postData.contents);
    const name    = (data.name    || '').toString().slice(0, 40).trim();
    const from    = (data.from    || '').toString().slice(0, 40).trim();
    const message = (data.message || '').toString().slice(0, 280).trim();

    if (!name || !message) return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: 'missing fields' }))
      .setMimeType(ContentService.MimeType.JSON);

    getSheet().appendRow([new Date(), name, from, message]);

    return ContentService
      .createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch(err) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}