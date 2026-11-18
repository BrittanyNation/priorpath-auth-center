// PriorPath resources page — commented as study code.
// Patterns: a checklist whose items come from data per service, checkbox state
// persisted per service in localStorage, a derived progress percentage,
// a searchable glossary rendered from data, FAQ accordions, and a
// duplicate-aware newsletter signup.

// ---------- Checklist data: documents differ by service, on purpose ----------
const CHECKLISTS = {
 'MRI imaging': ['Eligibility confirmed for the date of service','Signed imaging order with diagnosis code','Notes from the last two visits about this condition','Record of conservative care tried, with dates','Relevant prior imaging reports','Rendering facility name and tax ID'],
 'Physical therapy visits': ['Eligibility confirmed for the date of service','Signed therapy order with visit count requested','Initial evaluation notes','Functional goals written in measurable terms','Plan of care signed by the therapist',' Referring provider notes'],
 'Specialty office visit': ['Eligibility confirmed for the date of service','Referral from the primary care provider, if the plan requires one','Reason for the specialty visit in plain words','Recent visit notes about this condition','List of current medications','Specialist name and network status checked'],
 'Outpatient surgery': ['Eligibility confirmed for the date of service','Signed surgical order with procedure code','History and physical dated within the payer window','Notes showing conservative care or why it is not appropriate','Anesthesia plan if the payer asks for it','Facility name and tax ID'],
 'Home health visits': ['Eligibility confirmed for the date of service','Signed home health order with visit count','Face to face encounter note','Homebound status explained in the notes','Plan of care with skilled need stated','Agency name and tax ID'],
 'Durable medical equipment': ['Eligibility confirmed for the date of service','Signed equipment order with diagnosis code','Notes showing the member meets the coverage criteria','Face to face visit note within the payer window','Supplier name and tax ID','Delivery address confirmed']
};
// Fix a deliberate data typo guard: trim every item once at load.
Object.keys(CHECKLISTS).forEach(k => CHECKLISTS[k] = CHECKLISTS[k].map(s => s.trim()));

let checklistState = JSON.parse(localStorage.getItem('pp_checklists') || '{}');
const serviceSelect = document.getElementById('serviceSelect');
Object.keys(CHECKLISTS).forEach(name => {
  const o = document.createElement('option'); o.textContent = name; serviceSelect.appendChild(o);
});
function renderChecklist(){
  const service = serviceSelect.value;
  const items = CHECKLISTS[service];
  const done = checklistState[service] || [];
  const box = document.getElementById('checklistBox'); box.innerHTML = '';
  items.forEach((item, i) => {
    const row = document.createElement('label'); row.className = 'checkitem';
    const cb = document.createElement('input'); cb.type = 'checkbox'; cb.checked = done.includes(i);
    cb.addEventListener('change', () => {
      const set = new Set(checklistState[service] || []);
      if (cb.checked) set.add(i); else set.delete(i);
      checklistState[service] = [...set];
      localStorage.setItem('pp_checklists', JSON.stringify(checklistState));
      renderChecklist();
    });
    const span = document.createElement('span'); span.textContent = item;
    row.appendChild(cb); row.appendChild(span); box.appendChild(row);
  });
  const pct = Math.round((done.length / items.length) * 100);
  document.getElementById('progressBar').style.width = pct + '%';
  document.getElementById('progressText').textContent = done.length + ' of ' + items.length + ' documents ready (' + pct + ' percent) for ' + service;
  document.getElementById('toTracker').style.display = done.length === items.length ? 'inline-block' : 'none';
}
serviceSelect.addEventListener('change', renderChecklist);
document.getElementById('resetChecklist').addEventListener('click', () => {
  checklistState[serviceSelect.value] = [];
  localStorage.setItem('pp_checklists', JSON.stringify(checklistState));
  renderChecklist();
});
renderChecklist();

