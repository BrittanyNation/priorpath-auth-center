// PriorPath guides page — post-course combined-skills build, commented as study code.
// Patterns: data-driven rendering (one array builds every card), derived state
// (the visible list is computed from topic + search + sort, never stored),
// and localStorage persistence for helpful votes.

// ---------- Data: nine guides with full written content ----------
const GUIDES = [
 {id:'g1',topic:'Getting Started',title:'What prior authorization is and when you need it',minutes:4,img:'images/p5452225.jpg',alt:'Clinician writing notes on a clipboard',
  intro:'Prior authorization is a payer decision, made before care happens, that a service is covered under the member plan. It is not a promise of payment, and it never replaces medical judgment.',
  steps:['Check whether the service code needs authorization under the member plan.','Confirm the member is eligible on the date of service.','Gather the clinical notes that show why the service is needed.','Submit the request with enough lead time for the payer review window.','Save the reference number the payer returns.'],
  note:'If the service is urgent, say so on the request. Urgent requests follow a shorter review window at most payers.'},
 {id:'g2',topic:'Eligibility',title:'How to run an eligibility and benefits check',minutes:5,img:'images/p6285379.jpg',alt:'Healthcare worker at a computer in a clinic',
  intro:'An eligibility check answers three questions: is the coverage active, does this service need authorization, and what will the member owe.',
  steps:['Enter the member ID and date of birth exactly as they appear on the card.','Verify coverage is active for the planned date of service.','Read the service level benefits, not just the plan summary.','Note deductible, coinsurance, and visit limits in the record.','Screenshot or save the confirmation for the chart.'],
  note:'Eligibility can change month to month. Recheck close to the date of service for scheduled care.'},
 {id:'g3',topic:'Eligibility',title:'Reading a payer portal without guessing',minutes:6,img:'images/p7682205.jpg',alt:'Support worker with a headset helping by phone and computer',
  intro:'Payer portals use short labels that hide important detail. This guide names the fields that matter most and what each one really means.',
  steps:['Start on the member detail page, not the search results page.','Open the authorization requirement line for the exact service code.','Check the effective and termination dates before anything else.','Follow the documentation link; it lists what the reviewer expects.','Log the date, time, and portal reference in your notes.'],
  note:'When portal wording is unclear, write down the exact wording instead of paraphrasing it. Exact wording resolves disputes later.'},
 {id:'g4',topic:'Submitting',title:'Submitting a complete authorization request',minutes:7,img:'images/p8376156.jpg',alt:'Healthcare professional reviewing documents',
  intro:'Most delays come from missing pieces, not from the medicine. A complete first submission is the fastest path to a decision.',
  steps:['Attach the order, the recent visit notes, and any required test results.','Write the diagnosis and service codes the provider signed off on.','Add a short clinical summary in plain words at the top.','Double check the rendering provider and facility details.','Submit, then record the payer reference number right away.'],
  note:'Use the tracker on this site to practice: a complete sample request earns a PA reference number you can look up later.'},
 {id:'g5',topic:'Submitting',title:'Urgent and standard requests: choosing the right lane',minutes:4,img:'images/p5467601.jpg',alt:'Clinician writing in a patient record',
  intro:'Marking everything urgent slows the truly urgent cases down. This guide explains the difference and what proof each lane needs.',
  steps:['Use urgent only when waiting the standard window could harm the member.','State the harm plainly in one or two sentences.','Attach the note that supports the urgency.','Use standard for planned care with a future date.','Recheck the lane if the member condition changes.'],
  note:'Payers audit urgent lanes. A clear clinical reason protects the request and the team.'},
 {id:'g6',topic:'Denials and Appeals',title:'What to do in the first hour after a denial',minutes:6,img:'images/p7691730.jpg',alt:'Team meeting around a table with documents',
  intro:'A denial letter is a starting point, not the end. The first hour sets up a strong appeal.',
  steps:['Read the denial reason word for word and save the letter.','Match the reason to the chart: missing notes, wrong code, or criteria not shown.','Tell the provider what the reviewer asked for.','Ask whether a peer to peer review is offered.','Calendar the appeal deadline the day the letter arrives.'],
  note:'Never resubmit the same packet unchanged. An appeal must add the exact evidence the denial named.'},
 {id:'g7',topic:'Denials and Appeals',title:'Writing an appeal letter that answers the denial',minutes:8,img:'images/p7640451.jpg',alt:'Colleagues reviewing paperwork together',
  intro:'A good appeal letter mirrors the denial. Each paragraph answers one reason the payer gave, with the chart page that proves it.',
  steps:['Quote the denial reason at the top of the letter.','Answer it with dated clinical facts, not opinions.','Cite the note, test, or visit that supports each fact.','Close with the exact decision you are asking for.','Keep a copy with the appeal reference number.'],
  note:'Plain words win appeals. Reviewers read many letters a day; short sentences and clear dates help them say yes.'},
 {id:'g8',topic:'Getting Started',title:'The documentation checklist habit',minutes:5,img:'images/p8192000.jpg',alt:'Healthcare worker holding a tablet and reviewing a checklist',
  intro:'Teams that build the packet from a checklist submit faster and appeal less. The checklist changes by service, and that is the point.',
  steps:['Pick the checklist for the exact service being requested.','Work top to bottom; do not skip the eligibility line.','Check off each document as it enters the packet.','Note anything missing and who owns getting it.','Save the finished checklist with the request.'],
  note:'Try the checklist builder on the Checklists page: progress saves in your browser for each service.'},
 {id:'g9',topic:'Submitting',title:'Tracking a request so nothing goes quiet',minutes:5,img:'images/p4989132.jpg',alt:'Office worker reviewing information on a laptop',
  intro:'Requests stall in silence. A simple tracking habit, reference, date, next check, keeps every case moving.',
  steps:['Log the payer reference number the moment you submit.','Write the expected decision date next to it.','Check status on that date, not before and not a week after.','Add a dated note for every status change.','Close the case only when the decision letter is filed.'],
  note:'The Request Tracker page models this habit with sample requests you can search, filter, and update.'}
];
const TOPICS = ['All','Getting Started','Eligibility','Submitting','Denials and Appeals'];

