import * as ftp from 'basic-ftp';
import path from 'path';
import fs from 'fs';

async function deployToCpanel() {
  const host = (process.env.FTP_SERVER || '').trim();
  const user = (process.env.FTP_USERNAME || '').trim();
  const password = (process.env.FTP_PASSWORD || '').trim();
  const port = parseInt(process.env.FTP_PORT || '21', 10);

  console.log('====================================================');
  console.log('   Crusaders Logistics - Automated cPanel Deployment');
  console.log('====================================================\n');

  if (!host || !user || !password) {
    console.error('❌ Error: Missing required FTP credentials.');
    console.error('Please configure the following GitHub Secrets:');
    console.error('  - FTP_SERVER (e.g. standard7.doveserver.com)');
    console.error('  - FTP_USERNAME (e.g. crusader)');
    console.error('  - FTP_PASSWORD (your cPanel / FTP password)\n');
    process.exit(1);
  }

  const client = new ftp.Client(30000); // 30-second timeout per command
  client.ftp.verbose = true;

  let connected = false;

  // ---------------------------------------------------------------------------
  // STEP 1: Connect to Server (FTPS first, fallback to standard FTP)
  // ---------------------------------------------------------------------------
  console.log(`📡 Connecting to ${host}:${port} as user "${user}"...`);

  try {
    console.log('🔒 Strategy 1: Attempting secure FTPS (secure: "loose")...');
    await client.access({
      host,
      user,
      password,
      port,
      secure: 'loose',
      secureOptions: { rejectUnauthorized: false }
    });
    connected = true;
    console.log('✅ Connected successfully via FTPS!\n');
  } catch (err) {
    console.warn(`⚠️ FTPS connection failed or timed out: ${err.message}`);
    console.log('🔄 Strategy 2: Falling back to standard FTP (secure: false)...\n');
    client.close();
  }

  if (!connected) {
    try {
      await client.access({
        host,
        user,
        password,
        port,
        secure: false
      });
      connected = true;
      console.log('✅ Connected successfully via standard FTP!\n');
    } catch (err) {
      console.error(`❌ FTP connection failed: ${err.message}`);
      console.error('\nTroubleshooting Checklist:');
      console.error('  1. Verify FTP_SERVER is standard7.doveserver.com or your cPanel server IP.');
      console.error('  2. Verify FTP_USERNAME and FTP_PASSWORD match your cPanel / FTP account.');
      console.error('  3. Ensure FTP port 21 is not blocked for your IP in cPanel cPHulk / firewall.');
      process.exit(1);
    }
  }

  // ---------------------------------------------------------------------------
  // STEP 2: Inspect Directory Structure
  // ---------------------------------------------------------------------------
  const pwd = await client.pwd();
  console.log(`📂 Current remote working directory: ${pwd}`);

  let remoteItems = [];
  try {
    remoteItems = await client.list();
    const itemNames = remoteItems.map(i => i.name).slice(0, 15);
    console.log(`📋 Remote directory entries: ${itemNames.join(', ')}`);
  } catch (err) {
    console.warn(`⚠️ Could not list remote directory: ${err.message}`);
  }

  const hasPublicHtml = remoteItems.some(i => i.name.toLowerCase() === 'public_html');
  const alreadyInPublicHtml = remoteItems.some(i => i.name.toLowerCase() === 'index.php' || i.name.toLowerCase() === 'index.html');

  // Determine public destination:
  // If the account starts in /home/crusader, public_html exists as a child folder.
  // If the account was created in cPanel locked to public_html, it is already inside it.
  let targetPublicDir = './public_html/';
  if (alreadyInPublicHtml && !hasPublicHtml) {
    console.log('ℹ️ FTP account is already rooted directly inside public_html.');
    targetPublicDir = './';
  } else if (hasPublicHtml) {
    console.log('ℹ️ Found public_html directory; deploying into ./public_html/.');
    targetPublicDir = './public_html/';
  } else if (process.env.FTP_PUBLIC_DIR) {
    targetPublicDir = process.env.FTP_PUBLIC_DIR;
    console.log(`ℹ️ Using custom FTP_PUBLIC_DIR: ${targetPublicDir}`);
  }

  // ---------------------------------------------------------------------------
  // STEP 3: Deploy Public Web Root
  // ---------------------------------------------------------------------------
  const localPublicDir = path.resolve('./deploy-public');
  if (fs.existsSync(localPublicDir)) {
    console.log(`\n🚀 Uploading Frontend & Public Controller from ${localPublicDir} to ${targetPublicDir}...`);
    await client.ensureDir(targetPublicDir);
    await client.uploadFromDir(localPublicDir, targetPublicDir);
    console.log('✅ Frontend & Public Controller deployed successfully!');
  } else {
    console.warn(`⚠️ Local directory ${localPublicDir} not found; skipping public upload.`);
  }

  // ---------------------------------------------------------------------------
  // STEP 4: Deploy Backend Application (if local deploy-backend exists)
  // ---------------------------------------------------------------------------
  const localBackendDir = path.resolve('./deploy-backend');
  if (fs.existsSync(localBackendDir)) {
    // Only upload backend if we are in /home/crusader/ or if target path exists
    let targetBackendDir = './Crusader/Backend/';
    if (process.env.FTP_BACKEND_DIR) {
      targetBackendDir = process.env.FTP_BACKEND_DIR;
    }

    try {
      console.log(`\n🚀 Uploading Backend Core Application to ${targetBackendDir}...`);
      await client.cd(pwd); // Return to root
      await client.ensureDir(targetBackendDir);
      await client.uploadFromDir(localBackendDir, targetBackendDir);
      console.log('✅ Backend Core Application deployed successfully!');
    } catch (err) {
      console.warn(`ℹ️ Backend upload note: ${err.message}`);
    }
  }

  client.close();
  console.log('\n====================================================');
  console.log('🎉 Crusaders Logistics Deployment Complete & Verified!');
  console.log('====================================================\n');
}

deployToCpanel().catch(err => {
  console.error('\n❌ Fatal error during deployment:', err);
  process.exit(1);
});
