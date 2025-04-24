
function calculateTime() {
    const timeDisplay = document.querySelector('#time')
    const inputTime = document.querySelector('#inp-time').value;

    let inpHours = parseInt(inputTime.split(':')[0]);
    let inpMinutes = parseInt(inputTime.split(':')[1]);

    let updateTime = setInterval(function() {

        let now = new Date();

        // let days = now.getDate() - 1;
        let hours = now.getHours() - inpHours;
        let minutes = now.getMinutes() - inpMinutes;
        let seconds = now.getSeconds() - 0;

        // timeDisplay.textContent = `${hours} : ${minutes} : ${seconds}`;
        timeDisplay.textContent = `${inpHours} : ${inpMinutes}`
    })
}