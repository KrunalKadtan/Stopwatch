
const clock = document.querySelector('#clock')
const hand = document.querySelector('.hand')
const hourInput = document.querySelector('#hour-box')
const minuteInput = document.querySelector('#minute-box')

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

    

    const [ year, month, day ] = inputDate.split('-')
    const dateTime = new Date(year, month-1, day, hours, minutes)

    let updateTime = setInterval(function() {

        let now = new Date();
        let diff = now - dateTime;

        let days = Math.floor(diff / (1000 * 60 * 60 * 24));
        days = (days < 10) ? `0${days}` : days

        let hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        hours = (hours < 10) ? `0${hours}` : hours

        let minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        minutes = (minutes < 10) ? `0${minutes}` : minutes

        let seconds = Math.floor((diff % (1000 * 60)) / 1000);
        seconds = (seconds < 10) ? `0${seconds}` : seconds

        let mseconds = Math.floor((diff % (1000)) / 1);
        mseconds = (mseconds < 100) ? ((mseconds < 10) ? `00${mseconds}` : `0${mseconds}`) : mseconds

        daysDisplay.textContent = `${days}`;
        timeDisplay.textContent = `${hours} : ${minutes} : ${seconds} : ${mseconds}`;
    })
}

createNumbers(mode)



const calendar = document.getElementById('input-date-container');;
const selectedMonth = document.getElementById('selectedMonth');
const monthOptions = document.getElementById('monthOptions');
const selectedYear = document.getElementById('selectedYear');
const yearOptions = document.getElementById('yearOptions');

let currentDate = new Date()
let selectedDate = null




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