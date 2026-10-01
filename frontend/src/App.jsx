import { useEffect, useState } from "react";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const API_URL = (import.meta.env.VITE_API_URL || "http://localhost:8000").replace(/\/$/, "");

const navigationItems = [
  { label: "Home", path: "/" },
  { label: "Profile", path: "/profile" },
  { label: "Question Analytics", path: "/questions" },
  { label: "Contest Analytics", path: "/contests" },
  { label: "Submission Calendar", path: "/calendar" },
  { label: "AI Insights", path: "/insights" },
  { label: "Reports", path: "/reports" },
];

const defaultAvatar = "https://assets.leetcode.com/users/default_avatar.jpg";

function App() {
  const [profile, setProfile] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <BrowserRouter>
      <AppShell
        profile={profile}
        setProfile={setProfile}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />
    </BrowserRouter>
  );
}

function AppShell({ profile, setProfile, isSidebarOpen, setIsSidebarOpen }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [navigationMessage, setNavigationMessage] = useState("");

  const handleNavigation = (path) => {
    if (path !== "/" && !profile) {
      setNavigationMessage("Analyze a LeetCode username first to open this section.");
      navigate("/");
      return;
    }

    setNavigationMessage("");
    setIsSidebarOpen(false);
    navigate(path);
  };

  function handleNavigationWheel(event) {
    const navigation = event.currentTarget;

    if (navigation.scrollWidth <= navigation.clientWidth) {
      return;
    }

    if (Math.abs(event.deltaY) > Math.abs(event.deltaX)) {
      event.preventDefault();
      navigation.scrollLeft += event.deltaY;
    }
  }

  return (
    <main className="app-shell">
      <ProfileSidebar
        profile={profile}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <section className="main-content">
        <button
          className="mobile-sidebar-toggle"
          type="button"
          onClick={() => setIsSidebarOpen((current) => !current)}
          aria-expanded={isSidebarOpen}
          aria-controls="profile-sidebar"
        >
          {isSidebarOpen ? "Hide profile" : "Show profile"}
        </button>

        <nav className="navbar" aria-label="LeetLens navigation">
          <ul className="navbar-list" onWheel={handleNavigationWheel}>
            {navigationItems.map((item) => (
              <li className="navbar-item" key={item.path}>
                <button
                  className={`navbar-link ${location.pathname === item.path ? "active" : ""}`}
                  type="button"
                  onClick={() => handleNavigation(item.path)}
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {navigationMessage && (
          <p className="navigation-message" role="status">
            {navigationMessage}
          </p>
        )}

        <Routes>
          <Route
            path="/"
            element={<HomePage profile={profile} setProfile={setProfile} />}
          />
          <Route
            path="/profile"
            element={
              profile ? <ProfilePage profile={profile} /> : <Navigate to="/" replace />
            }
          />
          <Route
            path="/questions"
            element={
              profile ? (
                <QuestionAnalyticsPage username={profile.username} />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />
          <Route
            path="/contests"
            element={
              profile ? (
                <ContestAnalyticsPage username={profile.username} />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />
          <Route
            path="/calendar"
            element={
              profile ? (
                <SubmissionCalendarPage username={profile.username} />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />
          <Route
            path="*"
            element={
              profile ? (
                <ComingSoonPage title={navigationItems.find((item) => item.path === location.pathname)?.label} />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />
        </Routes>
      </section>
    </main>
  );
}

function ProfileSidebar({ profile, isOpen, onClose }) {
  const details = profile?.profile;
  const social = profile?.social;
  const displayName = details?.real_name || profile?.username || "LeetCode profile";
  const avatarUrl = details?.avatar_url || defaultAvatar;

  return (
    <aside className={`sidebar ${isOpen ? "is-open" : ""}`} id="profile-sidebar">
      <div className="sidebar-info">
        <div className="avatar-box">
          {profile ? (
            <img src={avatarUrl} alt={`${displayName} avatar`} />
          ) : (
            <span className="avatar-placeholder" aria-hidden="true">LL</span>
          )}
        </div>

        <div className="info-content">
          <p className="brand-mark">LeetLens</p>
          <h1 className="name" title={displayName}>{displayName}</h1>
          <p className="title">{profile ? "Analyzed profile" : "LeetCode analytics"}</p>
        </div>

        <button className="sidebar-close" type="button" onClick={onClose} aria-label="Close profile sidebar">
          x
        </button>
      </div>

      <div className="sidebar-info-more">
        <div className="separator" />

        {profile ? (
          <>
            <ul className="contacts-list">
              <SidebarDetail label="Ranking" value={formatNumber(details?.ranking)} />
              <SidebarDetail label="Reputation" value={formatNumber(details?.reputation)} />
              <SidebarDetail label="Country" value={details?.country || "Not provided"} />
            </ul>

            <div className="separator" />
            <div className="sidebar-socials">
              <p className="contact-title">Social links</p>
              <div className="social-list">
                {social?.github && <a href={social.github} target="_blank" rel="noreferrer">GitHub</a>}
                {social?.linkedin && <a href={social.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>}
                {social?.twitter && <a href={social.twitter} target="_blank" rel="noreferrer">Twitter</a>}
                {!social?.github && !social?.linkedin && !social?.twitter && <span>None linked</span>}
              </div>
            </div>
          </>
        ) : (
          <p className="sidebar-empty">Search a public username to load profile details here.</p>
        )}
      </div>
    </aside>
  );
}

function SidebarDetail({ label, value }) {
  return (
    <li className="contact-item">
      <div className="detail-dot" aria-hidden="true" />
      <div className="contact-info">
        <p className="contact-title">{label}</p>
        <p className="contact-value">{value}</p>
      </div>
    </li>
  );
}

function HomePage({ profile, setProfile }) {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const trimmedUsername = username.trim();

    if (!trimmedUsername) {
      setError("Enter a LeetCode username to continue.");
      return;
    }

    setError("");
    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/profile/${encodeURIComponent(trimmedUsername)}`);
      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(payload.detail || "Unable to load that LeetCode profile.");
      }

      setProfile(payload);
      navigate("/profile");
    } catch (requestError) {
      setError(requestError.message || "Unable to connect to the LeetLens backend.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <article className="page-card home-page">
      <header className="page-header">
        <p className="eyebrow">LeetCode profile intelligence</p>
        <h2 className="article-title">Find your progress</h2>
      </header>

      <section className="home-copy">
        <p>
          Turn a public LeetCode profile into a focused view of problem-solving progress,
          contest performance, and interview readiness.
        </p>
      </section>

      <form className="search-panel" onSubmit={handleSubmit} noValidate>
        <label htmlFor="username">LeetCode username</label>
        <div className="search-row">
          <input
            id="username"
            name="username"
            type="text"
            value={username}
            onChange={(event) => {
              setUsername(event.target.value);
              if (error) setError("");
            }}
            placeholder="e.g. leetcode"
            autoComplete="off"
            disabled={isLoading}
          />
          <button type="submit" className="primary-button" disabled={isLoading}>
            {isLoading ? "Analyzing..." : "Analyze profile"}
          </button>
        </div>
        {error && <p className="form-error" role="alert">{error}</p>}
      </form>

      {profile && (
        <section className="home-summary">
          <p className="eyebrow">Current profile</p>
          <h3>{profile.username}</h3>
          <p>Profile loaded. Use the navigation to explore the available analysis sections.</p>
        </section>
      )}
    </article>
  );
}

function ProfilePage({ profile }) {
  const details = profile.profile;

  return (
    <article className="page-card profile-page">
      <header className="page-header">
        <p className="eyebrow">Public profile</p>
        <h2 className="article-title">{profile.username}</h2>
      </header>

      <section className="profile-hero">
        <img src={details.avatar_url || defaultAvatar} alt={`${profile.username} avatar`} />
        <div>
          <p className="profile-role">LeetCode member</p>
          <h3>{details.real_name || profile.username}</h3>
          <p>{details.bio || "No public biography is available for this profile."}</p>
        </div>
      </section>

      <section className="metric-grid" aria-label="Profile metrics">
        <Metric label="Global ranking" value={formatNumber(details.ranking)} />
        <Metric label="Reputation" value={formatNumber(details.reputation)} />
        <Metric label="Country" value={details.country || "Not provided"} />
      </section>

      <section className="details-grid">
        <DetailCard label="Education" value={details.school || "Not provided"} />
        <DetailCard label="Company" value={details.company || "Not provided"} />
        <DetailCard label="Role" value={details.job_title || "Not provided"} />
      </section>
    </article>
  );
}

function QuestionAnalyticsPage({ username }) {
  const [analytics, setAnalytics] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    async function loadQuestionAnalytics() {
      setIsLoading(true);
      setError("");

      try {
        const response = await fetch(
          `${API_URL}/api/questions/${encodeURIComponent(username)}`,
          { signal: controller.signal },
        );
        const payload = await response.json().catch(() => ({}));

        if (!response.ok) {
          throw new Error(payload.detail || "Unable to load question analytics.");
        }

        setAnalytics(payload);
      } catch (requestError) {
        if (requestError.name !== "AbortError") {
          setError(requestError.message || "Unable to load question analytics.");
        }
      } finally {
        if (!controller.signal.aborted) setIsLoading(false);
      }
    }

    loadQuestionAnalytics();
    return () => controller.abort();
  }, [username]);

  if (isLoading) {
    return <AnalyticsState title="Question Analytics" message="Loading problem-solving data..." />;
  }

  if (error) {
    return <AnalyticsState title="Question Analytics" message={error} isError />;
  }

  if (!analytics) {
    return <AnalyticsState title="Question Analytics" message="No question analytics are available." />;
  }

  const { summary, difficulty, topics } = analytics;
  const topTopics = topics.slice(0, 10).map((topic) => ({
    name: topic.tag_name,
    solved: topic.problems_solved,
  }));
  const strongestTopics = topics.slice(0, 5);
  const practiceTopics = [...topics]
    .sort((left, right) => left.problems_solved - right.problems_solved)
    .slice(0, 5);

  return (
    <article className="page-card analytics-page">
      <header className="page-header">
        <p className="eyebrow">Problem-solving profile</p>
        <h2 className="article-title">Question Analytics</h2>
      </header>

      <section className="metric-grid analytics-metrics" aria-label="Question summary">
        <Metric label="Total solved" value={formatNumber(summary.total_solved)} />
        <Metric label="Easy" value={formatNumber(summary.easy)} />
        <Metric label="Medium" value={formatNumber(summary.medium)} />
        <Metric label="Hard" value={formatNumber(summary.hard)} />
      </section>

      <section className="chart-grid" aria-label="Question charts">
        <ChartCard title="Solved by difficulty">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={difficulty} margin={{ top: 10, right: 8, left: -20, bottom: 5 }}>
              <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
              <XAxis dataKey="difficulty" stroke="#aaa" tick={{ fontSize: 11 }} />
              <YAxis allowDecimals={false} stroke="#aaa" tick={{ fontSize: 11 }} />
              <Tooltip contentStyle={chartTooltipStyle} />
              <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                {difficulty.map((item) => (
                  <Cell key={item.difficulty} fill={difficultyColors[item.difficulty]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Difficulty distribution">
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={difficulty}
                dataKey="count"
                nameKey="difficulty"
                innerRadius={68}
                outerRadius={100}
                paddingAngle={3}
              >
                {difficulty.map((item) => (
                  <Cell key={item.difficulty} fill={difficultyColors[item.difficulty]} />
                ))}
              </Pie>
              <Tooltip contentStyle={chartTooltipStyle} />
            </PieChart>
          </ResponsiveContainer>
          <div className="chart-legend">
            {difficulty.map((item) => (
              <span key={item.difficulty}>
                <i style={{ background: difficultyColors[item.difficulty] }} />
                {item.difficulty}: {item.count}
              </span>
            ))}
          </div>
        </ChartCard>
      </section>

      <section className="topic-section">
        <div className="section-heading">
          <p className="eyebrow">Topic coverage</p>
          <h3>Topics solved</h3>
        </div>

        {topics.length === 0 ? (
          <div className="empty-state">No topic-wise solve progress is available for this profile.</div>
        ) : (
          <>
            <ChartCard title="Top topics">
              <ResponsiveContainer width="100%" height={Math.max(280, topTopics.length * 34)}>
                <BarChart layout="vertical" data={topTopics} margin={{ top: 5, right: 24, left: 18, bottom: 5 }}>
                  <CartesianGrid stroke="rgba(255,255,255,0.08)" horizontal={false} />
                  <XAxis type="number" allowDecimals={false} stroke="#aaa" tick={{ fontSize: 11 }} />
                  <YAxis type="category" dataKey="name" width={110} stroke="#aaa" tick={{ fontSize: 11 }} />
                  <Tooltip contentStyle={chartTooltipStyle} />
                  <Bar dataKey="solved" fill="#f5c451" radius={[0, 6, 6, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            <div className="topic-columns">
              <TopicList title="Strongest topics" topics={strongestTopics} />
              <TopicList title="Needs more practice" topics={practiceTopics} />
            </div>

            <div className="topic-table-wrap">
              <table className="topic-table">
                <caption>Full topic progress</caption>
                <thead>
                  <tr><th>Topic</th><th>Category</th><th>Solved</th></tr>
                </thead>
                <tbody>
                  {topics.map((topic) => (
                    <tr key={`${topic.category}-${topic.tag_slug || topic.tag_name}`}>
                      <td>{topic.tag_name}</td>
                      <td>{topic.category}</td>
                      <td>{topic.problems_solved}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </section>
    </article>
  );
}

function ContestAnalyticsPage({ username }) {
  const [analytics, setAnalytics] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    async function loadContestAnalytics() {
      setIsLoading(true);
      setError("");

      try {
        const response = await fetch(
          `${API_URL}/api/contests/${encodeURIComponent(username)}`,
          { signal: controller.signal },
        );
        const payload = await response.json().catch(() => ({}));

        if (!response.ok) {
          throw new Error(payload.detail || "Unable to load contest analytics.");
        }

        setAnalytics(payload);
      } catch (requestError) {
        if (requestError.name !== "AbortError") {
          setError(requestError.message || "Unable to load contest analytics.");
        }
      } finally {
        if (!controller.signal.aborted) setIsLoading(false);
      }
    }

    loadContestAnalytics();
    return () => controller.abort();
  }, [username]);

  if (isLoading) {
    return <AnalyticsState title="Contest Analytics" message="Loading contest history..." />;
  }

  if (error) {
    return <AnalyticsState title="Contest Analytics" message={error} isError />;
  }

  if (!analytics?.summary) {
    return (
      <article className="page-card analytics-state" role="status">
        <p className="eyebrow">Contest participation</p>
        <h2 className="article-title">Contest Analytics</h2>
        <p>This user has not participated in any LeetCode contests yet.</p>
      </article>
    );
  }

  const { summary, history } = analytics;
  const chartData = history.map((contest) => ({
    label: formatContestDate(contest.start_time),
    rating: Math.round(contest.rating),
  }));
  const tableHistory = [...history].reverse();

  return (
    <article className="page-card analytics-page">
      <header className="page-header">
        <p className="eyebrow">Competitive progress</p>
        <h2 className="article-title">Contest Analytics</h2>
      </header>

      <section className="metric-grid analytics-metrics contest-metrics" aria-label="Contest summary">
        <Metric label="Rating" value={Math.round(summary.rating).toLocaleString()} />
        <Metric label="Global rank" value={summary.global_ranking.toLocaleString()} />
        <Metric label="Contests attended" value={summary.attended_contests.toLocaleString()} />
        <Metric label="Top percentage" value={`${summary.top_percentage.toFixed(2)}%`} />
      </section>

      {summary.badge_name && (
        <p className="contest-badge">Badge: {summary.badge_name}</p>
      )}

      {history.length === 0 ? (
        <div className="empty-state">No attended contest history is available for this profile.</div>
      ) : (
        <>
          <ChartCard title="Contest rating progression">
            <ResponsiveContainer width="100%" height={320}>
              <LineChart data={chartData} margin={{ top: 10, right: 12, left: -18, bottom: 12 }}>
                <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
                <XAxis dataKey="label" stroke="#aaa" tick={{ fontSize: 10 }} />
                <YAxis allowDecimals={false} stroke="#aaa" tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={chartTooltipStyle} />
                <Line type="monotone" dataKey="rating" stroke="#f5c451" strokeWidth={2.5} dot={{ r: 3, fill: "#202020", stroke: "#f5c451", strokeWidth: 2 }} />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>

          <div className="contest-table-wrap">
            <table className="contest-table">
              <caption>Contest performance</caption>
              <thead>
                <tr>
                  <th>Contest</th>
                  <th>Rating</th>
                  <th>Rank</th>
                  <th>Solved</th>
                  <th>Trend</th>
                </tr>
              </thead>
              <tbody>
                {tableHistory.map((contest) => (
                  <tr key={`${contest.start_time}-${contest.title}`}>
                    <td>{contest.title}</td>
                    <td>{Math.round(contest.rating).toLocaleString()}</td>
                    <td>{contest.ranking.toLocaleString()}</td>
                    <td>{contest.problems_solved}/{contest.total_problems}</td>
                    <td><TrendLabel direction={contest.trend_direction} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </article>
  );
}

function TrendLabel({ direction }) {
  const labels = { UP: "Up", DOWN: "Down", SAME: "Same" };
  return <span className={`trend-label trend-${direction.toLowerCase()}`}>{labels[direction] || "Same"}</span>;
}

function formatContestDate(timestamp) {
  if (!timestamp) return "Unknown";
  return new Intl.DateTimeFormat("en", { month: "short", year: "2-digit" }).format(new Date(timestamp * 1000));
}

function SubmissionCalendarPage({ username }) {
  const [calendar, setCalendar] = useState(null);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function loadCalendar() {
      setIsLoading(true);
      setError("");

      try {
        const response = await fetch(
          `${API_URL}/api/calendar/${encodeURIComponent(username)}`,
          { signal: controller.signal },
        );
        const payload = await response.json().catch(() => ({}));

        if (!response.ok) {
          throw new Error(payload.detail || "Unable to load the submission calendar.");
        }

        setCalendar(payload);
      } catch (requestError) {
        if (requestError.name !== "AbortError") {
          setError(requestError.message || "Unable to load the submission calendar.");
        }
      } finally {
        if (!controller.signal.aborted) setIsLoading(false);
      }
    }

    loadCalendar();
    return () => controller.abort();
  }, [username]);

  if (isLoading) {
    return <AnalyticsState title="Submission Calendar" message="Loading submission history..." />;
  }

  if (error) {
    return <AnalyticsState title="Submission Calendar" message={error} isError />;
  }

  if (!calendar) {
    return <AnalyticsState title="Submission Calendar" message="No submission calendar is available." />;
  }

  const activeDays = calendar.days
    .filter((day) => day.count > 0)
    .sort((left, right) => right.date.localeCompare(left.date));
  const filteredDays = activeDays.filter((day) => {
    const query = search.trim().toLowerCase();
    return !query || day.date.includes(query) || day.weekday.toLowerCase().includes(query);
  });
  const topActiveDays = [...activeDays]
    .sort((left, right) => right.count - left.count || right.date.localeCompare(left.date))
    .slice(0, 10);

  const downloadCsv = async () => {
    setIsDownloading(true);
    setDownloadError("");

    try {
      const response = await fetch(`${API_URL}/api/reports/${encodeURIComponent(username)}/csv`);
      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        throw new Error(payload.detail || "Unable to download the submission CSV.");
      }

      const blob = await response.blob();
      const downloadUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = `${username}-submission-history.csv`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(downloadUrl);
    } catch (downloadRequestError) {
      setDownloadError(downloadRequestError.message || "Unable to download the submission CSV.");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <article className="page-card analytics-page calendar-page">
      <header className="page-header calendar-header">
        <div>
          <p className="eyebrow">Consistency over time</p>
          <h2 className="article-title">Submission Calendar</h2>
        </div>
        <button className="secondary-button" type="button" onClick={downloadCsv} disabled={isDownloading}>
          {isDownloading ? "Preparing CSV..." : "Download CSV"}
        </button>
      </header>

      {downloadError && <p className="form-error" role="alert">{downloadError}</p>}

      <section className="calendar-card" aria-label="Submission heatmap">
        <div className="calendar-card-heading">
          <div>
            <p className="eyebrow">Last 365 days</p>
            <h3>{calendar.summary.total_submissions.toLocaleString()} submissions</h3>
          </div>
          <span>{calendar.summary.submission_days} active days</span>
        </div>
        <div className="heatmap-scroll">
          <div className="heatmap-months" aria-hidden="true">
            {[...new Set(calendar.days.map((day) => day.month))].map((month) => (
              <span key={month}>{month}</span>
            ))}
          </div>
          <div className="heatmap-grid">
            {calendar.days.map((day) => (
              <span
                className={`heatmap-cell heatmap-level-${getHeatmapLevel(day.count)}`}
                key={day.date}
                style={{ gridColumn: day.week_index + 1, gridRow: getWeekdayRow(day.weekday) }}
                title={`${day.date}: ${day.count} submissions`}
                aria-label={`${day.date}: ${day.count} submissions`}
              />
            ))}
          </div>
        </div>
        <div className="heatmap-legend" aria-label="Submission intensity legend">
          <span>Less</span>
          {[0, 1, 3, 6, 11].map((count) => (
            <i className={`heatmap-cell heatmap-level-${getHeatmapLevel(count)}`} key={count} title={`${count} submissions`} />
          ))}
          <span>More</span>
        </div>
      </section>

      <section className="metric-grid analytics-metrics calendar-metrics" aria-label="Submission summary">
        <Metric label="Submission days" value={calendar.summary.submission_days.toLocaleString()} />
        <Metric label="Highest daily count" value={calendar.summary.highest_daily_count.toLocaleString()} />
        <Metric label="Average per day" value={calendar.summary.average_per_day.toFixed(1)} />
        <Metric label="Productive weekday" value={calendar.summary.most_productive_weekday || "No activity"} />
      </section>

      <section className="chart-grid calendar-chart-grid">
        <ChartCard title="Daily submission distribution">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={calendar.distribution} margin={{ top: 10, right: 8, left: -20, bottom: 5 }}>
              <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
              <XAxis dataKey="bucket" stroke="#aaa" tick={{ fontSize: 11 }} />
              <YAxis allowDecimals={false} stroke="#aaa" tick={{ fontSize: 11 }} />
              <Tooltip contentStyle={chartTooltipStyle} />
              <Bar dataKey="days" fill="#f5c451" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <div className="topic-list-card active-days-card">
          <h3>Top active days</h3>
          {topActiveDays.length === 0 ? (
            <p className="muted-copy">No submissions recorded in the last year.</p>
          ) : (
            <ol>
              {topActiveDays.map((day) => (
                <li key={day.date}><span>{formatCalendarDate(day.date)}</span><strong>{day.count}</strong></li>
              ))}
            </ol>
          )}
        </div>
      </section>

      <section className="history-section">
        <div className="section-heading history-heading">
          <div>
            <p className="eyebrow">Active days only</p>
            <h3>Submission history</h3>
          </div>
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search date or weekday"
            aria-label="Search submission history"
          />
        </div>
        <div className="topic-table-wrap">
          <table className="topic-table history-table">
            <caption>{filteredDays.length} matching days</caption>
            <thead><tr><th>Date</th><th>Weekday</th><th>Submissions</th></tr></thead>
            <tbody>
              {filteredDays.slice(0, 100).map((day) => (
                <tr key={day.date}><td>{formatCalendarDate(day.date)}</td><td>{day.weekday}</td><td>{day.count}</td></tr>
              ))}
            </tbody>
          </table>
          {filteredDays.length === 0 && <p className="empty-state">No active days match this search.</p>}
        </div>
      </section>
    </article>
  );
}

function getHeatmapLevel(count) {
  if (count === 0) return 0;
  if (count <= 2) return 1;
  if (count <= 5) return 2;
  if (count <= 10) return 3;
  return 4;
}

function getWeekdayRow(weekday) {
  return ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].indexOf(weekday) + 1;
}

function formatCalendarDate(dateValue) {
  const date = new Date(`${dateValue}T00:00:00`);
  return new Intl.DateTimeFormat("en", { day: "2-digit", month: "short", year: "numeric" }).format(date);
}

function ChartCard({ title, children }) {
  return (
    <div className="chart-card">
      <h3>{title}</h3>
      {children}
    </div>
  );
}

function TopicList({ title, topics }) {
  return (
    <div className="topic-list-card">
      <h3>{title}</h3>
      {topics.length === 0 ? (
        <p className="muted-copy">No topics available.</p>
      ) : (
        <ul>
          {topics.map((topic) => (
            <li key={`${title}-${topic.category}-${topic.tag_slug || topic.tag_name}`}>
              <span>{topic.tag_name}</span>
              <strong>{topic.problems_solved}</strong>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function AnalyticsState({ title, message, isError = false }) {
  return (
    <article className="page-card analytics-state" role={isError ? "alert" : "status"}>
      <p className="eyebrow">{isError ? "Unable to load" : "Question Analytics"}</p>
      <h2 className="article-title">{title}</h2>
      <p>{message}</p>
    </article>
  );
}

const chartTooltipStyle = {
  border: "1px solid hsl(0, 0%, 22%)",
  borderRadius: "8px",
  background: "hsl(240, 2%, 13%)",
  color: "hsl(0, 0%, 98%)",
};

const difficultyColors = {
  Easy: "#00b8a3",
  Medium: "#f5c451",
  Hard: "#ef6b63",
};

function Metric({ label, value }) {
  return (
    <div className="metric-card">
      <p>{label}</p>
      <strong>{value}</strong>
    </div>
  );
}

function DetailCard({ label, value }) {
  return (
    <div className="detail-card">
      <p className="eyebrow">{label}</p>
      <strong>{value}</strong>
    </div>
  );
}

function ComingSoonPage({ title = "Analytics" }) {
  return (
    <article className="page-card placeholder-page">
      <p className="eyebrow">Next analysis module</p>
      <h2 className="article-title">{title}</h2>
      <p>This section is reserved for the next implementation phase.</p>
    </article>
  );
}

function formatNumber(value) {
  return typeof value === "number" ? value.toLocaleString() : "Not provided";
}

export default App;
