# LeetLens Project Dashboard

## Current Phase

**Phase 5: AI insights and reports**

Phase 4 analytics endpoints and pages are complete and validated. The next implementation slice is AI insights and reports.

## Implementation Phases

The project will be implemented one phase at a time. Each phase must be validated before work begins on the next phase.

### Phase 0: Planning and Safety

- [x] Confirm requirements and technology choices.
- [x] Document the redesign plan.
- [x] Document sacred-folder and read-only rules.
- [x] Identify desktop and mobile visual references.

**Gate:** Requirements and protected-folder rules are clear.

### Phase 1: Project Scaffolding

- [x] Create the Vite React frontend.
- [x] Create the FastAPI backend.
- [x] Add dependency files.
- [x] Add `.env.example` files.
- [x] Add Vercel and Render configuration.
- [x] Verify both applications start independently.

**Gate:** Empty frontend and backend run successfully without analytics functionality.

### Phase 2: Backend Foundation and Profile

- [x] Configure FastAPI, settings, CORS, and health checks.
- [x] Implement the LeetCode GraphQL client.
- [x] Implement profile validation and `/api/profile/{username}`.
- [x] Normalize profile data and error responses.

**Gate:** A valid username returns profile data and an invalid username returns a controlled error.

### Phase 3: Frontend Shell and Search Flow

- [x] Recreate the Main-LeetLens shell.
- [x] Add the responsive sidebar.
- [x] Add horizontal navigation.
- [x] Build the empty Home page.
- [x] Connect Home to the profile endpoint.
- [x] Navigate valid searches to Profile.
- [x] Show inline invalid-username errors.

**Gate:** The complete search-to-Profile flow works on desktop and mobile with real profile data.

### Phase 4: Analytics Endpoints and Pages

- [x] Implement question analytics backend endpoint.
- [x] Implement contest analytics backend endpoint.
- [x] Implement calendar backend endpoint.
- [x] Build Question Analytics with browser charts.
- [x] Build Contest Analytics with browser charts.
- [x] Build Submission Calendar and its filters.

**Gate:** Each page fetches its own endpoint and handles loading, empty, error, and successful states.

### Phase 5: AI Insights and Reports

- [ ] Implement on-demand Gemini insights generation.
- [ ] Build the AI Insights page.
- [ ] Implement backend PDF generation.
- [ ] Implement backend CSV generation.
- [ ] Build the Reports page and browser downloads.

**Gate:** Gemini runs only after an explicit click, and PDF/CSV files download successfully.

### Phase 6: Integration, Responsive Polish, and Security

- [ ] Compare the UI against the desktop and mobile reference screenshots.
- [ ] Fix responsive layout and overflow issues.
- [ ] Verify all navigation and API error states.
- [ ] Verify secrets remain backend-only.
- [ ] Verify the original reference folders are unchanged.

**Gate:** The local application is stable and usable on desktop and mobile.

### Phase 7: Deployment and Production Verification

- [ ] Deploy the backend to Render.
- [ ] Configure Render environment variables.
- [ ] Deploy the frontend to Vercel.
- [ ] Configure `VITE_API_URL`.
- [ ] Configure production CORS.
- [ ] Verify the production application end to end.

**Gate:** A production user can search, analyze, generate insights, and download reports successfully.

## Completed Tasks

- [x] Confirmed the redesign goals and product direction.
- [x] Decided to build a normal website instead of continuing with Streamlit.
- [x] Selected Vite + React + JavaScript for the frontend.
- [x] Selected FastAPI for the backend.
- [x] Selected Vercel for frontend deployment.
- [x] Selected Render for backend deployment.
- [x] Confirmed the Main-LeetLens visual direction.
- [x] Identified the Main-LeetLens desktop and mobile demo screenshots as visual references.
- [x] Defined the horizontal LeetLens navigation.
- [x] Defined separate analytics endpoints.
- [x] Defined on-demand Gemini insights generation.
- [x] Defined backend-generated PDF and CSV downloads.
- [x] Completed and validated Phase 1 project scaffolding.
- [x] Completed and validated Phase 2 backend foundation and profile endpoint.
- [x] Completed and validated Phase 3 frontend shell and profile search flow.
- [x] Completed and validated the Question Analytics slice of Phase 4.
- [x] Completed and validated the Contest Analytics slice of Phase 4.
- [x] Completed and validated the Submission Calendar and CSV slice of Phase 4.
- [x] Created the redesign roadmap in [plan.md](plan.md).
- [x] Created workspace protection rules in [rule.md](rule.md).

