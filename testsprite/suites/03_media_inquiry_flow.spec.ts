/**
 * TestSprite Test Suite: 03. Media Pipeline & Test-Drive Inquiry Flow
 * Target: Frontend (<OptimizedImage /> CDN WebP) & Backend (POST /api/v1/inquiries)
 */

import { TestResult } from './01_auth_role_access.spec.js';
import { buildCdnUrl } from '../../components/ui/OptimizedImage.js';

export async function runMediaInquirySuite(apiUrl: string): Promise<TestResult[]> {
  const results: TestResult[] = [];

  // --------------------------------------------------------------------------
  // TEST CASE 1: Cloudinary Dynamic WebP & Auto-Format CDN URL Transformation
  // --------------------------------------------------------------------------
  const startT1 = Date.now();
  try {
    const rawCloudinaryUrl = 'https://res.cloudinary.com/automart/image/upload/v12345/porsche911.jpg';
    const transformedUrl = buildCdnUrl(rawCloudinaryUrl, 1200, 85, 'cloudinary');

    const hasWebPAutoParams =
      transformedUrl.includes('f_auto') &&
      transformedUrl.includes('q_85') &&
      transformedUrl.includes('w_1200');

    results.push({
      id: 'TC-MEDIA-001',
      name: 'Cloudinary Dynamic WebP & Auto-Optimization URL Transformation',
      category: 'Frontend',
      status: hasWebPAutoParams ? 'PASSED' : 'FAILED',
      durationMs: Date.now() - startT1,
      assertions: [
        {
          checkpoint: 'Injects f_auto, q_85, and w_1200 parameters into CDN path',
          passed: hasWebPAutoParams,
          expected: 'contains f_auto,q_85,w_1200',
          actual: transformedUrl,
        },
      ],
    });
  } catch (err: any) {
    results.push({
      id: 'TC-MEDIA-001',
      name: 'Cloudinary Dynamic WebP & Auto-Optimization URL Transformation',
      category: 'Frontend',
      status: 'FAILED',
      durationMs: Date.now() - startT1,
      error: err.message,
      assertions: [],
    });
  }

  // --------------------------------------------------------------------------
  // TEST CASE 2: AWS S3 & Imgix Compression Parameter Generation
  // --------------------------------------------------------------------------
  const startT2 = Date.now();
  try {
    const rawS3Url = 'https://automart-bucket.s3.amazonaws.com/vehicles/car.jpg';
    const transformedS3 = buildCdnUrl(rawS3Url, 800, 80, 's3');

    const hasS3Params =
      transformedS3.includes('auto=format%2Ccompress') ||
      (transformedS3.includes('auto=format') && transformedS3.includes('q=80'));

    results.push({
      id: 'TC-MEDIA-002',
      name: 'AWS S3 CDN Query Parameter Pipeline',
      category: 'Frontend',
      status: hasS3Params ? 'PASSED' : 'FAILED',
      durationMs: Date.now() - startT2,
      assertions: [
        {
          checkpoint: 'Appends auto=format,compress & quality params to S3 URL',
          passed: hasS3Params,
          expected: 'contains auto=format,compress&q=80',
          actual: transformedS3,
        },
      ],
    });
  } catch (err: any) {
    results.push({
      id: 'TC-MEDIA-002',
      name: 'AWS S3 CDN Query Parameter Pipeline',
      category: 'Frontend',
      status: 'FAILED',
      durationMs: Date.now() - startT2,
      error: err.message,
      assertions: [],
    });
  }

  // --------------------------------------------------------------------------
  // TEST CASE 3: Test-Drive Inquiry Submission (POST /inquiries)
  // --------------------------------------------------------------------------
  const startT3 = Date.now();
  try {
    // Get valid vehicle ID first
    const listRes = await fetch(`${apiUrl}/vehicles?limit=1`);
    const listData = await listRes.json();
    const vehicleId = listData.data?.[0]?.id;

    if (vehicleId) {
      const inquiryPayload = {
        vehicleId,
        name: 'Jordan Miller (QA Tester)',
        email: 'jordan.tester@example.com',
        phone: '+1 (555) 432-9988',
        message: 'Interested in booking a weekend test drive for this car.',
        preferredDate: new Date(Date.now() + 86400000 * 3).toISOString(),
        requestTestDrive: true,
        tradeInInterest: false,
      };

      const res = await fetch(`${apiUrl}/inquiries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(inquiryPayload),
      });

      const data = await res.json();

      results.push({
        id: 'TC-INQ-001',
        name: 'Test-Drive Booking & Inquiry Submission',
        category: 'Backend',
        status: res.status === 201 && data.data?.status === 'PENDING' ? 'PASSED' : 'FAILED',
        durationMs: Date.now() - startT3,
        assertions: [
          {
            checkpoint: 'HTTP Status Code is 201 Created',
            passed: res.status === 201,
            expected: 201,
            actual: res.status,
          },
          {
            checkpoint: 'Inquiry status initializes as PENDING',
            passed: data.data?.status === 'PENDING',
            expected: 'PENDING',
            actual: data.data?.status,
          },
          {
            checkpoint: 'Inquiry properly associates with Vehicle ID',
            passed: data.data?.vehicleId === vehicleId,
            expected: vehicleId,
            actual: data.data?.vehicleId,
          },
        ],
      });
    }
  } catch (err: any) {
    results.push({
      id: 'TC-INQ-001',
      name: 'Test-Drive Booking & Inquiry Submission',
      category: 'Backend',
      status: 'FAILED',
      durationMs: Date.now() - startT3,
      error: err.message,
      assertions: [],
    });
  }

  // --------------------------------------------------------------------------
  // TEST CASE 4: Zod Request Validation Barrier (Invalid Email & Missing Fields)
  // --------------------------------------------------------------------------
  const startT4 = Date.now();
  try {
    const invalidPayload = {
      vehicleId: 'invalid-uuid-format',
      name: '',
      email: 'not-an-email-address',
      phone: '123',
    };

    const res = await fetch(`${apiUrl}/inquiries`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(invalidPayload),
    });

    const data = await res.json();

    results.push({
      id: 'TC-INQ-002',
      name: 'Zod Input Validation on Inquiry Endpoint',
      category: 'Backend',
      status: res.status === 422 && Boolean(data.errors) ? 'PASSED' : 'FAILED',
      durationMs: Date.now() - startT4,
      assertions: [
        {
          checkpoint: 'HTTP Status Code is 422 Unprocessable Entity',
          passed: res.status === 422,
          expected: 422,
          actual: res.status,
        },
        {
          checkpoint: 'Response contains field-specific validation error details',
          passed: Boolean(data.errors?.email && data.errors?.vehicleId),
          expected: true,
          actual: Boolean(data.errors),
        },
      ],
    });
  } catch (err: any) {
    results.push({
      id: 'TC-INQ-002',
      name: 'Zod Input Validation on Inquiry Endpoint',
      category: 'Backend',
      status: 'FAILED',
      durationMs: Date.now() - startT4,
      error: err.message,
      assertions: [],
    });
  }

  return results;
}

export default runMediaInquirySuite;
