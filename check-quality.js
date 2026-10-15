// check-quality.js
// Automated Code Quality Check for the Online Food Ordering System

const fs = require('fs');
const path = require('path');
const vm = require('vm');

console.log('====================================================');
console.log('       STAGE 4: AUTOMATED CODE QUALITY CHECK        ');
console.log('====================================================\n');

let issuesFound = 0;
let checksPassed = 0;

function reportCheck(checkName, passed, details = '') {
  if (passed) {
    checksPassed++;
    console.log(`[PASS] ${checkName}`);
  } else {
    issuesFound++;
    console.error(`[FAIL] ${checkName} -> ${details}`);
  }
}

// Check 1: Verify presence of all required project files
const requiredFiles = [
  'package.json',
  'server.js',
  'src/menuData.js',
  'src/orderCalculator.js',
  'tests/orderCalculator.test.js',
  'Jenkinsfile'
];

console.log('1. Checking Project Structure Integrity...');
requiredFiles.forEach(file => {
  const filePath = path.join(__dirname, file);
  const exists = fs.existsSync(filePath);
  reportCheck(`Required file exists: ${file}`, exists, `Missing file: ${file}`);
});

// Check 2: JavaScript Syntax Check for all source and test files
console.log('\n2. Validating JavaScript Syntax...');
const jsFiles = [
  'server.js',
  'src/menuData.js',
  'src/orderCalculator.js',
  'tests/orderCalculator.test.js'
];

jsFiles.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (!fs.existsSync(filePath)) return;

  try {
    const code = fs.readFileSync(filePath, 'utf8');
    // vm.Script compiles without running the code
    new vm.Script(code, { filename: file });
    reportCheck(`Syntax check clean: ${file}`, true);
  } catch (err) {
    reportCheck(`Syntax check clean: ${file}`, false, err.message);
  }
});

// Check 3: Check for unwanted debugging artifacts (e.g., debugger statements)
console.log('\n3. Scanning for Forbidden Debugging Artifacts...');
jsFiles.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (!fs.existsSync(filePath)) return;

  const code = fs.readFileSync(filePath, 'utf8');
  const hasDebugger = /\bdebugger\b/.test(code);
  const hasAlert = /\balert\(/.test(code) && !file.includes('public');

  reportCheck(
    `No 'debugger' statements in ${file}`,
    !hasDebugger,
    `Found 'debugger' statement in ${file}`
  );
  reportCheck(
    `No rogue alert calls in ${file}`,
    !hasAlert,
    `Found 'alert()' call in backend file ${file}`
  );
});

// Check 4: Verify Required Business Logic Function Exports
console.log('\n4. Verifying API & Module Contract Integrity...');
try {
  const calculator = require('./src/orderCalculator.js');
  const expectedFunctions = [
    'calculateSubtotal',
    'calculateTax',
    'calculateDeliveryFee',
    'calculateTotal',
    'validateOrder',
    'createOrderConfirmation'
  ];

  expectedFunctions.forEach(fnName => {
    const isFunction = typeof calculator[fnName] === 'function';
    reportCheck(`orderCalculator exports '${fnName}()'`, isFunction, `Missing export: ${fnName}`);
  });
} catch (err) {
  reportCheck('Load orderCalculator module', false, err.message);
}

// Summary Report
console.log('\n====================================================');
console.log(`Results: ${checksPassed} Checks Passed | ${issuesFound} Issues Found`);
console.log('====================================================');

if (issuesFound > 0) {
  console.error('\nCode quality check FAILED. Please resolve issues above before deploying.');
  process.exit(1);
} else {
  console.log('\nAll Code Quality Checks PASSED successfully! Code is production ready.\n');
  process.exit(0);
}
