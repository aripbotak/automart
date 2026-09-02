/**
 * TestSprite Test Suite: 01. Authentication & Role-Based Access Flow
 * Target: Frontend (http://localhost:3000) & Backend (http://localhost:5000/api/v1)
 */

export interface TestResult {
  id: string;
  name: string;
  category: 'Frontend' | 'Backend' | 'Integration';
  status: 'PASSED' | 'FAILED' | 'SKIPPED';
  durationMs: number;
  error?: string;
  assertions: {
    checkpoint: string;
    passed: boolean;
    expected: unknown;
    actual: unknown;
  }[];
}

export async function runAuthSuite(baseUrl: string, apiUrl: string): Promise<TestResult[]> {
  const results: TestResult[] = [];
  const testTimestamp = Date.now();

  // --------------------------------------------------------------------------
  // TEST CASE 1: Buyer Registration & JWT Issuance (Backend API)
  // --------------------------------------------------------------------------
  const startT1 = Date.now();
  const buyerPayload = {
    name: `QA Buyer ${testTimestamp}`,
    email: `buyer_${testTimestamp}@automart-qa.com`,
    password: 'SecurePassword123!',
    role: 'BUYER',
    phone: '+15551234567',
  };

  try {
    const res = await fetch(`${apiUrl}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(buyerPayload),
    });

    const data = await res.json();

    results.push({
      id: 'TC-AUTH-001',
      name: 'User Registration & JWT Issuance',
      category: 'Backend',
      status: res.status === 201 && data.data?.token ? 'PASSED' : 'FAILED',
      durationMs: Date.now() - startT1,
      assertions: [
        {
          checkpoint: 'HTTP Status Code is 201 Created',
          passed: res.status === 201,
          expected: 201,
          actual: res.status,
        },
        {
          checkpoint: 'Response contains signed JWT token',
          passed: typeof data.data?.token === 'string' && data.data.token.length > 20,
          expected: 'Valid JWT String',
          actual: data.data?.token ? 'JWT Present' : 'Missing',
        },
        {
          checkpoint: 'User role matches registered BUYER role',
          passed: data.data?.user?.role === 'BUYER',
          expected: 'BUYER',
          actual: data.data?.user?.role,
        },
      ],
    });
  } catch (err: any) {
    results.push({
      id: 'TC-AUTH-001',
      name: 'User Registration & JWT Issuance',
      category: 'Backend',
      status: 'FAILED',
      durationMs: Date.now() - startT1,
      error: err.message,
      assertions: [],
    });
  }

  // --------------------------------------------------------------------------
  // TEST CASE 2: User Login & Token Verification (Backend API)
  // --------------------------------------------------------------------------
  const startT2 = Date.now();
  let buyerToken = '';

  try {
    const res = await fetch(`${apiUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: buyerPayload.email,
        password: buyerPayload.password,
      }),
    });

    const data = await res.json();
    buyerToken = data.data?.token || '';

    results.push({
      id: 'TC-AUTH-002',
      name: 'User Login & Credential Verification',
      category: 'Backend',
      status: res.status === 200 && Boolean(buyerToken) ? 'PASSED' : 'FAILED',
      durationMs: Date.now() - startT2,
      assertions: [
        {
          checkpoint: 'HTTP Status Code is 200 OK',
          passed: res.status === 200,
          expected: 200,
          actual: res.status,
        },
        {
          checkpoint: 'Login returns valid Bearer token',
          passed: Boolean(buyerToken),
          expected: 'Non-empty JWT token string',
          actual: buyerToken ? 'Valid' : 'Empty',
        },
      ],
    });
  } catch (err: any) {
    results.push({
      id: 'TC-AUTH-002',
      name: 'User Login & Credential Verification',
      category: 'Backend',
      status: 'FAILED',
      durationMs: Date.now() - startT2,
      error: err.message,
      assertions: [],
    });
  }

  // --------------------------------------------------------------------------
  // TEST CASE 3: Profile Extraction via Protected Route (Backend API)
  // --------------------------------------------------------------------------
  const startT3 = Date.now();
  try {
    const res = await fetch(`${apiUrl}/auth/me`, {
      headers: { Authorization: `Bearer ${buyerToken}` },
    });

    const data = await res.json();

    results.push({
      id: 'TC-AUTH-003',
      name: 'Protected Profile Route (GET /auth/me)',
      category: 'Backend',
      status: res.status === 200 && data.data?.email === buyerPayload.email ? 'PASSED' : 'FAILED',
      durationMs: Date.now() - startT3,
      assertions: [
        {
          checkpoint: 'Decodes token and returns matching user profile',
          passed: data.data?.email === buyerPayload.email,
          expected: buyerPayload.email,
          actual: data.data?.email,
        },
      ],
    });
  } catch (err: any) {
    results.push({
      id: 'TC-AUTH-003',
      name: 'Protected Profile Route (GET /auth/me)',
      category: 'Backend',
      status: 'FAILED',
      durationMs: Date.now() - startT3,
      error: err.message,
      assertions: [],
    });
  }

  // --------------------------------------------------------------------------
  // TEST CASE 4: Role Authorization Security Barrier (DEALER Only)
  // --------------------------------------------------------------------------
  const startT4 = Date.now();
  try {
    // Attempting to post a vehicle as a BUYER (Must be rejected with 403 Forbidden)
    const res = await fetch(`${apiUrl}/vehicles`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${buyerToken}`,
      },
      body: JSON.stringify({
        title: 'Unauthorized Vehicle Listing',
        brand: 'Porsche',
        model: '911',
        year: 2024,
        price: 150000,
        mileage: 100,
        vin: `UNAUTH${testTimestamp.toString().slice(-9)}`,
      }),
    });

    results.push({
      id: 'TC-AUTH-004',
      name: 'RBAC Access Protection (Buyer Forbidden from Dealer Endpoint)',
      category: 'Backend',
      status: res.status === 403 ? 'PASSED' : 'FAILED',
      durationMs: Date.now() - startT4,
      assertions: [
        {
          checkpoint: 'HTTP Status Code is 403 Forbidden',
          passed: res.status === 403,
          expected: 403,
          actual: res.status,
        },
      ],
    });
  } catch (err: any) {
    results.push({
      id: 'TC-AUTH-004',
      name: 'RBAC Access Protection (Buyer Forbidden from Dealer Endpoint)',
      category: 'Backend',
      status: 'FAILED',
      durationMs: Date.now() - startT4,
      error: err.message,
      assertions: [],
    });
  }

  return results;
}

export default runAuthSuite;
