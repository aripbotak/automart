/**
 * TestSprite Automation Runner for Web Auto Mart
 * Executes all spec suites and renders summary reports.
 */

import { runAuthSuite, TestResult } from './suites/01_auth_role_access.spec.js';
import { runVehicleFilterSuite } from './suites/02_vehicle_inventory_filtering.spec.js';
import { runMediaInquirySuite } from './suites/03_media_inquiry_flow.spec.js';
import fs from 'fs';
import path from 'path';

const FRONTEND_URL = process.env.TEST_FRONTEND_URL || 'http://localhost:3000';
const BACKEND_URL = process.env.TEST_BACKEND_URL || 'http://localhost:5000/api/v1';

async function main() {
  console.log(`
============================================================
🧪  TESTSPRITE AUTOMATION RUNNER - WEB AUTO MART E2E
🌐  Frontend Target: ${FRONTEND_URL}
📡  Backend Target:  ${BACKEND_URL}
⏱️   Timestamp:       ${new Date().toISOString()}
============================================================
  `);

  const allResults: TestResult[] = [];

  // 1. Check Backend Connectivity
  console.log('🩺 Performing API Health Check...');
  try {
    const healthRes = await fetch(`${BACKEND_URL}/health`);
    if (healthRes.ok) {
      console.log('✅ Backend API is reachable and healthy!\n');
    } else {
      console.warn('⚠️ Backend returned non-200 on /health. Running in fallback verification mode.\n');
    }
  } catch (err: any) {
    console.warn(`⚠️ Warning: Could not connect to live backend (${err.message}). Suites will test unit contracts.\n`);
  }

  // 2. Execute Test Suites
  console.log('🚀 Running Suite 1: Authentication & RBAC Flow...');
  const authResults = await runAuthSuite(FRONTEND_URL, BACKEND_URL);
  allResults.push(...authResults);

  console.log('🚀 Running Suite 2: Vehicle Inventory & Multi-Facet Filters...');
  const vehicleResults = await runVehicleFilterSuite(BACKEND_URL);
  allResults.push(...vehicleResults);

  console.log('🚀 Running Suite 3: Media Pipeline & Inquiries Flow...');
  const mediaResults = await runMediaInquirySuite(BACKEND_URL);
  allResults.push(...mediaResults);

  // 3. Print Results Summary
  console.log('\n============================================================');
  console.log('📊 TESTSPRITE EXECUTION SUMMARY');
  console.log('============================================================');

  let passedCount = 0;
  let failedCount = 0;

  allResults.forEach((test) => {
    const icon = test.status === 'PASSED' ? '✅' : '❌';
    if (test.status === 'PASSED') passedCount++;
    else failedCount++;

    console.log(`${icon} [${test.id}] ${test.name} (${test.durationMs}ms)`);

    test.assertions.forEach((a) => {
      const aIcon = a.passed ? '   ✔' : '   ✖';
      console.log(`${aIcon} ${a.checkpoint}`);
      if (!a.passed) {
        console.log(`      Expected: ${JSON.stringify(a.expected)}`);
        console.log(`      Actual:   ${JSON.stringify(a.actual)}`);
      }
    });

    if (test.error) {
      console.log(`   ⚠️ Error: ${test.error}`);
    }
  });

  console.log('------------------------------------------------------------');
  console.log(`Total Tests: ${allResults.length} | Passed: ${passedCount} | Failed: ${failedCount}`);
  console.log('============================================================\n');

  // 4. Save JSON Report
  const reportsDir = path.join(process.cwd(), 'testsprite', 'reports');
  if (!fs.existsSync(reportsDir)) {
    fs.mkdirSync(reportsDir, { recursive: true });
  }

  const reportPath = path.join(reportsDir, 'test_report.json');
  fs.writeFileSync(
    reportPath,
    JSON.stringify(
      {
        timestamp: new Date().toISOString(),
        summary: { total: allResults.length, passed: passedCount, failed: failedCount },
        results: allResults,
      },
      null,
      2
    )
  );

  console.log(`📄 Full JSON Test Report written to: ${reportPath}`);
}

main().catch(console.error);
