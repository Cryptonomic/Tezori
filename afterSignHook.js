const fs = require('fs');
const path = require('path');
const electronNotarize = require('electron-notarize');

module.exports = async function(params) {
  if (process.platform !== 'darwin') {
    return;
  }

  console.log('afterSign hook triggered', params);

  const appId = 'tech.galleon-wallet.galleon';
  const packagePath = path.join(
    params.appOutDir,
    `${params.packager.appInfo.productFilename}.app`
  );

  if (!fs.existsSync(packagePath)) {
    throw new Error(`Cannot find application at: ${packagePath}`);
  }

  try {
    console.log(`Notarizing ${appId} at ${packagePath}`);
    await electronNotarize.notarize({
      appBundleId: appId,
      appPath: packagePath,
      appleId: process.env.APPLE_NOTARIZATION_ID,
      appleIdPassword: process.env.APPLE_NOTARIZATION_PASSWORD
    });
    console.log(`Notarization completed`);
  } catch (error) {
    console.error('Notarization failed', error);
  }
};
