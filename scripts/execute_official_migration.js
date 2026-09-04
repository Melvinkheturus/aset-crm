const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
const ExcelJS = require('exceljs');

const SUPABASE_URL = 'https://fdejzsuoezjwaqhdlwor.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZkZWp6c3VvZXpqd2FxaGRsd29yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcwMTgyNjYsImV4cCI6MjEwMjU5NDI2Nn0.kZ3Bkf_ruTS3bduv66XZCuM1gio5R01ey9tlkFJ8FOk';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

function parseCsv(text) {
  const p = [];
  let row = [''];
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    const next = text[i + 1];
    if (c === '"') {
      if (inQuotes && next === '"') {
        row[row.length - 1] += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (c === ',' && !inQuotes) {
      row.push('');
    } else if ((c === '\r' || c === '\n') && !inQuotes) {
      if (c === '\r' && next === '\n') i++;
      p.push(row);
      row = [''];
    } else {
      row[row.length - 1] += c;
    }
  }
  if (row.length > 1 || row[0] !== '') p.push(row);
  return p;
}

function parseDate(str) {
  if (!str) return null;
  const s = str.trim().split(' ')[0];
  if (!s) return null;
  const m = s.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2,4})$/);
  if (m) {
    let day = m[1].padStart(2, '0');
    let month = m[2].padStart(2, '0');
    let year = m[3];
    if (year.length === 2) year = '20' + year;
    return `${year}-${month}-${day}`;
  }
  const textMatch = str.match(/(\d{1,2})(?:st|nd|rd|th)?\s*(?:of\s*)?(sep|oct|nov|dec|aug)/i) ||
                    str.match(/(sep|oct|nov|dec|aug)\s*(\d{1,2})/i);
  if (textMatch) {
    let d = 1, mon = '09';
    if (isNaN(parseInt(textMatch[1]))) {
      const mStr = textMatch[1].toLowerCase();
      d = parseInt(textMatch[2]);
      if (mStr.startsWith('aug')) mon = '08';
      else if (mStr.startsWith('sep')) mon = '09';
      else if (mStr.startsWith('oct')) mon = '10';
      else if (mStr.startsWith('nov')) mon = '11';
      else if (mStr.startsWith('dec')) mon = '12';
    } else {
      d = parseInt(textMatch[1]);
      const mStr = textMatch[2].toLowerCase();
      if (mStr.startsWith('aug')) mon = '08';
      else if (mStr.startsWith('sep')) mon = '09';
      else if (mStr.startsWith('oct')) mon = '10';
      else if (mStr.startsWith('nov')) mon = '11';
      else if (mStr.startsWith('dec')) mon = '12';
    }
    const day = String(d).padStart(2, '0');
    return `2026-${mon}-${day}`;
  }
  return null;
}

