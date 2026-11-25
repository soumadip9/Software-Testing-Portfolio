import { test, expect } from '@playwright/test';
import path from 'path';

const API_BASE = 'http://localhost:5000/api';
const SCREENSHOT_DIR = path.resolve(__dirname, '../../07_Screenshots');

const runId = Date.now();
const ownerEmail = `owner_${runId}@test.com`;
const tenantEmail = `tenant_${runId}@test.com`;
const bvaPassEmail = `bva_${runId}@test.com`;

async function registerViaUI(page, { name, email, password, role }) {
  await page.goto('/');
  await page.locator('.tabs').getByRole('button', { name: 'Register' }).click();
  await page.locator('#name').fill(name);
  await page.locator('#email').fill(email);
  await page.locator('#password').fill(password);
  await page.locator('#role').selectOption(role);
  await page.locator('form button[type="submit"]').click();
}

async function loginViaUI(page, { email, password }) {
  await page.goto('/');
  await page.locator('.tabs').getByRole('button', { name: 'Login' }).click();
  await page.locator('#email').fill(email);
  await page.locator('#password').fill(password);
  await page.locator('form button[type="submit"]').click();
}

test.describe('Real Estate Property Management & Rental System - 32 Test Cases', () => {
  // Module 1: Auth (TC-001 to TC-008)
  test('TC-001: [EP] Register new Owner with valid data', async ({ page }) => {
    await registerViaUI(page, {
      name: 'Alice Owner',
      email: ownerEmail,
      password: 'password123',
      role: 'owner'
    });
    await expect(page.getByText('Alice Owner (owner)')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Add New Property' })).toBeVisible();
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '01_owner_registered_dashboard.png'), fullPage: true });
  });

  test('TC-002: [EP] Register new Tenant with valid data', async ({ page }) => {
    await registerViaUI(page, {
      name: 'Bob Tenant',
      email: tenantEmail,
      password: 'password123',
      role: 'tenant'
    });
    await expect(page.getByText('Bob Tenant (tenant)')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Browse & Search Properties' })).toBeVisible();
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '02_tenant_registered_dashboard.png'), fullPage: true });
  });

  test('TC-003: [EP] Register with duplicate email fails', async ({ page }) => {
    await registerViaUI(page, {
      name: 'Alice Duplicate',
      email: ownerEmail,
      password: 'password123',
      role: 'owner'
    });
    await expect(page.getByRole('alert')).toContainText('An account with this email already exists.');
  });

  test('TC-004: [BVA] Register with password length 5 (min - 1) fails', async ({ page }) => {
    await registerViaUI(page, {
      name: 'Short Pass',
      email: `short_${runId}@test.com`,
      password: '12345',
      role: 'tenant'
    });
    await expect(page.getByRole('alert')).toContainText('Password must be at least 6 characters.');
  });

  test('TC-005: [BVA] Register with password length 6 (min) succeeds', async ({ page }) => {
    await registerViaUI(page, {
      name: 'Min Pass',
      email: bvaPassEmail,
      password: '123456',
      role: 'tenant'
    });
    await expect(page.getByText('Min Pass (tenant)')).toBeVisible();
  });

  test('TC-006: [BVA] Register with name length 1 (min - 1) fails', async ({ page }) => {
    await registerViaUI(page, {
      name: 'A',
      email: `name1_${runId}@test.com`,
      password: 'password123',
      role: 'tenant'
    });
    await expect(page.getByRole('alert')).toContainText('Name must be at least 2 characters');
  });

  test('TC-007: [DTT] Login with valid email and valid password succeeds', async ({ page }) => {
    await loginViaUI(page, { email: ownerEmail, password: 'password123' });
    await expect(page.getByText('Alice Owner (owner)')).toBeVisible();
  });

  test('TC-008: [DTT] Login with valid email and wrong password fails', async ({ page }) => {
    await loginViaUI(page, { email: ownerEmail, password: 'wrongpassword' });
    await expect(page.getByRole('alert')).toContainText('Invalid email or password.');
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '03_login_invalid_password.png'), fullPage: true });
  });

  // Module 2: Property Management - Owner (TC-009 to TC-018)
  test('TC-009: [EP] Owner adds property with valid details', async ({ page }) => {
    await loginViaUI(page, { email: ownerEmail, password: 'password123' });
    await page.locator('#prop-title').fill(`Sunny 2BHK ${runId}`);
    await page.locator('#prop-location').fill('Downtown');
    await page.locator('#prop-rent').fill('1200');
    await page.locator('#prop-bedrooms').fill('2');
    await page.locator('#prop-desc').fill('Near central park');
    await page.getByRole('button', { name: 'Add Property' }).click();

    await expect(page.getByRole('status')).toContainText('Property added successfully.');
    await expect(page.getByText(`Sunny 2BHK ${runId}`)).toBeVisible();
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '04_owner_property_added.png'), fullPage: true });
  });

  test('TC-010: [BVA] Add property with Title length 2 (min - 1) fails', async ({ page }) => {
    await loginViaUI(page, { email: ownerEmail, password: 'password123' });
    await page.locator('#prop-title').fill('AB');
    await page.locator('#prop-location').fill('Downtown');
    await page.locator('#prop-rent').fill('1000');
    await page.locator('#prop-bedrooms').fill('1');
    await page.getByRole('button', { name: 'Add Property' }).click();
    await expect(page.getByRole('alert')).toContainText('Title must be at least 3 characters');
  });

  test('TC-011: [BVA] Add property with Title length 3 (min) succeeds', async ({ page }) => {
    await loginViaUI(page, { email: ownerEmail, password: 'password123' });
    await page.locator('#prop-title').fill('Apt');
    await page.locator('#prop-location').fill('Uptown');
    await page.locator('#prop-rent').fill('2500');
    await page.locator('#prop-bedrooms').fill('3');
    await page.getByRole('button', { name: 'Add Property' }).click();
    await expect(page.getByRole('status')).toContainText('Property added successfully.');
  });

  test('TC-012: [BVA] Add property with Rent = 0 (min - 1) fails', async ({ page }) => {
    await loginViaUI(page, { email: ownerEmail, password: 'password123' });
    await page.locator('#prop-title').fill('Zero Rent Flat');
    await page.locator('#prop-location').fill('Midtown');
    await page.locator('#prop-rent').fill('0');
    await page.locator('#prop-bedrooms').fill('1');
    await page.getByRole('button', { name: 'Add Property' }).click();
    await expect(page.getByRole('alert')).toContainText('Rent must be greater than 0');
  });

  test('TC-013: [BVA] Add property with Rent = 1 (min) succeeds', async ({ page }) => {
    await loginViaUI(page, { email: ownerEmail, password: 'password123' });
    await page.locator('#prop-title').fill(`Min Rent Studio ${runId}`);
    await page.locator('#prop-location').fill('Suburb');
    await page.locator('#prop-rent').fill('1');
    await page.locator('#prop-bedrooms').fill('1');
    await page.getByRole('button', { name: 'Add Property' }).click();
    await expect(page.getByRole('status')).toContainText('Property added successfully.');
  });

  test('TC-014: [BVA] Add property with Rent = 1000001 (max + 1) fails', async ({ page }) => {
    await loginViaUI(page, { email: ownerEmail, password: 'password123' });
    await page.locator('#prop-title').fill('Luxury Mansion');
    await page.locator('#prop-location').fill('Hillside');
    await page.locator('#prop-rent').fill('1000001');
    await page.locator('#prop-bedrooms').fill('5');
    await page.getByRole('button', { name: 'Add Property' }).click();
    await expect(page.getByRole('alert')).toContainText('Rent cannot exceed 1,000,000');
  });

  test('TC-015: [BVA] Add property with Bedrooms = 0 (min - 1) fails', async ({ page }) => {
    await loginViaUI(page, { email: ownerEmail, password: 'password123' });
    await page.locator('#prop-title').fill('No Bed Room');
    await page.locator('#prop-location').fill('Downtown');
    await page.locator('#prop-rent').fill('900');
    await page.locator('#prop-bedrooms').fill('0');
    await page.getByRole('button', { name: 'Add Property' }).click();
    await expect(page.getByRole('alert')).toContainText('Bedrooms must be at least 1');
  });

  test('TC-016: [BVA] Add property with Bedrooms = 21 (max + 1) fails', async ({ page }) => {
    await loginViaUI(page, { email: ownerEmail, password: 'password123' });
    await page.locator('#prop-title').fill('Huge Castle');
    await page.locator('#prop-location').fill('Outskirts');
    await page.locator('#prop-rent').fill('5000');
    await page.locator('#prop-bedrooms').fill('21');
    await page.getByRole('button', { name: 'Add Property' }).click();
    await expect(page.getByRole('alert')).toContainText('Bedrooms cannot exceed 20');
  });

  test('TC-017: [EP] Owner edits existing property details', async ({ page }) => {
    await loginViaUI(page, { email: ownerEmail, password: 'password123' });
    const card = page.locator('.item-card', { hasText: `Min Rent Studio ${runId}` });
    await card.getByRole('button', { name: 'Edit' }).click();
    await page.locator('#prop-title').fill(`Updated Studio ${runId}`);
    await page.locator('#prop-rent').fill('1500');
    await page.getByRole('button', { name: 'Update Property' }).click();

    await expect(page.getByRole('status')).toContainText('Property updated successfully.');
    await expect(page.getByText(`Updated Studio ${runId}`)).toBeVisible();
  });

  test('TC-018: [EP] Owner deletes existing property', async ({ page }) => {
    await loginViaUI(page, { email: ownerEmail, password: 'password123' });
    const card = page.locator('.item-card', { hasText: `Updated Studio ${runId}` });
    await card.getByRole('button', { name: 'Delete' }).click();

    await expect(page.getByRole('status')).toContainText('Property deleted successfully.');
    await expect(page.getByText(`Updated Studio ${runId}`)).toHaveCount(0);
  });

  // Module 3: View & Search Properties - Tenant (TC-019 to TC-023)
  test('TC-019: [EP] Tenant views all available properties', async ({ page }) => {
    await loginViaUI(page, { email: tenantEmail, password: 'password123' });
    await expect(page.getByText(`Sunny 2BHK ${runId}`)).toBeVisible();
  });

  test('TC-020: [EP] Tenant searches properties by matching location', async ({ page }) => {
    await loginViaUI(page, { email: tenantEmail, password: 'password123' });
    await page.getByLabel('Search properties').fill('Downtown');
    await page.getByRole('button', { name: 'Search' }).click();
    await expect(page.getByText(`Sunny 2BHK ${runId}`)).toBeVisible();
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '05_tenant_search_results.png'), fullPage: true });
  });

  test('TC-021: [EP] Tenant searches with no matching results', async ({ page }) => {
    await loginViaUI(page, { email: tenantEmail, password: 'password123' });
    await page.getByLabel('Search properties').fill('NonExistentCityXYZ');
    await page.getByRole('button', { name: 'Search' }).click();
    await expect(page.getByText('No properties found.')).toBeVisible();
  });

  test('TC-022: [EP] Tenant filters properties by Max Rent', async ({ page }) => {
    await loginViaUI(page, { email: tenantEmail, password: 'password123' });
    await page.getByLabel('Max rent').fill('1500');
    await page.getByRole('button', { name: 'Search' }).click();
    await expect(page.getByText(`Sunny 2BHK ${runId}`)).toBeVisible();
  });

  test('TC-023: [EP] Tenant resets search filters', async ({ page }) => {
    await loginViaUI(page, { email: tenantEmail, password: 'password123' });
    await page.getByLabel('Search properties').fill('NonExistentCityXYZ');
    await page.getByRole('button', { name: 'Search' }).click();
    await expect(page.getByText('No properties found.')).toBeVisible();

    await page.getByRole('button', { name: 'Reset' }).click();
    await expect(page.getByText(`Sunny 2BHK ${runId}`)).toBeVisible();
  });

  // Module 4: Apply for Rental Property - Tenant (TC-024 to TC-027)
  test('TC-024: [EP] Tenant applies for available property with message', async ({ page }) => {
    await loginViaUI(page, { email: tenantEmail, password: 'password123' });
    const card = page.locator('.item-card', { hasText: `Sunny 2BHK ${runId}` }).first();
    await card.getByRole('button', { name: 'Apply' }).click();
    await page.locator('#apply-msg').fill('Interested in moving next month.');
    await page.getByRole('button', { name: 'Submit Application' }).click();

    await expect(page.getByRole('status')).toContainText(`Application submitted for Sunny 2BHK ${runId}.`);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '06_tenant_application_submitted.png'), fullPage: true });
  });

  test('TC-025: [EP] Tenant applies for available property without optional message', async ({ page }) => {
    await loginViaUI(page, { email: tenantEmail, password: 'password123' });
    const card = page.locator('.item-card', { hasText: 'Apt' }).first();
    await card.getByRole('button', { name: 'Apply' }).click();
    await page.getByRole('button', { name: 'Submit Application' }).click();

    await expect(page.getByRole('status')).toContainText('Application submitted for Apt.');
  });

  test('TC-026: [EP] Prevent duplicate application by same tenant', async ({ page }) => {
    await loginViaUI(page, { email: tenantEmail, password: 'password123' });
    const card = page.locator('.item-card', { hasText: `Sunny 2BHK ${runId}` }).first();
    await card.getByRole('button', { name: 'Apply' }).click();
    await page.getByRole('button', { name: 'Submit Application' }).click();

    await expect(page.getByRole('alert')).toContainText('You have already applied for this property.');
  });

  // Module 5: Approve or Reject Rental Applications - Owner (TC-028 to TC-030, then TC-027)
  test('TC-028: [STT] Owner approves pending application -> application approved & property rented', async ({ page }) => {
    await loginViaUI(page, { email: ownerEmail, password: 'password123' });
    const appCard = page.locator('.application-list .item-card', { hasText: `Sunny 2BHK ${runId}` }).first();
    await appCard.getByRole('button', { name: 'Approve' }).click();

    await expect(page.getByRole('status')).toContainText('Application approved.');
    await expect(appCard.locator('.badge')).toHaveText('approved');
    const propCard = page.locator('.property-list .item-card', { hasText: `Sunny 2BHK ${runId}` }).first();
    await expect(propCard.locator('.badge')).toHaveText('rented');
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '07_owner_application_approved.png'), fullPage: true });
  });

  test('TC-027: [STT] Tenant cannot apply for a rented property', async ({ page }) => {
    await loginViaUI(page, { email: bvaPassEmail, password: '123456' });
    const propCard = page.locator('.property-list .item-card', { hasText: `Sunny 2BHK ${runId}` }).first();
    const rentedBtn = propCard.getByRole('button', { name: 'Rented' });
    await expect(rentedBtn).toBeDisabled();
  });

  test('TC-029: [STT] Owner rejects pending application -> application rejected & property stays available', async ({ page }) => {
    await loginViaUI(page, { email: ownerEmail, password: 'password123' });
    const appCard = page.locator('.application-list .item-card', { hasText: 'Apt' }).first();
    await appCard.getByRole('button', { name: 'Reject' }).click();

    await expect(page.getByRole('status')).toContainText('Application rejected.');
    await expect(appCard.locator('.badge')).toHaveText('rejected');
    const propCard = page.locator('.property-list .item-card', { hasText: 'Apt' }).first();
    await expect(propCard.locator('.badge')).toHaveText('available');
  });

  test('TC-030: [STT] Approved/Rejected application has no further Approve/Reject buttons', async ({ page }) => {
    await loginViaUI(page, { email: ownerEmail, password: 'password123' });
    const appCard = page.locator('.application-list .item-card', { hasText: `Sunny 2BHK ${runId}` }).first();
    await expect(appCard.getByRole('button', { name: 'Approve' })).toHaveCount(0);
    await expect(appCard.getByRole('button', { name: 'Reject' })).toHaveCount(0);
  });

  // Role-Based Access Control (TC-031, TC-032)
  test('TC-031: [DTT] Tenant cannot add a property via API (403 Forbidden)', async ({ request }) => {
    const loginRes = await request.post(`${API_BASE}/auth/login`, {
      data: { email: tenantEmail, password: 'password123' }
    });
    const { token } = await loginRes.json();

    const propRes = await request.post(`${API_BASE}/properties`, {
      headers: { Authorization: `Bearer ${token}` },
      data: { title: 'Illegal Flat', location: 'Nowhere', rent: 500, bedrooms: 1 }
    });
    expect(propRes.status()).toBe(403);
  });

  test('TC-032: [DTT] Owner cannot apply for a property via API (403 Forbidden)', async ({ request }) => {
    const loginRes = await request.post(`${API_BASE}/auth/login`, {
      data: { email: ownerEmail, password: 'password123' }
    });
    const { token } = await loginRes.json();

    const appRes = await request.post(`${API_BASE}/applications`, {
      headers: { Authorization: `Bearer ${token}` },
      data: { propertyId: '000000000000000000000000', message: 'Test' }
    });
    expect(appRes.status()).toBe(403);
  });
});
