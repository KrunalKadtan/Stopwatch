// =======================
// DOM SELECTORS & COMMONS
// =======================
const clockElm = document.querySelector('#clock');
const handElm = document.querySelector('.hand');
const hourInput = document.querySelector('#hour-box');
const minuteInput = document.querySelector('#minute-box');
const selectedMonthBtn = document.getElementById('selectedMonth');
const monthOptionsElm = document.getElementById('monthOptions');
const selectedYearBtn = document.getElementById('selectedYear');
const yearOptionsElm = document.getElementById('yearOptions');
const dayNamesElm = document.getElementById('dayNames');
const daysGridElm = document.getElementById('daysGrid');
const inputField = document.getElementById('input-field');
const startNewClockBtn = document.getElementById('startNewClock');
const inputTitle = document.getElementById('input-title');
const okBtn = document.getElementById('ok-btn');
const cancelBtn = document.getElementById('cancel-btn');
const stopwatchesContainer = document.getElementById('container');
const inputForm = inputField;

// =======================
// Utility Data
// =======================
const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];
const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// Trackers
let currentDate = new Date();
let selectedDate = null;
let selectedHour = null;
let selectedMinute = null;
let mode = 'hours'; // 'hours' or 'minutes'
let stopwatchList = [];

// =======================
// ACCESSIBILITY: trap focus in modal
// =======================
function trapFocus(element) {
  const focusableElements = element.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
  const first = focusableElements[0];
  const last = focusableElements[focusableElements.length - 1];
  element.addEventListener('keydown', function(e) {
    if (e.key === 'Tab') {
      if (e.shiftKey && document.activeElement === first) {
        last.focus(); e.preventDefault();
      } else if (!e.shiftKey && document.activeElement === last) {
        first.focus(); e.preventDefault();
      }
    }
    if (e.key === 'Escape') closeInputForm();
  });
}

// =======================
// Utility: Format Date
// =======================
function formatDate(date) {
  if (!date) return '';
  return `${String(date.getDate()).padStart(2, '0')}-${String(date.getMonth()+1).padStart(2, '0')}-${date.getFullYear()}`;
}

// =======================
// CALENDAR MODULE
// =======================
function buildDropdown(options, parentElm, selectedIdx) {
  parentElm.innerHTML = '';
  options.forEach((name, idx) => {
    const li = document.createElement('li');
    li.textContent = name;
    li.tabIndex = 0;
    if (selectedIdx === idx) li.classList.add('selected');
    parentElm.appendChild(li);
  });
}
function closeAllDropdowns() {
  monthOptionsElm.classList.remove('show');
  yearOptionsElm.classList.remove('show');
  selectedMonthBtn.setAttribute('aria-expanded', 'false');
  selectedYearBtn.setAttribute('aria-expanded', 'false');
}
function openDropdown(type) {
  if (type === 'month') {
    monthOptionsElm.classList.add('show');
    selectedMonthBtn.setAttribute('aria-expanded', 'true');
    yearOptionsElm.classList.remove('show');
    selectedYearBtn.setAttribute('aria-expanded', 'false');
  }
  if (type === 'year') {
    yearOptionsElm.classList.add('show');
    selectedYearBtn.setAttribute('aria-expanded', 'true');
    monthOptionsElm.classList.remove('show');
    selectedMonthBtn.setAttribute('aria-expanded', 'false');
  }
}
selectedMonthBtn.addEventListener('click', e => {
  openDropdown('month');
  const currentIdx = currentDate.getMonth();
  Array.from(monthOptionsElm.children).forEach((li, idx) =>
    li.classList.toggle('selected', idx === currentIdx)
  );
  setTimeout(() => {
    const sel = monthOptionsElm.querySelector('.selected');
    if (sel) sel.scrollIntoView({block:'center'});
  }, 50);
});
monthOptionsElm.addEventListener('click', e => {
  if (e.target.tagName === 'LI') {
    const idx = Array.from(monthOptionsElm.children).indexOf(e.target);
    currentDate.setMonth(idx);
    generateCalendar(currentDate);
    closeAllDropdowns();
    selectedMonthBtn.textContent = months[idx];
  }
});
selectedYearBtn.addEventListener('click', e => {
  openDropdown('year');
  const currentYear = currentDate.getFullYear();
  Array.from(yearOptionsElm.children).forEach(li =>
    li.classList.toggle('selected', +li.textContent === currentYear)
  );
  setTimeout(() => {
    const sel = yearOptionsElm.querySelector('.selected');
    if (sel) sel.scrollIntoView({block:'center'});
  }, 50);
});
yearOptionsElm.addEventListener('click', e => {
  if (e.target.tagName === 'LI') {
    const y = +e.target.textContent;
    currentDate.setFullYear(y);
    generateCalendar(currentDate);
    closeAllDropdowns();
    selectedYearBtn.textContent = y;
  }
});
document.addEventListener('click', (e) => {
  if (!e.target.closest('.custom-dropdown')) closeAllDropdowns();
});
buildDropdown(months, monthOptionsElm, currentDate.getMonth());
buildDropdown(Array.from({length:121},(_,i)=>1980+i), yearOptionsElm, currentDate.getFullYear()-1980);
selectedMonthBtn.textContent = months[currentDate.getMonth()];
selectedYearBtn.textContent = currentDate.getFullYear();

