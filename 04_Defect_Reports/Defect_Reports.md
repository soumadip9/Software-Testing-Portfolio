# Defect Reports

During automated testing (32 planned test cases) all 32 cases passed. During follow-up exploratory testing of multi-tenant application workflows on the live application, **1 real functional defect** was identified and verified.

---

## DEF-001: Owner Can Approve Multiple Applications for an Already Rented Property

| Field | Details |
|---|---|
| **Defect ID** | DEF-001 |
| **Title** | Owner can approve a second pending rental application after the property is already marked `rented` |
| **Module** | Rental Application Review (`PATCH /api/applications/:id`) |
| **Severity** | High |
| **Priority** | High |
| **Status** | Open |
| **Environment** | Node.js + Express backend (`http://localhost:5000`), MongoDB |

### Steps to Reproduce
1. Register an Owner and create a property (status defaults to `available`).
2. Register Tenant 1 and submit a rental application (`App1`) for that property.
3. Register Tenant 2 and submit a rental application (`App2`) for the same property.
4. As the Owner, approve `App1` (`PATCH /api/applications/:id` with `{ status: "approved" }`).
   - `App1` becomes `approved` and the property becomes `rented`.
5. As the Owner, approve `App2` (`PATCH /api/applications/:id` with `{ status: "approved" }`).

### Expected Result
- Either approving `App1` should automatically reject other `pending` applications for the same property, **or** the backend should return `400 Bad Request` (`"Property is already rented"`) when trying to approve `App2`.

### Actual Result
- `PATCH /api/applications/:id` returned `200 OK` and set `App2.status` to `approved` even though the property was already `rented`:
  ```
  App1 status: approved, Property status: rented
  App2 status after property already rented: approved
  ```

### Root Cause
In `app/backend/routes/applications.js`, the `PATCH /api/applications/:id` handler checks property ownership and valid status values, but does not check whether `application.propertyId.status === 'rented'` before approving another application.
