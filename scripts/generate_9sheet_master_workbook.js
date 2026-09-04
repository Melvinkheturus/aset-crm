const fs = require('fs');
const path = require('path');
const ExcelJS = require('exceljs');
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://fdejzsuoezjwaqhdlwor.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZkZWp6c3VvZXpqd2FxaGRsd29yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcwMTgyNjYsImV4cCI6MjEwMjU5NDI2Nn0.kZ3Bkf_ruTS3bduv66XZCuM1gio5R01ey9tlkFJ8FOk';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function generate9SheetMaster() {
  console.log('Fetching live records from Supabase...');
  const [schoolsRes, visitsRes, plansRes] = await Promise.all([
    supabase.from('schools').select('*').order('school_code', { ascending: true }),
    supabase.from('visits').select('*, schools(school_code, name, area)').order('visit_date', { ascending: false }),
    supabase.from('planned_visits').select('*, schools(school_code, name, area, phone, contact_person)').order('visit_date', { ascending: true }).order('visit_order', { ascending: true, nullsFirst: false })
  ]);

  const schools = schoolsRes.data || [];
  const visits = visitsRes.data || [];
  const plans = plansRes.data || [];

  console.log(`Loaded ${schools.length} schools, ${visits.length} visits, ${plans.length} planned visits.`);

  const wb = new ExcelJS.Workbook();
  wb.creator = 'ASET College of Science & Technology';
  wb.lastModifiedBy = 'Manikandan / Field Team';
  wb.created = new Date();
  wb.modified = new Date();

  // Crimson Red Theme
  const CRIMSON = '990000';
  const BLACK = '121217';
  const WHITE = 'FFFFFF';
  const LIGHT_GRAY = 'F8F9FA';
  const BORDER_COLOR = 'E0E0E0';

  const headerFont = { name: 'Segoe UI', size: 10, bold: true, color: { argb: WHITE } };
  const headerFill = { type: 'pattern', pattern: 'solid', fgColor: { argb: CRIMSON } };
  const subHeaderFill = { type: 'pattern', pattern: 'solid', fgColor: { argb: BLACK } };
  const borderThin = {
    top: { style: 'thin', color: { argb: BORDER_COLOR } },
    bottom: { style: 'thin', color: { argb: BORDER_COLOR } },
    left: { style: 'thin', color: { argb: BORDER_COLOR } },
    right: { style: 'thin', color: { argb: BORDER_COLOR } }
  };

  // 1. 01_DASHBOARD
  const ws1 = wb.addWorksheet('01_DASHBOARD', { views: [{ showGridLines: true }] });
  ws1.columns = [{ width: 26 }, { width: 18 }, { width: 22 }, { width: 20 }, { width: 28 }];
  ws1.addRow(['ASET SCHOOL OUTREACH — FIELD ACTIVITY DASHBOARD']).font = { name: 'Segoe UI', size: 16, bold: true, color: { argb: CRIMSON } };
  ws1.addRow(['TODAY: 04 September 2026 • Executive: Manikandan • Master Database: 201 Schools']).font = { name: 'Segoe UI', size: 10, italic: true };
  ws1.addRow([]);

  ws1.addRow(['METRIC CATEGORY', 'COUNT / VALUE', 'BENCHMARK / GOAL', 'STATUS', 'FIELD EXECUTIVE SUMMARY']);
  ws1.getRow(4).font = headerFont;
  ws1.getRow(4).fill = headerFill;

  const kpis = [
    ['Total Master Schools Covered', schools.length, '250 Target', 'Active Pipeline', 'Manikandan, Peter, Pandurangan'],
    ['Total Field Visits Executed', visits.length, '300 Target', 'On Track', 'Ajith Kumar, Kingsten, Saranya'],
    ['Upcoming Scheduled Follow-ups', plans.length, 'Continuous', 'Scheduled Itinerary', 'Daily Route Alignment'],
    ['Hot Leads (Immediate Conversion)', schools.filter(s => s.lead_status === 'Hot').length, '20% Target', 'High Priority', 'Principal Meetings / Confirmations'],
    ['Warm Leads (Follow-up Scheduled)', schools.filter(s => s.lead_status === 'Warm').length, '40% Target', 'Medium Priority', 'Career Guidance Pitch'],
    ['Cold / Untapped Pipeline', schools.filter(s => s.lead_status === 'Cold').length, 'N/A', 'Nurture Required', 'Revisit in Oct/Nov'],
    ['Conducted / Confirmed Orientations', schools.filter(s => s.lead_status === 'CONDUCTED').length, '50 Target', 'Milestone Won', 'Programs Delivered']
  ];
  kpis.forEach(k => {
    const r = ws1.addRow(k);
    r.font = { name: 'Segoe UI', size: 10 };
    r.eachCell(c => { c.border = borderThin; });
  });

  // 2. 02_SCHOOL_MASTER
  const ws2 = wb.addWorksheet('02_SCHOOL_MASTER', { views: [{ showGridLines: true }] });
  ws2.columns = [
    { header: 'School ID', key: 'school_code', width: 14 },
    { header: 'School Name', key: 'name', width: 38 },
    { header: 'Branch / Area', key: 'area', width: 22 },
    { header: 'Full Address', key: 'address', width: 45 },
    { header: 'Board', key: 'board', width: 14 },
    { header: 'Class 12', key: 'class_12', width: 10 },
    { header: 'Student Strength', key: 'student_strength', width: 16 },
    { header: 'Contact Person', key: 'contact_person', width: 24 },
    { header: 'Designation', key: 'designation', width: 20 },
    { header: 'Phone', key: 'phone', width: 20 },
    { header: 'Program Pitched', key: 'program', width: 20 },
    { header: 'Lead Status', key: 'lead_status', width: 16 },
    { header: 'Priority', key: 'priority', width: 12 },
    { header: 'Last Visit Date', key: 'last_visit_date', width: 16 },
    { header: 'Next Action', key: 'next_action', width: 22 },
    { header: 'Next Action Date', key: 'next_action_date', width: 16 },
    { header: 'Latest Remarks', key: 'latest_remarks', width: 50 },
    { header: 'Created Date', key: 'created_at', width: 16 }
  ];
  ws2.getRow(1).font = headerFont;
  ws2.getRow(1).fill = headerFill;

  schools.forEach(s => {
    const r = ws2.addRow({
      school_code: s.school_code,
      name: s.name,
      area: s.area,
      address: s.address,
      board: s.board || 'State Board',
      class_12: s.class_12 || 'Yes',
      student_strength: s.student_strength || 0,
      contact_person: s.contact_person || 'Staff',
      designation: s.designation || 'Staff',
      phone: s.phone || '',
      program: s.program,
      lead_status: s.lead_status,
      priority: s.priority,
      last_visit_date: s.last_visit_date || '',
      next_action: s.next_action || '',
      next_action_date: s.next_action_date || '',
      latest_remarks: s.latest_remarks || '',
      created_at: s.created_at ? s.created_at.split('T')[0] : '2026-08-19'
    });
    r.font = { name: 'Segoe UI', size: 9 };
    r.eachCell(c => { c.border = borderThin; });
  });

  // 3. 03_VISIT_LOG
  const ws3 = wb.addWorksheet('03_VISIT_LOG', { views: [{ showGridLines: true }] });
  ws3.columns = [
    { header: 'Visit ID', key: 'visit_code', width: 14 },
    { header: 'School ID', key: 'school_code', width: 14 },
    { header: 'School Name', key: 'school_name', width: 36 },
    { header: 'Visit Date', key: 'visit_date', width: 14 },
    { header: 'Visit Type', key: 'visit_type', width: 18 },
    { header: 'Person Met', key: 'person_met', width: 22 },
    { header: 'Designation', key: 'designation', width: 20 },
    { header: 'Program', key: 'program', width: 20 },
    { header: 'Outcome', key: 'outcome', width: 24 },
    { header: 'Lead Status', key: 'lead_status', width: 16 },
    { header: 'Next Action', key: 'next_action', width: 22 },
    { header: 'Next Action Date', key: 'next_action_date', width: 16 },
    { header: 'Executive / Created By', key: 'created_by', width: 20 },
    { header: 'Remarks & Discussion', key: 'remarks', width: 55 }
  ];
  ws3.getRow(1).font = headerFont;
  ws3.getRow(1).fill = headerFill;

  visits.forEach(v => {
    const r = ws3.addRow({
      visit_code: v.visit_code,
      school_code: v.schools?.school_code || '',
      school_name: v.schools?.name || '',
      visit_date: v.visit_date,
      visit_type: v.visit_type,
      person_met: v.person_met,
      designation: v.designation,
      program: v.program,
      outcome: v.outcome,
      lead_status: v.lead_status_after_visit,
      next_action: v.next_action,
      next_action_date: v.next_action_date || '',
      created_by: v.created_by,
      remarks: v.remarks
    });
    r.font = { name: 'Segoe UI', size: 9 };
    r.eachCell(c => { c.border = borderThin; });
  });

  // 4. 04_VISIT_PLAN
  const ws4 = wb.addWorksheet('04_VISIT_PLAN', { views: [{ showGridLines: true }] });
  ws4.columns = [
    { header: 'Plan ID', key: 'plan_code', width: 14 },
    { header: 'Visit Date', key: 'visit_date', width: 14 },
    { header: 'School ID', key: 'school_code', width: 14 },
    { header: 'School Name', key: 'school_name', width: 36 },
    { header: 'Area', key: 'area', width: 20 },
    { header: 'Visit Order', key: 'visit_order', width: 12 },
    { header: 'Planned Time', key: 'planned_time', width: 16 },
    { header: 'Purpose', key: 'purpose', width: 24 },
    { header: 'Appointment', key: 'appointment', width: 14 },
    { header: 'Priority', key: 'priority', width: 12 },
    { header: 'Status', key: 'status', width: 14 },
    { header: 'Notes', key: 'notes', width: 45 }
  ];
  ws4.getRow(1).font = headerFont;
  ws4.getRow(1).fill = headerFill;

  plans.forEach((p, idx) => {
    const r = ws4.addRow({
      plan_code: p.plan_code,
      visit_date: p.visit_date,
      school_code: p.schools?.school_code || '',
      school_name: p.schools?.name || '',
      area: p.schools?.area || '',
      visit_order: p.visit_order || idx + 1,
      planned_time: p.planned_time || `${String(9 + idx)}:30 AM`,
      purpose: p.purpose,
      appointment: p.is_appointment ? 'Yes' : 'No',
      priority: p.priority || 'Medium',
      status: p.status || 'Planned',
      notes: p.notes
    });
    r.font = { name: 'Segoe UI', size: 9 };
    r.eachCell(c => { c.border = borderThin; });
  });

  // 5. 05_DAILY_REPORT
  const ws5 = wb.addWorksheet('05_DAILY_REPORT', { views: [{ showGridLines: true }] });
  ws5.columns = [{ width: 8 }, { width: 36 }, { width: 22 }, { width: 24 }, { width: 24 }];
  ws5.addRow(['ASET SCHOOL OUTREACH — DAILY REPORT (04 SEPTEMBER 2026)']).font = { name: 'Segoe UI', size: 14, bold: true, color: { argb: CRIMSON } };
  ws5.addRow(['Executive: Manikandan • Area: Mogappair / Anna Nagar • Planned: 14 • Completed: 12 • Positive: 7']).font = { name: 'Segoe UI', size: 10, italic: true };
  ws5.addRow([]);
  ws5.addRow(['#', 'School Name', 'Area', 'Outcome', 'Next Action']);
  ws5.getRow(4).font = headerFont;
  ws5.getRow(4).fill = headerFill;

  visits.slice(0, 14).forEach((v, i) => {
    const r = ws5.addRow([i + 1, v.schools?.name, v.schools?.area, v.outcome, v.next_action]);
    r.font = { name: 'Segoe UI', size: 9 };
    r.eachCell(c => { c.border = borderThin; });
  });

  // 6. 06_WEEKLY_REPORT
  const ws6 = wb.addWorksheet('06_WEEKLY_REPORT', { views: [{ showGridLines: true }] });
  ws6.columns = [{ width: 24 }, { width: 20 }, { width: 24 }, { width: 20 }];
  ws6.addRow(['ASET SCHOOL OUTREACH — WEEKLY REPORT (31 AUG - 06 SEP 2026)']).font = { name: 'Segoe UI', size: 14, bold: true, color: { argb: CRIMSON } };
  ws6.addRow(['Total Visits: ' + visits.length + ' • Unique Schools: ' + schools.length + ' • Orientations Won: ' + schools.filter(s => s.lead_status === 'CONDUCTED').length]).font = { name: 'Segoe UI', size: 10, italic: true };
  ws6.addRow([]);
  ws6.addRow(['DAY / AREA', 'VISITS LOGGED', 'OUTCOME SUMMARY', 'COUNT']);
  ws6.getRow(4).font = headerFont;
  ws6.getRow(4).fill = headerFill;

  const weeklyRows = [
    ['Monday (31 Aug)', 42, 'Follow-up Required', 115],
    ['Tuesday (01 Sep)', 38, 'Interested', 44],
    ['Wednesday (02 Sep)', 35, 'Program Confirmed', 18],
    ['Thursday (03 Sep)', 48, 'Program Conducted', 8],
    ['Friday (04 Sep)', 48, 'Not Interested', 26]
  ];
  weeklyRows.forEach(w => {
    const r = ws6.addRow(w);
    r.font = { name: 'Segoe UI', size: 9 };
    r.eachCell(c => { c.border = borderThin; });
  });

  // 7. 07_MONTHLY_REPORT
  const ws7 = wb.addWorksheet('07_MONTHLY_REPORT', { views: [{ showGridLines: true }] });
  ws7.columns = [{ width: 22 }, { width: 18 }, { width: 16 }, { width: 16 }, { width: 16 }, { width: 18 }];
  ws7.addRow(['ASET SCHOOL OUTREACH — MONTHLY REPORT (SEPTEMBER 2026)']).font = { name: 'Segoe UI', size: 14, bold: true, color: { argb: CRIMSON } };
  ws7.addRow(['Total Institutions in Master Database: 201 • Total Visits Executed: 211']).font = { name: 'Segoe UI', size: 10, italic: true };
  ws7.addRow([]);
  ws7.addRow(['Executive Name', 'Total Visits', 'Hot Leads', 'Warm Leads', 'Cold Leads', 'Orientations Won']);
  ws7.getRow(4).font = headerFont;
  ws7.getRow(4).fill = subHeaderFill;

  const execMatrix = [
    ['Ajith Kumar', 53, 1, 33, 19, 0],
    ['Manikandan', 49, 3, 15, 31, 0],
    ['Kingsten', 48, 23, 14, 8, 3],
    ['Pandurangan', 28, 0, 12, 12, 4],
    ['Peter', 22, 0, 11, 10, 1],
    ['Saranya', 11, 1, 5, 5, 0]
  ];
  execMatrix.forEach(e => {
    const r = ws7.addRow(e);
    r.font = { name: 'Segoe UI', size: 9 };
    r.eachCell(c => { c.border = borderThin; });
  });

  // 8. 08_MANAGEMENT_VIEW
  const ws8 = wb.addWorksheet('08_MANAGEMENT_VIEW', { views: [{ showGridLines: true }] });
  ws8.columns = [{ width: 8 }, { width: 16 }, { width: 38 }, { width: 20 }, { width: 24 }, { width: 16 }, { width: 16 }];
  ws8.addRow(['ASET SCHOOL OUTREACH — FIELD VISIT PLAN (05 SEPTEMBER 2026)']).font = { name: 'Segoe UI', size: 14, bold: true, color: { argb: CRIMSON } };
  ws8.addRow(['Executive: Manikandan • Target Area: Mogappair / Anna Nagar • Total Visits: 14 • Appointments: 6 • Follow-ups: 8']).font = { name: 'Segoe UI', size: 10, italic: true };
  ws8.addRow([]);
  ws8.addRow(['Order', 'Time', 'Partner School', 'Area', 'Purpose', 'Appointment?', 'Status']);
  ws8.getRow(4).font = headerFont;
  ws8.getRow(4).fill = headerFill;

  plans.slice(0, 14).forEach((p, idx) => {
    const r = ws8.addRow([
      p.visit_order || idx + 1,
      p.planned_time || `${String(9 + idx)}:30 AM`,
      p.schools?.name,
      p.schools?.area,
      p.purpose,
      p.is_appointment ? 'YES' : 'No',
      p.status || 'Planned'
    ]);
    r.font = { name: 'Segoe UI', size: 9 };
    r.eachCell(c => { c.border = borderThin; });
  });

  // 9. 09_LISTS
  const ws9 = wb.addWorksheet('09_LISTS', { views: [{ showGridLines: true }] });
  ws9.columns = [
    { header: 'Programs', key: 'p', width: 22 },
    { header: 'Lead Status', key: 'ls', width: 22 },
    { header: 'Priority', key: 'pr', width: 14 },
    { header: 'Visit Status', key: 'vs', width: 18 },
    { header: 'Visit Types', key: 'vt', width: 22 },
    { header: 'Outcomes', key: 'oc', width: 24 },
    { header: 'Next Actions', key: 'na', width: 26 },
    { header: 'Executives', key: 'ex', width: 20 }
  ];
  ws9.getRow(1).font = headerFont;
  ws9.getRow(1).fill = headerFill;

  const listsData = {
    p: ['Aviation', 'Commerce', 'Career Guidance', 'Scholarship Exam', 'Multiple Programs'],
    ls: ['Cold', 'Warm', 'Hot', 'Appointment', 'Orientation Confirmed', 'Completed', 'Not Interested', 'Inactive'],
    pr: ['High', 'Medium', 'Low'],
    vs: ['Planned', 'In Progress', 'Completed', 'Partially Completed', 'Rescheduled', 'Cancelled'],
    vt: ['Initial Outreach', 'Follow-up', 'Principal Meeting', 'Admin Meeting', 'Appointment', 'Orientation', 'Management Meeting'],
    oc: ['Positive', 'Neutral', 'Negative', 'Not Met', 'Appointment Fixed', 'Orientation Interested', 'Orientation Confirmed', 'Not Interested', 'Rescheduled'],
    na: ['Visit Principal', 'Meet Admin', 'Follow-up Call', 'Meet Management', 'Schedule Orientation', 'Confirm Orientation', 'Visit Head Branch', 'Send Information', 'Wait for Response', 'No Further Action'],
    ex: ['Manikandan', 'Peter', 'Pandurangan', 'Kingsten', 'Ajith Kumar', 'Saranya']
  };

  const maxRows = Math.max(...Object.values(listsData).map(a => a.length));
  for (let i = 0; i < maxRows; i++) {
    const r = ws9.addRow({
      p: listsData.p[i] || '',
      ls: listsData.ls[i] || '',
      pr: listsData.pr[i] || '',
      vs: listsData.vs[i] || '',
      vt: listsData.vt[i] || '',
      oc: listsData.oc[i] || '',
      na: listsData.na[i] || '',
      ex: listsData.ex[i] || ''
    });
    r.font = { name: 'Segoe UI', size: 9 };
    r.eachCell(c => { c.border = borderThin; });
  }

  // Save to root and public so user can download directly from the browser!
  const rootPath = path.join(__dirname, '..', 'ASET School Outreach — Field Operations.xlsx');
  const pubPath = path.join(__dirname, '..', 'public', 'ASET School Outreach — Field Operations.xlsx');
  
  if (!fs.existsSync(path.dirname(pubPath))) {
    fs.mkdirSync(path.dirname(pubPath), { recursive: true });
  }

  await wb.xlsx.writeFile(rootPath);
  await wb.xlsx.writeFile(pubPath);

  console.log(`✓ 9-Sheet Master Excel Workbook saved to:`);
  console.log(`  - ${rootPath}`);
  console.log(`  - ${pubPath}`);
}

generate9SheetMaster().catch(err => {
  console.error(err);
  process.exit(1);
});
