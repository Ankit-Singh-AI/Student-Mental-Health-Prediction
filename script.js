// ---------------------------------------------------------------------------
// Digital Balance — frontend logic
// Talks to the local FastAPI backend at http://127.0.0.1:8000/predict
// ---------------------------------------------------------------------------

const API_BASE_URL = 'http://127.0.0.1:8000';

const form = document.getElementById('predictForm');
const submitBtn = document.getElementById('submitBtn');
const btnLabel = submitBtn.querySelector('.btn-primary__label');
const btnLoader = submitBtn.querySelector('.btn-primary__loader');

const resultSection = document.getElementById('resultSection');
const errorSection = document.getElementById('errorSection');
const errorTitle = document.getElementById('errorTitle');
const errorMessage = document.getElementById('errorMessage');
const errorDismiss = document.getElementById('errorDismiss');
const resetBtn = document.getElementById('resetBtn');

const scoreValueEl = document.getElementById('scoreValue');
const scoreDescriptorEl = document.getElementById('scoreDescriptor');
const scoreNoteEl = document.getElementById('scoreNote');
const gaugeFill = document.getElementById('gaugeFill');
const gaugeNeedle = document.getElementById('gaugeNeedle');

// ---------------------------------------------------------------------------
// Segmented control (stress_level) — behaves like a required radio group
// ---------------------------------------------------------------------------
const segmented = document.getElementById('stress_level');
const segmentedOpts = segmented.querySelectorAll('.segmented__opt');
let stressLevelValue = '';

segmentedOpts.forEach(opt => {
  opt.addEventListener('click', () => {
    segmentedOpts.forEach(o => o.classList.remove('is-active'));
    opt.classList.add('is-active');
    stressLevelValue = opt.dataset.value;
    clearFieldError('stress_level');
  });
});

// ---------------------------------------------------------------------------
// Validation rules mirrored from the backend's Pydantic model
// ---------------------------------------------------------------------------
const numericRules = {
  age:                       { min: 10, max: 100, integer: true },
  avg_daily_usage_hours:     { min: 0,  max: 24 },
  daily_unlocks:             { min: 0,  integer: true },
  study_hours:               { min: 0,  max: 24 },
  physical_activity_hours:   { min: 0,  max: 24 },
  sleep_hours_per_night:     { min: 0,  max: 24 },
};

function clearFieldError(name) {
  const field = document.querySelector(`[data-error-for="${name}"]`);
  if (field) field.textContent = '';
  const wrapper = name === 'stress_level'
    ? segmented.closest('.field')
    : document.getElementById(name)?.closest('.field');
  wrapper?.classList.remove('has-error');
}

function setFieldError(name, message) {
  const field = document.querySelector(`[data-error-for="${name}"]`);
  if (field) field.textContent = message;
  const wrapper = name === 'stress_level'
    ? segmented.closest('.field')
    : document.getElementById(name)?.closest('.field');
  wrapper?.classList.add('has-error');
}

function validateForm(payload) {
  let isValid = true;
  form.querySelectorAll('[data-error-for]').forEach(el => {
    clearFieldError(el.dataset.errorFor);
  });

  // required select/text fields
  ['gender', 'country', 'academic_level', 'most_used_platform', 'purpose_of_use'].forEach(name => {
    if (!payload[name]) {
      setFieldError(name, 'Please make a selection.');
      isValid = false;
    }
  });

  if (!stressLevelValue) {
    setFieldError('stress_level', 'Please choose a stress level.');
    isValid = false;
  }

  // numeric fields
  Object.entries(numericRules).forEach(([name, rule]) => {
    const raw = payload[name];
    if (raw === '' || raw === null || raw === undefined || Number.isNaN(raw)) {
      setFieldError(name, 'This field is required.');
      isValid = false;
      return;
    }
    if (rule.integer && !Number.isInteger(raw)) {
      setFieldError(name, 'Please enter a whole number.');
      isValid = false;
      return;
    }
    if (raw < rule.min || (rule.max !== undefined && raw > rule.max)) {
      const upper = rule.max !== undefined ? `${rule.min}–${rule.max}` : `at least ${rule.min}`;
      setFieldError(name, `Must be ${upper}.`);
      isValid = false;
    }
  });

  return isValid;
}

// ---------------------------------------------------------------------------
// Gauge + result rendering
// ---------------------------------------------------------------------------
const GAUGE_CIRCUMFERENCE = 283; // approx. length of the semicircle path

