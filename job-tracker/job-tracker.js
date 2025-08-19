// script.js

// Array of 22 FFXI job abbreviations
const jobNames = [
  "WAR", "MNK", "WHM", "BLM", "RDM", "THF", "PLD", "DRK", "BST", "BRD",
  "RNG", "SAM", "NIN", "DRG", "SMN", "BLU", "COR", "PUP", "DNC", "SCH",
  "GEO", "RUN"
];

// Maximum spent points and unspent points
const MAX_SPENT = 2100; // Progress to Master uses 2100
const MAX_UNSPENT = 500;

// Gift breakpoints (in ascending order)
const giftBreakpoints = [
  5, 10, 20, 25, 30, 45, 50, 55, 60, 80,
  95, 100, 125, 145, 150, 180, 205, 210, 245, 275,
  280, 320, 355, 360, 405, 445, 450, 500, 545, 550,
  605, 655, 660, 720, 775, 780, 845, 905, 910, 980,
  1045, 1050, 1125, 1195, 1200, 1280, 1355, 1360, 1445, 1530,
  1620, 1710, 1805, 1900, 2000, 2100
];

let jobs = [];

// Load job data from localStorage or initialize if not present
function loadJobsData() {
  const stored = localStorage.getItem('jobsData');
  if (stored) {
    jobs = JSON.parse(stored);
  } else {
    jobs = jobNames.map(name => ({
      name: name,
      spent: 0,       // Spent points as integer
      unspent: 0.00   // Unspent can be fractional (to two decimals)
    }));
    saveJobsData();
  }
}

// Save job data to localStorage
function saveJobsData() {
  localStorage.setItem('jobsData', JSON.stringify(jobs));
}

/**
 * Computes progress toward the next gift.
 * Returns an object with:
 * - spentFraction: percentage width for the spent portion (within the gift range)
 * - potentialFraction: percentage width for (spent+unspent) within that range
 * - percentage: overall potential percentage (to display inside the bar)
 * - text: detailed text to display below the bar
 */
function computeGiftProgress(spent, unspent) {
  let lastGift = 0;
  let nextGift = null;
  for (let i = 0; i < giftBreakpoints.length; i++) {
    if (spent >= giftBreakpoints[i]) {
      lastGift = giftBreakpoints[i];
    } else {
      nextGift = giftBreakpoints[i];
      break;
    }
  }
  if (nextGift === null) {
    return {
      spentFraction: 100,
      potentialFraction: 100,
      percentage: 100,
      text: `Maxed out at ${spent} (no next gift).`
    };
  }
  const range = nextGift - lastGift;
  const spentFrac = ((spent - lastGift) / range) * 100;
  const potentialFrac = ((spent + unspent - lastGift) / range) * 100;

  // clamp to 100
  const clampedSpentFrac = Math.min(spentFrac, 100);
  const clampedPotentialFrac = Math.min(potentialFrac, 100);

  // bar widths (whole numbers) and one‐decimal label
  const spentFraction = Math.round(clampedSpentFrac);
  const potentialFraction = Math.round(clampedPotentialFrac);
  const percentage = parseFloat(clampedPotentialFrac.toFixed(1));

  // if you also want to avoid negative "remaining", clamp in‐range values here:
  const potentialInRange = Math.min((spent + unspent) - lastGift, range);
  const remaining = range - potentialInRange;

  return {
    spentFraction,
    potentialFraction,
    percentage,   // will never exceed 100.0
    text: `From ${lastGift} to ${nextGift}: ` +
      `Total ${potentialInRange.toFixed(2)} / ${range} ` +
      `(${percentage}%) -- ${remaining.toFixed(2)} To Go`
  };
}

/**
 * Computes total progress out of 2100 (Progress to Master).
 * Returns an object with:
 * - spentFraction: percentage width for spent points
 * - potentialFraction: percentage width for (spent + unspent)
 * - percentage: overall potential percentage (for the overlay)
 * - text: detailed text to display below the bar
 */
function computeTotalProgress(spent, unspent) {
  const MAX = 2100;  // or whatever your max is
  const totalSpent = Math.min(spent, MAX);
  const totalPotential = Math.min(spent + unspent, MAX);

  // Bar widths still use integer percentages:
  const spentFraction = Math.round((totalSpent / MAX) * 100);
  const potentialFraction = Math.round((totalPotential / MAX) * 100);

  // Display percentage with one decimal:
  const percentage = parseFloat(((totalPotential / MAX) * 100).toFixed(1));

  const remaining = MAX - totalPotential;
  const remainingRounded = remaining.toFixed(2);

  return {
    spentFraction,
    potentialFraction,
    percentage,   // e.g. 74.3
    text: `Spent: ${totalSpent} / ${MAX} | Potential: ${totalPotential.toFixed(2)} / ${MAX} (${percentage}%) -- ${remainingRounded} To Go`
  };
}



