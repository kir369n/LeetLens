# LeetLens Implementation Prompts

This file contains focused, copy-paste prompts for implementing LeetLens phase by phase.

Use one prompt at a time. Do not combine multiple implementation phases in a single request.

## How to Use These Prompts

Before each phase:

1. Open the workspace containing `Redesigned LeetLens`.
2. Attach or reference `rule.md`, `master.md`, and `plan.md` when useful.
3. Copy only the prompt for the current phase.
4. Let the AI inspect the workspace before editing.
5. Review the changes and validation results before continuing.
6. Update the phase status in `master.md` only after the phase gate passes.

## Shared Safety and Workflow Instructions

Include this instruction with every implementation prompt:

```text
Read these project documents before making changes:

- Redesigned LeetLens/rule.md
- Redesigned LeetLens/master.md
- Redesigned LeetLens/plan.md

Follow rule.md strictly. Only read existing folders and files outside Redesigned LeetLens for reference. Only create or modify files inside Redesigned LeetLens.

Do not modify, rename, delete, move, overwrite, format, or run migrations against anything outside Redesigned LeetLens.

Work only on the requested phase. Do not implement future phases or unrelated refactors.

Before editing:
1. Inspect the relevant existing reference files.
2. Identify the smallest set of files needed.
3. State a short implementation hypothesis and the validation check that could disprove it.

After editing:
1. Run the narrowest relevant validation immediately.
2. Fix only errors caused by this phase.
3. Do not continue to the next phase.
4. Report changed files, validation results, remaining blockers, and the phase gate status.
```

# Phase 0: Planning and Safety Review

```text
Review Redesigned LeetLens/plan.md, Redesigned LeetLens/rule.md, and Redesigned LeetLens/master.md.

Do not write application code.
Do not modify any reference folder or file.

Check whether the implementation requirements, folder boundaries, phases, API responsibilities, deployment targets, and validation gates are consistent.

Report:
- Any contradictions.
- Any missing requirement that would block implementation.
- Any phase that is too broad and should be split.
- The recommended first implementation task.

If there are no blocking issues, state that Phase 1 is ready to begin.
```

**Phase gate:** Requirements and safety boundaries are clear.

# Phase 1: Project Scaffolding

```text
Implement only Phase 1: Project Scaffolding for Redesigned LeetLens.

Create a Vite + React + JavaScript frontend in:
Redesigned LeetLens/frontend

Create a FastAPI backend in:
Redesigned LeetLens/backend

Add only the minimum files needed for a clean starting project, including:
- Frontend package.json and Vite entry files.
- Backend requirements.txt and FastAPI entry files.
- Frontend .env.example with VITE_API_URL.
- Backend .env.example with GEMINI_API_KEY and FRONTEND_ORIGIN.
- frontend/vercel.json for SPA deployment.
- backend/render.yaml for Render deployment.
- A minimal backend health endpoint.
- Basic README files if needed for local setup.

Do not implement:
- LeetCode API calls.
- Analytics endpoints.
- Charts.
- Gemini.
- PDF generation.
- CSV generation.
- Final dashboard pages.

Verify that the frontend builds and the backend starts or passes a syntax/import check. Keep all files inside Redesigned LeetLens.
```

**Phase gate:** Frontend and backend run independently.

# Phase 2: Backend Foundation and Profile Endpoint

```text
Implement only Phase 2: Backend Foundation and Profile Flow.

Inspect the existing root LeetLens fetch_data.py only as a read-only reference for LeetCode GraphQL queries and response shapes.

Inside Redesigned LeetLens/backend:
- Configure FastAPI settings.
- Configure CORS for local development and FRONTEND_ORIGIN.
- Add a health endpoint if needed.
- Create a reusable LeetCode GraphQL client with request timeouts.
- Implement GET /api/profile/{username}.
- Validate that the username exists.
- Normalize profile data into a stable JSON response.
- Include avatar, username, real name, bio, ranking, reputation, country, school, company, job title, and social links when available.
- Return a controlled 404-style response for an invalid username.
- Return consistent error responses for external API failures.

Do not implement question, contest, calendar, Gemini, PDF, or CSV functionality yet.

Test the endpoint with a valid public username and an invalid username if network access is available. Otherwise, run backend syntax, import, and route checks.
```

**Phase gate:** Valid and invalid usernames produce predictable responses.

# Phase 3: Frontend Shell and Search Flow