// Day Names
dayNamesElm.innerHTML = '';
days.forEach(day => {
  const span = document.createElement('span');
  span.textContent = day;
  dayNamesElm.appendChild(span);
});

function generateCalendar(date) {
  daysGridElm.innerHTML = '';
  const y = date.getFullYear(), m = date.getMonth();
  const firstDay = new Date(y, m, 1).getDay();
  const daysInMonth = new Date(y, m + 1, 0).getDate();
  // blanks
  for (let i = 0; i < firstDay; i++) daysGridElm.appendChild(document.createElement('span'));
  // days
  for (let d = 1; d <= daysInMonth; d++) {
    const cell = document.createElement('span');
    cell.tabIndex = 0;
    cell.textContent = d;
    const today = new Date();
    const isToday = today.getDate() === d && today.getMonth() === m && today.getFullYear() === y;
    const isSelected = selectedDate &&
      selectedDate.getDate() === d && selectedDate.getMonth() === m && selectedDate.getFullYear() === y;
    if (isToday) cell.classList.add('today');
    if (isSelected) cell.classList.add('selected');
    cell.addEventListener('click', () => {
      selectedDate = new Date(y, m, d);
      Array.from(daysGridElm.children).forEach(el=>el.classList.remove('selected'));
      cell.classList.add('selected');
    });
    cell.addEventListener('keydown', (e) => {
      if (e.key === ' ' || e.key === 'Enter') cell.click();
    });
    daysGridElm.appendChild(cell);
  }
}

// =======================
// CLOCK PICKER
// =======================
function clearClock() {
  Array.from(clockElm.querySelectorAll('.number')).forEach(el => el.remove());
}
function rotateHand(degree) {
  handElm.style.transform = `rotate(${degree}deg)`;
}
function updateTimeBox(type, value) {
  const val = value !== null ? String(value).padStart(2, '0') : '00';
  if (type === 'hours') hourInput.textContent = val;
  else if (type === 'minutes') minuteInput.textContent = val;
}
function createNumbers(mode) {
  clearClock();
  const clockRadius = clockElm.offsetWidth / 2;
  const center = clockElm.offsetWidth / 2;
  let radius = clockRadius * 0.8;
  if (mode === 'hours') {
    for (let i = 0; i < 24; i++) {
      radius = (i > 11) ? (clockRadius * 0.8 * 0.6) : (clockRadius * 0.8);
      const deg = i * 30, rad = deg * (Math.PI / 180);
      const x = center + radius * Math.sin(rad), y = center - radius * Math.cos(rad);
      const num = document.createElement('div');
      num.className = 'number'; num.innerText = i; num.tabIndex = 0;
      num.style.left = `${x}px`; num.style.top = `${y}px`;
      num.addEventListener('click', () => {
        selectedHour = i;
        rotateHand(deg);
        setTimeout(() => {
          updateTimeBox('hours', selectedHour);
          mode = 'minutes';
          createNumbers(mode);
        }, 300);
      });
      num.addEventListener('keydown', (e) => {
        if (e.key === ' ' || e.key === 'Enter') num.click();
      });
      clockElm.appendChild(num);
    }
  } else { // minutes 0..55 in steps of 5
    for (let i = 0; i < 60; i += 5) {
      const deg = i * 6, rad = deg * (Math.PI / 180);
      const x = center + radius * Math.sin(rad), y = center - radius * Math.cos(rad);
      const num = document.createElement('div');
      num.className = 'number'; num.innerText = i; num.tabIndex = 0;
      num.style.left = `${x}px`; num.style.top = `${y}px`;
      num.addEventListener('click', () => {
        selectedMinute = i;
        rotateHand(deg);
        setTimeout(() => { updateTimeBox('minutes', selectedMinute); }, 300);
      });
      num.addEventListener('keydown', (e) => {
        if (e.key === ' ' || e.key === 'Enter') num.click();
      });
      clockElm.appendChild(num);
    }
  }
}

// Allow direct time editing by click (reset clock picker!)
hourInput.addEventListener('click', () => {
  mode = 'hours';
  createNumbers('hours');
});
minuteInput.addEventListener('click', () => {
  mode = 'minutes';
  createNumbers('minutes');
});

