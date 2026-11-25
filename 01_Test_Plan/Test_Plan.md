# Test Plan: Real Estate Property Management and Rental System

## 1. Introduction
This Test Plan describes the testing strategy, scope, objectives, environment, and schedule for the **Real Estate Property Management and Rental System** web application.

## 2. Scope
### In Scope (Features Tested)
1. **User Registration and Login** (Owner and Tenant roles)
2. **Property Management (Owner)**: Add, Edit, and Delete properties
3. **Property Viewing and Searching (Tenant)**: Browse properties, search by title/location, filter by maximum rent
4. **Rental Applications (Tenant)**: Apply for available rental properties and view application status
5. **Application Review (Owner)**: Approve or Reject rental applications

### Out of Scope
- Payment processing, image uploads, email notifications, and performance/load testing.

## 3. Test Objectives
- Verify that all five core features work as expected against a real MongoDB database.
- Validate input fields using **Equivalence Partitioning** and **Boundary Value Analysis**.
- Verify business rules and role permissions using **Decision Table Testing**.
- Verify property and application lifecycle changes using **State Transition Testing**.
- Identify, document, and track any real defects found during test execution.

## 4. Test Environment
- **Frontend**: React (Vite) running at `http://localhost:5173`
- **Backend**: Node.js + Express running at `http://localhost:5000`
- **Database**: MongoDB Community Server running at `mongodb://127.0.0.1:27017/realestate_db`
- **Automation Tool**: Playwright Test (`@playwright/test`)
- **Browser**: Chromium (Desktop)
- **Operating System**: Windows

## 5. Testing Techniques Used
1. **Equivalence Partitioning (EP)**: Grouping inputs into valid and invalid classes (e.g., valid vs. duplicate email, valid vs. empty search).
2. **Boundary Value Analysis (BVA)**: Testing exact boundary values and off-by-one limits (e.g., password length 5 vs. 6; rent 0, 1, 1000000, 1000001; bedrooms 0, 1, 20, 21).
3. **Decision Table Testing (DTT)**: Testing combinations of conditions such as Login credentials and Role-Based Access Control.
4. **State Transition Testing (STT)**: Testing state changes for Applications (`pending` -> `approved` / `rejected`) and Properties (`available` -> `rented`).

## 6. Entry and Exit Criteria
- **Entry Criteria**: Application builds without errors, backend connects to MongoDB, and test cases are reviewed.
- **Exit Criteria**: All 32 test cases are executed on the running application, actual results are recorded, any discovered defects are logged, HTML report is generated, and screenshots are saved.

## 7. Deliverables
- `01_Test_Plan/Test_Plan.md`
- `02_Test_Case_Design/Test_Cases.md` & `Test_Cases.csv`
- `03_Test_Execution/Test_Execution_Log.md`
- `04_Defect_Reports/Defect_Reports.md`
- `05_Test_Automation/` (Playwright test suite)
- `06_Test_Reports/` (Playwright HTML report & Final Testing Summary)
- `07_Screenshots/` (Visual evidence of key flows and results)