```text
Implement only Phase 3: Frontend Shell and Search Flow.

Use Main-LeetLens as a read-only visual reference, including:
- Main-LeetLens/index.html
- Main-LeetLens/assets/css/style.css
- Main-LeetLens/assets/js/script.js
- Main-LeetLens/website-demo-image/desktop.png
- Main-LeetLens/website-demo-image/mobile.png

Inside Redesigned LeetLens/frontend:
- Recreate the dark portfolio-style shell in React.
- Preserve the left sidebar visual treatment.
- Preserve the horizontal navigation style.
- Use Poppins typography and yellow/gold accents.
- Make the layout responsive for desktop and mobile.
- Replace portfolio navigation with Home, Profile, Question Analytics, Contest Analytics, Submission Calendar, AI Insights, and Reports.
- Build the initial empty Home page with username input and Analyze button.
- Connect Home to GET /api/profile/{username}.
- Show loading state while searching.
- Show an inline error for an invalid username without navigating.
- Navigate automatically to Profile after a valid response.
- Populate the sidebar with the analyzed user's profile and avatar.
- Use a default avatar when the API does not provide one.

Do not implement analytics data, charts, Gemini, PDF, or CSV yet.

Run the frontend build and test the search states at desktop and mobile viewport sizes if browser tooling is available.
```

**Phase gate:** Search-to-Profile works with real profile data on desktop and mobile.

# Phase 4A: Question Analytics

```text
Implement only the Question Analytics slice.

Backend:
- Inspect the existing root LeetLens progress and skills logic as read-only reference.
- Implement GET /api/questions/{username}.
- Normalize difficulty counts and topic counts.
- Handle missing data and zero solved problems safely.

Frontend:
- Fetch the questions endpoint only when Question Analytics is opened.
- Add loading, empty, and error states.
- Display total, Easy, Medium, and Hard solved counts.
- Add browser-based interactive difficulty charts using Recharts.
- Add topic-wise chart and topic progress table.
- Display strongest topics and topics needing practice.

Do not implement contests, calendar, Gemini, PDF, or CSV in this task.

Run backend endpoint checks and the frontend production build.
```

**Phase gate:** Question Analytics works independently with real and empty data.

# Phase 4B: Contest Analytics

```text
Implement only the Contest Analytics slice.

Backend:
- Inspect the existing root LeetLens contest logic as read-only reference.
- Implement GET /api/contests/{username}.
- Normalize contest summary and attended contest history.
- Handle users with no contest participation.

Frontend:
- Fetch the contests endpoint only when Contest Analytics is opened.
- Add loading, empty, and error states.
- Display rating, global rank, contests attended, and top percentage.
- Add an interactive contest rating progression chart.
- Add a contest performance table with contest name, rating, rank, solved problems, and trend.

Do not implement calendar, Gemini, PDF, or CSV in this task.

Run endpoint checks and the frontend production build.
```

**Phase gate:** Contest Analytics works for both participating and non-participating users.

# Phase 4C: Submission Calendar

```text
Implement only the Submission Calendar slice.

Backend:
- Inspect the existing root LeetLens calendar and heatmap logic as read-only reference.
- Implement GET /api/calendar/{username}.
- Normalize daily submission records and summary statistics.
- Handle missing calendar data safely.
- Implement GET /api/reports/{username}/csv.
- Return a downloadable CSV with submission history.

Frontend:
- Fetch calendar data only when Submission Calendar is opened.
- Render a responsive GitHub-style submission heatmap.
- Display submission days, highest daily count, average per day, total submissions, and most productive weekday.
- Add daily submission distribution chart.
- Add top active days table.
- Add searchable/filterable submission history.
- Add a CSV download control.
- Support loading, empty, error, and download states.

Do not implement Gemini or PDF in this task.

Run backend checks, verify CSV content, and run the frontend build.
```

**Phase gate:** Calendar and CSV download work on desktop and mobile.

# Phase 5A: AI Insights

```text
Implement only the AI Insights slice.

Backend:
- Inspect the existing root LeetLens AI logic as a read-only reference for metrics and report concepts.
- Configure Gemini using GEMINI_API_KEY.
- Implement POST /api/insights/{username}.
- Call Gemini only when this endpoint is explicitly requested.
- Build a prompt using the user's profile, question, contest, and calendar metrics.
- Return structured readiness score, strengths, weaknesses, goals, study plan, and detailed report text.
- Return a clear configuration error if GEMINI_API_KEY is missing.
- Do not expose the Gemini key to the frontend.

Frontend:
- Fetch insights only when the user clicks Generate AI Insights.
- Add loading and error states.
- Display readiness score, strengths, weaknesses, goals, study plan, and detailed evaluation.

Do not implement PDF generation in this task.

Test that opening the page does not call Gemini and clicking the button does.
```

