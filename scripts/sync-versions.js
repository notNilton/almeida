const fs = require('fs');
const path = require('path');

const rootPackage = require('../package.json');
const version = rootPackage.version;

const apps = [
  'apps/back-end/package.json',
  'apps/back-office/package.json'
];

apps.forEach(appPath => {
  const fullPath = path.resolve(__dirname, '..', appPath);
  if (fs.existsSync(fullPath)) {
    const appPackage = require(fullPath);
    appPackage.version = version;
    fs.writeFileSync(fullPath, JSON.stringify(appPackage, null, 2) + '\n');
    console.log(`Updated ${appPath} to version ${version}`);
  } else {
    console.error(`File not found: ${appPath}`);
  }
});