// Update the progress bars and details for a given job
function updateJobProgress(jobIndex) {
  const job = jobs[jobIndex];
  const spentInput = document.getElementById(`spent-${jobIndex}`);
  const unspentInput = document.getElementById(`unspent-${jobIndex}`);

  // Spent is an integer; unspent is a float (rounded to 2 decimals)
  job.spent = parseInt(spentInput.value, 10) || 0;
  job.unspent = parseFloat(unspentInput.value) || 0;
  if (job.spent > MAX_SPENT) job.spent = MAX_SPENT;
  if (job.unspent > MAX_UNSPENT) job.unspent = MAX_UNSPENT;
  job.unspent = Math.round(job.unspent * 100) / 100;

  spentInput.value = job.spent;
  unspentInput.value = job.unspent.toFixed(2);

  // Update "Progress to Next Gift"
  const giftInfo = computeGiftProgress(job.spent, job.unspent);
  const giftAdditional = Math.max(giftInfo.potentialFraction - giftInfo.spentFraction, 0);
  const giftBarContainer = document.getElementById(`gift-progress-bar-${jobIndex}`);
  giftBarContainer.innerHTML = `
      <div class="progress-bar" role="progressbar" style="width: ${giftInfo.spentFraction}%; background-color: #00477B;" aria-valuenow="${giftInfo.spentFraction}" aria-valuemin="0" aria-valuemax="100"></div>
      <div class="progress-bar" role="progressbar" style="width: ${giftAdditional}%; background-color: #00477B; opacity: 0.25;" aria-valuenow="${giftAdditional}" aria-valuemin="0" aria-valuemax="100"></div>
    `;
  document.getElementById(`gift-percentage-${jobIndex}`).textContent = giftInfo.percentage + '%';
  document.getElementById(`gift-details-${jobIndex}`).textContent = giftInfo.text;

  // Update "Progress to Master"
  const totalInfo = computeTotalProgress(job.spent, job.unspent);
  const totalAdditional = Math.max(totalInfo.potentialFraction - totalInfo.spentFraction, 0);
  const totalBarContainer = document.getElementById(`total-progress-bar-${jobIndex}`);
  totalBarContainer.innerHTML = `
      <div class="progress-bar" role="progressbar" style="width: ${totalInfo.spentFraction}%; background-color: #00477B;" aria-valuenow="${totalInfo.spentFraction}" aria-valuemin="0" aria-valuemax="100"></div>
      <div class="progress-bar" role="progressbar" style="width: ${totalAdditional}%; background-color: #00477B; opacity: 0.25;" aria-valuenow="${totalAdditional}" aria-valuemin="0" aria-valuemax="100"></div>
    `;
  document.getElementById(`total-percentage-${jobIndex}`).textContent = totalInfo.percentage + '%';
  document.getElementById(`total-details-${jobIndex}`).textContent = totalInfo.text;

  saveJobsData();
}

// Build the table with Bootstrap classes
function buildJobsTable() {
  const container = document.getElementById('jobsContainer');
  // 1) compute overall-to-master percentages and average them
  const allTotals = jobs.map(j => computeTotalProgress(j.spent, j.unspent).percentage);
  const sumTotals = allTotals.reduce((sum, p) => sum + p, 0);
  const avgTotal = jobs.length
    ? parseFloat((sumTotals / jobs.length).toFixed(1))
    : 0;

  // 2) start our HTML with the overall bar…
  let html = `
    <div style="margin-bottom:1rem;">
      <div class="position-relative">
        <div class="progress">
          <div class="progress-bar" style="width: ${avgTotal}%;"></div>
        </div>
        <div class="progress-overlay">${avgTotal}%</div>
      </div>
      <p style="text-align:center; margin:0.25rem 0 0;">Average Progress to Master</p>
    </div>

    <table class="table table-striped table-bordered">

  <thead>
        <tr>
          <th class="text-center align-middle">Job</th>
          <th class="text-center align-middle">Spent Points</th>
          <th class="text-center align-middle">Unspent Points<br>(0–${MAX_UNSPENT})</th>
          <th class="text-center align-middle">Progress to Next Gift</th>
          <th class="text-center align-middle">Progress to Master</th>
        </tr>
      </thead>
      <tbody>
    `;

  jobs.forEach((job, index) => {
    const giftInfo = computeGiftProgress(job.spent, job.unspent);
    const totalInfo = computeTotalProgress(job.spent, job.unspent);
    html += `
        <tr>
          <td class="text-center fw-bold align-middle">${job.name}</td>
          <td>
            <input type="number" class="form-control" id="spent-${index}" value="${job.spent}" min="0" max="${MAX_SPENT}" onchange="updateJobProgress(${index})">
          </td>
          <td>
            <input type="number" class="form-control" id="unspent-${index}" value="${job.unspent.toFixed(2)}" min="0" max="${MAX_UNSPENT}" step="0.01" onchange="updateJobProgress(${index})">
          </td>
          <td>
            <div class="position-relative">
              <div class="progress" id="gift-progress-bar-${index}"></div>
              <div class="progress-overlay" id="gift-percentage-${index}">${giftInfo.percentage}%</div>
            </div>
            <div class="mt-1" id="gift-details-${index}">${giftInfo.text}</div>
          </td>
          <td>
            <div class="position-relative">
              <div class="progress" id="total-progress-bar-${index}"></div>
              <div class="progress-overlay" id="total-percentage-${index}">${totalInfo.percentage}%</div>
            </div>
            <div class="mt-1" id="total-details-${index}">${totalInfo.text}</div>
          </td>
        </tr>
      `;
  });

  html += `
        </tbody>
      </table>
    `;

  container.innerHTML = html;
}

// Rounds x to n significant digits
//function roundToSignificant(x, n) {
//   if (x === 0) return 0;
//   const d = Math.floor(Math.log10(Math.abs(x))) + 1;
//   const factor = Math.pow(10, n - d);
//   return Math.round(x * factor) / factor;
// }

function roundToSignificant(x) {
  return x.toFixed(2)
}


document.addEventListener('DOMContentLoaded', function () {
  loadJobsData();
  buildJobsTable();
  // Ensure progress bars update on page load (from localStorage)
  for (let i = 0; i < jobs.length; i++) {
    updateJobProgress(i);
  }
});
