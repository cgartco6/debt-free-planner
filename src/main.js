// main.js — App entry point and router

import { state } from './state.js';
import { renderWizard } from './views/wizard.js';
import { renderDashboard } from './views/dashboard.js';

const app = document.getElementById('app');

function showWizard() {
  app.innerHTML = `
    <div class="wizard-page">
      <header class="wizard-header">
        <div class="brand">
          <span class="brand-icon">🔓</span>
          <span class="brand-name">Debt<strong>Free</strong> Planner</span>
        </div>
        <p class="wizard-header-sub">Income first. Real numbers. No lectures.</p>
      </header>
      <div id="wizard-container"></div>
      <footer class="wizard-footer">
        <p>Your data stays on your device. Nothing is sent to any server.</p>
      </footer>
    </div>
  `;
  renderWizard(document.getElementById('wizard-container'), () => {
    showDashboard();
  });
}

function showDashboard() {
  app.innerHTML = `<div id="dashboard-container"></div>`;
  renderDashboard(document.getElementById('dashboard-container'), () => {
    showWizard();
  });
}

// Route on load
if (state.hasPlan()) {
  showDashboard();
} else {
  showWizard();
}
