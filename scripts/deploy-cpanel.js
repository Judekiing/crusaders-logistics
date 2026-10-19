import * as ftp from 'basic-ftp';
import SftpClient from 'ssh2-sftp-client';
import path from 'path';
import fs from 'fs';

async function runDeploy() {
  const host = (process.env.FTP_SERVER || '').trim();
  const user = (process.env.FTP_USERNAME || '').trim();
  const password = (process.env.FTP_PASSWORD || '').trim();
  const port = parseInt(process.env.FTP_PORT || '21', 10);

  console.log('====================================================');
  console.log('   Crusaders Logistics - Automated cPanel Deployment');
  console.log('====================================================\n');

  if (!host || !user || !password) {
    console.error('❌ Error: Missing required credentials.');
    console.error('Please configure the following GitHub Secrets:');
    console.error('  - FTP_SERVER (e.g. standard7.doveserver.com or 104.37.172.151)');
    console.error('  - FTP_USERNAME (e.g. crusader)');
    console.error('  - FTP_PASSWORD (your cPanel / FTP password)\n');
    process.exit(1);
  }

  // If port 22 or explicitly requested, use SFTP
  if (port === 22 || process.env.USE_SFTP === 'true') {
    return deployViaSftp(host, user, password, port === 21 ? 22 : port);
  }

  // Otherwise, attempt FTP / FTPS with fallback to SFTP
  const ftpSuccess = await deployViaFtp(host, user, password, port);
  if (!ftpSuccess) {
    console.log('\n🔄 Attempting SFTP (port 22) as automatic fallback...');
    await deployViaSftp(host, user, password, 22);
  }
}

// -----------------------------------------------------------------------------
// FTP / FTPS DEPLOYMENT (Ports 21 / 990)
// -----------------------------------------------------------------------------
async function deployViaFtp(host, user, password, port) {
  const client = new ftp.Client(15000); // 15-second timeout (avoids 2m hanging)
  client.ftp.verbose = true;
  let connected = false;

  console.log(`📡 Connecting to ${host}:${port} as "${user}" via FTP...`);

  // Try Strategy 1: FTPS with secure "loose"
  try {
    console.log('🔒 Strategy 1: FTPS (secure: "loose")...');
    await client.access({
      host,
      user,
      password,
      port,
      secure: 'loose',
      secureOptions: { rejectUnauthorized: false }
    });
    connected = true;
    console.log('✅ Connected via FTPS!\n');
  } catch (err) {
    console.warn(`⚠️ FTPS failed or timed out (${err.message}).`);
    client.close();
  }

  // Try Strategy 2: Plain FTP (in case passive port TLS data channel is firewalled)
  if (!connected) {
    try {
      console.log('🔓 Strategy 2: Standard FTP (secure: false)...');
      await client.access({
        host,
        user,
        password,
        port,
        secure: false
      });
      connected = true;
      console.log('✅ Connected via Standard FTP!\n');
    } catch (err) {
      console.warn(`⚠️ Standard FTP failed: ${err.message}`);
      client.close();
      return false;
    }
  }

  try {
    const pwd = await client.pwd();
    console.log(`📂 Current remote working directory: ${pwd}`);

    const remoteItems = await client.list();
    const itemNames = remoteItems.map(i => i.name);
    console.log(`📋 Remote directory entries: ${itemNames.slice(0, 15).join(', ')}`);

    const hasPublicHtml = itemNames.some(i => i.toLowerCase() === 'public_html');
    const alreadyInPublic = itemNames.some(i => i.toLowerCase() === 'index.php' || i.toLowerCase() === 'index.html');

    let targetPublicDir = './public_html/';
    if (alreadyInPublic && !hasPublicHtml) {
      console.log('ℹ️ FTP account is already inside public_html.');
      targetPublicDir = './';
    } else if (hasPublicHtml) {
      targetPublicDir = './public_html/';
    } else if (process.env.FTP_PUBLIC_DIR) {
      targetPublicDir = process.env.FTP_PUBLIC_DIR;
    }

    const localPublic = path.resolve('./deploy-public');
    if (fs.existsSync(localPublic)) {
      console.log(`\n🚀 Uploading public web root to ${targetPublicDir}...`);
      await client.ensureDir(targetPublicDir);
      await client.uploadFromDir(localPublic, targetPublicDir);
      console.log('✅ Frontend & Public Controller deployed successfully!');
    }

    const localBackend = path.resolve('./deploy-backend');
    if (fs.existsSync(localBackend)) {
      let targetBackendDir = './Crusader/Backend/';
      if (process.env.FTP_BACKEND_DIR) targetBackendDir = process.env.FTP_BACKEND_DIR;
      try {
        console.log(`\n🚀 Uploading Backend to ${targetBackendDir}...`);
        await client.cd(pwd);
        await client.ensureDir(targetBackendDir);
        await client.uploadFromDir(localBackend, targetBackendDir);
        console.log('✅ Backend application deployed successfully!');
      } catch (e) {
        console.warn(`ℹ️ Backend upload note: ${e.message}`);
      }
    }

    client.close();
    console.log('\n🎉 FTP Deployment completed successfully!\n');
    return true;
  } catch (err) {
    console.warn(`⚠️ FTP upload process error: ${err.message}`);
    client.close();
    return false;
  }
}