**Phase gate:** Gemini runs only after explicit user action and returns usable insights.

# Phase 5B: Reports and PDF Download

```text
Implement only the Reports slice.

Backend:
- Inspect the existing root LeetLens PDF report and chart logic as read-only reference.
- Implement GET /api/reports/{username}/pdf.
- Generate a downloadable PDF containing profile, question, contest, calendar, and AI report information when available.
- Return the PDF with correct browser download headers.
- Keep temporary generated files controlled and inside Redesigned LeetLens or use in-memory generation.

Frontend:
- Build the Reports page.
- Add PDF download control with loading, success, and error states.
- Keep the existing CSV download available.

Do not modify the original pdf_report.py or any other reference file.

Verify that the returned file is a valid PDF and downloads correctly in the browser.
```

**Phase gate:** PDF and CSV files download successfully from the Reports page.

# Phase 6: Integration and Responsive Polish

```text
Implement only Phase 6: Integration and Responsive Polish.

Review the complete Redesigned LeetLens application against the read-only references:
- Main-LeetLens/website-demo-image/desktop.png
- Main-LeetLens/website-demo-image/mobile.png
- Main-LeetLens/assets/css/style.css

Check and improve only the new project:
- Desktop layout proportions.
- Mobile layout and sidebar behavior.
- Horizontal navigation usability.
- Card spacing, borders, shadows, and yellow accents.
- Poppins typography and readable text sizes.
- Chart responsiveness.
- Heatmap overflow behavior.
- Loading, empty, invalid, and API error states.
- Keyboard focus and button accessibility.
- No overlapping content or clipped controls.
- No frontend exposure of Gemini credentials.

Do not change the product scope or add new analytics features.

Run the frontend production build, backend checks, and browser-based smoke tests if available. Confirm that all original reference folders remain unchanged.
```

**Phase gate:** The local application is stable and usable on desktop and mobile.

# Phase 7: Deployment and Production Verification

```text
Implement only Phase 7: Deployment Preparation and Verification.

Review the deployment configuration inside Redesigned LeetLens.

Frontend:
- Verify Vite production build.
- Verify frontend/vercel.json supports React Router refreshes.
- Verify VITE_API_URL is documented and used correctly.

Backend:
- Verify backend/render.yaml.
- Verify the Uvicorn start command.
- Verify health endpoint.
- Verify CORS allows the deployed Vercel origin.
- Verify GEMINI_API_KEY and FRONTEND_ORIGIN are environment variables.

Documentation:
- Add or update setup and deployment instructions inside Redesigned LeetLens only.
- Do not write real secrets into files.

After deployment, verify:
- Home username search.
- Invalid username handling.
- Profile navigation.
- Each analytics page.
- On-demand Gemini insights.
- PDF download.
- CSV download.
- Desktop and mobile behavior.

Do not modify the original root LeetLens project or Main-LeetLens.
```

**Phase gate:** The production application works end to end on Vercel and Render.

# Bug-Fix Prompt

Use this when a phase validation fails:

```text
A validation failure occurred in the current LeetLens phase.

Read:
- Redesigned LeetLens/rule.md
- Redesigned LeetLens/master.md
- Redesigned LeetLens/plan.md

Current phase: [INSERT PHASE]
Validation command or test: [INSERT COMMAND OR TEST]
Observed error: [INSERT ERROR]

Investigate only the files and code path related to this failure. Do not start a new feature or implement a future phase. State the likely root cause before editing. Make the smallest fix, rerun the same validation, and report the result.
```

# Review Prompt

Use this before marking a phase complete:

```text
Review only the implementation completed for [INSERT PHASE].

Read the relevant section of Redesigned LeetLens/plan.md and follow Redesigned LeetLens/rule.md.

Review for:
- Functional bugs.
- Missing requirements.
- Incorrect API contracts.
- Loading, empty, and error-state problems.
- Responsive layout issues.
- Exposed secrets.
- Unnecessary changes outside the current phase.
- Missing validation.

Do not modify files during this review. Report findings first, ordered by severity, with file references and concrete fixes. If there are no blocking issues, state the remaining test gaps and whether the phase gate passes.
```
