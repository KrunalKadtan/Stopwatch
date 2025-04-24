
const timeDisplay = document.querySelector('#time')


let updateTime = setInterval(function() {
    let time = new Date();

    let hours = Math.floor(time.getHours());
    (hours < 10) ? (hours = "0" + hours) : (hours = hours);

    let minutes = Math.floor(time.getMinutes());
    (minutes < 10) ? (minutes = "0" + minutes) : (minutes = minutes);

    let seconds = Math.floor(time.getSeconds());
    (seconds < 10) ? (seconds = "0" + seconds) : (seconds = seconds);

    timeDisplay.textContent = hours + " : " + minutes + " : " + seconds;
})

