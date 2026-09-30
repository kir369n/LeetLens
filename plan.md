# LeetLens Redesign Plan

## 1. Project Goal

Create a new full-stack LeetCode analytics website called **LeetLens** by combining:

- The existing LeetCode analytics functionality from the root LeetLens project.
- The visual language and responsive layout of `Main-LeetLens`.

The redesigned application will be a normal web application with:

- A React frontend deployed on Vercel.
- A FastAPI backend deployed on Render.
- LeetCode GraphQL requests handled by the backend.
- Browser-based interactive charts.
- Backend-generated PDF and CSV downloads.

## 2. Source Folder Rules

The following folders are reference-only and must not be modified:

- The existing root LeetLens project.
- `Main-LeetLens`.

Only this new folder may be created and modified:

```text
Redesigned LeetLens/
```

The new project will be independent from the existing Streamlit application. Existing Python files, Streamlit pages, portfolio files, and assets will remain available as references.

## 3. Final Project Structure

```text
Redesigned LeetLens/
├── plan.md
├── frontend/
│   ├── public/
│   │   └── assets/
│   ├── src/
│   │   ├── components/
│   │   ├── layouts/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── hooks/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── styles/
│   ├── .env.example
│   ├── package.json
│   ├── vite.config.js
│   └── vercel.json
└── backend/
    ├── app/
    │   ├── main.py
    │   ├── config.py
    │   ├── dependencies.py
    │   ├── routers/
    │   ├── services/
    │   ├── schemas/
    │   └── utils/
    ├── .env.example
    ├── requirements.txt
    ├── render.yaml
    └── README.md
```

The exact file breakdown may be adjusted during implementation if an existing pattern makes the code simpler, but the frontend/backend separation must remain.

## 4. Technology Stack

### Frontend

- Vite
- React
- JavaScript
- React Router for page navigation
- Recharts for interactive charts
- Lucide React for interface icons
- Native `fetch` or Axios for API requests
- CSS based on the existing `Main-LeetLens` visual design
- Poppins font

### Backend

- Python
- FastAPI
- Uvicorn
- Requests or HTTPX for LeetCode GraphQL requests
- Pydantic response schemas
- Google Gemini SDK for AI insights
- ReportLab for PDF generation
- Python CSV tools or Pandas for CSV generation
- CORS middleware for the Vercel frontend

### Deployment

- Frontend: Vercel
- Backend: Render
- Backend URL configured in the frontend through `VITE_API_URL`
- Gemini API key stored only in Render environment variables

## 5. Visual Design Requirements

The frontend must remain visually close to the existing `Main-LeetLens` portfolio template.

The visual implementation must use the existing desktop and mobile demo screenshots as design references:

```text
Main-LeetLens/website-demo-image/desktop.png
Main-LeetLens/website-demo-image/mobile.png
```

These screenshots are reference-only and must not be modified. They should be used to compare the redesigned frontend's layout, proportions, responsive behavior, navigation placement, sidebar treatment, card styling, spacing, and overall visual hierarchy during implementation and validation.

Preserve the following design characteristics:

- Dark theme.
- Left profile sidebar.
- Horizontal top navigation.
- Rounded cards.
- Poppins typography.
- Yellow and gold accent colors inspired by LeetCode.
- Responsive desktop and mobile layout.
- Existing visual hierarchy of sidebar, main content, cards, separators, and navigation states.
- Existing mobile sidebar behavior where appropriate.
- Existing general spacing, shadows, borders, and rounded visual language where it suits the analytics content.

Replace the portfolio content completely. Do not keep placeholder sections such as:

- About me
- Resume
- Portfolio projects
- Blog
- Contact form
- Testimonials
- Clients
- Personal portfolio information

The sidebar must represent the currently analyzed LeetCode user rather than the project author.

## 6. Application States

### Initial State

When the website first loads:

- Show the LeetLens brand.
- Show the existing-style sidebar in an empty or neutral state.
- Show the Home page.
- Display a username input and Analyze button.
- Do not display an analytics dashboard until a username is analyzed.

### Loading State

While a profile is being validated:

- Disable the Analyze button.
- Display a clear loading state.
- Prevent duplicate submissions.

### Invalid Username State

If the username does not exist or the backend cannot find a valid public profile:

