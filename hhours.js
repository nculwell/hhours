// vim: et ts=8 sts=2 sw=2 ft=javascript

"strict";

const dayAbbrs = [ "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat" ];

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
  const [startTimes, endTimes] = (
    [sti, eti].map(timeInputs =>
      Array.from(timeInputs).map(input => parse(input.value)))
  );
  let days = Iterator.zip([ dayAbbrs, startTimes, endTimes ]);
  days = Array.from(days.map(([d,s,e]) => ({ day: d, st: s, et: e, diff: e-s })));
  console.log('days:', days);
  const daysWithHours = days.filter(d => !Number.isNaN(d.diff) && d.diff > 0);
  console.log('daysWithHours:', daysWithHours);
  let lunchHours = parse(lunch.value);
  if (Number.isNaN(lunchHours) || lunchHours <= 0) {
    lunchHours = 0;
  }
  console.log("Lunch duration:", lunchHours);
  const total = sum(daysWithHours.map(d => d.diff - lunchHours));
  console.log(`Total hours: ${total}`);
  document.getElementById('total-hours').textContent = total.toString();
  let sched = days.map(d => `${d.day}: ${d.st} - ${d.et} (${d.diff})`).join("<BR>");
  document.getElementById('schedule').setHTML(sched);
}

