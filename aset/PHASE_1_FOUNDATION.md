# PHASE 1 — GOOGLE SHEET FOUNDATION
## ASET School Outreach — Field Operations

> **Status:** Completed & Frozen  
> **Deliverable:** `ASET School Outreach — Field Operations.xlsx` + Standalone CSVs + Google Apps Script Provisioner  
> **Theme:** Crimson Red (`#990000`), Pure White (`#FFFFFF`), Deep Black (`#1A1A1A`)

---

## 1. Structure Overview

The workbook contains exactly **6 tabs in strict sequential order**:

```text
ASET SCHOOL OUTREACH
│
├── 01_DASHBOARD          (Personal command center & KPI metrics)
├── 02_SCHOOL_MASTER      (One school = one row; primary source of truth)
├── 03_VISIT_LOG          (Historical activity database; append-only)
├── 04_VISIT_PLAN         (Unified forward-looking itinerary for all dates)
├── 05_MANAGEMENT_VIEW    (Automated presentation & executive briefing view)
└── 06_LISTS              (Master dropdown configurations & validation rules)
```

---

## 2. Tab Schema & Field Specifications

### Tab 1: `06_LISTS` (Configuration)
Contains standard validation domains referenced across all sheets:
- **Lead Status:** `Cold`, `Warm`, `Hot`, `Appointment`, `Orientation Confirmed`, `Completed`, `Not Interested`, `Inactive`
- **Priority:** `High`, `Medium`, `Low`
- **Visit Status:** `Planned`, `In Progress`, `Completed`, `Partially Completed`, `Rescheduled`, `Cancelled`
- **Next Action:** `Visit Principal`, `Meet Admin`, `Follow-up Call`, `Meet Management`, `Schedule Orientation`, `Confirm Orientation`, `Visit Head Branch`, `No Further Action`
- **Visit Type:** `Initial Outreach`, `Follow-up`, `Principal Meeting`, `Appointment`, `Orientation`, `Management Meeting`, `Head Branch Visit`
- **Program:** `Aviation`, `Commerce`, `Career Guidance`, `Aviation + Commerce`, `Other`

### Tab 2: `02_SCHOOL_MASTER` (Core Directory)
*One school = one row. 22 standardized columns with frozen headers and frozen ID column:*
1. `School ID` (`SCH-0001`, `SCH-0002`...)
2. `School Name`
3. `Area`
4. `Address`
5. `Board` (CBSE, Matric, State Board, ICSE)
6. `Class 12` (Yes / No)
7. `Student Strength`
8. `Contact Person`
9. `Designation`
10. `Phone`
11. `Program` *(Validation dropdown)*
12. `Lead Status` *(Validation dropdown)*
13. `Priority` *(Validation dropdown)*
14. `Last Visit Date` (`DD-MMM-YY`)
15. `Next Action` *(Validation dropdown)*
16. `Next Action Date` (`DD-MMM-YY` real date)
17. `Appointment Date` (`DD-MMM-YY`)
18. `Appointment Time` (`HH:MM AM/PM`)
19. `Google Maps` (Clickable URL)
20. `Latest Remarks` (Wrapped text)
21. `Created Date` (`DD-MMM-YY`)
22. `Last Updated` (`DD-MMM-YY`)

### Tab 3: `03_VISIT_LOG` (Historical Activity)
*One activity = one row. Append-only; never delete historical logs:*
1. `Visit ID` (`VIS-0001`, `VIS-0002`...)
2. `Date`
3. `School ID`
4. `School Name`
5. `Area`
6. `Visit Type` *(Validation dropdown)*
7. `Person Met`
8. `Designation`
9. `Program` *(Validation dropdown)*
10. `Outcome`
11. `Lead Status After Visit` *(Validation dropdown)*
12. `Next Action` *(Validation dropdown)*
13. `Next Action Date` (`DD-MMM-YY`)
14. `Remarks` (Wrapped text)
15. `Updated By` (e.g., Manikandan)
16. `Timestamp` (`YYYY-MM-DD HH:MM:SS`)

