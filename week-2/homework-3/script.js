let time = 0;
let interval = null;

function startCountdown() {
  if (interval) {
    return;
  }

  let minutes = parseInt(document.getElementById("minutes").value) || 0;
  let seconds = parseInt(document.getElementById("seconds").value) || 0;

  time = minutes * 60 + seconds;

  if (minutes < 0 || seconds < 0) {
    document.getElementById("timer").innerHTML = "Invalid time";
    return;
  }

  interval = setInterval(() => {
    time--;
    document.getElementById("timer").textContent = formatTime(time);

    console.log(time);

    if (time <= 0) {
      clearInterval(interval);
      interval = null;
      document.getElementById("timer").innerHTML = "Süre doldu!";
    }
  }, 1000);
}

function stopCountdown() {
  clearInterval(interval);
  interval = null;
}

function resetCountdown() {
  clearInterval(interval);
  interval = null;
  time = 0;
  document.getElementById("timer").textContent = "00:00";
}

/* padStart bir stringi belirli bir uzunluğa ulaşmasını 
sağlamak için başına belirttiğimiz karakteri ekler */
function formatTime(seconds) {
  let min = Math.floor(seconds / 60);
  let sec = seconds % 60;
  return `${String(min).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
}