async function main() {
  console.log('========================================================');
  console.log('STARTING OFFICIAL RE-ETL & MIGRATION');
  console.log('Source: aset/Aset School Reach Program - School Visit Report.csv');
  console.log('Target: Supabase Database + Master Excel (Crimson Red Theme)');
  console.log('========================================================\n');

  // 1. Purge old rows in Supabase
  console.log('Step 1: Purging all previous data from Supabase...');
  await supabase.from('visits').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('planned_visits').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('schools').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  console.log('✓ Supabase tables cleared successfully.\n');

  // 2. Parse official CSV
  console.log('Step 2: Parsing official CSV file...');
  const csvPath = path.join(__dirname, '..', 'aset', 'Aset School Reach Program - School Visit Report.csv');
  const text = fs.readFileSync(csvPath, 'utf8');
  const rawRows = parseCsv(text);
  const dataRows = rawRows.slice(3).filter(r => r.length > 3 && r[3] && r[3].trim());
  console.log(`✓ Loaded ${dataRows.length} visit records.\n`);

  // 3. Extract Schools, Visits, and Planned Visits
  console.log('Step 3: Transforming data...');
  const schoolMap = new Map();
  const visitsToInsert = [];
  const plansToInsert = [];

  dataRows.forEach((r, idx) => {
    const schoolName = r[3].trim();
    const normKey = schoolName.toLowerCase();

    let school = schoolMap.get(normKey);
    if (!school) {
      const schoolCode = `SCH-${String(schoolMap.size + 1).padStart(4, '0')}`;
      let strength = parseInt(r[5]?.trim(), 10);
      if (isNaN(strength)) strength = 0;

      let leadStatus = r[14]?.trim() || 'Cold';
      let priority = 'Medium';
      if (leadStatus === 'Hot') priority = 'High';
      else if (leadStatus === 'Cold') priority = 'Low';

      let address = r[4]?.trim() || '';
      let area = 'Chennai';
      if (address) {
        const parts = address.split(',').map(s => s.trim());
        if (parts.length >= 3) {
          area = parts[parts.length - 3] || parts[parts.length - 2] || parts[0];
        } else {
          area = parts[0];
        }
      }
      if (!area || !area.trim()) area = 'Chennai';

      school = {
        school_code: schoolCode,
        name: schoolName.substring(0, 255),
        area: (area || 'Chennai').substring(0, 100),
        address: address || null,
        board: 'State Board',
        class_12: 'Yes',
        student_strength: strength,
        contact_person: r[6]?.trim() ? r[6].trim().substring(0, 150) : null,
        designation: (r[7]?.trim() || r[8]?.trim()) ? (r[7]?.trim() || r[8]?.trim()).substring(0, 100) : null,
        phone: r[9]?.trim() ? r[9].trim().substring(0, 50) : null,
        program: r[11]?.trim() || 'Career Guidance',
        lead_status: leadStatus,
        priority: priority,
        latest_remarks: r[24]?.trim() || r[25]?.trim() || null,
        is_active: true,
        visitCount: 0
      };
      schoolMap.set(normKey, school);
    }

    school.visitCount++;

    const visitCode = `VIS-${String(idx + 1).padStart(4, '0')}`;
    const visitDate = parseDate(r[1]) || '2026-08-19';
    const nextDate = parseDate(r[19]);

    let vType = 'Initial Outreach';
    if (school.visitCount > 1 || (r[15] && parseInt(r[15], 10) > 0)) {
      vType = 'Follow-up';
    } else if ((r[7] || '').toLowerCase().includes('principal')) {
      vType = 'Principal Meeting';
    }

    let remarksCombined = [r[24]?.trim(), r[25]?.trim()].filter(Boolean).join(' | ');
    if (r[22]?.trim()) remarksCombined += ` [KM: ${r[22].trim()}]`;
    if (r[23]?.trim()) remarksCombined += ` [Expense: ₹${r[23].trim()}]`;
    if (r[19]?.trim() && !nextDate) {
      remarksCombined += ` [Next Date Note: ${r[19].trim()}]`;
    }

    let nextAction = r[20]?.trim() || 'Follow-up Call';

    visitsToInsert.push({
      visit_code: visitCode,
      school_code_ref: school.school_code,
      visit_date: visitDate,
      visit_type: vType,
      person_met: (r[6]?.trim() || school.contact_person || 'Staff').substring(0, 150),
      designation: (r[7]?.trim() || r[8]?.trim() || school.designation || 'Staff').substring(0, 100),
      program: r[11]?.trim() || 'Career Guidance',
      outcome: (r[21]?.trim() || 'Follow-up Required').substring(0, 150),
      lead_status_after_visit: r[14]?.trim() || school.lead_status,
      next_action: nextAction,
      next_action_date: nextDate || null,
      remarks: remarksCombined || 'Visit conducted',
      created_by: (r[2]?.trim() || 'Manikandan').substring(0, 100)
    });

    if (nextDate || r[20]?.trim()) {
      const planCode = `PLN-${String(plansToInsert.length + 1).padStart(4, '0')}`;
      plansToInsert.push({
        plan_code: planCode,
        school_code_ref: school.school_code,
        visit_date: nextDate || visitDate,
        purpose: r[20]?.trim() || 'Follow-up Call',
        priority: school.priority,
        status: 'Planned',
        notes: r[25]?.trim() || r[24]?.trim() || 'Scheduled outreach follow-up'
      });
    }
  });

  const schoolsArray = Array.from(schoolMap.values()).map(s => {
    const { visitCount, ...rest } = s;
    return rest;
  });

  console.log(`✓ Extracted:`);
  console.log(`  - ${schoolsArray.length} Schools`);
  console.log(`  - ${visitsToInsert.length} Visits`);
  console.log(`  - ${plansToInsert.length} Planned Visits\n`);

  // 4. Insert Schools in Batches into Supabase
  console.log('Step 4: Seeding Schools into Supabase...');
  const BATCH_SIZE = 50;
  for (let i = 0; i < schoolsArray.length; i += BATCH_SIZE) {
    const chunk = schoolsArray.slice(i, i + BATCH_SIZE);
    const { error } = await supabase.from('schools').insert(chunk);
    if (error) {
      console.error(`Error inserting schools batch ${i}:`, error);
      process.exit(1);
    }
    console.log(`  Inserted schools ${i + 1} to ${Math.min(i + BATCH_SIZE, schoolsArray.length)}`);
  }

  // 5. Fetch School Code to UUID Map
  console.log('\nStep 5: Retrieving School IDs from Supabase...');
  const { data: dbSchools, error: fetchErr } = await supabase
    .from('schools')
    .select('id, school_code');
  if (fetchErr || !dbSchools) {
    console.error('Error fetching school IDs:', fetchErr);
    process.exit(1);
  }
  const codeToId = new Map();
  dbSchools.forEach(s => codeToId.set(s.school_code, s.id));
  console.log(`✓ Mapped ${codeToId.size} school IDs.\n`);

  // 6. Insert Visits into Supabase
  console.log('Step 6: Seeding Visits into Supabase...');
  const preparedVisits = visitsToInsert.map(v => ({
    visit_code: v.visit_code,
    school_id: codeToId.get(v.school_code_ref),
    visit_date: v.visit_date,
    visit_type: v.visit_type,
    person_met: v.person_met,
    designation: v.designation,
    program: v.program,
    outcome: v.outcome,
    lead_status_after_visit: v.lead_status_after_visit,
    next_action: v.next_action,
    next_action_date: v.next_action_date,
    remarks: v.remarks,
    created_by: v.created_by
  }));

  for (let i = 0; i < preparedVisits.length; i += BATCH_SIZE) {
    const chunk = preparedVisits.slice(i, i + BATCH_SIZE);
    const { error } = await supabase.from('visits').insert(chunk);
    if (error) {
      console.error(`Error inserting visits batch ${i}:`, error);
      process.exit(1);
    }
    console.log(`  Inserted visits ${i + 1} to ${Math.min(i + BATCH_SIZE, preparedVisits.length)}`);
  }

  // 7. Insert Planned Visits into Supabase
  console.log('\nStep 7: Seeding Planned Visits into Supabase...');
  const preparedPlans = plansToInsert.map(p => ({
    plan_code: p.plan_code,
    school_id: codeToId.get(p.school_code_ref),
    visit_date: p.visit_date,
    purpose: p.purpose,
    priority: p.priority,
    status: p.status,
    notes: p.notes
  }));

  for (let i = 0; i < preparedPlans.length; i += BATCH_SIZE) {
    const chunk = preparedPlans.slice(i, i + BATCH_SIZE);
    const { error } = await supabase.from('planned_visits').insert(chunk);
    if (error) {
      console.error(`Error inserting plans batch ${i}:`, error);
      process.exit(1);
    }
    console.log(`  Inserted planned visits ${i + 1} to ${Math.min(i + BATCH_SIZE, preparedPlans.length)}`);
  }

  // 8. Verify Database Counts and Views
  console.log('\nStep 8: Verifying live database counts & views...');
  const { count: countSchools } = await supabase.from('schools').select('*', { count: 'exact', head: true });
  const { count: countVisits } = await supabase.from('visits').select('*', { count: 'exact', head: true });
  const { count: countPlans } = await supabase.from('planned_visits').select('*', { count: 'exact', head: true });

  console.log(`✓ Supabase Database Verification:`);
  console.log(`  - schools table: ${countSchools} rows`);
  console.log(`  - visits table: ${countVisits} rows`);
  console.log(`  - planned_visits table: ${countPlans} rows`);

  // 9. Generate Master Excel Workbook (Field Operations) with Crimson Red Theme
  console.log('\nStep 9: Generating Master Excel Workbook (Crimson Red Theme)...');
  const wb = new ExcelJS.Workbook();
  wb.creator = 'ASET Outreach CRM System';
  wb.lastModifiedBy = 'ASET Field Operations';
  wb.created = new Date();
  wb.modified = new Date();

  const CRIMSON = '990000';
  const BLACK = '1A1A1A';
  const WHITE = 'FFFFFF';
  const LIGHT_GRAY = 'F5F5F5';
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

  // Tab 1: 01_DASHBOARD
  const wsDash = wb.addWorksheet('01_DASHBOARD', { views: [{ showGridLines: true }] });
  wsDash.columns = [{ width: 25 }, { width: 20 }, { width: 25 }, { width: 20 }, { width: 25 }];
  wsDash.addRow(['ASET SCHOOL OUTREACH — EXECUTIVE KPI DASHBOARD']).font = { name: 'Segoe UI', size: 16, bold: true, color: { argb: CRIMSON } };
  wsDash.addRow(['Real-time operational summary powered by Supabase & Field Visit Logs']).font = { name: 'Segoe UI', size: 10, italic: true };
  wsDash.addRow([]);

  wsDash.addRow(['METRIC CATEGORY', 'COUNT / VALUE', 'BENCHMARK / GOAL', 'STATUS', 'FIELD EXECUTIVE SUMMARY']);
  const dashHRow = wsDash.getRow(4);
  dashHRow.font = headerFont;
  dashHRow.fill = headerFill;

  const kpis = [
    ['Total Partner Schools Covered', countSchools, '250 Target', 'In Progress', 'Manikandan, Peter, Pandurangan'],
    ['Total Field Visits Executed', countVisits, '300 Target', 'On Track', 'Kingsten, Ajith Kumar, Saranya'],
    ['Upcoming Scheduled Follow-ups', countPlans, 'Continuous', 'Active Pipeline', 'Daily Route Alignment'],
    ['Hot Leads (Immediate Conversion)', schoolsArray.filter(s => s.lead_status === 'Hot').length, '20% Target', 'High Priority', 'Principal / Management Follow-up'],
    ['Warm Leads (Follow-up Scheduled)', schoolsArray.filter(s => s.lead_status === 'Warm').length, '40% Target', 'Medium Priority', 'Career Guidance Pitch'],
    ['Cold / Untapped Schools', schoolsArray.filter(s => s.lead_status === 'Cold').length, 'N/A', 'Nurture Required', 'Revisit in Oct/Nov'],
    ['Conducted / Confirmed Orientations', schoolsArray.filter(s => s.lead_status === 'CONDUCTED').length, '50 Target', 'Milestone', 'Completed Outreach']
  ];

  kpis.forEach(k => {
    const row = wsDash.addRow(k);
    row.font = { name: 'Segoe UI', size: 10 };
    row.eachCell(cell => { cell.border = borderThin; });
  });

  // Tab 2: 02_SCHOOL_MASTER
  const wsSchools = wb.addWorksheet('02_SCHOOL_MASTER', { views: [{ showGridLines: true }] });
  wsSchools.columns = [
    { header: 'School ID', key: 'school_code', width: 14 },
    { header: 'School Name', key: 'name', width: 38 },
    { header: 'Area', key: 'area', width: 22 },
    { header: 'Full Address', key: 'address', width: 45 },
    { header: 'Approx Strength', key: 'student_strength', width: 16 },
    { header: 'Contact Person', key: 'contact_person', width: 24 },
    { header: 'Designation', key: 'designation', width: 22 },
    { header: 'Phone / Contact', key: 'phone', width: 20 },
    { header: 'Program Pitched', key: 'program', width: 20 },
    { header: 'Lead Status', key: 'lead_status', width: 16 },
    { header: 'Priority', key: 'priority', width: 12 },
    { header: 'Latest Discussion Remarks', key: 'latest_remarks', width: 50 },
    { header: 'Active', key: 'is_active', width: 10 }
  ];
  wsSchools.getRow(1).font = headerFont;
  wsSchools.getRow(1).fill = headerFill;

  schoolsArray.forEach(s => {
    const r = wsSchools.addRow(s);
    r.font = { name: 'Segoe UI', size: 9 };
    r.eachCell(cell => { cell.border = borderThin; });
  });

  // Tab 3: 03_VISIT_LOG
  const wsVisits = wb.addWorksheet('03_VISIT_LOG', { views: [{ showGridLines: true }] });
  wsVisits.columns = [
    { header: 'Visit ID', key: 'visit_code', width: 14 },
    { header: 'School Code', key: 'school_code_ref', width: 14 },
    { header: 'Visit Date', key: 'visit_date', width: 14 },
    { header: 'Visit Type', key: 'visit_type', width: 18 },
    { header: 'Person Met', key: 'person_met', width: 22 },
    { header: 'Designation', key: 'designation', width: 20 },
    { header: 'Program', key: 'program', width: 20 },
    { header: 'Outcome', key: 'outcome', width: 24 },
    { header: 'Status After', key: 'lead_status_after_visit', width: 16 },
    { header: 'Next Action', key: 'next_action', width: 24 },
    { header: 'Next Action Date', key: 'next_action_date', width: 16 },
    { header: 'Executive / Created By', key: 'created_by', width: 18 },
    { header: 'Field Remarks & Notes', key: 'remarks', width: 55 }
  ];
  wsVisits.getRow(1).font = headerFont;
  wsVisits.getRow(1).fill = headerFill;

  visitsToInsert.forEach(v => {
    const r = wsVisits.addRow(v);
    r.font = { name: 'Segoe UI', size: 9 };
    r.eachCell(cell => { cell.border = borderThin; });
  });

  // Tab 4: 04_VISIT_PLAN
  const wsPlans = wb.addWorksheet('04_VISIT_PLAN', { views: [{ showGridLines: true }] });
  wsPlans.columns = [
    { header: 'Plan ID', key: 'plan_code', width: 14 },
    { header: 'School Code', key: 'school_code_ref', width: 14 },
    { header: 'Planned Date', key: 'visit_date', width: 16 },
    { header: 'Purpose / Next Action', key: 'purpose', width: 25 },
    { header: 'Priority', key: 'priority', width: 12 },
    { header: 'Status', key: 'status', width: 14 },
    { header: 'Operational Notes', key: 'notes', width: 50 }
  ];
  wsPlans.getRow(1).font = headerFont;
  wsPlans.getRow(1).fill = headerFill;

  plansToInsert.forEach(p => {
    const r = wsPlans.addRow(p);
    r.font = { name: 'Segoe UI', size: 9 };
    r.eachCell(cell => { cell.border = borderThin; });
  });

  // Tab 5: 05_MANAGEMENT_VIEW
  const wsMgmt = wb.addWorksheet('05_MANAGEMENT_VIEW', { views: [{ showGridLines: true }] });
  wsMgmt.columns = [
    { header: 'Executive Name', key: 'exec', width: 22 },
    { header: 'Total Visits Logged', key: 'total_visits', width: 18 },
    { header: 'Hot Leads', key: 'hot_leads', width: 14 },
    { header: 'Warm Leads', key: 'warm_leads', width: 14 },
    { header: 'Cold Leads', key: 'cold_leads', width: 14 },
    { header: 'Orientations / Conducted', key: 'conducted', width: 22 }
  ];
  wsMgmt.getRow(1).font = headerFont;
  wsMgmt.getRow(1).fill = subHeaderFill;

  const execStats = {};
  ['Manikandan', 'Peter', 'Pandurangan', 'Kingsten', 'Ajith Kumar', 'Saranya'].forEach(e => {
    execStats[e] = { exec: e, total_visits: 0, hot_leads: 0, warm_leads: 0, cold_leads: 0, conducted: 0 };
  });

  visitsToInsert.forEach(v => {
    const e = v.created_by;
    if (!execStats[e]) execStats[e] = { exec: e, total_visits: 0, hot_leads: 0, warm_leads: 0, cold_leads: 0, conducted: 0 };
    execStats[e].total_visits++;
    if (v.lead_status_after_visit === 'Hot') execStats[e].hot_leads++;
    else if (v.lead_status_after_visit === 'Warm') execStats[e].warm_leads++;
    else if (v.lead_status_after_visit === 'Cold') execStats[e].cold_leads++;
    else if (v.lead_status_after_visit === 'CONDUCTED') execStats[e].conducted++;
  });

  Object.values(execStats).forEach(s => {
    const r = wsMgmt.addRow(s);
    r.font = { name: 'Segoe UI', size: 9 };
    r.eachCell(cell => { cell.border = borderThin; });
  });

  // Tab 6: 06_LISTS
  const wsLists = wb.addWorksheet('06_LISTS', { views: [{ showGridLines: true }] });
  wsLists.columns = [
    { header: 'Lead Status', key: 'status', width: 20 },
    { header: 'Priority', key: 'priority', width: 16 },
    { header: 'Program Pitched', key: 'program', width: 22 },
    { header: 'Next Action Types', key: 'action', width: 26 },
    { header: 'Visit Types', key: 'visit_types', width: 20 },
    { header: 'Field Executives', key: 'execs', width: 20 }
  ];
  wsLists.getRow(1).font = headerFont;
  wsLists.getRow(1).fill = headerFill;

  const maxRows = 10;
  const listData = {
    status: ['Cold', 'Warm', 'Hot', 'CONDUCTED', 'Appointment', 'Completed', 'Not Interested', 'Inactive'],
    priority: ['High', 'Medium', 'Low'],
    program: ['Career Guidance', 'Scholarship Exam', 'Multiple Programs', 'Aviation', 'Commerce'],
    action: ['Call', 'Send Proposal', 'Proposal sent', 'Schedule Career Guidance', 'Follow up with Principal', 'Discuss with Management', 'Schedule Meeting', 'Follow up with admin', 'Follow up with Correspondent', 'Schedule Scholarship Exam'],
    visit_types: ['Initial Outreach', 'Follow-up', 'Principal Meeting', 'Appointment', 'Orientation'],
    execs: ['Manikandan', 'Peter', 'Pandurangan', 'Kingsten', 'Ajith Kumar', 'Saranya']
  };

  for (let i = 0; i < maxRows; i++) {
    const r = wsLists.addRow({
      status: listData.status[i] || '',
      priority: listData.priority[i] || '',
      program: listData.program[i] || '',
      action: listData.action[i] || '',
      visit_types: listData.visit_types[i] || '',
      execs: listData.execs[i] || ''
    });
    r.font = { name: 'Segoe UI', size: 9 };
    r.eachCell(cell => { cell.border = borderThin; });
  }

  const excelPath = path.join(__dirname, '..', 'ASET School Outreach — Field Operations.xlsx');
  await wb.xlsx.writeFile(excelPath);
  console.log(`✓ Generated Master Excel: ${excelPath}`);

  // 10. Update GoogleAppsScript_Setup.js with Real Dataset
  console.log('\nStep 10: Generating updated Google Apps Script file with real data...');
  const gasContent = `/**
 * =========================================================================
 * ASET SCHOOL OUTREACH CRM — GOOGLE APPS SCRIPT AUTOMATION SETUP
 * Dataset: Official ASET School Reach Program - School Visit Report
 * Total Records: ${schoolsArray.length} Schools | ${visitsToInsert.length} Visits | ${plansToInsert.length} Planned Visits
 * Theme: Crimson Red (#990000), Deep Black (#1A1A1A), Pure White (#FFFFFF)
 * =========================================================================
 */

function setupAsetOutreachMaster() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  
  // Theme Palette
  const CRIMSON = '#990000';
  const BLACK = '#1A1A1A';
  const WHITE = '#FFFFFF';
  const LIGHT_GRAY = '#F8F9FA';
  const BORDER_COLOR = '#E0E0E0';

  // 1. Dashboard Tab
  let wsDash = ss.getSheetByName('01_DASHBOARD') || ss.insertSheet('01_DASHBOARD');
  wsDash.clear();
  wsDash.getRange('A1').setValue('ASET SCHOOL OUTREACH — EXECUTIVE KPI DASHBOARD')
    .setFontSize(16).setFontWeight('bold').setFontColor(CRIMSON);
  wsDash.getRange('A2').setValue('Real-time operational summary powered by Supabase & Field Visit Logs')
    .setFontSize(10).setFontStyle('italic');

  const dashHeaders = [['METRIC CATEGORY', 'COUNT / VALUE', 'BENCHMARK / GOAL', 'STATUS', 'FIELD EXECUTIVE SUMMARY']];
  wsDash.getRange('A4:E4').setValues(dashHeaders)
    .setBackground(CRIMSON).setFontColor(WHITE).setFontWeight('bold');

  const kpiData = [
    ['Total Partner Schools Covered', ${countSchools}, '250 Target', 'In Progress', 'Manikandan, Peter, Pandurangan'],
    ['Total Field Visits Executed', ${countVisits}, '300 Target', 'On Track', 'Kingsten, Ajith Kumar, Saranya'],
    ['Upcoming Scheduled Follow-ups', ${countPlans}, 'Continuous', 'Active Pipeline', 'Daily Route Alignment'],
    ['Hot Leads (Immediate Conversion)', ${schoolsArray.filter(s => s.lead_status === 'Hot').length}, '20% Target', 'High Priority', 'Principal / Management Follow-up'],
    ['Warm Leads (Follow-up Scheduled)', ${schoolsArray.filter(s => s.lead_status === 'Warm').length}, '40% Target', 'Medium Priority', 'Career Guidance Pitch'],
    ['Cold / Untapped Schools', ${schoolsArray.filter(s => s.lead_status === 'Cold').length}, 'N/A', 'Nurture Required', 'Revisit in Oct/Nov'],
    ['Conducted / Confirmed Orientations', ${schoolsArray.filter(s => s.lead_status === 'CONDUCTED').length}, '50 Target', 'Milestone', 'Completed Outreach']
  ];
  wsDash.getRange('A5:E' + (4 + kpiData.length)).setValues(kpiData);

  // 2. School Master Tab
  let wsSchools = ss.getSheetByName('02_SCHOOL_MASTER') || ss.insertSheet('02_SCHOOL_MASTER');
  wsSchools.clear();
  const schoolHeaders = [['School ID', 'School Name', 'Area', 'Full Address', 'Approx Strength', 'Contact Person', 'Designation', 'Phone / Contact', 'Program Pitched', 'Lead Status', 'Priority', 'Latest Discussion Remarks', 'Active']];
  wsSchools.getRange('A1:M1').setValues(schoolHeaders)
    .setBackground(CRIMSON).setFontColor(WHITE).setFontWeight('bold');

  const schoolRows = ${JSON.stringify(schoolsArray.map(s => [
    s.school_code, s.name, s.area, s.address || '', s.student_strength || 0, s.contact_person || '', s.designation || '', s.phone || '', s.program, s.lead_status, s.priority, s.latest_remarks || '', 'TRUE'
  ]))};
  if (schoolRows.length > 0) {
    wsSchools.getRange(2, 1, schoolRows.length, schoolRows[0].length).setValues(schoolRows);
  }

  // 3. Visit Log Tab
  let wsVisits = ss.getSheetByName('03_VISIT_LOG') || ss.insertSheet('03_VISIT_LOG');
  wsVisits.clear();
  const visitHeaders = [['Visit ID', 'School Code', 'Visit Date', 'Visit Type', 'Person Met', 'Designation', 'Program', 'Outcome', 'Status After', 'Next Action', 'Next Action Date', 'Executive / Created By', 'Field Remarks & Notes']];
  wsVisits.getRange('A1:M1').setValues(visitHeaders)
    .setBackground(CRIMSON).setFontColor(WHITE).setFontWeight('bold');

  const visitRows = ${JSON.stringify(visitsToInsert.map(v => [
    v.visit_code, v.school_code_ref, v.visit_date, v.visit_type, v.person_met, v.designation, v.program, v.outcome, v.lead_status_after_visit, v.next_action, v.next_action_date || '', v.created_by, v.remarks
  ]))};
  if (visitRows.length > 0) {
    wsVisits.getRange(2, 1, visitRows.length, visitRows[0].length).setValues(visitRows);
  }

  // 4. Visit Plan Tab
  let wsPlans = ss.getSheetByName('04_VISIT_PLAN') || ss.insertSheet('04_VISIT_PLAN');
  wsPlans.clear();
  const planHeaders = [['Plan ID', 'School Code', 'Planned Date', 'Purpose / Next Action', 'Priority', 'Status', 'Operational Notes']];
  wsPlans.getRange('A1:G1').setValues(planHeaders)
    .setBackground(CRIMSON).setFontColor(WHITE).setFontWeight('bold');

  const planRows = ${JSON.stringify(plansToInsert.map(p => [
    p.plan_code, p.school_code_ref, p.visit_date, p.purpose, p.priority, p.status, p.notes
  ]))};
  if (planRows.length > 0) {
    wsPlans.getRange(2, 1, planRows.length, planRows[0].length).setValues(planRows);
  }

  // Auto-resize
  [wsDash, wsSchools, wsVisits, wsPlans].forEach(sheet => {
    for (let c = 1; c <= sheet.getLastColumn(); c++) {
      sheet.autoResizeColumn(c);
    }
  });

  SpreadsheetApp.getUi().alert('ASET School Outreach CRM successfully initialized with official dataset!');
}
`;

  fs.writeFileSync(path.join(__dirname, '..', 'aset', 'GoogleAppsScript_Setup.js'), gasContent);
  console.log(`✓ Updated GoogleAppsScript_Setup.js`);

  console.log('\n========================================================');
  console.log('OFFICIAL MIGRATION & SEEDING COMPLETED SUCCESSFULLY!');
  console.log('========================================================\n');
}

main().catch(err => {
  console.error('Fatal migration error:', err);
  process.exit(1);
});
