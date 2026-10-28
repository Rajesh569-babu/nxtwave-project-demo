const TARGET_REGISTRATIONS = 500;
const STORAGE_KEY = 'nxtwave-workshop-registrations';

const initialRegistrations = [
  { name: 'Aisha R.', branch: 'CSE', source: 'College Ambassador', referralCode: 'NXT-AMB-01' },
  { name: 'Karan S.', branch: 'AI/ML', source: 'College Ambassador', referralCode: 'NXT-AMB-01' },
  { name: 'Meera P.', branch: 'IT', source: 'Technical Club', referralCode: 'NXT-CLUB-01' },
  { name: 'Arjun V.', branch: 'ECE', source: 'WhatsApp Group', referralCode: 'WHATSAPP' },
  { name: 'Nandita K.', branch: 'CSE', source: 'Referral', referralCode: 'NXT-AMB-02' },
  { name: 'Rahul M.', branch: 'IT', source: 'Referral', referralCode: 'NXT-AMB-02' },
  { name: 'Sanjana T.', branch: 'AI/ML', source: 'Instagram', referralCode: 'INSTA-01' },
  { name: 'Rohit A.', branch: 'CSE', source: 'College Ambassador', referralCode: 'NXT-AMB-03' },
  { name: 'Ishita D.', branch: 'IT', source: 'Technical Club', referralCode: 'NXT-CLUB-02' },
  { name: 'Vikram L.', branch: 'MECH', source: 'WhatsApp Group', referralCode: 'WHATSAPP' },
  { name: 'Priya N.', branch: 'CSE', source: 'College Ambassador', referralCode: 'NXT-AMB-03' },
  { name: 'Sai V.', branch: 'AI/ML', source: 'Referral', referralCode: 'NXT-AMB-01' }
];

const form = document.getElementById('registrationForm');
const studentNameInput = document.getElementById('studentName');
const branchInput = document.getElementById('branch');
const sourceInput = document.getElementById('source');
const referralCodeInput = document.getElementById('referralCode');

const totalRegistrationsEl = document.getElementById('totalRegistrations');
const targetProgressEl = document.getElementById('targetProgress');
const targetProgressBarEl = document.getElementById('targetProgressBar');
const remainingRegistrationsEl = document.getElementById('remainingRegistrations');
const bestChannelEl = document.getElementById('bestChannel');
const bestChannelCountEl = document.getElementById('bestChannelCount');
const ambassadorCountEl = document.getElementById('ambassadorCount');
const registrationDeltaEl = document.getElementById('registrationDelta');
const channelChartEl = document.getElementById('channelChart');
const referralTableBody = document.getElementById('referralTableBody');
const registrationTableBody = document.getElementById('registrationTableBody');
const aiInsightsEl = document.getElementById('aiInsights');
const storageStatusEl = document.getElementById('storageStatus');

function setStorageStatus(message) {
  storageStatusEl.textContent = message;
}

function isRegistrationList(value) {
  return Array.isArray(value) && value.every((student) =>
    student &&
    typeof student.name === 'string' &&
    typeof student.branch === 'string' &&
    typeof student.source === 'string' &&
    typeof student.referralCode === 'string'
  );
}

function loadRegistrations() {
  let savedData;
  try {
    savedData = localStorage.getItem(STORAGE_KEY);
  } catch {
    setStorageStatus('Browser storage is unavailable. New registrations will only last until this page is closed.');
    return [...initialRegistrations];
  }

  if (savedData === null) return [...initialRegistrations];

  try {
    const registrations = JSON.parse(savedData);
    if (!isRegistrationList(registrations)) throw new Error('Invalid saved registration data.');
    return registrations;
  } catch {
    setStorageStatus('Saved data could not be read. Showing demo registrations instead.');
    return [...initialRegistrations];
  }
}

const state = {
  registrations: loadRegistrations()
};

function saveRegistrations() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.registrations));
    setStorageStatus('Registrations are saved in this browser.');
  } catch {
    setStorageStatus('Could not save registrations in this browser. They will be lost when this page is closed.');
  }
}

function computeChannelStats() {
  const channelMap = new Map();

  state.registrations.forEach((student) => {
    const key = student.source;
    channelMap.set(key, (channelMap.get(key) || 0) + 1);
  });

  return [...channelMap.entries()].sort((a, b) => b[1] - a[1]);
}

function computeReferralStats() {
  const referralMap = new Map();

  state.registrations.forEach((student) => {
    const code = student.referralCode || 'SELF';
    if (!code || code === 'SELF') return;

    if (!referralMap.has(code)) {
      referralMap.set(code, { code, source: student.source, count: 0 });
    }

    referralMap.get(code).count += 1;
  });

  return [...referralMap.values()].sort((a, b) => b.count - a.count);
}

function getBestChannel() {
  const channels = computeChannelStats();
  if (!channels.length) return { name: 'N/A', count: 0 };

  const [name, count] = channels[0];
  return { name, count };
}

