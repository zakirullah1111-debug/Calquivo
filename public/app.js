import { scores, requiredFinal, replacementRequired, replacementGrade, weighted } from './math.js';

const form = document.querySelector('#calculator');
const kind = document.body.dataset.tool;
const answer = document.querySelector('#answer');
const explanation = document.querySelector('#explanation');
const error = document.querySelector('#error');
const breakdown = document.querySelector('#breakdown');
const percent = value => `${value.toFixed(2)}%`;
const numeric = input => {
  if (input.value.trim() === '') throw Error('Complete every numeric field.');
  const value = Number(input.value);
  if (!Number.isFinite(value)) throw Error('Enter a valid number.');
  return value;
};
const number = id => numeric(document.getElementById(id));
let serial = 0;

function updateWeightStatus() {
  if (kind !== 'weighted-grade') return;
  const fields = [...document.querySelectorAll('.weight')];
  const status = document.querySelector('#weight-status');
  if (fields.some(field => field.value.trim() === '' || !Number.isFinite(Number(field.value)))) {
    status.textContent = 'Complete every category weight to see the total.';
    return;
  }
  const total = fields.reduce((sum, field) => sum + Number(field.value), 0);
  const remaining = 100 - total;
  status.textContent = `Total weight: ${percent(total)}. ` + (Math.abs(remaining) < 1e-7 ? 'Ready to calculate.' : remaining > 0 ? `${percent(remaining)} still to allocate.` : `${percent(-remaining)} over 100%.`);
}

function clearResult() {
  answer.textContent = 'Ready when you are';
  explanation.textContent = 'Inputs changed. Calculate to update your result.';
  error.textContent = '';
  breakdown.replaceChildren();
  updateWeightStatus();
}

function addCategory(values = '80, 90', weight = 0, drop = 0) {
  const row = document.createElement('fieldset');
  row.className = 'category';
  const id = ++serial;
  row.innerHTML = `<legend>Category ${id}</legend><label>Scores (%)<input class="scores" required></label><div class="row"><label>Weight (%)<input class="weight" type="number" min="0" max="100" step="any" required></label><label>Scores to drop<input class="drop" type="number" min="0" step="1" required></label><button class="secondary remove" type="button" aria-label="Remove category ${id}">Remove</button></div>`;
  row.querySelector('.scores').value = values;
  row.querySelector('.weight').value = weight;
  row.querySelector('.drop').value = drop;
  row.querySelector('.remove').onclick = () => {
    row.remove();
    clearResult();
    document.querySelector('#add').focus();
  };
  document.querySelector('#categories').append(row);
  return row;
}

function defaults() {
  document.querySelector('#categories').replaceChildren();
  serial = 0;
  addCategory('60, 80, 100', 40, 1);
  addCategory('80', 60, 0);
  updateWeightStatus();
}

function showBreakdown(lines) {
  const heading = document.createElement('h2');
  heading.textContent = 'Your calculation';
  const list = document.createElement('ul');
  for (const text of lines) {
    const item = document.createElement('li');
    item.textContent = text;
    list.append(item);
  }
  breakdown.replaceChildren(heading, list);
}

if (kind === 'weighted-grade') {
  defaults();
  document.querySelector('#add').onclick = () => {
    const row = addCategory();
    clearResult();
    row.querySelector('input').focus();
  };
}
form.addEventListener('input', clearResult);
form.addEventListener('reset', () => setTimeout(() => {
  if (kind === 'weighted-grade') defaults();
  clearResult();
}, 0));
form.addEventListener('submit', event => {
  event.preventDefault();
  error.textContent = '';
  breakdown.replaceChildren();
  try {
    let result;
    let lines = [];
    if (kind === 'final-grade') {
      const current = number('current'), weight = number('weight'), target = number('target');
      result = requiredFinal(current, weight, target);
      const earned = current * (1 - weight / 100);
      lines = [`Completed work contributes ${earned.toFixed(2)} course percentage points.`, `Target: ${percent(target)}. Final weight: ${percent(weight)}.`];
    } else if (kind === 'replacement-exam') {
      const list = scores(document.querySelector('#scores').value);
      const ew = number('examWeight'), fw = number('weight'), other = number('other'), target = number('target');
      result = replacementRequired(list, ew, fw, other, target);
      const achievable = replacementGrade(list, ew, fw, other, 100);
      lines = [`Lowest eligible midterm: ${percent(Math.min(...list))}.`, `A 100% final produces a course grade of ${percent(achievable)} under these rules.`];
    } else {
      const rows = [...document.querySelectorAll('.category')];
      const categories = rows.map(row => ({
        scores: scores(row.querySelector('.scores').value),
        weight: numeric(row.querySelector('.weight')),
        drop: numeric(row.querySelector('.drop'))
      }));
      result = weighted(categories);
      lines = categories.map((category, index) => {
        const kept = [...category.scores].sort((a, b) => a - b).slice(category.drop);
        const average = kept.reduce((sum, value) => sum + value, 0) / kept.length;
        return `${rows[index].querySelector('legend').textContent}: ${percent(average)} average after dropping ${category.drop}; contributes ${(average * category.weight / 100).toFixed(2)} course percentage points.`;
      });
    }
    if (kind === 'weighted-grade') {
      answer.textContent = percent(result);
      explanation.textContent = 'Your weighted course grade under the entered category and drop rules.';
    } else if (result > 100 + 1e-8) {
      answer.textContent = 'Above 100%';
      explanation.textContent = 'Your target is not reachable with a final score of 100% or less under these assumptions.';
    } else if (result <= 0) {
      answer.textContent = '0% needed';
      explanation.textContent = 'Your target is already met mathematically, even with a zero on the final. Separate attendance or exam-pass rules may still apply.';
    } else {
      answer.textContent = percent(Math.ceil((result - 1e-9) * 100) / 100);
      explanation.textContent = 'Minimum final-exam score for your target, rounded up to two decimals. Grading policies and rounding can affect official results.';
    }
    showBreakdown(lines);
  } catch (e) {
    answer.textContent = 'Check your inputs';
    explanation.textContent = 'Correct the issue shown in the form and try again.';
    error.textContent = e.message;
  }
});
