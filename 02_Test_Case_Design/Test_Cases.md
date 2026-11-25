# Test Case Design (32 Test Cases)

This document contains **32 test cases** designed using four black-box testing techniques:
1. **Equivalence Partitioning (EP)**
2. **Boundary Value Analysis (BVA)**
3. **Decision Table Testing (DTT)**
4. **State Transition Testing (STT)**

---

## Technique Summaries

### Decision Table: Login (TC-007, TC-008)
| Condition / Rule | Rule 1 | Rule 2 | Rule 3 | Rule 4 |
|---|---|---|---|---|
| Email registered? | Yes | Yes | No | Empty |
| Password matches? | Yes | No | N/A | Any |
| **Expected Result** | Login succeeds | Error: Invalid email or password | Error: Invalid email or password | HTML5 / API required field validation |

### State Transition Diagram: Application & Property Status
```
Property: [available] --(Owner Approves Application)--> [rented]
Application: [pending] --(Owner Approves)--> [approved]
Application: [pending] --(Owner Rejects)---> [rejected]
```

---

## Test Cases List

| ID | Module | Technique | Title | Preconditions | Test Steps / Input Data | Expected Result |
|---|---|---|---|---|---|---|
| TC-001 | Auth | EP | Register new Owner with valid data | User on Login/Register page | Click Register tab, enter Name: `Alice Owner`, Email: unique, Password: `password123`, Role: `Owner`, submit | Account created, redirected to Owner Dashboard |
| TC-002 | Auth | EP | Register new Tenant with valid data | User on Login/Register page | Click Register tab, enter Name: `Bob Tenant`, Email: unique, Password: `password123`, Role: `Tenant`, submit | Account created, redirected to Tenant Dashboard |
| TC-003 | Auth | EP | Register with duplicate email | `Alice Owner` already registered | Try registering again with same email and password `password123` | Error message: `An account with this email already exists.` |
| TC-004 | Auth | BVA | Register with password length 5 (min - 1) | User on Register tab | Enter valid name & email, Password: `12345` (5 chars), submit | Registration fails with `Password must be at least 6 characters.` |
| TC-005 | Auth | BVA | Register with password length 6 (min) | User on Register tab | Enter valid name & email, Password: `123456` (6 chars), submit | Registration succeeds |
| TC-006 | Auth | BVA | Register with name length 1 (min - 1) | User on Register tab | Enter Name: `A`, valid email & password `123456`, submit | Registration fails with minimum name length validation error |
| TC-007 | Auth | DTT | Login with valid email and valid password | Registered Owner exists | Enter registered email & `password123`, click Login | Login succeeds and Owner Dashboard loads |
| TC-008 | Auth | DTT | Login with valid email and wrong password | Registered Owner exists | Enter registered email & `wrongpass`, click Login | Error message: `Invalid email or password.` |
| TC-009 | Property (Owner) | EP | Add property with valid details | Logged in as Owner | Fill Title: `Sunny 2BHK`, Location: `Downtown`, Rent: `1200`, Bedrooms: `2`, Description: `Near park`, click Add Property | Property appears in My Properties with `available` badge |
| TC-010 | Property (Owner) | BVA | Add property with Title length 2 (min - 1) | Logged in as Owner | Enter Title: `AB`, Location: `City`, Rent: `1000`, Bedrooms: `1`, submit | Error: Title must be at least 3 characters |
| TC-011 | Property (Owner) | BVA | Add property with Title length 3 (min) | Logged in as Owner | Enter Title: `Apt`, Location: `City`, Rent: `1000`, Bedrooms: `1`, submit | Property added successfully |
| TC-012 | Property (Owner) | BVA | Add property with Rent = 0 (min - 1) | Logged in as Owner | Enter valid Title/Location, Rent: `0`, Bedrooms: `1`, submit | Error: Rent must be greater than 0 |
| TC-013 | Property (Owner) | BVA | Add property with Rent = 1 (min) | Logged in as Owner | Enter valid Title/Location, Rent: `1`, Bedrooms: `1`, submit | Property added successfully |
| TC-014 | Property (Owner) | BVA | Add property with Rent = 1000001 (max + 1) | Logged in as Owner | Enter valid Title/Location, Rent: `1000001`, Bedrooms: `1`, submit | Error: Rent cannot exceed 1,000,000 |
| TC-015 | Property (Owner) | BVA | Add property with Bedrooms = 0 (min - 1) | Logged in as Owner | Enter valid Title/Location, Rent: `1000`, Bedrooms: `0`, submit | Error: Bedrooms must be at least 1 |
| TC-016 | Property (Owner) | BVA | Add property with Bedrooms = 21 (max + 1) | Logged in as Owner | Enter valid Title/Location, Rent: `1000`, Bedrooms: `21`, submit | Error: Bedrooms cannot exceed 20 |
| TC-017 | Property (Owner) | EP | Edit existing property details | Owner has at least 1 property | Click Edit on property, change Title to `Updated Villa` and Rent to `1500`, click Update Property | Property list shows updated title and rent `$1500/mo` |
| TC-018 | Property (Owner) | EP | Delete existing property | Owner has at least 1 property | Click Delete on property | Property is removed from My Properties list |
| TC-019 | Search (Tenant) | EP | View all available properties | Logged in as Tenant; properties exist | Open Tenant Dashboard | All listed properties are displayed with title, location, rent, bedrooms, status |
| TC-020 | Search (Tenant) | EP | Search properties by matching location/title | Properties exist in `Downtown` and `Uptown` | Enter `Downtown` in search box, click Search | Only properties matching `Downtown` are displayed |
| TC-021 | Search (Tenant) | EP | Search properties with no matching results | Logged in as Tenant | Enter `NonExistentCityXYZ`, click Search | Displays `No properties found.` |
| TC-022 | Search (Tenant) | EP | Filter properties by Max Rent | Properties with rent `$1200` and `$2500` exist | Enter `1500` in Max Rent box, click Search | Only properties with rent <= `$1500` are displayed |
| TC-023 | Search (Tenant) | EP | Reset search filters | Search filter currently applied | Click Reset button | Search inputs clear and all properties are shown again |
| TC-024 | Application (Tenant) | EP | Apply for an available property with message | Logged in as Tenant; `available` property exists | Click Apply, enter message `Interested in moving next month`, click Submit Application | Success message shown; application appears in My Rental Applications with `pending` badge |
| TC-025 | Application (Tenant) | EP | Apply for an available property without message | Logged in as Tenant; `available` property exists | Click Apply, leave message empty, click Submit Application | Application submitted successfully with `pending` status |
| TC-026 | Application (Tenant) | EP | Prevent duplicate application by same tenant | Tenant already applied for Property X | Click Apply on Property X again and submit | Error: `You have already applied for this property.` |
| TC-027 | Application (Tenant) | STT | Cannot apply for a rented property | Property is in `rented` state | View rented property on Tenant Dashboard | Button displays `Rented` and is disabled |
| TC-028 | Review (Owner) | STT | Approve pending application transitions application & property | Pending application exists for Owner's property | Logged in as Owner, click Approve on pending application | Application status becomes `approved`; property status becomes `rented` |
| TC-029 | Review (Owner) | STT | Reject pending application keeps property available | Pending application exists for Owner's property | Logged in as Owner, click Reject on pending application | Application status becomes `rejected`; property remains `available` |
| TC-030 | Review (Owner) | STT | Approved/Rejected application has no further action buttons | Application is `approved` or `rejected` | View Rental Applications as Owner | Approve and Reject buttons are no longer displayed for that application |
| TC-031 | Security / RBAC | DTT | Tenant cannot add a property via API | Logged in as Tenant (has Tenant JWT) | Send `POST /api/properties` with Tenant token | API returns `403 Forbidden` |
| TC-032 | Security / RBAC | DTT | Owner cannot apply for a property via API | Logged in as Owner (has Owner JWT) | Send `POST /api/applications` with Owner token | API returns `403 Forbidden` |