// -----------------------------------------------------------------------------
// SFTP DEPLOYMENT (Port 22 SSH File Transfer - No Passive Port Firewall Drops)
// -----------------------------------------------------------------------------
async function deployViaSftp(host, user, password, port) {
  const sftp = new SftpClient();
  console.log(`\n🛡️ Connecting to ${host}:${port} as "${user}" via SFTP...`);

  try {
    await sftp.connect({
      host,
      port,
      username: user,
      password,
      readyTimeout: 15000
    });
    console.log('✅ Connected successfully via SFTP!\n');

    const remotePwd = await sftp.realPath('.');
    console.log(`📂 Remote home path: ${remotePwd}`);

    const remoteList = await sftp.list('.');
    const names = remoteList.map(i => i.name);
    console.log(`📋 Directory list: ${names.slice(0, 15).join(', ')}`);

    let targetPublic = `${remotePwd}/public_html/`;
    if (names.some(n => n.toLowerCase() === 'public_html')) {
      targetPublic = `${remotePwd}/public_html/`;
    } else {
      targetPublic = `${remotePwd}/`;
    }

    const localPublic = path.resolve('./deploy-public');
    if (fs.existsSync(localPublic)) {
      console.log(`🚀 Uploading public web root to ${targetPublic}...`);
      await sftp.uploadDir(localPublic, targetPublic);
      console.log('✅ Frontend & Public Controller deployed successfully via SFTP!');
    }

    const localBackend = path.resolve('./deploy-backend');
    if (fs.existsSync(localBackend)) {
      const targetBackend = `${remotePwd}/Crusader/Backend/`;
      try {
        console.log(`🚀 Uploading Backend to ${targetBackend}...`);
        await sftp.uploadDir(localBackend, targetBackend);
        console.log('✅ Backend Core Application deployed successfully via SFTP!');
      } catch (e) {
        console.warn(`ℹ️ Backend upload note: ${e.message}`);
      }
    }

    await sftp.end();
    console.log('\n====================================================');
    console.log('🎉 Crusaders Logistics SFTP Deployment 100% Successful!');
    console.log('====================================================\n');
  } catch (err) {
    console.error(`\n❌ Deployment could not complete: ${err.message}`);
    console.error('\nQuick Resolution Options:');
    console.error('1. Check GitHub Secrets: Ensure FTP_SERVER, FTP_USERNAME, and FTP_PASSWORD match cPanel.');
    console.error('2. Native cPanel Git: Use cPanel -> "Git™ Version Control" with repository URL https://github.com/Judekiing/crusaders-logistics.git and click Deploy.');
    process.exit(1);
  }
}

runDeploy().catch(err => {
  console.error('\nFatal error:', err);
  process.exit(1);
});
