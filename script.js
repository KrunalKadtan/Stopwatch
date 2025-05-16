
const clock = document.querySelector('#clock')
const hand = document.querySelector('.hand')
const hourInput = document.querySelector('#hour-box')
const minuteInput = document.querySelector('#minute-box')

const calendar = document.getElementById('input-date-container');;
const selectedMonth = document.getElementById('selectedMonth');
const monthOptions = document.getElementById('monthOptions');
const selectedYear = document.getElementById('selectedYear');
const yearOptions = document.getElementById('yearOptions');

let currentDate = new Date()
let selectedDate = null

let selectedHour = null
let selectedMinute = null
let ampm = 'AM'
let mode = 'hours'

function clearClock() {
    document.querySelectorAll('.number').forEach(el => el.remove())
}

function rotateHand(degree) {
    hand.style.transform = `rotate(${degree}deg)`
}

function updateTime(hand, time) {
    if (time !== null) {
        const tt = String(time).padStart(2, '0')

        if (hand === 'hours') {
            hourInput.textContent = `${time}`
        } else if (hand === 'minutes') {
            minuteInput.textContent = `${time}`
        }
    }
}

function createNumbers(mode) {
    clearClock()

    const clockRadius = clock.offsetWidth / 2

    const centerX = clock.offsetWidth / 2 * 0.99
    const centerY = clock.offsetHeight / 2 * 0.99
    let radius = clockRadius * 0.8

    if (mode === 'hours') {
        for (let i = 0; i < 24; i++) {
            radius = (i > 11) ? (clockRadius * 0.8 * 0.6) : (clockRadius * 0.8)
            const deg = i * 30
            const rad = deg * (Math.PI / 180)
            const x = centerX + radius * Math.sin(rad)
            const y = centerY - radius * Math.cos(rad)

            // console.log(x, y)

            const num = document.createElement('div')
            num.className = 'number'
            num.innerText = i
            num.style.left = `${x}px`
            num.style.top = `${y}px`

            num.onclick = () => {
                selectedHour = i
                rotateHand(deg)
                setTimeout(() => {
                    updateTime(mode, selectedHour)
                    mode = 'minutes'
                    createNumbers(mode)
                }, 400)
            }

            clock.appendChild(num)
        }
    } else if (mode === 'minutes') {
        for (let i = 0; i < 60; i += 5) {
            const deg = i * 6
            const rad = deg * (Math.PI / 180)
            const x = centerX + radius * Math.sin(rad)
            const y = centerY - radius * Math.cos(rad)

            const num = document.createElement('div')
            num.className = 'number'
            num.innerText = i
            num.style.left = `${x}px`
            num.style.top = `${y}px`

            num.onclick = () => {
                selectedMinute = i
                rotateHand(deg)
                setTimeout(() => {
                    updateTime(mode, selectedMinute)
                    // clearClock()
                }, 400)
            }

            clock.appendChild(num)
        }
    }
}

function calculateTime() {
    const timeDisplay = document.querySelector('#time')
    const daysDisplay = document.querySelector('#days')

    const hours = String(selectedHour).padStart(2, '0')
    const minutes = String(selectedMinute).padStart(2, '0')

    

    // const [ year, month, day ] = inputDate.split('-')
    const [ day, month, year ] = formatDate(selectedDate).split('-')
    const dateTime = new Date(year, month-1, day, hours, minutes)

    console.log(dateTime)

    showWatch()

    let updateTime = setInterval(function() {

        let now = new Date();
        
        let years = now.getFullYear() - dateTime.getFullYear();
        let months = now.getMonth() - dateTime.getMonth();
        let days = now.getDate() - dateTime.getDate();
        
        if (days < 0) {
          months--;
          const prevMon = new Date(now.getFullYear(), now.getMonth(), 0).getDate();
          days += prevMon;
        }

        if (months < 0) {
          years--;
          months += 12;
        }        

        years = (years < 10) ? `0${years}` : years
        months = (months < 10) ? `0${months}` : months
        days = (days < 10) ? `0${days}` : days

        let diff = now - dateTime;

        // let hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

        let hours = now.getHours() - dateTime.getHours();

        if (hours < 0) {
            hours = 24 + hours
            days = days - 1
        }

        // let minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        let minutes = now.getMinutes() - dateTime.getMinutes();
        
        if (minutes < 0) {
            minutes = 60 + minutes
            hours = hours - 1
        }

        // let seconds = Math.floor((diff % (1000 * 60)) / 1000);
        let seconds = now.getSeconds() - dateTime.getSeconds();
        
        if (seconds < 0) {
            seconds = 60 + seconds
            minutes = minutes - 1
        }

        // let mseconds = Math.floor((diff % (1000)) / 1);
        let mseconds = now.getMilliseconds() - dateTime.getMilliseconds();

        if (mseconds < 0) {
            mseconds = 1000 + mseconds
            seconds = seconds - 1
        }

        minutes = (minutes < 10) ? `0${minutes}` : minutes
        seconds = (seconds < 10) ? `0${seconds}` : seconds
        hours = (hours < 10) ? `0${hours}` : hours
        mseconds = (mseconds < 100) ? ((mseconds < 10) ? `00${mseconds}` : `0${mseconds}`) : mseconds

        daysDisplay.textContent = `${years} : ${months} : ${days}`;
        timeDisplay.textContent = `${hours} : ${minutes} : ${seconds} : ${mseconds}`;
    })


}










