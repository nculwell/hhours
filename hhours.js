// vim: et ts=8 sts=2 sw=2 ft=javascript

"strict";

let totalWeekHours = 0;

// The starting point for execution.
function hoursInit() {
  addListeners();
}

function getInputs() {
  const tr = document.getElementById('hours-row');
  const inputs = tr.querySelectorAll('input');
  return inputs;
}

function changeListener(event) {
  console.log("CHANGED", event);
  const v = event.target.value;
  console.log(v);
  const n = parseInt(v);
  console.log(n);
  calculate();
}

function calculate() {
  const inputs = getInputs();
  let total = 0;
  for (input of inputs) {
    const dayHours = parseInt(input.value);
    if (!Number.isNaN(dayHours)) {
      console.log(`dayHours (${input.dataset.dayNumber}): ${dayHours}`);
      total += dayHours;
    }
  }
  totalWeekHours = total;
  console.log(`Total hours: ${total}`);
  document.getElementById('total-hours').textContent = total.toString();
}

function addListeners() {
  const inputs = getInputs();
  console.log(inputs);
  let i = 0;
  for (input of inputs) {
    i++;
    input.id = `input-day-${i}`;
    input.dataset.dayNumber = i;
    input.value = '';
    input.addEventListener('input', changeListener);
  }
}

