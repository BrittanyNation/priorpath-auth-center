// PriorPath request tracker — commented as study code.
// Patterns: validated form ending in a generated reference, state persisted to
// localStorage, derived list (status filter + lookup), and a detail view where
// notes append and status moves through a fixed workflow.

// Workflow order: a request can only move forward through these statuses.
const FLOW = ['Submitted','In Review','Decision Made'];
const FILTERS = ['All','Submitted','In Review','Decision Made','Cancelled'];

// ---------- Load or seed state ----------
let requests = JSON.parse(localStorage.getItem('pp_requests') || 'null');
if (!requests) {
  // Two labeled samples so the tracker can be explored on first load.
  requests = [
    {ref:'PA-DEMO01',name:'Sample Member One',email:'sample1@example.com',payer:'Blue River Health Plan',service:'MRI imaging',date:'2026-12-02',urgency:'Standard',summary:'Sample request: imaging ordered after six weeks of conservative care for lower back pain.',status:'In Review',sample:true,notes:[{when:'Demo',text:'Sample case loaded for exploring the tracker.'}]},
    {ref:'PA-DEMO02',name:'Sample Member Two',email:'sample2@example.com',payer:'Summit National Insurance',service:'Physical therapy visits',date:'2026-12-09',urgency:'Standard',summary:'Sample request: therapy visits after a knee injury, with the evaluation notes attached.',status:'Submitted',sample:true,notes:[{when:'Demo',text:'Sample case loaded for exploring the tracker.'}]}
  ];
  saveRequests();
}
function saveRequests(){ localStorage.setItem('pp_requests', JSON.stringify(requests)); }
function makeRef(){
  const chars = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'; let s = '';
  for (let i = 0; i < 6; i++) s += chars[Math.floor(Math.random() * chars.length)];
  return 'PA-' + s;
}

// ---------- Form validation + submit ----------
const emailOk = v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
document.getElementById('requestForm').addEventListener('submit', e => {
  e.preventDefault();
  const name = document.getElementById('fName').value.trim();
  const email = document.getElementById('fEmail').value.trim();
  const payer = document.getElementById('fPayer').value;
  const service = document.getElementById('fService').value;
  const date = document.getElementById('fDate').value;
  const urgency = document.getElementById('fUrgency').value;
  const notes = document.getElementById('fNotes').value.trim();
  let ok = true;
  const setErr = (id,msg) => { document.getElementById(id).textContent = msg; if (msg) ok = false; };
  setErr('eName', name.length >= 2 ? '' : 'Please enter the member full name.');
  setErr('eEmail', emailOk(email) ? '' : 'Please enter a valid email address.');
  setErr('ePayer', payer ? '' : 'Please choose a payer.');
  setErr('eService', service ? '' : 'Please choose a service.');
  const today = new Date(); today.setHours(0,0,0,0);
  setErr('eDate', !date ? 'Please choose a planned date.' : (new Date(date + 'T00:00:00') < today ? 'The planned date cannot be in the past.' : ''));
  setErr('eNotes', notes.length >= 20 ? '' : 'Please write a clinical summary of at least 20 characters.');
  if (!ok) { document.getElementById('confirmBox').innerHTML = ''; return; }
  const req = {ref:makeRef(),name,email,payer,service,date,urgency,summary:notes,status:'Submitted',sample:false,
    notes:[{when:new Date().toLocaleDateString(),text:'Request submitted through the PriorPath sample tracker.'}]};
  requests.unshift(req); saveRequests(); renderRequests();
  document.getElementById('confirmBox').innerHTML =
    '<div class="success"><h3 class="sans">Request received</h3><p>Your sample reference is <strong>' + req.ref + '</strong>. ' +
    'Status starts at Submitted. Find it in the list below, open it to add notes, move its status forward, or cancel it.</p></div>';
  e.target.reset();
});

// ---------- Status filter chips ----------
let activeFilter = 'All';
const chipBox = document.getElementById('statusChips');
FILTERS.forEach(f => {
  const b = document.createElement('button');
  b.className = 'chip' + (f === 'All' ? ' active' : ''); b.textContent = f; b.dataset.filter = f;
  b.addEventListener('click', () => {
    activeFilter = f;
    chipBox.querySelectorAll('.chip').forEach(c => c.classList.toggle('active', c.dataset.filter === f));
    renderRequests();
  });
  chipBox.appendChild(b);
});

