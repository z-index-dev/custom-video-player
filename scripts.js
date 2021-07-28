// DOM Selectors
const player = document.querySelector('.player');
const video = player.querySelector('.viewer');
const timeDiv = player.querySelector('.video-length');
const progress = player.querySelector('.progress');
const progressBar = player.querySelector('.progress__filled');
const toggle = player.querySelector('.toggle');
const skipButtons = [...player.querySelectorAll('[data-skip')];
const ranges = [...player.querySelectorAll('.player__slider')];
const fullScreen = player.querySelector('.full-screen');
const tooltip = document.querySelector('.tooltip');

// Functions
function setDuration() {
  setInterval(function() {
    timeDiv.textContent = `${formatTime(video.currentTime)}/${formatTime(video.duration)}`;
  }, 250)
}

function formatTime(seconds) {
  let timeString = (new Date(seconds * 1000)).toUTCString().match(/(\d\d:\d\d:\d\d)/)[0];

  if(timeString.startsWith('00:')) {
    timeString = timeString.slice(3);
  }

  return timeString;
}

function togglePlay() {
  if(video.paused) {
    video.play();
  } else {
    video.pause();
  }
}

function updateButton() {
  const icon = this.paused ? '►' : '❚ ❚';
  toggle.textContent = icon;
}

function skip() {
  video.currentTime += +this.dataset.skip;
}

function handleRangeUpdate() {
  video[this.name] = this.value;
}

function handleProgress() {
  const percent = (video.currentTime / video.duration) * 100;
  progressBar.style.flexBasis = `${percent}%`;
}

function updateToolTip(e) {
  const timeLocation = (e.offsetX / progress.offsetWidth) * 100;
  const tooltipTime = (e.offsetX / progress.offsetWidth) * video.duration;
  const tooltipText = tooltip.querySelector('.tooltip-text');
  tooltipText.textContent = `${formatTime(tooltipTime)}`;

  if (timeLocation > 10 && timeLocation < 90) {
    tooltip.style.left = `${timeLocation}%`;
  } else if (timeLocation < 10) {
    tooltip.style.left = '10%';
  } else if (timeLocation > 90) {
    tooltip.style.left = '90%';
  }
}

function scrub(e) {
  const scrubTime = (e.offsetX / progress.offsetWidth) * video.duration;
  video.currentTime = scrubTime;
  setDuration();
}

function makeFullScreen() {
  if (player.requestFullscreen) {
    player.requestFullscreen();
  } else if (player.mozRequestFullScreen) {
    player.mozRequestFullScreen();
  } else if (player.webkitRequestFullscreen) {
    player.webkitRequestFullscreen();
  } else if (player.msRequestFullscreen) { 
    player.msRequestFullscreen();
  }
}

// Event Listeners
video.addEventListener('loadedmetadata', setDuration);
video.addEventListener('click', togglePlay);
video.addEventListener('play', updateButton);
video.addEventListener('pause', updateButton);
video.addEventListener('timeupdate', handleProgress);
fullScreen.addEventListener('click', makeFullScreen);
toggle.addEventListener('click', togglePlay);
skipButtons.forEach(button => button.addEventListener('click', skip));
ranges.forEach(range => range.addEventListener('change', handleRangeUpdate));

let mousedown = false;
progress.addEventListener('click', scrub);
progress.addEventListener('mousemove', e => mousedown && scrub(e));
progress.addEventListener('mousemove', updateToolTip);
progress.addEventListener('mousedown', () => mousedown = true);
progress.addEventListener('mouseup', () => mousedown = false);