
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