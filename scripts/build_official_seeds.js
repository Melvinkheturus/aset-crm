const fs = require('fs');
const path = require('path');

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

function escapeSql(str) {
  if (str === null || str === undefined) return 'NULL';
  return `'${String(str).replace(/'/g, "''")}'`;
}

const csvPath = path.join(__dirname, '..', 'aset', 'Aset School Reach Program - School Visit Report.csv');
const text = fs.readFileSync(csvPath, 'utf8');
const rows = parseCsv(text).slice(3).filter(r => r.length > 3 && r[3] && r[3].trim());

const schoolMap = new Map();
const visits = [];
const plans = [];

rows.forEach((r, idx) => {
  const schoolName = r[3].trim();
  const normKey = schoolName.toLowerCase();

  let school = schoolMap.get(normKey);
  if (!school) {
    const schoolCode = `SCH-${String(schoolMap.size + 1).padStart(4, '0')}`;
    let strength = parseInt(r[5]?.trim(), 10);
    if (isNaN(strength)) strength = null;

    let leadStatus = r[14]?.trim() || 'Cold';
    let priority = 'Medium';
    if (leadStatus === 'Hot') priority = 'High';
    else if (leadStatus === 'Cold') priority = 'Low';

    let address = r[4]?.trim() || '';
    let area = '';
    if (address) {
      const parts = address.split(',').map(s => s.trim());
      if (parts.length >= 3) {
        area = parts[parts.length - 3] || parts[parts.length - 2] || parts[0];
      } else {
        area = parts[0];
      }
    }

    school = {
      code: schoolCode,
      name: schoolName,
      area: area.substring(0, 100),
      address: address,
      student_strength: strength,
      contact_person: r[6]?.trim() || '',
      designation: r[7]?.trim() || r[8]?.trim() || '',
      phone: r[9]?.trim() || '',
      program: r[11]?.trim() || 'Career Guidance',
      lead_status: leadStatus,
      priority: priority,
      latest_remarks: r[24]?.trim() || r[25]?.trim() || '',
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

  const visit = {
    code: visitCode,
    schoolCode: school.code,
    schoolName: school.name,
    visitDate: visitDate,
    visitType: vType,
    personMet: r[6]?.trim() || school.contact_person,
    designation: r[7]?.trim() || r[8]?.trim() || school.designation,
    program: r[11]?.trim() || 'Career Guidance',
    outcome: r[21]?.trim() || 'Follow-up Required',
    leadStatusAfter: r[14]?.trim() || school.lead_status,
    nextAction: r[20]?.trim() || 'Follow-up Call',
    nextActionDate: nextDate,
    remarks: remarksCombined,
    createdBy: r[2]?.trim() || 'Manikandan'
  };
  visits.push(visit);

  if (nextDate || r[20]?.trim()) {
    const planCode = `PLN-${String(plans.length + 1).padStart(4, '0')}`;
    plans.push({
      code: planCode,
      schoolCode: school.code,
      schoolName: school.name,
      visitDate: nextDate || visitDate,
      purpose: r[20]?.trim() || 'Follow-up Call',
      priority: school.priority,
      status: 'Planned',
      notes: r[25]?.trim() || r[24]?.trim() || 'Scheduled follow-up'
    });
  }
});

// Output SQL generation
const schoolsArr = Array.from(schoolMap.values());

// 1. Schools SQL
const schoolStatements = schoolsArr.map(s => {
  return `(${escapeSql(s.code)}, ${escapeSql(s.name)}, ${escapeSql(s.area)}, ${escapeSql(s.address)}, ${s.student_strength === null ? 'NULL' : s.student_strength}, ${escapeSql(s.contact_person)}, ${escapeSql(s.designation)}, ${escapeSql(s.phone)}, ${escapeSql(s.program)}::program_type, ${escapeSql(s.lead_status)}::lead_status_type, ${escapeSql(s.priority)}::priority_type, ${escapeSql(s.latest_remarks)}, true)`;
});

const sqlSchools = `INSERT INTO schools (school_code, name, area, address, student_strength, contact_person, designation, phone, program, lead_status, priority, latest_remarks, is_active)
VALUES
${schoolStatements.join(',\n')};`;

// 2. Visits SQL
const visitStatements = visits.map(v => {
  return `(${escapeSql(v.code)}, (SELECT id FROM schools WHERE school_code = ${escapeSql(v.schoolCode)}), ${escapeSql(v.visitDate)}::date, ${escapeSql(v.visitType)}::visit_type_enum, ${escapeSql(v.personMet)}, ${escapeSql(v.designation)}, ${escapeSql(v.program)}::program_type, ${escapeSql(v.outcome)}, ${escapeSql(v.leadStatusAfter)}::lead_status_type, ${escapeSql(v.nextAction)}::next_action_type, ${v.nextActionDate ? escapeSql(v.nextActionDate) + '::date' : 'NULL'}, ${escapeSql(v.remarks)}, ${escapeSql(v.createdBy)})`;
});

const sqlVisits = `INSERT INTO visits (visit_code, school_id, visit_date, visit_type, person_met, designation, program, outcome, lead_status_after_visit, next_action, next_action_date, remarks, created_by)
VALUES
${visitStatements.join(',\n')};`;

// 3. Planned Visits SQL
const planStatements = plans.map(p => {
  return `(${escapeSql(p.code)}, (SELECT id FROM schools WHERE school_code = ${escapeSql(p.schoolCode)}), ${escapeSql(p.visitDate)}::date, ${escapeSql(p.purpose)}, ${escapeSql(p.priority)}::priority_type, ${escapeSql(p.status)}::visit_status_type, ${escapeSql(p.notes)})`;
});

const sqlPlans = `INSERT INTO planned_visits (plan_code, school_id, visit_date, purpose, priority, status, notes)
VALUES
${planStatements.join(',\n')};`;

const outDir = path.join(__dirname, '..', 'aset');
fs.writeFileSync(path.join(outDir, '01_seed_schools.sql'), sqlSchools);
fs.writeFileSync(path.join(outDir, '02_seed_visits.sql'), sqlVisits);
fs.writeFileSync(path.join(outDir, '03_seed_planned_visits.sql'), sqlPlans);

console.log('Successfully generated:');
console.log(`- 01_seed_schools.sql (${schoolsArr.length} schools)`);
console.log(`- 02_seed_visits.sql (${visits.length} visits)`);
console.log(`- 03_seed_planned_visits.sql (${plans.length} planned visits)`);
