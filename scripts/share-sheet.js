/**
 * Share spreadsheet with service account via Drive API
 * 
 * Usage: node scripts/share-sheet.js
 */
const { google } = require('googleapis');
const path = require('path');

async function main() {
  const SPREADSHEET_ID = '1_-3Lh0-NIVkcbvHAbMjT59J4K1bZr1FGKRZrF6NUe7M';
  const KEY_PATH = path.join(__dirname, 'gcp-service-account.json');

  // Auth as service account
  const auth = new google.auth.GoogleAuth({
    keyFile: KEY_PATH,
    scopes: ['https://www.googleapis.com/auth/drive'],
  });

  const drive = google.drive({ version: 'v3', auth });

  // Get service account email
  const client = await auth.getClient();
  const saEmail = (await client.getCredentials()).client_email;
  console.log(`🔑 Service account: ${saEmail}`);

  // Share with service account itself (add permission)
  await drive.permissions.create({
    fileId: SPREADSHEET_ID,
    requestBody: {
      role: 'writer',
      type: 'user',
      emailAddress: saEmail,
    },
    sendNotificationEmail: false,
  });

  console.log(`✅ Shared spreadsheet with ${saEmail} (writer)`);
  console.log(`▶️  Now run: node scripts/push-to-sheet.js`);
}

main().catch(err => {
  if (err.code === 403 && err.message?.includes?.('not have permission')) {
    console.error('❌ Service account cannot share — need to be added as editor first.');
    console.error('   Manual: Buka spreadsheet → Share → tambah sheets@koncolawas.iam.gserviceaccount.com');
  } else {
    console.error(err.message);
  }
});
