# Test Execution Log

## Execution Summary
- **Execution Date**: 2026-11-25
- **Test Environment**:
  - Frontend: `http://localhost:5173` (React + Vite)
  - Backend: `http://localhost:5000` (Node.js + Express)
  - Database: MongoDB (`mongodb://127.0.0.1:27017/realestate_db`)
  - Browser: Chromium (Playwright `1.49.0`)
- **Initial Run (Run #1)**: 6 passed, 26 failed due to a strict-mode selector ambiguity in the test helper (`getByRole('button', { name: 'Login' })` matched both the Login tab and Login submit button). Fixed the test script to scope tab clicks to `.tabs`.
- **Final Automated Run (Run #2)**: **32 Passed / 0 Failed** in **26.3s**.

---

## Detailed Execution Results (Run #2)

| Test ID | Module | Technique | Test Case Title | Actual Result | Status | Duration |
|---|---|---|---|---|---|---|
| TC-001 | Auth | EP | Register new Owner with valid data | Owner registered and redirected to Owner Dashboard | Pass | 2.4s |
| TC-002 | Auth | EP | Register new Tenant with valid data | Tenant registered and redirected to Tenant Dashboard | Pass | 816ms |
| TC-003 | Auth | EP | Register with duplicate email fails | Alert displayed: `An account with this email already exists.` | Pass | 494ms |
| TC-004 | Auth | BVA | Register with password length 5 (min - 1) fails | Alert displayed: `Password must be at least 6 characters.` | Pass | 504ms |
| TC-005 | Auth | BVA | Register with password length 6 (min) succeeds | Tenant registered and logged in | Pass | 693ms |
| TC-006 | Auth | BVA | Register with name length 1 (min - 1) fails | Alert displayed with minimum name length error | Pass | 683ms |
| TC-007 | Auth | DTT | Login with valid email and valid password succeeds | Owner logged in and dashboard loaded | Pass | 658ms |
| TC-008 | Auth | DTT | Login with valid email and wrong password fails | Alert displayed: `Invalid email or password.` | Pass | 755ms |
| TC-009 | Property | EP | Owner adds property with valid details | Property added and displayed with `available` badge | Pass | 900ms |
| TC-010 | Property | BVA | Add property with Title length 2 (min - 1) fails | Alert displayed: `Title must be at least 3 characters` | Pass | 798ms |
| TC-011 | Property | BVA | Add property with Title length 3 (min) succeeds | Property added successfully | Pass | 738ms |
| TC-012 | Property | BVA | Add property with Rent = 0 (min - 1) fails | Alert displayed: `Rent must be greater than 0` | Pass | 765ms |
| TC-013 | Property | BVA | Add property with Rent = 1 (min) succeeds | Property added successfully | Pass | 775ms |
| TC-014 | Property | BVA | Add property with Rent = 1000001 (max + 1) fails | Alert displayed: `Rent cannot exceed 1,000,000` | Pass | 789ms |
| TC-015 | Property | BVA | Add property with Bedrooms = 0 (min - 1) fails | Alert displayed: `Bedrooms must be at least 1` | Pass | 794ms |
| TC-016 | Property | BVA | Add property with Bedrooms = 21 (max + 1) fails | Alert displayed: `Bedrooms cannot exceed 20` | Pass | 756ms |
| TC-017 | Property | EP | Owner edits existing property details | Property updated and new title/rent shown | Pass | 801ms |
| TC-018 | Property | EP | Owner deletes existing property | Property deleted and removed from list | Pass | 717ms |
| TC-019 | Search | EP | View all available properties | All listed properties displayed on Tenant Dashboard | Pass | 685ms |
| TC-020 | Search | EP | Search properties by matching location | Matching `Downtown` property displayed | Pass | 771ms |
| TC-021 | Search | EP | Search properties with no matching results | Displayed `No properties found.` | Pass | 730ms |
| TC-022 | Search | EP | Filter properties by Max Rent | Properties within max rent displayed | Pass | 694ms |
| TC-023 | Search | EP | Reset search filters | Filters cleared and all properties displayed | Pass | 773ms |
| TC-024 | Application | EP | Apply for available property with message | Application submitted and shown with `pending` badge | Pass | 858ms |
| TC-025 | Application | EP | Apply for available property without optional message | Application submitted successfully | Pass | 771ms |
| TC-026 | Application | EP | Prevent duplicate application by same tenant | Alert displayed: `You have already applied for this property.` | Pass | 765ms |
| TC-027 | Application | STT | Tenant cannot apply for a rented property | Button displayed `Rented` and was disabled | Pass | 756ms |
| TC-028 | Review | STT | Owner approves pending application -> application approved & property rented | Application became `approved` and property became `rented` | Pass | 846ms |
| TC-029 | Review | STT | Owner rejects pending application -> application rejected & property stays available | Application became `rejected` and property stayed `available` | Pass | 801ms |
| TC-030 | Review | STT | Approved/Rejected application has no further Approve/Reject buttons | Approve and Reject buttons were not rendered | Pass | 503ms |
| TC-031 | RBAC | DTT | Tenant cannot add a property via API (403 Forbidden) | API returned HTTP `403` | Pass | 199ms |
| TC-032 | RBAC | DTT | Owner cannot apply for a property via API (403 Forbidden) | API returned HTTP `403` | Pass | 150ms |
