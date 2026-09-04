// vim: et ts=8 sts=2 sw=2 ft=javascript

"strict";

let totalWeekHours = 0;

// The starting point for execution.
function hoursInit() {
  addListeners();
}

function getTimeInputs() {
  const st = document.getElementById('start-times');
  const et = document.getElementById('end-times');
  const sti = st.querySelectorAll('input');
  const eti = et.querySelectorAll('input');
  return [ sti, eti ];
}

function changeListener(event) {
  console.log("CHANGED", event);
  const v = event.target.value;
  console.log(v);
  const n = parseInt(v);
  console.log(n);
  calculate();
}

function sum(numbers) {
  return numbers.reduce((accum, current) => (accum + current), 0);
}

function calculate() {
  const [sti, eti] = getTimeInputs();
  console.log(sti);
  const startTimes = Array.from(sti).map(input => parseInt(input.value));
  const endTimes = Array.from(eti).map(input => parseInt(input.value));
  const pairs = Iterator.zip([ startTimes, endTimes ]);
  console.log(pairs);
  const dayTimes = pairs.map(([s,e]) => (e - s)).filter(t => !Number.isNaN(t) && t>0);
  const total = sum(dayTimes);
  totalWeekHours = total;
  console.log(`Total hours: ${total}`);
  document.getElementById('total-hours').textContent = total.toString();
}

function addListeners() {
  const [s, e] = getTimeInputs();
  console.log(s);
  console.log(e);
  let i = 0;
  for (input of s) {
    i++;
    input.id = `start-time-day-${i}`;
    input.dataset.dayNumber = i;
    input.value = '';
    input.addEventListener('input', changeListener);
  }
  i = 0;
  for (input of e) {
    i++;
    input.id = `end-time-day-${i}`;
    input.dataset.dayNumber = i;
    input.value = '';
    input.addEventListener('input', changeListener);
  }
}

