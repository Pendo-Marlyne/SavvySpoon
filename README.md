# SavvySpoon

SavvySpoon is a portfolio-ready React app for **weekly meal planning, grocery generation, and budget tracking** in Kenyan shillings (KES).

It is built to feel polished for end users while remaining easy for developers to understand and extend.

---

## Why This Project Exists

Planning meals is hard when budget and grocery needs are disconnected.

SavvySpoon solves that by linking 3 flows in one place:

1. Plan meals for each day of the week.
2. Auto-generate a grocery list from planned meals.
3. Track spending against a weekly budget with visual analytics.

---

## Core Features

- **Authentication modes**
  - Create account / sign in (stored locally for demo simplicity).
  - Continue as guest for quick exploration.

- **Weekly planner**
  - Plan breakfast, lunch, and supper across 7 dates.
  - Save reusable meals to a personal library.
  - Favorite meals and apply them directly to a day + meal slot.

- **Smart grocery list**
  - Ingredients are auto-derived from meal names.
  - Edit quantity, unit, and price per row.
  - Add custom ingredients and soft-delete rows.

- **Budget analytics**
  - Weekly spend total and budget comparison.
  - Pie chart (spent vs remaining).
  - Day ranking (most to least expensive).
  - Ingredient spend ranking.
  - Toast status: under budget, 50% reached, or over budget.

- **Profile summary**
  - User details + weekly overview cards.
  - Day-by-day meal cost table.

- **Session controls**
  - Navbar logout returns users to auth screen.
  - Account data remains saved for future sign-in.

---

## Tech Stack

- **Frontend:** React 19, JSX
- **Build tool:** Vite
- **Styling:** Tailwind CSS + component-level CSS
- **Icons:** lucide-react
- **State model:** React hooks (`useState`, `useMemo`, `useEffect`, `useCallback`)
- **Persistence:** `localStorage` (frontend-only demo architecture)

---

## Project Structure

```text
src/
  App.jsx                    # App shell, routing-by-state, persistence boundary
  lib/
    planner.js               # Date utilities, planner normalization, money formatting
  components/
    Auth.jsx                 # Sign in / Sign up / Guest access
    Header.jsx               # Navbar + spend meter + logout
    Homepage.jsx             # Landing page and feature highlights
    weeklyplanner.jsx        # Weekly planning interactions
    grocery.jsx              # Grocery editing and total calculations
    budget.jsx               # Budget analytics and status persistence
    profile.jsx              # Profile and weekly summary dashboard
    Footer.jsx               # Footer navigation
```

---

## Data Flow at a Glance

SavvySpoon uses a clean derived-state approach:

1. **Planner state** is the source of truth.
2. **Grocery list** is derived from planner meal names + ingredient mapping.
3. **Weekly total** is derived from grocery item `price * quantity`.
4. **Budget status** is derived from `weeklyTotal` vs `budget`.

This makes the app easy to reason about and demo.

---

## LocalStorage Model

For account users, data is namespaced by username to avoid collisions.

Examples:

- `savvyspoon.users`
- `savvyspoon.user.<username>.weekStartDate`
- `savvyspoon.user.<username>.weeklyPlan.<yyyy-mm-dd>`
- `savvyspoon.user.<username>.budget`
- `savvyspoon.user.<username>.ingredientOverrides`
- `savvyspoon.user.<username>.customIngredients`
- `savvyspoon.user.<username>.savedMeals`
- `savvyspoon.user.<username>.favoriteMealIds`
- `savvyspoon.user.<username>.budgetStatus`

### Security Note

This project stores credentials in localStorage because it is a frontend portfolio demo.
For production, use a backend auth system with hashed passwords and secure sessions.

---

## Getting Started

### 1) Install dependencies

```bash
npm install
```

### 2) Run development server

```bash
npm run dev
```

### 3) Build for production

```bash
npm run build
```

### 4) Preview production build

```bash
npm run preview
```

### 5) Lint project

```bash
npm run lint
```

---

## User Roles

- **Guest**
  - Can explore the experience quickly.
  - Limited access to non-home routes by design.
  - Data is not persisted as an account profile.

- **Account user**
  - Full planner, grocery, budget, and profile experience.
  - Data persists between sessions.

---

## Presentation / Demo Script (2-3 minutes)

1. Start at auth and create an account.
2. Open Weekly Planner and add meals for a few days.
3. Save one meal to the library and apply it elsewhere.
4. Go to Grocery List and show auto-generated ingredients.
5. Edit quantity/unit/price and add one custom ingredient.
6. Open Budget page to show live charts and status toast.
7. Open Profile for weekly summary.
8. Click Logout and show return to auth.
9. Sign in again to prove data persistence.

---

## Developer Notes

- The app intentionally uses **state-driven page switching** instead of a router to keep core logic straightforward for portfolio review.
- `src/lib/planner.js` normalizes planner shape to support compatibility with older stored payloads.
- `useMemo` is used in critical derivations (`dayTotals`, `groceryList`, `weeklyTotal`) to keep rendering efficient.
- Comments were added in key files to support walkthroughs and onboarding.

---

## Known Limitations

- No backend/database; persistence is browser-local only.
- No multi-device sync.
- No real authentication security.
- Ingredient extraction is keyword-based heuristic (not NLP/AI).

---

## Roadmap Ideas

- Add backend auth + encrypted credentials.
- Sync accounts across devices.
- Add meal cost suggestions and smarter ingredient inference.
- Export grocery list / budget reports (PDF or CSV).
- Add tests (unit + integration) for planner and budget derivations.

---

## License

This project is currently unlicensed for public reuse by default.
Add a `LICENSE` file (MIT, Apache-2.0, etc.) if you want open-source distribution.
