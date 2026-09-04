// vim: et ts=8 sts=2 sw=2 ft=javascript

"strict";

// The starting point for execution.
function hoursInit() {
  addListeners();
}

function addListeners() {
  const inputs = document.getElementsByTagName('input');
  console.log(inputs);
  for (input of inputs) {
    input.value = '';
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
  calculate();
}

function sum(numbers) {
  return numbers.reduce((accum, current) => (accum + current), 0);
}

function parse(v) {
  return parseFloat(v);
}

function calculate() {
  const [sti, eti, lunch] = getTimeInputs();
  console.log(sti);
  const startTimes = Array.from(sti).map(input => parse(input.value));
  const endTimes = Array.from(eti).map(input => parse(input.value));
  const pairs = Iterator.zip([ startTimes, endTimes ]);
  console.log(pairs);
  const dayTimes = pairs
    .map(([s,e]) => (e - s))
    .filter(t => !Number.isNaN(t) && t>0);
  const lunchHours = parse(lunch.value);
  console.log("Lunch duration:", lunchHours);
  const total = (Number.isNaN(lunchHours)
    ? sum(dayTimes)
    : sum(dayTimes.map(t => t - lunchHours))
  );
  console.log(`Total hours: ${total}`);
  document.getElementById('total-hours').textContent = total.toString();
}

