const SECONDS = document.getElementById('seconds');
const MINUTES = document.getElementById('minutes');
const HOURS = document.getElementById('hours');
const DAYS = document.getElementById('days');

const newYears = '2025-01-01 00:00';


const convertMs = (ms) => {

  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor(((ms % day) % hour) / minute);
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);
  return { days, hours, minutes, seconds };
}

 const timer = setInterval(() => {
    const ms = new Date(newYears) - new Date();
    const result = convertMs(ms);

    if (ms > 0) {
        markUpTimer(result);
    }
    else {
        clearInterval(timer);
    }
}, 1000);

const markUpTimer = ({ days, hours, minutes, seconds }) => {
    SECONDS.textContent = seconds;
    MINUTES.textContent = minutes;
    HOURS.textContent = hours;
    DAYS.textContent = days;
};