- Remain on Home.
- Display an inline error message near the username input.
- Do not navigate to another page.
- Do not partially populate the sidebar.

### Valid Username State

After a valid username is confirmed:

- Store the analyzed username in frontend state.
- Populate the sidebar with the analyzed profile.
- Navigate automatically to Profile.
- Allow navigation to the remaining analytics pages.

### Page Loading and Error States

Every analytics page must support:

- Loading state.
- Successful state.
- Empty-data state.
- API error state.
- Retry action where useful.

## 7. Frontend Navigation

Use the portfolio template's horizontal navigation pattern, replacing its portfolio labels with:

```text
Home
Profile
Question Analytics
Contest Analytics
Submission Calendar
AI Insights
Reports
```

Navigation rules:

- Navigation is available after a profile is successfully analyzed.
- Home remains available for starting a new analysis.
- A new username search replaces the current analyzed profile.
- No recent-search history is required.
- No multiple-profile comparison is required.
- No authentication is required.
- Active navigation state must be visually clear.
- Navigation must remain usable on mobile, including horizontal overflow or an equivalent responsive treatment.

## 8. Frontend Pages

### Home

Purpose:

- Initial username search.
- Empty welcome state.
- Optional compact summary after analysis.

Required controls:

- LeetCode username input.
- Analyze Profile button.
- Inline validation and API error messages.

### Profile

Display the analyzed user's:

- Avatar.
- Username.
- Real name.
- Biography, when available.
- Country.
- School.
- Company.
- Job title.
- Global ranking.
- Reputation.
- GitHub link.
- LinkedIn link.
- Twitter link.

The analyzed user's avatar must be used in the sidebar. Use the existing default avatar as a fallback when LeetCode does not provide one.

### Question Analytics

Display:

- Total solved problems.
- Easy solved count.
- Medium solved count.
- Hard solved count.
- Interactive difficulty chart.
- Difficulty distribution chart.
- Topic-wise chart.
- Full topic progress table.
- Strongest topics.
- Topics needing more practice.

Use Recharts or another browser-based chart approach. Do not use Matplotlib in the frontend.

### Contest Analytics

Display:

- Contest rating.
- Global ranking.
- Contests attended.
- Top percentage.
- Contest rating progression chart.
- Contest performance table.
- Rating trend.
- Problems solved per contest.
- Empty state for users without contest participation.

### Submission Calendar

Display:

- GitHub-style submission heatmap.
- Submission days.
- Highest daily submission count.
- Average submissions per day.
- Total submissions.
- Most productive weekday.
- Daily submission distribution chart.
- Top active days table.
- Submission history table.
- Date search/filter control.
- Backend-generated CSV download.

The calendar must work responsively on desktop and mobile without overlapping or unreadable cells.

### AI Insights

Display:

- Interview readiness score.
- Readiness level.
- Strengths.
- Weaknesses.
- Recommended weekly goals.
- Personalized study plan.
- FAANG/interview readiness assessment.
- Detailed generated evaluation report.

Behavior:

- Do not call Gemini while the page is merely opened.
- Call Gemini only after the user clicks `Generate AI Insights`.
- Show loading state while Gemini is processing.
- Show a useful backend error if the Gemini key is missing or the request fails.
- The backend may use a fallback only if that behavior is explicitly retained during implementation; the primary requirement is that Gemini configuration is prepared and used.

### Reports

Provide controls for:

- Generating and downloading the PDF report.
- Generating and downloading the CSV submission report.

The backend must generate the files and return them as browser downloads. The frontend must show loading and error states for both downloads.

## 9. Backend API Design

The backend will expose separate endpoints so each page can request only the data it needs.

### Profile

```text
GET /api/profile/{username}
```

Responsibilities:

- Fetch and validate the public LeetCode profile.
- Return profile and social-link information.
- Return a clear 404-style response for an unknown username.

### Questions

```text
GET /api/questions/{username}
```

Responsibilities:

- Return difficulty counts.
- Return topic counts.
- Return normalized question analytics data.

### Contests

```text
GET /api/contests/{username}
```

Responsibilities:

- Return contest summary information.
- Return attended contest history.
- Return normalized rating history.

### Calendar

```text
GET /api/calendar/{username}
```

Responsibilities:

- Return submission calendar data.
- Return normalized daily submission records.
- Return summary statistics required by the calendar page.

