// vim: et ts=8 sts=2 sw=2 ft=javascript

"strict";

const dayAbbrs = [ "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat" ];
const LOCAL_STORAGE_KEY = 'HHOURS_SCHEDULE';

// The starting point for execution.
function hoursInit() {
  load();
  addListeners();
}

function save(times) {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(times));
}

function load() {
  const timesJson = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (timesJson) {
    const times = JSON.parse(timesJson);
    console.log(times);
    const [sti, eti, lunch] = getTimeInputs();
    if (times.lunch) {
      lunch.value = times.lunchHours;
    }
    for (let i=0; i < sti.length; i++) {
      sti[i].value = times.days[i].st;
      eti[i].value = times.days[i].et;
    }
    updateDisplay(times);
  }
}

function addListeners() {
  const inputs = document.getElementsByTagName('input');
  console.log(inputs);
  for (input of inputs) {
    //input.value = '';
    input.addEventListener('input', changeListener);
  }
}

function getTimeInputs() {
  const st = document.getElementById('start-times');
  const et = document.getElementById('end-times');
  const sti = st.querySelectorAll('input');
  const eti = et.querySelectorAll('input');
  const lunch = document.getElementById('lunch-hours');
  return [ sti, eti, lunch ];
}

function changeListener(event) {
  console.log("CHANGED", event);
  const v = event.target.value;
  console.log(`Field changed to value: ${v}`);
  const times = readInputs();
  updateDisplay(times);
  save(times);
}

function sum(numbers) {
  return numbers.reduce((accum, current) => (accum + current), 0);
}

function parse(v) {
  const vv = v.trim();
  if (vv.match(/^\d{1,2}:\d\d$/)) {
    const [h,m] = v.split(':');
    return (parseInt(h) * 60 + parseInt(m)) / 60;
  } else if (vv.match(/^\d+(.\d*)?$/)) {
    return parseFloat(v);
  } else {
    return NaN
  }
}

function fmtTime(t) {
  const hours = Math.floor(t);
  const mins = Math.floor((t - hours) * 60);
  return `${hours}:${mins.toString().padStart(2, '0')}`;
}

function readInputs() {
  const [sti, eti, lunch] = getTimeInputs();
  console.log(sti);
  const [startTimes, endTimes] = (
    [sti, eti].map(timeInputs =>
      Array.from(timeInputs).map(input => parse(input.value)))
  );
  let days = Iterator.zip([ dayAbbrs, startTimes, endTimes ]);
  days = Array.from(days.map(([d,s,e]) => ({ day: d, st: s, et: e, diff: e-s })));
  console.log('days:', days);
  let lunchHours = parse(lunch.value);
  if (Number.isNaN(lunchHours) || lunchHours <= 0) {
    lunchHours = 0;
  }
  return { days: days, lunchHours: lunchHours };
}

function updateDisplay(times) {
  const daysWithHours = times.days.filter(d => !Number.isNaN(d.diff) && d.diff > 0);
  console.log('daysWithHours:', daysWithHours);
  console.log("Lunch duration:", times.lunchHours);
  const total = sum(daysWithHours.map(d => d.diff - times.lunchHours));
  console.log(`Total hours: ${total}`);
  document.getElementById('total-hours').textContent = total.toString();
  let sched = daysWithHours.map(d =>
    `${d.day}: ${fmtTime(d.st)} - ${fmtTime(d.et)} (${d.diff - times.lunchHours} hours)`).join("<BR>");
  document.getElementById('schedule').setHTML(sched);
}