function describeScore(score) {
  if (score >= 7) {
    return {
      label: 'Balanced',
      color: 'var(--sage)',
      note: 'Your habits look steady overall. Keep an eye on the routines that are working for you.',
    };
  }
  if (score >= 4) {
    return {
      label: 'Mixed signals',
      color: 'var(--amber)',
      note: 'Some areas look strong, others may be worth a closer look — sleep and screen time are good places to start.',
    };
  }
  return {
    label: 'Needs attention',
    color: 'var(--coral)',
    note: 'This estimate suggests real strain. Consider talking to someone you trust, or a counsellor — you don\u2019t have to sort this out alone.',
  };
}

function renderResult(score) {
  const clamped = Math.max(0, Math.min(10, score));
  const { label, color, note } = describeScore(score);

  scoreValueEl.textContent = score.toFixed(2);
  scoreDescriptorEl.textContent = label;
  scoreDescriptorEl.style.color = color;
  scoreNoteEl.textContent = note;

  const offset = GAUGE_CIRCUMFERENCE - (GAUGE_CIRCUMFERENCE * clamped) / 10;
  const rotation = -90 + (clamped / 10) * 180;

  // reset for a clean re-animation on repeated submits
  gaugeFill.style.transition = 'none';
  gaugeNeedle.style.transition = 'none';
  gaugeFill.style.strokeDashoffset = GAUGE_CIRCUMFERENCE;
  gaugeNeedle.style.transform = 'rotate(-90deg)';
  gaugeFill.style.stroke = color;
  // eslint-disable-next-line no-unused-expressions
  gaugeFill.getBoundingClientRect(); // force reflow

  requestAnimationFrame(() => {
    gaugeFill.style.transition = '';
    gaugeNeedle.style.transition = '';
    gaugeFill.style.strokeDashoffset = String(offset);
    gaugeNeedle.style.transform = `rotate(${rotation}deg)`;
  });

  errorSection.hidden = true;
  resultSection.hidden = false;
  resultSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function showError(title, message) {
  errorTitle.textContent = title;
  errorMessage.textContent = message;
  resultSection.hidden = true;
  errorSection.hidden = false;
  errorSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// ---------------------------------------------------------------------------
// Loading state
// ---------------------------------------------------------------------------
function setLoading(isLoading) {
  submitBtn.disabled = isLoading;
  btnLabel.hidden = isLoading;
  btnLoader.hidden = !isLoading;
}

// ---------------------------------------------------------------------------
// Submit handler
// ---------------------------------------------------------------------------
form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const formData = new FormData(form);
  const payload = {
    age: parseInt(formData.get('age'), 10),
    gender: formData.get('gender'),
    country: formData.get('country'),
    academic_level: formData.get('academic_level'),
    most_used_platform: formData.get('most_used_platform'),
    purpose_of_use: formData.get('purpose_of_use'),
    avg_daily_usage_hours: parseFloat(formData.get('avg_daily_usage_hours')),
    daily_unlocks: parseInt(formData.get('daily_unlocks'), 10),
    study_hours: parseFloat(formData.get('study_hours')),
    physical_activity_hours: parseFloat(formData.get('physical_activity_hours')),
    sleep_hours_per_night: parseFloat(formData.get('sleep_hours_per_night')),
    stress_level: stressLevelValue,
  };

  if (!validateForm(payload)) {
    showError('Check the highlighted fields', 'A few answers are missing or out of range — fix those and try again.');
    return;
  }

  setLoading(true);
  errorSection.hidden = true;

  try {
    const response = await fetch(`${API_BASE_URL}/predict`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      if (response.status === 422) {
        const body = await response.json().catch(() => null);
        const detail = body?.detail?.[0]?.msg || 'The server rejected one or more values.';
        showError('Validation failed', detail);
      } else if (response.status >= 500) {
        showError('Server error', 'The prediction model ran into a problem. Please try again in a moment.');
      } else {
        showError('Request failed', `The server responded with status ${response.status}.`);
      }
      return;
    }

    const data = await response.json();
    if (typeof data.predicted_mental_health_score !== 'number') {
      showError('Unexpected response', 'The server responded, but not in the format we expected.');
      return;
    }

    renderResult(data.predicted_mental_health_score);
  } catch (err) {
    showError(
      'Can\u2019t reach the server',
      `Make sure the FastAPI backend is running at ${API_BASE_URL} (uvicorn main:app --reload).`
    );
  } finally {
    setLoading(false);
  }
});

// ---------------------------------------------------------------------------
// Reset / dismiss
// ---------------------------------------------------------------------------
resetBtn.addEventListener('click', () => {
  form.reset();
  segmentedOpts.forEach(o => o.classList.remove('is-active'));
  stressLevelValue = '';
  resultSection.hidden = true;
  form.scrollIntoView({ behavior: 'smooth', block: 'start' });
});

errorDismiss.addEventListener('click', () => {
  errorSection.hidden = true;
});