// ---------- Derived list + rendering ----------
function visibleRequests(){
  const q = document.getElementById('lookupSearch').value.trim().toLowerCase();
  return requests.filter(r =>
    (activeFilter === 'All' || r.status === activeFilter) &&
    (!q || (r.ref + ' ' + r.name + ' ' + r.service + ' ' + r.payer).toLowerCase().includes(q)));
}
function renderRequests(){
  const list = visibleRequests();
  const grid = document.getElementById('requestGrid'); grid.innerHTML = '';
  list.forEach(r => {
    const card = document.createElement('article'); card.className = 'card';
    card.innerHTML = '<p><span class="tag">' + r.status + '</span>' + (r.sample ? ' <span class="tag">Sample</span>' : '') + '</p>' +
      '<h3>' + r.ref + '</h3><p><strong>' + r.service + '</strong><br>' + r.payer + '<br>' +
      '<span class="small">Member: ' + r.name + ' · Planned: ' + r.date + ' · ' + r.urgency + '</span></p>';
    const btn = document.createElement('button'); btn.className = 'btn'; btn.textContent = 'Open request';
    btn.addEventListener('click', () => openDetail(r.ref));
    card.appendChild(btn); grid.appendChild(card);
  });
  document.getElementById('reqCount').textContent = 'Showing ' + list.length + ' of ' + requests.length + ' requests';
  document.getElementById('reqEmpty').hidden = list.length !== 0;
}
document.getElementById('lookupSearch').addEventListener('input', renderRequests);

// ---------- Detail view: notes, status moves, cancel ----------
let currentRef = null;
function openDetail(ref){
  const r = requests.find(x => x.ref === ref); if (!r) return;
  currentRef = ref;
  document.getElementById('dTitle').textContent = r.ref + ' — ' + r.service;
  document.getElementById('dMeta').textContent = r.payer + ' · Member ' + r.name + ' · Planned ' + r.date + ' · ' + r.urgency + ' · Status: ' + r.status;
  document.getElementById('dSummary').textContent = r.summary;
  const ul = document.getElementById('dNotes'); ul.innerHTML = '';
  r.notes.forEach(n => { const li = document.createElement('li'); li.textContent = n.when + ' — ' + n.text; ul.appendChild(li); });
  document.getElementById('noteText').value = '';
  document.getElementById('eNote').textContent = '';
  document.getElementById('dMsg').textContent = '';
  const idx = FLOW.indexOf(r.status);
  document.getElementById('advanceBtn').disabled = (idx === -1 || idx === FLOW.length - 1);
  document.getElementById('advanceBtn').textContent = idx >= 0 && idx < FLOW.length - 1 ? 'Move to ' + FLOW[idx+1] : 'Move status forward';
  document.getElementById('cancelBtn').disabled = (r.status === 'Cancelled' || r.status === 'Decision Made');
  document.getElementById('detailDialog').showModal();
}
document.getElementById('addNoteBtn').addEventListener('click', () => {
  const r = requests.find(x => x.ref === currentRef); if (!r) return;
  const text = document.getElementById('noteText').value.trim();
  if (text.length < 3) { document.getElementById('eNote').textContent = 'Please write a note of at least 3 characters.'; return; }
  r.notes.push({when:new Date().toLocaleDateString(), text});
  saveRequests(); openDetail(currentRef);
  document.getElementById('dMsg').textContent = 'Note added and saved.';
  renderRequests();
});
document.getElementById('advanceBtn').addEventListener('click', () => {
  const r = requests.find(x => x.ref === currentRef); if (!r) return;
  const idx = FLOW.indexOf(r.status);
  if (idx >= 0 && idx < FLOW.length - 1) {
    r.status = FLOW[idx+1];
    r.notes.push({when:new Date().toLocaleDateString(), text:'Status moved to ' + r.status + '.'});
    saveRequests(); renderRequests(); openDetail(currentRef);
    document.getElementById('dMsg').textContent = 'Status is now ' + r.status + '.';
  }
});
document.getElementById('cancelBtn').addEventListener('click', () => {
  const r = requests.find(x => x.ref === currentRef); if (!r) return;
  r.status = 'Cancelled';
  r.notes.push({when:new Date().toLocaleDateString(), text:'Request cancelled from the tracker.'});
  saveRequests(); renderRequests(); openDetail(currentRef);
  document.getElementById('dMsg').textContent = 'Request cancelled.';
});
document.getElementById('closeDetail').addEventListener('click', () => document.getElementById('detailDialog').close());

renderRequests();