### AI Insights

```text
POST /api/insights/{username}
```

Responsibilities:

- Fetch or receive the required analytics data.
- Build the Gemini prompt.
- Call Gemini only after the frontend requests generation.
- Return structured insight data and detailed report text.
- Return a useful configuration or provider error if Gemini is unavailable.

### PDF Report

```text
GET /api/reports/{username}/pdf
```

Responsibilities:

- Fetch the necessary profile and analytics data.
- Generate a complete PDF report.
- Return the file with download headers.

### CSV Report

```text
GET /api/reports/{username}/csv
```

Responsibilities:

- Fetch or reuse the user's calendar data.
- Generate a CSV submission history report.
- Return the file with download headers.

## 10. Data and API Practices

- Keep LeetCode GraphQL requests on the backend.
- Never expose LeetCode or Gemini secrets in the frontend.
- Normalize GraphQL responses into stable frontend response shapes.
- Handle missing profile fields safely.
- Handle users without contests or topic data.
- Handle zero solved problems without chart failures.
- Use timeouts for external requests.
- Return consistent JSON error responses.
- Avoid sending unnecessary personal or unrelated data to the frontend.
- Consider lightweight backend caching where it improves reliability without complicating deployment.

## 11. Environment Configuration

### Frontend `.env.example`

```env
VITE_API_URL=https://your-backend.onrender.com
```

### Backend `.env.example`

```env
GEMINI_API_KEY=your_gemini_api_key
FRONTEND_ORIGIN=https://your-frontend.vercel.app
```

The actual secret values must not be committed.

The backend CORS configuration must allow the deployed Vercel origin and a local development origin.

## 12. Deployment Configuration

### Vercel

Include:

- `frontend/vercel.json`.
- SPA fallback configuration so React Router routes work on refresh.
- Build configuration compatible with Vite.
- `VITE_API_URL` environment variable documentation.

### Render

Include:

- `backend/render.yaml`.
- FastAPI start command using Uvicorn.
- Python runtime/dependency configuration.
- Environment variables for Gemini and allowed frontend origins.
- Health endpoint for deployment checks.

## 13. Phased Implementation Strategy

The application must not be implemented as one large code-writing operation. Work will proceed in small phases, and each phase must pass its validation gate before the next phase begins.

### Phase 0: Planning and Safety

Confirm the requirements, technology choices, visual references, folder boundaries, and deployment targets. No application code is written in this phase.

**Validation gate:** The requirements and read-only rules are unambiguous.

### Phase 1: Project Scaffolding

Create the Vite React frontend and FastAPI backend inside `Redesigned LeetLens`. Add dependencies, environment examples, Vercel configuration, Render configuration, and minimal startup/health checks.

**Validation gate:** The frontend builds and the backend starts independently.

### Phase 2: Backend Foundation and Profile Flow

Configure FastAPI, CORS, settings, error handling, and the LeetCode GraphQL client. Implement profile fetching, username validation, normalized profile data, and `/api/profile/{username}`.

**Validation gate:** Valid and invalid usernames produce predictable backend responses.

### Phase 3: Frontend Shell and Search Flow

Recreate the Main-LeetLens shell in React, including the dark theme, sidebar, Poppins typography, yellow accents, rounded cards, responsive behavior, and horizontal navigation. Build Home, connect it to the profile endpoint, and navigate valid searches to Profile.

**Validation gate:** The search-to-Profile flow works with real data on desktop and mobile.

### Phase 4: Analytics Data and Pages

Implement questions, contests, and calendar endpoints one at a time. After each endpoint is validated, connect its corresponding frontend page. Use browser-based interactive charts and support loading, empty, error, and successful states.

**Validation gate:** Each analytics page fetches only its own data and renders safely with real and missing data.

### Phase 5: AI Insights and Report Downloads

Implement the explicit-click Gemini request, AI Insights page, backend PDF generation, backend CSV generation, and Reports page. Keep Gemini credentials on the backend.

**Validation gate:** Gemini is called only on request, and PDF/CSV files download successfully.

### Phase 6: Integration and Responsive Polish

Compare the implementation with the read-only desktop and mobile demo screenshots. Fix layout, overflow, navigation, error-state, accessibility, and visual consistency issues. Confirm secrets are not exposed to the frontend.

