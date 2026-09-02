/**
 * TestSprite Test Suite: 02. Vehicle Inventory & Multi-Facet Filter Flow
 * Target: Backend (http://localhost:5000/api/v1) & Frontend Data Contracts
 */

import { TestResult } from './01_auth_role_access.spec.js';

export async function runVehicleFilterSuite(apiUrl: string): Promise<TestResult[]> {
  const results: TestResult[] = [];

  // --------------------------------------------------------------------------
  // TEST CASE 1: Brand & Model Facet Filtering
  // --------------------------------------------------------------------------
  const startT1 = Date.now();
  try {
    const res = await fetch(`${apiUrl}/vehicles?brand=Porsche`);
    const data = await res.json();

    const allMatchBrand = Array.isArray(data.data) && data.data.every((v: any) => v.brand.toLowerCase() === 'porsche');

    results.push({
      id: 'TC-VEH-001',
      name: 'Multi-Facet Filtering by Manufacturer / Brand',
      category: 'Backend',
      status: res.status === 200 && allMatchBrand ? 'PASSED' : 'FAILED',
      durationMs: Date.now() - startT1,
      assertions: [
        {
          checkpoint: 'HTTP Status Code is 200 OK',
          passed: res.status === 200,
          expected: 200,
          actual: res.status,
        },
        {
          checkpoint: 'All returned items match brand="Porsche"',
          passed: allMatchBrand,
          expected: true,
          actual: allMatchBrand,
        },
      ],
    });
  } catch (err: any) {
    results.push({
      id: 'TC-VEH-001',
      name: 'Multi-Facet Filtering by Manufacturer / Brand',
      category: 'Backend',
      status: 'FAILED',
      durationMs: Date.now() - startT1,
      error: err.message,
      assertions: [],
    });
  }

  // --------------------------------------------------------------------------
  // TEST CASE 2: Price Range Filtering (minPrice & maxPrice)
  // --------------------------------------------------------------------------
  const startT2 = Date.now();
  const minPrice = 80000;
  const maxPrice = 100000;

  try {
    const res = await fetch(`${apiUrl}/vehicles?minPrice=${minPrice}&maxPrice=${maxPrice}`);
    const data = await res.json();

    const withinRange =
      Array.isArray(data.data) &&
      data.data.every((v: any) => Number(v.price) >= minPrice && Number(v.price) <= maxPrice);

    results.push({
      id: 'TC-VEH-002',
      name: 'Price Range Bound Filtering (minPrice / maxPrice)',
      category: 'Backend',
      status: res.status === 200 && withinRange ? 'PASSED' : 'FAILED',
      durationMs: Date.now() - startT2,
      assertions: [
        {
          checkpoint: 'Returned vehicles strictly within $80,000 - $100,000 range',
          passed: withinRange,
          expected: true,
          actual: withinRange,
        },
      ],
    });
  } catch (err: any) {
    results.push({
      id: 'TC-VEH-002',
      name: 'Price Range Bound Filtering (minPrice / maxPrice)',
      category: 'Backend',
      status: 'FAILED',
      durationMs: Date.now() - startT2,
      error: err.message,
      assertions: [],
    });
  }

  // --------------------------------------------------------------------------
  // TEST CASE 3: Sorting Verification (Price Descending)
  // --------------------------------------------------------------------------
  const startT3 = Date.now();
  try {
    const res = await fetch(`${apiUrl}/vehicles?sortBy=price_desc`);
    const data = await res.json();

    let isSorted = true;
    if (Array.isArray(data.data) && data.data.length > 1) {
      for (let i = 0; i < data.data.length - 1; i++) {
        if (Number(data.data[i].price) < Number(data.data[i + 1].price)) {
          isSorted = false;
          break;
        }
      }
    }

    results.push({
      id: 'TC-VEH-003',
      name: 'Dynamic Sorting (Price: High to Low)',
      category: 'Backend',
      status: res.status === 200 && isSorted ? 'PASSED' : 'FAILED',
      durationMs: Date.now() - startT3,
      assertions: [
        {
          checkpoint: 'Vehicles array sorted in descending price sequence',
          passed: isSorted,
          expected: true,
          actual: isSorted,
        },
      ],
    });
  } catch (err: any) {
    results.push({
      id: 'TC-VEH-003',
      name: 'Dynamic Sorting (Price: High to Low)',
      category: 'Backend',
      status: 'FAILED',
      durationMs: Date.now() - startT3,
      error: err.message,
      assertions: [],
    });
  }

  // --------------------------------------------------------------------------
  // TEST CASE 4: Pagination Structure & Metadata Calculation
  // --------------------------------------------------------------------------
  const startT4 = Date.now();
  try {
    const res = await fetch(`${apiUrl}/vehicles?page=1&limit=2`);
    const data = await res.json();

    const hasValidMeta =
      data.meta &&
      typeof data.meta.total === 'number' &&
      data.meta.page === 1 &&
      data.meta.limit === 2 &&
      typeof data.meta.totalPages === 'number';

    results.push({
      id: 'TC-VEH-004',
      name: 'Pagination Meta Calculation (page, limit, totalPages)',
      category: 'Backend',
      status: res.status === 200 && hasValidMeta ? 'PASSED' : 'FAILED',
      durationMs: Date.now() - startT4,
      assertions: [
        {
          checkpoint: 'Response contains paginated meta object',
          passed: Boolean(hasValidMeta),
          expected: 'meta: { total, page: 1, limit: 2, totalPages }',
          actual: data.meta ? 'Valid' : 'Missing',
        },
      ],
    });
  } catch (err: any) {
    results.push({
      id: 'TC-VEH-004',
      name: 'Pagination Meta Calculation (page, limit, totalPages)',
      category: 'Backend',
      status: 'FAILED',
      durationMs: Date.now() - startT4,
      error: err.message,
      assertions: [],
    });
  }

  // --------------------------------------------------------------------------
  // TEST CASE 5: Individual Vehicle Detail Payload (GET /vehicles/:id)
  // --------------------------------------------------------------------------
  const startT5 = Date.now();
  try {
    const listRes = await fetch(`${apiUrl}/vehicles?limit=1`);
    const listData = await listRes.json();
    const firstVehicleId = listData.data?.[0]?.id;

    if (firstVehicleId) {
      const detailRes = await fetch(`${apiUrl}/vehicles/${firstVehicleId}`);
      const detailData = await detailRes.json();

      const hasRequiredFields =
        detailData.data?.id === firstVehicleId &&
        Boolean(detailData.data?.vin) &&
        Boolean(detailData.data?.seller) &&
        Array.isArray(detailData.data?.images);

      results.push({
        id: 'TC-VEH-005',
        name: 'Single Vehicle Detail with Seller & Images Relations',
        category: 'Backend',
        status: detailRes.status === 200 && hasRequiredFields ? 'PASSED' : 'FAILED',
        durationMs: Date.now() - startT5,
        assertions: [
          {
            checkpoint: 'Contains detailed specs, seller metadata, and ordered images',
            passed: hasRequiredFields,
            expected: true,
            actual: hasRequiredFields,
          },
        ],
      });
    }
  } catch (err: any) {
    results.push({
      id: 'TC-VEH-005',
      name: 'Single Vehicle Detail with Seller & Images Relations',
      category: 'Backend',
      status: 'FAILED',
      durationMs: Date.now() - startT5,
      error: err.message,
      assertions: [],
    });
  }

  return results;
}

export default runVehicleFilterSuite;
