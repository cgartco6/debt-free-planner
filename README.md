# 🔓 DebtFree Planner

> **Income first. Real numbers. No lectures.**
> A 5-phase debt-freedom planner that starts with what you actually earn, calculates your true surplus, then shows you *exactly* when each debt payment converts into savings.

---

## What makes this different

Most debt planners ask for your debts first, then tell you to "put extra money toward debt" — without ever calculating whether you *have* any. This app inverts that:

1. **Income first** — enter what lands in your account after tax
2. **Expenses second** — map where it actually goes (no shame, just math)
3. **Debts third** — now we know your *real* attack budget
4. **The plan** — month-by-month, debt by debt, payment by payment

### The Liberation Timeline

The signature feature: a horizontal timeline bar showing your debt attack phase (rose → amber → teal gradient) transitioning into your wealth building phase (teal → emerald). Every debt payoff appears as a milestone marker. The moment your last debt clears, your entire former monthly payment becomes yours.

### The Payoff Cascade

When Debt A is paid off, its minimum payment automatically rolls into the attack on Debt B. When Debt B falls, both freed payments hit Debt C. This is the "avalanche roll" — shown visually, step by step, with exact dates and amounts.

### Phase 4: Debt → Savings Conversion

The plan doesn't end when debt is gone. It shows exactly:
- How much per month you've freed (all former minimums + your attack budget)
- The split between investments and savings
- 5/10/20/25-year compound growth projections
- Exact milestone dates when you hit R100k, R500k, R1M, R2M+

---

## Features

| Feature | Description |
|---|---|
| **Freedom Score** | 0–100 financial health score (surplus ratio + debt load + EF coverage) |
| **3 Strategies** | Avalanche (min interest), Snowball (min time-to-first-win), Hybrid (balanced) |
| **Strategy Comparison** | Side-by-side interest and timeline comparison of all 3 methods |
| **5-Phase Roadmap** | Foundation → Safety Buffer → Debt Attack → Recovery → Wealth Building |
| **Actionable Checklists** | Personalised, number-specific actions per phase (not generic advice) |
| **Month-by-Month Schedule** | Full payment table with target debt highlighted, milestone rows |
| **Snowflakes** | Add one-off extra payments (bonus, tax refund) and see timeline impact |
| **Wealth Projection** | Post-debt compound growth table and chart up to 40 years |
| **Budget Insights** | Non-judgmental, data-driven observations (housing %, discretionary spend) |
| **Multi-currency** | ZAR, USD, GBP, EUR, KES, NGN, GHS |
| **Irregular income** | 3-month average for commission/freelance earners |
| **Persistent state** | localStorage — data survives browser close/refresh |
| **Export/Import** | JSON export and import for backup or sharing |
| **No backend** | 100% client-side, no signup, no data leaves your device |

---

## Quick Start

```bash
# Clone the repo
git clone https://github.com/yourusername/debt-free-planner.git
cd debt-free-planner

# Install serve (only dev dependency)
npm install

# Start the app
npm start
# → Open http://localhost:3000
```

> **Why a server?** The app uses ES6 modules (`import`/`export`), which browsers block when opened directly as `file://`. A simple static server is the only requirement — no build step, no bundler, no framework.

### Alternative: zero-install

```bash
# If you have Node.js installed, no npm install needed:
npx serve . --listen 3000
```

---

## Repository Structure

```
debt-free-planner/
│
├── index.html                  # Entry point — loads fonts, Chart.js, CSS, main.js
│
├── styles/
│   ├── main.css                # Design tokens, reset, typography, wizard, forms, buttons
│   └── dashboard.css           # Sidebar, Liberation Timeline, phase cards, tables, charts
│
├── src/
│   ├── main.js                 # App router (wizard ↔ dashboard)
│   ├── state.js                # localStorage state management (income, expenses, debts)
│   │
│   ├── engine/
│   │   ├── budgetEngine.js     # Income aggregation, expense analysis, surplus, freedom score
│   │   ├── debtEngine.js       # Avalanche/snowball/hybrid algorithms, payment roll logic
│   │   ├── phaseEngine.js      # 5-phase roadmap generator with personalised actions
│   │   └── savingsEngine.js    # Post-debt compound growth projections, milestone finder
│   │
│   ├── views/
│   │   ├── wizard.js           # 3-step onboarding (income → expenses → debts)
│   │   └── dashboard.js        # Full dashboard (overview, schedule, projection, compare, settings)
│   │
│   └── utils/
│       └── format.js           # Currency formatting, date helpers, ID generation
│
├── package.json
├── .gitignore
└── README.md
```