// =======================
// MODAL OPEN/CLOSE LOGIC
// =======================
startNewClockBtn.addEventListener('click', e => {
  inputField.style.display = 'flex';
  inputField.focus();
  generateCalendar(currentDate);
  createNumbers('hours');
  mode = 'hours';
  selectedDate = null; selectedHour = null; selectedMinute = null;
  updateTimeBox('hours', null);
  updateTimeBox('minutes', null);
  Array.from(daysGridElm.children).forEach(el => el.classList.remove('selected'));
  inputTitle.value = '';
  trapFocus(inputField);
});

function closeInputForm() {
  inputField.style.display = 'none';
  clearClock();
}
cancelBtn.addEventListener('click', closeInputForm);

document.addEventListener('click', (event) => {
  if (inputField.style.display === 'flex'
    && !inputField.contains(event.target)
    && event.target !== startNewClockBtn) {
    closeInputForm();
  }
});

// =======================
// STOPWATCH LOGIC
// =======================
class Stopwatch {
  constructor(id, startTime, title) {
    this.id = id;
    this.startTime = startTime;
    this.title = title;
    this.interval = setInterval(() => this.updateDisplay(), 33);
    this.show();
  }
  updateDisplay() {
    const now = new Date();
    let years = now.getFullYear() - this.startTime.getFullYear();
    let months = now.getMonth() - this.startTime.getMonth();
    let days = now.getDate() - this.startTime.getDate();
    if (days < 0) {
      months--;
      days += new Date(now.getFullYear(), now.getMonth(), 0).getDate();
    }
    if (months < 0) {
      years--;
      months += 12;
    }
    let hours = now.getHours() - this.startTime.getHours();
    let minutes = now.getMinutes() - this.startTime.getMinutes();
    let seconds = now.getSeconds() - this.startTime.getSeconds();
    let ms = now.getMilliseconds() - this.startTime.getMilliseconds();
    if (ms < 0) {
      ms += 1000; seconds--;
    }
    if (seconds < 0) {
      seconds += 60; minutes--;
    }
    if (minutes < 0) {
      minutes += 60; hours--;
    }
    if (hours < 0) {
      hours += 24; days--;
    }
    // Format
    const dstr = `${String(years).padStart(2,'0')} : `
      + `${String(months).padStart(2,'0')} : `
      + `${String(days).padStart(2,'0')}`;
    let mss = ms < 100 ? (ms < 10 ? `00${ms}` : `0${ms}`) : `${ms}`;
    const tstr = `${String(hours).padStart(2,'0')} : `
      + `${String(minutes).padStart(2,'0')} : `
      + `${String(seconds).padStart(2,'0')} : ${mss}`;
    const daysElm = document.getElementById(`days-${this.id}`);
    const timeElm = document.getElementById(`time-${this.id}`);
    if (daysElm) daysElm.textContent = dstr;
    if (timeElm) timeElm.textContent = tstr;
  }
  show() {
    const stopWatch = document.createElement('div');
    stopWatch.className = 'watch';
    stopWatch.id = `stopwatch-${this.id}`;
    // Remove button for watch
    const removeBtn = document.createElement('button');
    removeBtn.className = 'remove-btn';
    removeBtn.setAttribute('title', 'Remove Stopwatch');
    removeBtn.innerText = '×';
    removeBtn.addEventListener('click', () => this.remove());
    stopWatch.appendChild(removeBtn);
    const titleDisplay = document.createElement('div');
    titleDisplay.className = 'title';
    titleDisplay.textContent = this.title;
    titleDisplay.id = `title-${this.id}`;
    const daysDisplay = document.createElement('div');
    daysDisplay.className = 'days'; daysDisplay.id = `days-${this.id}`;
    const timeDisplay = document.createElement('div');
    timeDisplay.className = 'time'; timeDisplay.id = `time-${this.id}`;
    stopWatch.appendChild(titleDisplay);
    stopWatch.appendChild(daysDisplay);
    stopWatch.appendChild(timeDisplay);
    stopwatchesContainer.appendChild(stopWatch);
    this.updateDisplay();
  }
  remove() {
    clearInterval(this.interval);
    const el = document.getElementById(`stopwatch-${this.id}`);
    if (el) el.remove();
    stopwatchList = stopwatchList.filter(sw => sw.id !== this.id);
  }
}

// =======================
// VALIDATION & SUBMIT
// =======================
inputForm.addEventListener('submit', function(evt) {
  evt.preventDefault();

  // validation: date and time
  if (!selectedDate || selectedHour === null || selectedMinute === null) {
    alert('Please select date, hour and minute!');
    return;
  }
  // Prepare date object
  const [day, month, year] = formatDate(selectedDate).split('-');
  const startDateTime = new Date(year, month - 1, day, selectedHour, selectedMinute);
  const title = inputTitle.value.trim() || 'Untitled';
  const id = 'sw' + Date.now();

  // Add stopwatch
  const watch = new Stopwatch(id, startDateTime, title);
  stopwatchList.push(watch);

  closeInputForm();
});

// ===============
// INITIALIZATION
// ===============
generateCalendar(currentDate); // on load

// ===============
// END
// ===============