// ---------- Glossary: searchable, rendered from data ----------
const GLOSSARY = [
 {term:'Prior authorization', def:'A payer decision, made before care, that a service is covered under the member plan.'},
 {term:'Eligibility', def:'Whether the member coverage is active on a given date, and what the plan covers.'},
 {term:'Peer to peer', def:'A call where the ordering provider explains the clinical need to a payer reviewer.'},
 {term:'Denial', def:'A payer decision that a request is not approved, with the reason stated in a letter.'},
 {term:'Appeal', def:'A written request asking the payer to reconsider a denial, with added evidence.'},
 {term:'Medical necessity', def:'The clinical standard payers use: care that is appropriate, needed, and proven for the condition.'},
 {term:'Rendering provider', def:'The clinician or facility that will actually provide the service.'},
 {term:'Date of service', def:'The day the care is planned to happen; eligibility and rules are checked against this date.'}
];
function renderGlossary(){
  const q = document.getElementById('glossarySearch').value.trim().toLowerCase();
  const list = GLOSSARY.filter(g => !q || (g.term + ' ' + g.def).toLowerCase().includes(q));
  const box = document.getElementById('glossaryBox'); box.innerHTML = '';
  const table = document.createElement('table');
  table.innerHTML = '<tr><th>Term</th><th>What it means</th></tr>';
  list.forEach(g => {
    const tr = document.createElement('tr');
    const td1 = document.createElement('td'); td1.textContent = g.term;
    const td2 = document.createElement('td'); td2.textContent = g.def;
    tr.appendChild(td1); tr.appendChild(td2); table.appendChild(tr);
  });
  if (list.length) box.appendChild(table);
  document.getElementById('glossaryCount').textContent = 'Showing ' + list.length + ' of ' + GLOSSARY.length + ' terms';
  document.getElementById('glossaryEmpty').hidden = list.length !== 0;
}
document.getElementById('glossarySearch').addEventListener('input', renderGlossary);
renderGlossary();

// ---------- FAQ accordions ----------
const FAQS = [
 ['How long does a standard request take?','Most payers answer standard requests within a set review window, often several business days. The exact window is in the member plan and on the payer portal. Submitting a complete packet the first time is the best way to stay inside it.'],
 ['Does an approval promise payment?','No. Approval means the service is covered in principle. Payment still depends on eligibility on the date of service, correct coding, and the claim matching the approved request.'],
 ['What is the most common denial reason?','Missing or unclear clinical documentation. The denial letter names what the reviewer needed; an appeal that adds exactly that evidence has the best chance.'],
 ['When should a request be marked urgent?','Only when waiting the standard window could seriously harm the member. State the harm plainly and attach the note that supports it.'],
 ['Who can start a request?','In most offices, trained support and authorization staff prepare and submit requests, and the ordering provider signs the order and supplies the clinical notes.'],
 ['What should I save after submitting?','The payer reference number, the date and time submitted, the packet you sent, and every status note after that. Those four items resolve most later questions.']
];
const faqBox = document.getElementById('faqBox');
FAQS.forEach(([q,a]) => {
  const div = document.createElement('div'); div.className = 'faq';
  const btn = document.createElement('button'); btn.type = 'button'; btn.textContent = q;
  const body = document.createElement('div'); body.className = 'body'; body.textContent = a;
  btn.addEventListener('click', () => {
    const wasOpen = div.classList.contains('open');
    faqBox.querySelectorAll('.faq').forEach(f => f.classList.remove('open'));
    if (!wasOpen) div.classList.add('open');
  });
  div.appendChild(btn); div.appendChild(body); faqBox.appendChild(div);
});

// ---------- Letter signup with duplicate recognition ----------
document.getElementById('letterForm').addEventListener('submit', e => {
  e.preventDefault();
  const email = document.getElementById('letterEmail').value.trim().toLowerCase();
  const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  document.getElementById('eLetter').textContent = ok ? '' : 'Please enter a valid email address.';
  if (!ok) return;
  let subs = JSON.parse(localStorage.getItem('pp_letter') || '[]');
  const msg = document.getElementById('letterMsg');
  if (subs.includes(email)) {
    msg.innerHTML = '<div class="success">That address is already signed up for the PriorPath Letter. No duplicate was added.</div>';
    return;
  }
  subs.push(email); localStorage.setItem('pp_letter', JSON.stringify(subs));
  msg.innerHTML = '<div class="success">You are signed up for the PriorPath Letter. This sample signup is stored only in your browser.</div>';
  e.target.reset();
});