---

## The 5-Phase Plan

```
Phase 0 — Foundation (Month 1)
  Know your numbers. Set up debit orders. Write down your debt-free date.

Phase 1 — Safety Buffer (1–3 months)
  Build 1 month of expenses as emergency fund (20% of surplus).
  Pay minimums only. Any shortfall here derails Phase 2.

Phase 2 — Debt Attack (the journey)
  All surplus above minimums hits the target debt.
  Strategy: Avalanche / Snowball / Hybrid (your choice).
  Each payoff rolls the freed payment into the next target.
  Attack power grows every time a debt falls.

Phase 3 — Recovery (2–6 months post-debt)
  Former debt payments → full 3-month emergency fund.
  Review insurance. No new debt.

Phase 4 — Wealth Building (permanent)
  Every rand that went to lenders now compounds for you.
  Split: investments (equities/ETF) + savings (HYSA/bonds).
  The plan shows exactly what this becomes in 10, 20, 25 years.
```

---

## The Math

### Surplus Calculation
```
Net monthly income
  - Fixed expenses     (rent, car, insurance, phone)
  - Variable expenses  (food, utilities, fuel)
  - Discretionary      (entertainment, clothing)
  ─────────────────────────────────────────────
= Surplus before debt

  - All minimum payments
  ─────────────────────
= Attack budget         ← This is your weapon
```

### Debt Payoff (Avalanche example)
```
Month 1:  All minimums paid. Extra R1,050 → FNB Credit Card (22.5% APR)
Month 12: FNB Credit Card PAID OFF. Freed R550/mo → rolls to Capitec Loan
Month 19: Capitec Loan PAID OFF. Freed R1,750/mo → rolls to WesBank Car
Month 33: WesBank Car PAID OFF. R4,550/mo now YOURS.
```

### Compound Growth (Post-Debt, 10% p/a investments)
```
Month 34:  R4,550/mo → investments + savings
Year 5:    ~R350,000
Year 10:   ~R870,000
Year 20:   ~R3.2M
```

---

## Technology

- **Pure vanilla JS** — ES6 modules, no framework, no build step
- **Chart.js 4.4** — debt balance line chart, wealth stacked bar chart
- **Google Fonts** — Inter (UI) + JetBrains Mono (financial data)
- **localStorage** — client-side persistence, no server needed
- **CSS custom properties** — full design token system, dark sidebar + light content
- ~1,800 lines of CSS, ~1,600 lines of JS across 10 files

---

## Customisation

### Adding a currency

In `src/utils/format.js`, add to the `CURRENCIES` object:

```javascript
AUD: { symbol: 'A$', locale: 'en-AU', code: 'AUD' },
```

### Changing EF target

In Settings → Emergency Fund, adjust the % of surplus that goes to EF during Phase 1.
The default is 20% (builds EF in 2–4 months while still making progress on debt).

### Snowflake payments

On the Month-by-Month tab, add a one-off extra payment in any month (bonus, tax refund, gift). The schedule recalculates immediately to show how many months it shaves off.

---

## Data Privacy

All data lives in your browser's `localStorage`. Nothing is transmitted anywhere.
Export your plan to JSON for backup. Import it on any device.

---

## Roadmap / Contributing

Ideas welcome via issues or PRs:

- [ ] PDF plan export
- [ ] Multiple debt plans (comparison mode)
- [ ] Shared plan link (base64 encoded URL)
- [ ] PWA / offline mode
- [ ] Debt consolidation calculator
- [ ] Rent vs buy calculator (post-debt phase)
- [ ] SA-specific: SARS provisional tax integration, bond affordability

---

## Disclaimer

This tool provides financial planning calculations for informational purposes only.
It is not financial advice. Investment projections use assumed rates and are not guaranteed.
Consult a registered financial advisor before making investment decisions.

---

*Built with the conviction that financial freedom is a math problem, not a willpower problem.*