// ---------- State ----------
let activeTopic = 'All';
let votes = JSON.parse(localStorage.getItem('pp_votes') || '{}');

// Live status band stamped with the visitor's own time (honest client-side status).
document.getElementById('statusBand').textContent =
  'Center status checked ' + new Date().toLocaleString() + ' — all sample services running in your browser. Guide desk hours: Monday to Friday, 8 AM to 6 PM Central.';

// ---------- Topic chips (built from data) ----------
const chipBox = document.getElementById('topicChips');
TOPICS.forEach(t => {
  const b = document.createElement('button');
  b.className = 'chip' + (t === 'All' ? ' active' : '');
  b.textContent = t; b.dataset.topic = t;
  b.addEventListener('click', () => {
    activeTopic = t;
    chipBox.querySelectorAll('.chip').forEach(c => c.classList.toggle('active', c.dataset.topic === t));
    renderGuides();
  });
  chipBox.appendChild(b);
});

// ---------- Derived list + rendering ----------
function visibleGuides() {
  const q = document.getElementById('guideSearch').value.trim().toLowerCase();
  const sort = document.getElementById('guideSort').value;
  let list = GUIDES.filter(g =>
    (activeTopic === 'All' || g.topic === activeTopic) &&
    (!q || (g.title + ' ' + g.topic + ' ' + g.intro).toLowerCase().includes(q)));
  if (sort === 'az') list.sort((a,b) => a.title.localeCompare(b.title));
  if (sort === 'za') list.sort((a,b) => b.title.localeCompare(a.title));
  if (sort === 'minutes') list.sort((a,b) => a.minutes - b.minutes);
  return list;
}
function renderGuides() {
  const list = visibleGuides();
  const grid = document.getElementById('guideGrid');
  grid.innerHTML = '';
  list.forEach(g => {
    const card = document.createElement('article');
    card.className = 'card';
    card.innerHTML = '<img src="' + g.img + '" alt="' + g.alt + '">' +
      '<p><span class="tag">' + g.topic + '</span></p><h3>' + g.title + '</h3>' +
      '<p class="small">' + g.minutes + ' minute read</p><p>' + g.intro + '</p>';
    const btn = document.createElement('button');
    btn.className = 'btn'; btn.textContent = 'Read guide';
    btn.addEventListener('click', () => openGuide(g));
    card.appendChild(btn);
    grid.appendChild(card);
  });
  document.getElementById('resultCount').textContent = 'Showing ' + list.length + ' of ' + GUIDES.length + ' guides';
  document.getElementById('emptyState').hidden = list.length !== 0;
}
document.getElementById('guideSearch').addEventListener('input', renderGuides);
document.getElementById('guideSort').addEventListener('change', renderGuides);

// ---------- Article reader modal + helpful vote ----------
let currentGuide = null;
function openGuide(g) {
  currentGuide = g;
  document.getElementById('dialogTitle').textContent = g.title;
  document.getElementById('dialogTopic').textContent = g.topic;
  document.getElementById('dialogMeta').textContent = g.minutes + ' minute read';
  document.getElementById('dialogIntro').textContent = g.intro;
  const ol = document.getElementById('dialogSteps'); ol.innerHTML = '';
  g.steps.forEach(s => { const li = document.createElement('li'); li.textContent = s; ol.appendChild(li); });
  document.getElementById('dialogNote').textContent = g.note;
  const voted = !!votes[g.id];
  document.getElementById('helpfulBtn').disabled = voted;
  document.getElementById('helpfulMsg').textContent = voted ? 'You marked this guide helpful. Thank you.' : '';
  document.getElementById('articleDialog').showModal();
}
document.getElementById('helpfulBtn').addEventListener('click', () => {
  if (!currentGuide) return;
  votes[currentGuide.id] = true;
  localStorage.setItem('pp_votes', JSON.stringify(votes));
  document.getElementById('helpfulBtn').disabled = true;
  document.getElementById('helpfulMsg').textContent = 'You marked this guide helpful. Thank you.';
});
document.getElementById('closeDialog').addEventListener('click', () => document.getElementById('articleDialog').close());

renderGuides();
