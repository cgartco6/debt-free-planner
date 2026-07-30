// state.js — Central app state with localStorage persistence

import { generateId } from './utils/format.js';

const STORAGE_KEY = 'dfp_state_v2';

const DEFAULT_STATE = {
  currency: 'ZAR',
  strategy: 'avalanche',
  efMonthlyPct: 0.2,
  investSplit: 0.6,
  investReturnPct: 10,
  savingsReturnPct: 6,
  projectionYears: 20,

  incomeSources: [],          // [{ id, label, amount, isIrregular, months: [] }]
  expenses: [],               // [{ id, category, name, amount }]
  debts: [],                  // [{ id, name, type, balance, apr, minPayment }]
  efBalance: 0,               // Current emergency fund balance

  // Tracking
  actionsDone: {},            // { [actionId]: true }
  snowflakes: [],             // [{ month, amount, note }]

  // Meta
  planCreatedAt: null,
  planUpdatedAt: null,
};

class AppState {
  constructor() {
    this._state = this._load();
    this._listeners = [];
  }

  _load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        return { ...DEFAULT_STATE, ...parsed };
      }
    } catch (e) {
      console.warn('State load failed, using defaults:', e);
    }
    return { ...DEFAULT_STATE };
  }

  _save() {
    try {
      this._state.planUpdatedAt = new Date().toISOString();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this._state));
    } catch (e) {
      console.warn('State save failed:', e);
    }
  }

  _notify() {
    this._listeners.forEach(fn => fn(this._state));
  }

  subscribe(fn) {
    this._listeners.push(fn);
    return () => { this._listeners = this._listeners.filter(l => l !== fn); };
  }

  get(key) {
    return this._state[key];
  }

  set(key, value) {
    this._state[key] = value;
    this._save();
    this._notify();
  }

  patch(partial) {
    Object.assign(this._state, partial);
    this._save();
    this._notify();
  }

  getAll() {
    return { ...this._state };
  }

  // ── Income ──────────────────────────────────────────────────────

  addIncomeSource(label = 'Income', amount = 0, isIrregular = false) {
    const source = { id: generateId(), label, amount: Number(amount), isIrregular, months: [] };
    this._state.incomeSources.push(source);
    this._save(); this._notify();
    return source.id;
  }

  updateIncomeSource(id, patch) {
    const idx = this._state.incomeSources.findIndex(s => s.id === id);
    if (idx >= 0) {
      this._state.incomeSources[idx] = { ...this._state.incomeSources[idx], ...patch };
      this._save(); this._notify();
    }
  }

  removeIncomeSource(id) {
    this._state.incomeSources = this._state.incomeSources.filter(s => s.id !== id);
    this._save(); this._notify();
  }

  // ── Expenses ────────────────────────────────────────────────────

  addExpense(category, name, amount) {
    const expense = { id: generateId(), category, name, amount: Number(amount) };
    this._state.expenses.push(expense);
    this._save(); this._notify();
    return expense.id;
  }

  updateExpense(id, patch) {
    const idx = this._state.expenses.findIndex(e => e.id === id);
    if (idx >= 0) {
      this._state.expenses[idx] = { ...this._state.expenses[idx], ...patch };
      this._save(); this._notify();
    }
  }

  removeExpense(id) {
    this._state.expenses = this._state.expenses.filter(e => e.id !== id);
    this._save(); this._notify();
  }

  // ── Debts ───────────────────────────────────────────────────────

  addDebt(name, type, balance, apr, minPayment) {
    const debt = {
      id: generateId(),
      name,
      type: type || 'other',
      balance: Number(balance),
      apr: Number(apr),
      minPayment: Number(minPayment),
    };
    this._state.debts.push(debt);
    this._save(); this._notify();
    return debt.id;
  }

  updateDebt(id, patch) {
    const idx = this._state.debts.findIndex(d => d.id === id);
    if (idx >= 0) {
      this._state.debts[idx] = { ...this._state.debts[idx], ...patch };
      this._save(); this._notify();
    }
  }

  removeDebt(id) {
    this._state.debts = this._state.debts.filter(d => d.id !== id);
    this._save(); this._notify();
  }

  // ── Actions tracking ────────────────────────────────────────────

  toggleAction(actionId) {
    this._state.actionsDone[actionId] = !this._state.actionsDone[actionId];
    this._save(); this._notify();
  }

  isActionDone(actionId) {
    return !!this._state.actionsDone[actionId];
  }

  // ── Snowflakes (one-off extra payments) ─────────────────────────

  addSnowflake(month, amount, note = '') {
    this._state.snowflakes.push({ id: generateId(), month: Number(month), amount: Number(amount), note });
    this._save(); this._notify();
  }

  removeSnowflake(id) {
    this._state.snowflakes = this._state.snowflakes.filter(s => s.id !== id);
    this._save(); this._notify();
  }

  // ── Utility ────────────────────────────────────────────────────

  hasData() {
    return (
      this._state.incomeSources.length > 0 ||
      this._state.expenses.length > 0 ||
      this._state.debts.length > 0
    );
  }

  hasPlan() {
    return (
      this._state.incomeSources.length > 0 &&
      this._state.expenses.length > 0 &&
      this._state.debts.length > 0
    );
  }

  reset() {
    this._state = { ...DEFAULT_STATE };
    localStorage.removeItem(STORAGE_KEY);
    this._notify();
  }

  exportJSON() {
    return JSON.stringify(this._state, null, 2);
  }

  importJSON(jsonStr) {
    try {
      const parsed = JSON.parse(jsonStr);
      this._state = { ...DEFAULT_STATE, ...parsed };
      this._save();
      this._notify();
      return true;
    } catch (e) {
      return false;
    }
  }
}

// Singleton
export const state = new AppState();