function renderChannelChart() {
  const channels = computeChannelStats();
  const max = Math.max(...channels.map(([, count]) => count), 1);

  channelChartEl.replaceChildren();
  channels.forEach(([name, count]) => {
    const row = document.createElement('div');
    row.className = 'channel-row';

    const label = document.createElement('span');
    label.className = 'channel-label';
    label.textContent = name;

    const track = document.createElement('div');
    track.className = 'channel-bar-track';
    const bar = document.createElement('span');
    bar.className = 'channel-bar';
    bar.style.width = `${(count / max) * 100}%`;
    track.appendChild(bar);

    const value = document.createElement('span');
    value.className = 'channel-value';
    value.textContent = count;

    row.append(label, track, value);
    channelChartEl.appendChild(row);
  });
}

function renderReferralTable() {
  const referralStats = computeReferralStats();

  referralTableBody.replaceChildren();
  referralStats.forEach(({ code, source, count }) => {
    const row = document.createElement('tr');
    const share = state.registrations.length
      ? Math.round((count / state.registrations.length) * 100)
      : 0;
    [code, source, count, `${share}%`].forEach((value) => {
      const cell = document.createElement('td');
      cell.textContent = value;
      row.appendChild(cell);
    });
    referralTableBody.appendChild(row);
  });
}

function renderRegistrations() {
  registrationTableBody.replaceChildren();
  state.registrations.slice().reverse().forEach((student) => {
    const row = document.createElement('tr');
    [student.name, student.branch, student.source, student.referralCode || '—'].forEach((value) => {
      const cell = document.createElement('td');
      cell.textContent = value;
      row.appendChild(cell);
    });
    registrationTableBody.appendChild(row);
  });
}

function renderInsights() {
  const total = state.registrations.length;
  const remaining = Math.max(TARGET_REGISTRATIONS - total, 0);
  const channels = computeChannelStats();
  const referralCount = state.registrations.filter((student) => student.source === 'Referral').length;
  const suggestions = [];

  if (remaining > 0) {
    suggestions.push(
      `${remaining} registrations remain to reach the ${TARGET_REGISTRATIONS} target. Share a clear workshop benefit and registration link in your next outreach.`
    );
  } else {
    suggestions.push(
      `The ${TARGET_REGISTRATIONS}-registration target has been reached. Send a confirmation and attendance reminder to registered students.`
    );
  }

  if (channels.length > 1) {
    const [bestName, bestCount] = channels[0];
    const [lowestName, lowestCount] = channels[channels.length - 1];
    suggestions.push(
      `${bestName} leads with ${bestCount} registrations, while ${lowestName} has ${lowestCount}. Prioritize the stronger channel for your next outreach and test a different message in ${lowestName}.`
    );
  } else if (channels.length === 1) {
    const [name, count] = channels[0];
    suggestions.push(
      `${name} is the only channel with registrations so far (${count}). Try one additional student channel to see whether it can bring in more sign-ups.`
    );
  } else {
    suggestions.push(
      'There are no registrations yet. Share the sign-up link with one student community and record its source to start comparing channels.'
    );
  }

  if (referralCount > 0) {
    suggestions.push(
      `${referralCount} registrations are attributed to referrals. Ask students who have already shared the workshop to invite one more classmate.`
    );
  } else if (total > 0) {
    suggestions.push(
      'No registrations are attributed to referrals yet. Invite registrants to share the workshop and record referral sign-ups under the Referral source.'
    );
  }

  aiInsightsEl.replaceChildren();
  suggestions.forEach((suggestion) => {
    const item = document.createElement('li');
    item.textContent = suggestion;
    aiInsightsEl.appendChild(item);
  });
}

function updateSummary() {
  const total = state.registrations.length;
  const best = getBestChannel();
  const ambassadorCount = new Set(state.registrations.map((student) => student.referralCode).filter(Boolean)).size;
  const percentage = Math.min(Math.round((total / TARGET_REGISTRATIONS) * 100), 100);
  const remaining = Math.max(TARGET_REGISTRATIONS - total, 0);

  totalRegistrationsEl.textContent = total;
  targetProgressEl.textContent = `${percentage}%`;
  targetProgressBarEl.style.width = `${percentage}%`;
  remainingRegistrationsEl.textContent = `${remaining} remaining`;
  bestChannelEl.textContent = best.name;
  bestChannelCountEl.textContent = `${best.count} registrations`;
  ambassadorCountEl.textContent = ambassadorCount;
  registrationDeltaEl.textContent = `${total - initialRegistrations.length} since last update`;
}

function handleSubmit(event) {
  event.preventDefault();

  const student = {
    name: studentNameInput.value.trim() || 'New Student',
    branch: branchInput.value,
    source: sourceInput.value,
    referralCode: referralCodeInput.value.trim() || 'SELF'
  };

  state.registrations.push(student);
  saveRegistrations();

  form.reset();
  branchInput.value = 'CSE';
  sourceInput.value = 'College Ambassador';

  renderAll();
}

function renderAll() {
  renderChannelChart();
  renderReferralTable();
  renderRegistrations();
  renderInsights();
  updateSummary();
}

form.addEventListener('submit', handleSubmit);

renderAll();