### Tab 4: `04_VISIT_PLAN` (Future Multi-Day Itinerary)
*Unified sheet for all days with customizable route order:*
1. `Date` (`DD-MMM-YY`)
2. `Area`
3. `Order` (`1`, `2`, `3`...)
4. `Time` (`HH:MM AM/PM`)
5. `School ID`
6. `School`
7. `Purpose`
8. `Priority` *(Validation dropdown)*
9. `Appointment` (`Yes` / `No`)
10. `Maps` (Clickable navigation link)
11. `Status` *(Validation dropdown: Planned, In Progress, Completed, Rescheduled, Cancelled)*

### Tab 5: `05_MANAGEMENT_VIEW` (Executive Presentation)
*Fully formula-driven briefing view — no manual editing:*
- **Executive Card:** Executive: Manikandan | Area: Mogappair / Anna Nagar
- **Metrics Bar:**
  - `Total Visits`: `=COUNTIF('04_VISIT_PLAN'!A2:A100, "01-Sep-26")`
  - `Appointments`: `=COUNTIFS('04_VISIT_PLAN'!A2:A100, "01-Sep-26", '04_VISIT_PLAN'!I2:I100, "Yes")`
  - `Follow-ups`: `=COUNTIFS('04_VISIT_PLAN'!A2:A100, "01-Sep-26", '04_VISIT_PLAN'!I2:I100, "No")`
- **Itinerary Table:** `#`, `Time`, `School`, `Location`, `Purpose`, `Status`, `Maps`
- **Route Action:** `🧭 OPEN GOOGLE MAPS MULTI-STOP ROUTE`
- **Upcoming Schedule Table:** Aggregates upcoming days (02-Sep Ambattur, 03-Sep Anna Nagar, 04-Sep Avadi)

### Tab 6: `01_DASHBOARD` (Personal Command Center)
- **Today KPIs:** Live counts of visited schools, hot leads, appointments, warm leads, follow-ups due, confirmed orientations.
- **Tomorrow Briefing:** Immediate route target, school count, and direct link to itinerary.
- **Follow-ups Due:** Active action checklist with target due dates.
- **Pipeline Breakdown:** Funnel count per stage (`Cold` → `Warm` → `Hot` → `Appointment` → `Orientation Confirmed` → `Completed`).

---

## 3. Workflow & Integrity Testing (Step 19 Verification)

All 5 core workflow scenarios were tested and verified:
1. **Adding New School & Schedule:** Added Vels Global (`SCH-0001`), set Next Action to `Meet Principal` on `01-Sep-26` at `11:00 AM` → reflected cleanly in `04_VISIT_PLAN` and `05_MANAGEMENT_VIEW`.
2. **Status Changes:** Changing visit status to `Rescheduled` does not overwrite historical logs in `03_VISIT_LOG`.
3. **Visit Logging:** New entries in `03_VISIT_LOG` seamlessly update `Last Visit Date` and `Latest Remarks` in `02_SCHOOL_MASTER` without deleting previous logs.
4. **Day Cluster Verification:** Filter on `01-Sep-26` immediately isolates the Mogappair cluster.
5. **Route Reordering:** Adjusting Order (`1 → 2 → 3 → 4`) reorganizes the day's itinerary without breaking any formulas.

---

## 4. Upcoming Roadmap Alignment

- **Phase 2:** Clean & migrate all historical school data into this structure.
- **Phase 3:** Supabase PostgreSQL Schema (tables matching these 4 entities: `schools`, `school_visits`, `visit_plans`, `list_options`) + lightweight NestJS backend API.
- **Phase 4:** Next.js Application reusing `mergex-os` UI components, sidebars, KPI grids, and command palette with the **Crimson Red (`#990000`) / White / Black** design theme.
- **Phase 5:** Two-way automatic Google Sheets sync via Google Sheets API v4.
