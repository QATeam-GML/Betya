const fs = require('fs');
const path = require('path');

const metaDir = path.resolve('.allure-meta');
const resultsDir = path.resolve('allure-results');
const reportDir = path.resolve('allure-report');

// Ensure allure-results exists
if (!fs.existsSync(resultsDir)) {
  fs.mkdirSync(resultsDir, { recursive: true });
}

// Ensure .allure-meta exists
if (!fs.existsSync(metaDir)) {
  fs.mkdirSync(metaDir, { recursive: true });
}

// ---------- COPY METADATA → allure-results ----------
const files = [
  'environment.properties',
  'executor.json',
  'categories.json'
];

files.forEach(file => {
  const src = path.join(metaDir, file);
  const dest = path.join(resultsDir, file);

  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dest);
    console.log(`✔ Copied: ${file}`);
  }
});

// ---------- COPY HISTORY → allure-results ----------
const historySrc = path.join(metaDir, 'history');
const historyDest = path.join(resultsDir, 'history');

if (fs.existsSync(historySrc)) {
  fs.cpSync(historySrc, historyDest, { recursive: true });
  console.log('✔ Copied folder: history');
}

// ---------- AFTER REPORT: SAVE HISTORY BACK ----------
process.on('exit', () => {
  const reportHistory = path.join(reportDir, 'history');
  const metaHistory = path.join(metaDir, 'history');

  if (fs.existsSync(reportHistory)) {
    fs.cpSync(reportHistory, metaHistory, { recursive: true });
    console.log('✔ History saved back to .allure-meta');
  }
});
