# Software-Testing-Portfolio

**Project**: Real Estate Property Management and Rental System  
**Tech Stack**: React (Vite), Node.js, Express, MongoDB, Playwright

## Repository Structure
- `01_Test_Plan/` — Test Plan document (`Test_Plan.md`)
- `02_Test_Case_Design/` — 32 Test Cases using EP, BVA, DTT, and STT (`Test_Cases.md`)
- `03_Test_Execution/` — Actual test execution log (`Test_Execution_Log.md`)
- `04_Defect_Reports/` — Documented defects (`Defect_Reports.md`)
- `05_Test_Automation/` — Playwright automated test suite (`tests/realestate.spec.js`)
- `06_Test_Reports/` — Playwright HTML report (`playwright-html-report/`) and `Final_Testing_Summary.md`
- `07_Screenshots/` — Visual evidence screenshots from test execution
- `app/` — Full-stack application (`app/backend` and `app/frontend`)

## How to Run the Application & Tests

### 1. Start MongoDB
Ensure MongoDB Server is running on `mongodb://127.0.0.1:27017`.

### 2. Start Backend (`app/backend`)
```bash
cd app/backend
npm install
npm start
```

### 3. Start Frontend (`app/frontend`)
```bash
cd app/frontend
npm install
npm run dev
```

### 4. Run Playwright Tests (`05_Test_Automation`)
```bash
cd 05_Test_Automation
npm install
npx playwright install chromium
npx playwright test
```

### 5. View HTML Test Report
```bash
cd 05_Test_Automation
npm run report
```