function formatDate(date) {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${day}-${month}-${year}`;
}

const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

months.forEach((monthName, index) => {
  const li = document.createElement('li');
  li.textContent = monthName;
  li.addEventListener('click', () => {
    selectedMonth.textContent = monthName;
    currentDate.setMonth(index);
    generateCalendar(currentDate);
    monthOptions.querySelectorAll('li').forEach(item => item.classList.remove('selected'));
    li.classList.add('selected');
    monthOptions.classList.remove('show');
  });
  monthOptions.appendChild(li);
});

for (let y = 1980; y <= 2100; y++) {
  const li = document.createElement('li');
  li.textContent = y;
  li.addEventListener('click', () => {
    selectedYear.textContent = y;
    currentDate.setFullYear(y);
    generateCalendar(currentDate);
    yearOptions.querySelectorAll('li').forEach(item => item.classList.remove('selected'));
    li.classList.add('selected');
    yearOptions.classList.remove('show');
  });
  yearOptions.appendChild(li);
}

selectedMonth.addEventListener('click', (event) => {
    event.stopPropagation();
    monthOptions.classList.toggle('show');
    yearOptions.classList.remove('show');

    const currentMonth = currentDate.getMonth();
    monthOptions.querySelectorAll('li').forEach((item,index) => {
        item.classList.toggle('selected', index === currentMonth);
    });

    setTimeout(() => {
        const selectedMonthItem = monthOptions.querySelector('li.selected');
        if (selectedMonthItem) selectedMonthItem.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 50);
});

selectedYear.addEventListener('click', (event) => {
  event.stopPropagation();
  yearOptions.classList.toggle('show');
  monthOptions.classList.remove('show');

  const currentYear = currentDate.getFullYear();
  yearOptions.querySelectorAll('li').forEach((item) => {
    item.classList.toggle('selected', parseInt(item.textContent) === currentYear);
  });

  setTimeout(() => {
    const selectedYearItem = yearOptions.querySelector('li.selected');
    if (selectedYearItem) selectedYearItem.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, 50);
});

document.addEventListener('click', (event) => {
  if (!event.target.closest('.custom-dropdown')) {
    monthOptions.classList.remove('show');
    yearOptions.classList.remove('show');
  }
});

const dayNames = document.querySelector('#dayNames');

const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

days.forEach((dayName) => {
    const span = document.createElement('span');
    span.textContent = dayName;
    dayNames.appendChild(span);
})

const daysGrid = document.querySelector('#daysGrid');

function generateCalendar(date) {
  daysGrid.innerHTML = '';

  const year = date.getFullYear();
  const month = date.getMonth();

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  for (let i = 0; i < firstDay; i++) {
    const empty = document.createElement('span');
    daysGrid.appendChild(empty);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const dayCell = document.createElement('span');
    dayCell.textContent = day;

    const today = new Date();
    if (today.getDate() === day && today.getMonth() === month && today.getFullYear() === year) {
      dayCell.classList.add('today');
    }

    if (selectedDate && selectedDate.getDate() === day &&
        selectedDate.getMonth() === month && selectedDate.getFullYear() === year) {
      dayCell.classList.add('selected');
    }

    dayCell.addEventListener('click', () => {
      selectedDate = new Date(year, month, day);
      // dateInput.value = formatDate(selectedDate);

      const previouslySelected = daysGrid.querySelector('.selected');
      if (previouslySelected) previouslySelected.classList.remove('selected');
      dayCell.classList.add('selected');

      // setTimeout(() => calendar.classList.remove('show'), 300);
    });

    daysGrid.appendChild(dayCell);
  }
}


const inputDateTime = document.querySelector('#startNewClock')
const inputField = document.querySelector('#input-field')

inputDateTime.addEventListener('click', (event) => {
  // event.stopPropagation();
  // inputField.classList.add('show');

  inputField.style.display = 'flex'
  generateCalendar(currentDate);
  createNumbers(mode)
});

document.addEventListener('click', (event) => {
  if (!inputField.contains(event.target) && event.target !== inputDateTime) {
    // inputField.classList.remove('show');
    inputField.style.display = 'none'
    clearClock()
  }
})

const watch = document.querySelector('#watch')

function showWatch () {
    watch.style.display = 'flex'
    inputField.style.display = 'none'
    clearClock()
}