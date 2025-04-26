
const clock = document.querySelector('#clock')
const hand = document.querySelector('.hand')
const hourInput = document.querySelector('#hour-box')
const minuteInput = document.querySelector('#minute-box')

let selectedHour = null
let selectedMinute = null
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
    const radius = clockRadius * 0.8

    if (mode === 'hours') {
        for (let i = 1; i <= 12; i++) {
            const deg = i * 30
            const rad = deg * (Math.PI / 180)
            const x = centerX + radius * Math.sin(rad)
            const y = centerY - radius * Math.cos(rad)

            console.log(x, y)

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
    const inputTime = document.querySelector('#inp-time').value;
    const inputDate = document.querySelector('#inp-date').value;

    console.log(inputTime, inputDate)

    const [ hours, minutes ] = inputTime.split(':')
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