## Remaining Tasks

### Project Setup

- [x] Create the frontend Vite React application.
- [x] Create the backend FastAPI application.
- [x] Add frontend and backend environment examples.
- [x] Add Vercel and Render deployment configuration.
- [ ] Add project README documentation.

### Backend

- [x] Configure FastAPI, CORS, settings, and health checks.
- [x] Implement the LeetCode GraphQL service foundation.
- [x] Implement the profile endpoint.
- [x] Add normalized profile schemas and error handling.
- [x] Implement question analytics endpoint.
- [x] Implement contest analytics endpoint.
- [x] Implement submission calendar endpoint.
- [ ] Implement Gemini insights endpoint.
- [ ] Implement PDF report endpoint.
- [x] Implement CSV report endpoint.
- [ ] Add backend error handling and response schemas.

### Frontend

- [x] Recreate the Main-LeetLens shell in React.
- [x] Implement the responsive sidebar.
- [x] Implement horizontal navigation.
- [x] Implement the empty Home username-search state.
- [x] Implement profile validation and automatic navigation to Profile.
- [x] Implement the analyzed-user sidebar.
- [x] Implement the Profile page.
- [x] Implement Question Analytics with interactive charts.
- [x] Implement Contest Analytics with interactive charts.
- [x] Implement Submission Calendar and CSV download.
- [ ] Implement AI Insights with on-demand generation.
- [ ] Implement Reports with PDF and CSV downloads.
- [ ] Add loading, empty, validation, and error states.

### Validation and Deployment

- [ ] Test the frontend and backend locally.
- [ ] Test desktop and mobile layouts.
- [ ] Verify all analytics endpoints.
- [ ] Verify Gemini configuration.
- [ ] Verify PDF and CSV downloads.
- [ ] Verify frontend-to-backend CORS behavior.
- [ ] Run the frontend production build.
- [ ] Run backend checks.
- [ ] Deploy the frontend to Vercel.
- [ ] Deploy the backend to Render.
- [ ] Verify the production application end to end.

## Important Links

- [Full redesign plan](plan.md)
- [Workspace rules](rule.md)
- [Desktop design reference](../Main-LeetLens/website-demo-image/desktop.png)
- [Mobile design reference](../Main-LeetLens/website-demo-image/mobile.png)
- [Root project README](../README.md)
- [Reference portfolio README](../Main-LeetLens/README.md)
- [Reference portfolio HTML](../Main-LeetLens/index.html)
- [Reference portfolio styles](../Main-LeetLens/assets/css/style.css)
- [Reference portfolio JavaScript](../Main-LeetLens/assets/js/script.js)

Technical documentation will be added under `docs/` as implementation progresses.

## Known Decisions

- Only `Redesigned LeetLens` may be modified.
- The root LeetLens project and `Main-LeetLens` are read-only references.
- The frontend and backend are separate applications.
- The frontend uses React, Vite, JavaScript, Recharts, and Lucide React.
- The backend uses FastAPI and communicates with LeetCode GraphQL.
- Each navigation page fetches its own data when opened.
- Gemini is called only when the user explicitly requests AI insights.
- PDF and CSV files are generated by the backend and downloaded by the browser.
- No authentication is required.
- No recent-search history is required.
- No multiple-profile comparison is required.
- The analyzed LeetCode user is displayed in the sidebar.
- The horizontal Main-LeetLens navigation style will be preserved.

## Known Blockers

There are currently no implementation blockers.

Potential deployment dependencies to resolve during implementation:

- A valid Gemini API key must be configured on Render.
- The deployed Vercel origin must be added to backend CORS settings.
- The deployed Render URL must be configured as `VITE_API_URL` in Vercel.
- LeetCode GraphQL availability and response behavior must be verified from the Render environment.

## Status Legend

- `[ ]` Not started
- `[x]` Completed
