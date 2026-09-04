# ASET School Outreach — Field Operations CRM

A purpose-built Outreach Management & Field Operations platform for ASET School Outreach programs.

## Design & Architecture Overview
- **Theme:** Crimson Red (`#990000`), Pure White (`#FFFFFF`), and Deep Black (`#1A1A1A`).
- **UI Components:** Reused and adapted from [MergeX OS](file:///D:/web%20development/mergex-os) (floating cards, command palette, KPI grids, activity feeds, responsive layout shell).
- **Backend Architecture:** Supabase (PostgreSQL + Auth + Realtime) + NestJS (modular API & sync workers).

---

## Phase 1 Deliverables: Google Sheet Foundation

Phase 1 establishes the exact operational and reporting contract between field executives, future app databases, and executive management.

### Deliverables:
1. **Master Excel Workbook:** [`ASET School Outreach — Field Operations.xlsx`](file:///d:/web%20development/aset-crm/ASET%20School%20Outreach%20%E2%80%94%20Field%20Operations.xlsx) (also mirrored in [`aset/`](file:///d:/web%20development/aset-crm/aset/))
2. **Tab CSV Exports:** All 6 individual CSVs ready for direct import in [`aset/`](file:///d:/web%20development/aset-crm/aset/)
3. **1-Click Google Sheets Auto-Provisioner:** [`aset/GoogleAppsScript_Setup.js`](file:///d:/web%20development/aset-crm/aset/GoogleAppsScript_Setup.js)
4. **Foundation Specification:** [`aset/PHASE_1_FOUNDATION.md`](file:///d:/web%20development/aset-crm/aset/PHASE_1_FOUNDATION.md)

### The 6 Tabs:
1. `01_DASHBOARD` — Executive command center & live KPI metrics.
2. `02_SCHOOL_MASTER` — Primary school directory (22 standardized fields, 1 school = 1 row).
3. `03_VISIT_LOG` — Historical activity log (16 columns, append-only).
4. `04_VISIT_PLAN` — Multi-day route itinerary and visit scheduler.
5. `05_MANAGEMENT_VIEW` — Auto-calculated management briefing & route view.
6. `06_LISTS` — Master dropdown domain lists and configuration rules.

