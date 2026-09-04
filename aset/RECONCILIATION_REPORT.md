# PHASE 2 — RECONCILIATION & VALIDATION REPORT

## 1. Summary Reconciliation Matrix

| Entity / Metric | Raw Sources Total | Migrated Master v1 | Difference | Status / Explanation |
| :--- | :---: | :---: | :---: | :--- |
| **Raw School Records** | 43 | 36 | -7 | 7 duplicates / multi-stops normalized without data loss |
| **Unique Institutional Records** | 36 | 36 | 0 | **100% Reconciled** |
| **Historical Visit Logs** | 14 | 14 | 0 | **100% Reconciled** (Preserved from 28-Aug & 31-Aug) |
| **Forward Itinerary Plans** | 15 | 15 | 0 | **100% Reconciled** (01-Sep, 02-Sep, 03-Sep itineraries) |
| **Confirmed Appointments** | 6 | 6 | 0 | **100% Reconciled** (Vels, MGR, Vivekanandha, SBOA, Velammal, Chinmaya) |
| **Orientation Confirmed** | 2 | 2 | 0 | **100% Reconciled** (Mount Carmel, Chinmaya Vidyalaya) |

---

## 2. Multi-Branch Entity Decisions (Step 2.12 Compliance)

- **DAV Group:**
  - `SCH-0003`: DAV Senior Secondary School (Mogappair) — Principal Smt. S. Nandhini. Next action: Head Branch clearance.
  - `SCH-0010`: DAV Girls Senior Secondary School (Mogappair East).
  - `SCH-0011`: DAV Secondary School Mogappair (Mogappair East).
  *Rule followed: Branch schools preserved individually; not merged.*

- **Zion Group:**
  - `SCH-0024`: Zion Matriculation Higher Secondary School, Selaiyur (Head Branch).
  - `SCH-0030`: Zion Matriculation Higher Secondary School, Madambakkam.
  *Rule followed: Separate branch IDs created, relationship noted in Remarks.*

- **SBOA Group:**
  - `SCH-0007`: SBOA Matriculation Higher Secondary School (Anna Nagar West Extension).
  - `SCH-0008`: SBOA School & Junior College (Anna Nagar West Extension).
  - `SCH-0013`: SBOA Global School (Anna Nagar West Extension).
  *Rule followed: Distinct curriculum and management channels kept discrete.*

---

## 3. Step 2.23 & 2.24 Random Record & Edge Case Validation

1. **Vels Global School (`SCH-0001`):**
   - Address: 432, Seethakathi Salai, Paneer Nagar, Mogappair East
   - Strength: 64 | Phone: +91 72990 99155 | Contact: Ramya Saneel, Principal
   - Status: Appointment | Time: 11:00 AM on 01-Sep-26 | **Validation: PASS**

2. **Mount Carmel Matriculation (`SCH-0025`):**
   - Location: Madambakkam | Status: Orientation Confirmed | Permission: Approved
   - Follow-up: Confirm specific day on Monday | **Validation: PASS**

3. **Shri Anand Jain Vidyalaya (`SCH-0020`):**
   - Location: Tambaram West | Previous Visit: School on leave | Status: Cold
   - Next Action: Follow-up Call (02-Sep-26) | **Validation: PASS**

4. **Jai Hind Matriculation (`SCH-0028`):**
   - Location: Thirumazhisai | Contact: Mrs. Abarna, Principal | Status: Warm
   - Next Action: Correspondent sign-off for Scholarship Exam | **Validation: PASS**