**Validation gate:** The local application is stable and usable at desktop and mobile sizes.

### Phase 7: Deployment and Production Verification

Deploy the backend to Render and the frontend to Vercel. Configure `GEMINI_API_KEY`, `FRONTEND_ORIGIN`, `VITE_API_URL`, production CORS, and SPA routing. Test the complete production flow.

**Validation gate:** A production user can search for a profile, view all analytics, generate AI insights, and download reports.

### Phase Rules

- Work on one phase at a time.
- Keep each code change focused on the current phase.
- Run the narrowest relevant validation after each change.
- Do not continue to the next phase when the current phase's gate fails.
- Update `master.md` as phase tasks are completed.
- Record new technical decisions or blockers in the project documentation.
- Never modify the sacred reference folders or files.

## 14. Development Workflow

1. Create the new `Redesigned LeetLens` directory.
2. Scaffold the Vite React frontend.
3. Scaffold the FastAPI backend.
4. Add shared environment examples and deployment configuration.
5. Recreate the Main-LeetLens shell in React.
6. Replace portfolio navigation and content with LeetCode navigation.
7. Implement backend configuration, CORS, and health checking.
8. Implement the profile endpoint and username validation.
9. Connect Home to the profile endpoint.
10. Implement the analyzed-user sidebar.
11. Implement the Profile page.
12. Implement Question Analytics and interactive charts.
13. Implement Contest Analytics and interactive charts.
14. Implement Submission Calendar and CSV download.
15. Implement AI Insights and on-demand Gemini generation.
16. Implement PDF report generation and browser download.
17. Add loading, empty, validation, and error states.
18. Verify desktop and mobile layouts.
19. Run frontend build and backend checks.
20. Run the local frontend and backend together.
21. Verify production configuration for Vercel and Render.
22. Update the new project README with local and deployment instructions.

## 15. Validation Checklist

### Source Safety

- [ ] Root LeetLens files are unchanged.
- [ ] `Main-LeetLens` files are unchanged.
- [ ] All new implementation files are inside `Redesigned LeetLens`.

### Frontend

- [ ] Vite production build succeeds.
- [ ] React routes load correctly.
- [ ] Horizontal navigation works on desktop.
- [ ] Navigation remains usable on mobile.
- [ ] Empty Home state is clear.
- [ ] Invalid username stays on Home with an inline error.
- [ ] Valid username navigates to Profile.
- [ ] Sidebar avatar and profile details update correctly.
- [ ] Loading states do not cause layout shifts or duplicate requests.
- [ ] Charts render with real data.
- [ ] Charts render safely with zero or missing data.
- [ ] PDF and CSV downloads work from the browser.

### Backend

- [ ] FastAPI application starts successfully.
- [ ] Health endpoint responds.
- [ ] CORS allows local frontend and Vercel frontend origins.
- [ ] Profile endpoint validates usernames.
- [ ] Separate analytics endpoints return normalized data.
- [ ] Missing contest data returns a valid empty response.
- [ ] Missing optional profile fields do not cause errors.
- [ ] Gemini is called only through the explicit insights request.
- [ ] PDF endpoint returns a valid downloadable PDF.
- [ ] CSV endpoint returns a valid downloadable CSV.
- [ ] External requests have timeouts and useful errors.

### Deployment

- [ ] Vercel build configuration is included.
- [ ] Render configuration is included.
- [ ] Frontend `.env.example` is included.
- [ ] Backend `.env.example` is included.
- [ ] No API keys or secrets are committed.
- [ ] Vercel can reach the Render backend.
- [ ] Render accepts requests from the deployed Vercel origin.

## 16. Completion Criteria

The redesign is complete when a user can:

1. Open the Vercel-hosted LeetLens website.
2. Enter a public LeetCode username on Home.
3. Receive an inline error for an invalid username.
4. Automatically reach Profile after a successful search.
5. See the analyzed user's information in the left sidebar.
6. Navigate using the horizontal portfolio-style navigation.
7. View all profile, question, contest, calendar, and AI analytics.
8. Generate AI insights on demand using Gemini.
9. Download a PDF report.
10. Download a CSV submission report.
11. Use the entire application on desktop and mobile.
12. Deploy the frontend on Vercel and backend on Render without modifying either reference folder.
