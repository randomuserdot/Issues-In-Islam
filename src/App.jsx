import React from "react";
import { BrowserRouter as Router, Routes, Route, Link, useParams, useNavigate, useLocation } from "react-router-dom";
import fm from "front-matter";
import { marked } from "marked";
import logo from "./assets/logo.png";

// --- Markdown Loading Logic ---
const files = import.meta.glob("./posts/*.md", {
  query: "?raw",
  import: "default",
  eager: true,
});

function calculateReadingTime(text) {
  // Strip markdown syntax to get plain words only
  const plainText = text
    .replace(/#{1,6}\s/g, "")         // headings
    .replace(/\*\*?(.*?)\*\*?/g, "$1") // bold/italic
    .replace(/\[.*?\]\(.*?\)/g, "")    // links
    .replace(/`{1,3}.*?`{1,3}/gs, "")  // code
    .replace(/>\s/g, "")               // blockquotes
    .replace(/[-*]\s/g, "")            // list markers
    .trim();

  const wordCount = plainText.split(/\s+/).filter(Boolean).length;
  const minutes = Math.ceil(wordCount / 200);
  return { minutes, wordCount };
}

const posts = Object.entries(files).map(([path, content]) => {
  const { attributes, body } = fm(content);
  const slug = path.split("/").pop().replace(".md", "");
  const { minutes, wordCount } = calculateReadingTime(body || "");
  return {
    ...attributes,
    slug,
    body: marked(body || ""),
    readingTime: minutes,
    wordCount,
  };
}).sort((a, b) => new Date(b.date) - new Date(a.date));


// --- Sidebar Component ---
function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-inner">
        <div className="sidebar-brand">
          <div className="sidebar-logo-wrap">
            <img src={logo} alt="Logo" className="sidebar-logo" />
            <div className="sidebar-logo-ring" />
          </div>
          <h1 className="sidebar-title">Issues in Islām</h1>
          <p className="sidebar-subtitle">Benefits to those who want to study and learn.</p>
          <div className="sidebar-divider" />
        </div>

        <nav className="sidebar-nav">
          <SidebarLink to="/" icon="◈" label="Home" />
          <SidebarLink to="/about" icon="◉" label="About" />
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-footer-line" />
          <p className="sidebar-footer-text">إِنَّ هَٰذَا الْقُرْآنَ يَهْدِي</p>
        </div>
      </div>
    </aside>
  );
}

function SidebarLink({ to, icon, label }) {
  const location = useLocation();
  const isActive = location.pathname === to || (to !== "/" && location.pathname.startsWith(to));

  return (
    <Link to={to} className={`sidebar-link ${isActive ? "sidebar-link--active" : ""}`}>
      <span className="sidebar-link-icon">{icon}</span>
      <span className="sidebar-link-label">{label}</span>
      {isActive && <span className="sidebar-link-indicator" />}
    </Link>
  );
}

// --- Home Component ---
// --- Quote of the Day ---
const islamicQuotes = [
  {
    text: "Indeed, with hardship will be ease.",
    source: "Qur'ān 94:6",
    arabic: "فَإِنَّ مَعَ الْعُسْرِ يُسْرًا",
    type: "quran",
  },
  {
    text: "Allah does not burden a soul beyond that it can bear.",
    source: "Qur'ān 2:286",
    arabic: "لَا يُكَلِّفُ اللَّهُ نَفْسًا إِلَّا وُسْعَهَا",
    type: "quran",
  },
  {
    text: "And whoever relies upon Allah — then He is sufficient for him.",
    source: "Qur'ān 65:3",
    arabic: "وَمَن يَتَوَكَّلْ عَلَى اللَّهِ فَهُوَ حَسْبُهُ",
    type: "quran",
  },
  {
    text: "So remember Me; I will remember you.",
    source: "Qur'ān 2:152",
    arabic: "فَاذْكُرُونِي أَذْكُرْكُمْ",
    type: "quran",
  },
  {
    text: "And He found you lost and guided you.",
    source: "Qur'ān 93:7",
    arabic: "وَوَجَدَكَ ضَالًّا فَهَدَىٰ",
    type: "quran",
  },
  {
    text: "The strong man is not the one who wrestles others down. The strong man is the one who controls himself when he is angry.",
    source: "Sahīh al-Bukhārī 6114",
    arabic: null,
    type: "hadith",
  },
  {
    text: "Make things easy and do not make them difficult. Give good tidings and do not drive people away.",
    source: "Sahīh al-Bukhārī 69",
    arabic: null,
    type: "hadith",
  },
  {
    text: "The best of people are those who are most beneficial to people.",
    source: "Al-Mu'jam al-Awsat 5937",
    arabic: null,
    type: "hadith",
  },
  {
    text: "Whoever believes in Allah and the Last Day, let him speak good or remain silent.",
    source: "Sahīh al-Bukhārī 6018",
    arabic: null,
    type: "hadith",
  },
  {
    text: "Do not belittle any good deed, even if it is just greeting your brother with a cheerful face.",
    source: "Sahīh Muslim 2626",
    arabic: null,
    type: "hadith",
  },
  {
    text: "Take up good deeds only as much as you are able, for the best deeds are those done regularly even if they are few.",
    source: "Sunan Ibn Mājah 4240",
    arabic: null,
    type: "hadith",
  },
  {
    text: "Verily, Allah does not look at your appearance or wealth, but rather He looks at your hearts and actions.",
    source: "Sahīh Muslim 2564",
    arabic: null,
    type: "hadith",
  },
  {
    text: "And be patient. Indeed, Allah is with the patient.",
    source: "Qur'ān 8:46",
    arabic: "وَاصْبِرُوا ۚ إِنَّ اللَّهَ مَعَ الصَّابِرِينَ",
    type: "quran",
  },
  {
    text: "And it may be that you dislike a thing which is good for you.",
    source: "Qur'ān 2:216",
    arabic: "وَعَسَىٰ أَن تَكْرَهُوا شَيْئًا وَهُوَ خَيْرٌ لَّكُمْ",
    type: "quran",
  },
];

function QuoteOfTheDay() {
  // Uses today's date as a number to pick a consistent quote for the whole day
  const today = new Date();
  const dayIndex = Math.floor(today.getTime() / 86400000); // milliseconds in a day
  const quote = islamicQuotes[dayIndex % islamicQuotes.length];

  const label = quote.type === "quran" ? "Āyah of the Day" : "Hadīth of the Day";

  return (
    <div className="qotd-wrap">
      <div className="qotd-label-row">
        <span className="qotd-label">{label}</span>
        <span className="qotd-ornament">❧</span>
      </div>

      {quote.arabic && (
        <p className="qotd-arabic">{quote.arabic}</p>
      )}

      <blockquote className="qotd-text">
        "{quote.text}"
      </blockquote>

      <p className="qotd-source">— {quote.source}</p>
    </div>
  );
}


function Home() {
  const [query, setQuery] = React.useState("");
  const filtered = posts.filter((p) =>
    p.title?.toLowerCase().includes(query.toLowerCase()) ||
    p.summary?.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="page-enter">
      {/* Updates Banner */}
      <section className="updates-section">
        <div className="updates-header">
          <span className="updates-badge">Updates</span>
        </div>
        <ul className="updates-list">
          <li>
            <span className="updates-dot" />
            <span className="updates-date">April 25, 2026</span>
            <span className="updates-text">The website is officially live!</span>
          </li>
          <li>
            <span className="updates-dot" />
            <span className="updates-date">April 25, 2026</span>
            <span className="updates-text">Added the True View of 5:44 article.</span>
          </li>
          <li>
            <span className="updates-dot" />
            <span className="updates-date">April 26, 2026</span>
            <span className="updates-text">Added the Understanding the nature of Šhirk and ʿIbādah.</span>
          </li>
          <li>
            <span className="updates-dot" />
            <span className="updates-date">April 26, 2026</span>
            <span className="updates-text">Added Quotes of The Day.</span>
          </li>
          <li>
            <span className="updates-dot" />
            <span className="updates-date">3rd May, 2026</span>
            <span className="updates-text">Added the 'Refuting the Misconceptions of Istiqlālists'. </span>
          </li>
        </ul>
      </section>
           {/* Quote of the Day */}
      <QuoteOfTheDay />


        {/* Posts Header + Search */}
      <div className="home-header">
        <h2 className="home-title">Recent Posts</h2>
        <div className="search-wrap">
          <span className="search-icon">⌕</span>
          <input
            className="search-input"
            placeholder="Search articles..."
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>


      {/* Post Cards */}
      <div className="post-list">
        {filtered.map((post, i) => (
          <Link to={`/posts/${post.slug}`} key={post.slug} className="post-card-link" style={{ animationDelay: `${i * 60}ms` }}>
            <article className="post-card">
              <div className="post-card-inner">
                <div className="post-card-top">
                  <div className="post-card-meta">
                 <time className="post-card-date">{post.date}</time>
                 <span className="post-card-reading-time">⏱ {post.readingTime} min read</span>
                 {post.tags && (
                  <div className="post-card-tags">
                  {post.tags.slice(0, 3).map(tag => (
                  <span key={tag} className="tag">{tag}</span>
                      ))}
                   </div>
                  )}
                </div>
                  <span className="post-card-arrow">→</span>
                </div>
                <h3 className="post-card-title">{post.title}</h3>
                {post.summary && <p className="post-card-summary">{post.summary}</p>}
              </div>
              <div className="post-card-accent" />
            </article>
          </Link>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="empty-state">
          <span className="empty-icon">◌</span>
          <p>No posts match your search.</p>
        </div>
      )}
    </div>
  );
}

// --- Post Component ---
function Post() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const post = posts.find((p) => p.slug === slug);

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (!post) return (
    <div className="not-found">
      <h1>Post not found</h1>
      <button onClick={() => navigate("/")} className="back-btn">← Return Home</button>
    </div>
  );

  return (
    <div className="page-enter post-page">
      {/* Back button */}
      <button onClick={() => navigate("/")} className="back-link">
        ← Back to Posts
      </button>

      {/* Post Header */}
      <header className="post-header">
        <div className="post-header-meta">
            <time className="post-meta-date">📅 {post.date}</time>
              <span className="post-meta-reading-time">⏱ {post.readingTime} min read · {post.wordCount.toLocaleString()} words</span>
          {post.tags && (
            <div className="post-tags">
              {post.tags.map(tag => (
                <span key={tag} className="tag tag--lg">{tag}</span>
              ))}
            </div>
          )}
        </div>

        <h1 className="post-title">{post.title}</h1>

        {post.summary && (
          <p className="post-lead">{post.summary}</p>
        )}

        <div className="post-header-divider" />
      </header>

      {/* Post Body */}
      <article
        className="post-content"
        dangerouslySetInnerHTML={{ __html: post.body }}
      />

      {/* Post Footer */}
      <footer className="post-footer">
        <div className="post-footer-divider" />
        <button onClick={() => navigate("/")} className="back-btn">
          ← Back to all posts
        </button>
      </footer>
    </div>
  );
}

// --- About Component ---
function About() {
  return (
    <div className="page-enter about-page">
      <header className="about-header">
        <h1 className="about-title">About This Website</h1>
        <div className="post-header-divider" />
      </header>

      <div className="about-content">
        <p>
          Welcome to <strong>Issues in Islām</strong>. This website serves as a dedicated archive for studying and learning about the religion and in-depth issues for the student of knowledge.
        </p>
        <p>
          Here, you will find detailed articles, responses, and beneficial knowledge aimed at those who wish to deepen their understanding.
        </p>
        <blockquote className="about-quote">
          We are a strict-traditionalist group that strictly follows the early predecessors in the understanding of the religion. We conform to revelation and its guidelines.
        </blockquote>
      </div>
    </div>
  );
}

// --- Main App ---
export default function App() {
  return (
    <Router>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Crimson+Pro:ital,wght@0,300;0,400;0,600;1,300;1,400&family=DM+Sans:wght@300;400;500;600&family=Amiri:ital,wght@0,400;0,700;1,400&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --bg:        #0e0f11;
          --bg-card:   #141519;
          --bg-hover:  #1a1b20;
          --border:    #1f2028;
          --border-hi: #2a2b35;
          --gold:      #c9a96e;
          --gold-dim:  #7a6140;
          --text-1:    #e8e6e0;
          --text-2:    #9b9890;
          --text-3:    #5a5854;
          --sidebar-w: 280px;
          --content-max: 760px;
          --radius:    14px;
        }

        body {
          background: var(--bg);
          color: var(--text-1);
          font-family: 'DM Sans', sans-serif;
          font-size: 15px;
          line-height: 1.6;
          -webkit-font-smoothing: antialiased;
        }

        /* ── Layout ── */
        .layout {
          display: flex;
          min-height: 100vh;
        }

        .main-content {
          margin-left: var(--sidebar-w);
          flex: 1;
          display: flex;
          justify-content: center;
          padding: 64px 48px;
        }

        .main-inner {
          width: 100%;
          max-width: var(--content-max);
        }

        /* ── Sidebar ── */
        .sidebar {
          width: var(--sidebar-w);
          height: 100vh;
          position: fixed;
          top: 0;
          left: 0;
          background: #0b0c0e;
          border-right: 1px solid var(--border);
          display: flex;
          flex-direction: column;
          z-index: 100;
        }

        .sidebar-inner {
          display: flex;
          flex-direction: column;
          height: 100%;
          padding: 36px 24px;
        }

        .sidebar-brand {
          text-align: center;
          margin-bottom: 32px;
        }

        .sidebar-logo-wrap {
          position: relative;
          width: 88px;
          height: 88px;
          margin: 0 auto 20px;
        }

        .sidebar-logo {
          width: 88px;
          height: 88px;
          border-radius: 50%;
          object-fit: cover;
          position: relative;
          z-index: 2;
          border: 2px solid var(--gold-dim);
        }

        .sidebar-logo-ring {
          position: absolute;
          inset: -5px;
          border-radius: 50%;
          border: 1px solid var(--gold-dim);
          opacity: 0.4;
          z-index: 1;
        }

        .sidebar-title {
          font-family: 'Crimson Pro', serif;
          font-size: 20px;
          font-weight: 600;
          color: var(--text-1);
          margin-bottom: 8px;
          letter-spacing: 0.01em;
        }

        .sidebar-subtitle {
          font-size: 12px;
          color: var(--text-3);
          font-style: italic;
          line-height: 1.5;
          padding: 0 12px;
        }

        .sidebar-divider {
          height: 1px;
          background: linear-gradient(90deg, transparent, var(--border-hi), transparent);
          margin: 24px 0 0;
        }

        /* Nav */
        .sidebar-nav {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .sidebar-link {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 11px 14px;
          border-radius: 10px;
          text-decoration: none;
          color: var(--text-2);
          font-size: 14px;
          font-weight: 400;
          transition: all 0.2s ease;
          position: relative;
          letter-spacing: 0.01em;
        }

        .sidebar-link:hover {
          background: var(--bg-hover);
          color: var(--text-1);
        }

        .sidebar-link--active {
          background: var(--bg-hover);
          color: var(--text-1);
          font-weight: 500;
        }

        .sidebar-link-icon {
          font-size: 14px;
          color: var(--gold);
          opacity: 0.7;
          width: 16px;
          text-align: center;
        }

        .sidebar-link--active .sidebar-link-icon {
          opacity: 1;
        }

        .sidebar-link-label { flex: 1; }

        .sidebar-link-indicator {
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: var(--gold);
        }

        /* Sidebar footer */
        .sidebar-footer {
          margin-top: auto;
          text-align: center;
        }

        .sidebar-footer-line {
          height: 1px;
          background: linear-gradient(90deg, transparent, var(--border-hi), transparent);
          margin-bottom: 20px;
        }

        .sidebar-footer-text {
          font-family: 'Amiri', serif;
          font-size: 16px;
          color: var(--gold-dim);
          direction: rtl;
          letter-spacing: 0.05em;
        }

        /* ── Page Transitions ── */
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .page-enter {
          animation: fadeUp 0.5s ease-out both;
        }

        /* ── Updates Section ── */
        .updates-section {
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: var(--radius);
          padding: 22px 26px;
          margin-bottom: 52px;
          position: relative;
          overflow: hidden;
        }

        .updates-section::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 2px;
          background: linear-gradient(90deg, var(--gold-dim), transparent);
        }

        .updates-badge {
          display: inline-block;
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--gold);
          background: rgba(201, 169, 110, 0.1);
          padding: 3px 10px;
          border-radius: 20px;
          margin-bottom: 16px;
          border: 1px solid rgba(201, 169, 110, 0.2);
        }

        .updates-list {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .updates-list li {
          display: flex;
          align-items: baseline;
          gap: 10px;
          font-size: 14px;
        }

        .updates-dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: var(--gold);
          opacity: 0.6;
          flex-shrink: 0;
          margin-top: 2px;
          align-self: center;
        }

        .updates-date {
          color: var(--text-2);
          font-weight: 500;
          white-space: nowrap;
          font-size: 13px;
        }

        .updates-text {
          color: var(--text-2);
          font-size: 13px;
        }

        /* ── Home Header ── */
        .home-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 24px;
          gap: 20px;
          flex-wrap: wrap;
        }

        .home-title {
          font-family: 'Crimson Pro', serif;
          font-size: 28px;
          font-weight: 600;
          color: var(--text-1);
          letter-spacing: -0.01em;
        }

        /* Search */
        .search-wrap {
          position: relative;
          flex: 1;
          max-width: 280px;
        }

        .search-icon {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--text-3);
          font-size: 18px;
          pointer-events: none;
        }

        .search-input {
          width: 100%;
          padding: 10px 16px 10px 38px;
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: 10px;
          color: var(--text-1);
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          outline: none;
          transition: border-color 0.2s;
        }

        .search-input::placeholder { color: var(--text-3); }
        .search-input:focus { border-color: var(--gold-dim); }

        /* ── Post List ── */
        .post-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .post-card-link {
          text-decoration: none;
          display: block;
          animation: fadeUp 0.5s ease-out both;
        }

        .post-card {
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: var(--radius);
          overflow: hidden;
          transition: border-color 0.25s ease, transform 0.25s ease, box-shadow 0.25s ease;
          position: relative;
        }

        .post-card:hover {
          border-color: var(--gold-dim);
          transform: translateY(-2px);
          box-shadow: 0 8px 32px rgba(0,0,0,0.35);
        }

        .post-card-inner {
          padding: 22px 24px;
        }

        .post-card-accent {
          position: absolute;
          left: 0; top: 0; bottom: 0;
          width: 3px;
          background: linear-gradient(180deg, var(--gold) 0%, transparent 100%);
          opacity: 0;
          transition: opacity 0.25s;
        }

        .post-card:hover .post-card-accent { opacity: 1; }

        .post-card-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 10px;
          gap: 12px;
        }

        .post-card-meta {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
        }

        .post-card-date {
          font-size: 12px;
          color: var(--text-3);
          letter-spacing: 0.03em;
        }
        
        .post-card-reading-time {
         font-size: 12px;
         color: var(--text-3);
         letter-spacing: 0.02em;
        }

        .post-meta-reading-time {
        font-size: 13px;
        color: var(--text-3);
        letter-spacing: 0.02em;
        }

        .post-card-tags {
          display: flex;
          gap: 6px;
          flex-wrap: wrap;
        }

        .tag {
          font-size: 11px;
          padding: 3px 10px;
          border-radius: 20px;
          background: rgba(201, 169, 110, 0.08);
          color: var(--gold);
          border: 1px solid rgba(201, 169, 110, 0.18);
          font-weight: 500;
          letter-spacing: 0.02em;
        }

        .tag--lg {
          font-size: 12px;
          padding: 4px 12px;
        }

        .post-card-arrow {
          color: var(--text-3);
          font-size: 16px;
          transition: color 0.2s, transform 0.2s;
        }

        .post-card:hover .post-card-arrow {
          color: var(--gold);
          transform: translateX(3px);
        }

        .post-card-title {
          font-family: 'Crimson Pro', serif;
          font-size: 22px;
          font-weight: 600;
          color: var(--text-1);
          line-height: 1.3;
          margin-bottom: 8px;
          letter-spacing: -0.01em;
        }

        .post-card-summary {
          font-size: 14px;
          color: var(--text-2);
          line-height: 1.65;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        /* ── Empty State ── */
        .empty-state {
          text-align: center;
          padding: 60px 20px;
          color: var(--text-3);
        }

        .empty-icon {
          display: block;
          font-size: 36px;
          margin-bottom: 16px;
          opacity: 0.4;
        }

        /* ── Post Page ── */
        .post-page {
          max-width: var(--content-max);
        }

        .back-link {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 13px;
          color: var(--text-3);
          background: none;
          border: none;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          padding: 0;
          margin-bottom: 40px;
          transition: color 0.2s;
          letter-spacing: 0.02em;
        }

        .back-link:hover { color: var(--gold); }

        .post-header {
          margin-bottom: 48px;
        }

        .post-header-meta {
          display: flex;
          align-items: center;
          gap: 14px;
          flex-wrap: wrap;
          margin-bottom: 20px;
        }

        .post-meta-date {
          font-size: 13px;
          color: var(--text-3);
          letter-spacing: 0.03em;
        }

        .post-tags {
          display: flex;
          gap: 6px;
          flex-wrap: wrap;
        }

        .post-title {
          font-family: 'Crimson Pro', serif;
          font-size: 42px;
          font-weight: 600;
          color: var(--text-1);
          line-height: 1.2;
          letter-spacing: -0.02em;
          margin-bottom: 18px;
        }

        .post-lead {
          font-family: 'Crimson Pro', serif;
          font-size: 20px;
          font-weight: 300;
          font-style: italic;
          color: var(--text-2);
          line-height: 1.65;
          margin-bottom: 0;
        }

        .post-header-divider {
          height: 1px;
          background: linear-gradient(90deg, var(--gold-dim), var(--border), transparent);
          margin-top: 32px;
          opacity: 0.5;
        }

        /* ── Post Content ── */
        .post-content {
          color: var(--text-2);
          font-family: 'Crimson Pro', serif;
          font-size: 19px;
          line-height: 1.85;
          letter-spacing: 0.008em;
        }

        .post-content p { margin-bottom: 1.6em; }

        .post-content h1,
        .post-content h2,
        .post-content h3,
        .post-content h4 {
          font-family: 'Crimson Pro', serif;
          color: var(--text-1);
          font-weight: 600;
          margin-top: 2.8em;
          margin-bottom: 1em;
          line-height: 1.25;
          letter-spacing: -0.01em;
        }

        .post-content h2 {
          font-size: 28px;
          padding-bottom: 14px;
          border-bottom: 1px solid var(--border);
        }

        .post-content h3 { font-size: 23px; color: var(--text-1); }
        .post-content h4 { font-size: 19px; color: var(--text-2); }

        .post-content a {
          color: var(--gold);
          text-decoration: none;
          border-bottom: 1px solid rgba(201,169,110,0.3);
          transition: border-color 0.2s;
        }

        .post-content a:hover { border-bottom-color: var(--gold); }

        /* Blockquotes — Quranic / hadith */
        .post-content blockquote {
          margin: 2.2em 0;
          padding: 24px 30px;
          background: linear-gradient(135deg, rgba(201,169,110,0.05) 0%, rgba(201,169,110,0.02) 100%);
          border-left: 3px solid var(--gold);
          border-radius: 0 10px 10px 0;
          color: #c5bfb0;
          font-style: italic;
        }

        .post-content blockquote p { margin: 0; }

        /* Lists */
        .post-content ul,
        .post-content ol {
          padding-left: 26px;
          margin-bottom: 1.6em;
        }

        .post-content li { margin-bottom: 0.65em; padding-left: 6px; }
        .post-content li::marker { color: var(--gold-dim); }

        /* Code */
        .post-content code {
          background: var(--bg-hover);
          padding: 2px 8px;
          border-radius: 5px;
          font-size: 0.88em;
          color: #c9a96e;
          font-family: 'Fira Code', 'Consolas', monospace;
          border: 1px solid var(--border-hi);
        }

        .post-content pre {
          background: var(--bg-card);
          padding: 22px;
          border-radius: 12px;
          overflow-x: auto;
          border: 1px solid var(--border);
          margin: 1.6em 0;
        }

        .post-content pre code { background: none; padding: 0; border: none; }

        /* HR */
        .post-content hr {
          border: none;
          height: 1px;
          background: linear-gradient(90deg, transparent, var(--border-hi), transparent);
          margin: 3em 0;
        }

        /* Strong / em */
        .post-content strong { color: var(--text-1); font-weight: 600; }
        .post-content em { color: #b8b0a5; }

        /* Tables */
        .post-content table {
          width: 100%;
          border-collapse: collapse;
          margin: 1.6em 0;
          font-size: 16px;
        }

        .post-content th,
        .post-content td {
          padding: 12px 18px;
          border: 1px solid var(--border);
          text-align: left;
        }

        .post-content th {
          background: var(--bg-hover);
          color: var(--text-1);
          font-weight: 600;
          font-size: 14px;
          letter-spacing: 0.03em;
        }

        .post-content tr:nth-child(even) { background: rgba(255,255,255,0.02); }

        /* Images */
        .post-content img {
          max-width: 100%;
          border-radius: 10px;
          margin: 1.8em 0;
          border: 1px solid var(--border);
        }

        /* Arabic */
        .post-content [lang="ar"],
        .post-content .arabic {
          font-family: 'Amiri', serif;
          font-size: 1.3em;
          line-height: 2.2;
          direction: rtl;
          text-align: center;
          color: #d4c8a8;
          margin: 1.8em 0;
          display: block;
        }

        /* ── Post Footer ── */
        .post-footer { margin-top: 72px; }
        .post-footer-divider {
          height: 1px;
          background: linear-gradient(90deg, var(--border-hi), transparent);
          margin-bottom: 28px;
          opacity: 0.5;
        }

        .back-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 11px 20px;
          background: var(--bg-card);
          border: 1px solid var(--border-hi);
          border-radius: 10px;
          color: var(--text-2);
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .back-btn:hover {
          border-color: var(--gold-dim);
          color: var(--text-1);
          background: var(--bg-hover);
        }

        /* ── About ── */
        .about-page { max-width: 680px; }

        .about-header { margin-bottom: 40px; }

        .about-title {
          font-family: 'Crimson Pro', serif;
          font-size: 36px;
          font-weight: 600;
          color: var(--text-1);
          letter-spacing: -0.02em;
          margin-bottom: 0;
        }

        .about-content {
          font-family: 'Crimson Pro', serif;
          font-size: 19px;
          color: var(--text-2);
          line-height: 1.85;
        }

        .about-content p { margin-bottom: 1.5em; }
        .about-content strong { color: var(--text-1); }

        .about-quote {
          margin: 2em 0 0;
          padding: 22px 28px;
          background: rgba(201,169,110,0.05);
          border-left: 3px solid var(--gold);
          border-radius: 0 10px 10px 0;
          color: #c5bfb0;
          font-style: italic;
        }

        /* ── Not Found ── */
        .not-found {
          padding: 80px 0;
          color: var(--text-2);
        }

        .not-found h1 {
          font-family: 'Crimson Pro', serif;
          font-size: 32px;
          margin-bottom: 24px;
          color: var(--text-1);
        }

        /* ── Quote of the Day ── */
.qotd-wrap {
  margin-bottom: 52px;
  padding: 32px 36px;
  background: linear-gradient(135deg, rgba(201,169,110,0.07) 0%, rgba(201,169,110,0.02) 100%);
  border: 1px solid rgba(201,169,110,0.2);
  border-radius: var(--radius);
  position: relative;
  overflow: hidden;
  animation: fadeUp 0.6s ease-out both;
  animation-delay: 0.1s;
}

.qotd-wrap::before {
  content: '"';
  position: absolute;
  top: -10px;
  left: 20px;
  font-family: 'Crimson Pro', serif;
  font-size: 120px;
  color: var(--gold);
  opacity: 0.07;
  line-height: 1;
  pointer-events: none;
}

.qotd-label-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}

.qotd-label {
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--gold);
  background: rgba(201,169,110,0.1);
  padding: 4px 12px;
  border-radius: 20px;
  border: 1px solid rgba(201,169,110,0.2);
}

.qotd-ornament {
  color: var(--gold-dim);
  font-size: 18px;
  opacity: 0.5;
}

.qotd-arabic {
  font-family: 'Amiri', serif;
  font-size: 26px;
  line-height: 2;
  direction: rtl;
  text-align: center;
  color: #d4c8a8;
  margin-bottom: 20px;
}

.qotd-text {
  font-family: 'Crimson Pro', serif;
  font-size: 21px;
  font-style: italic;
  color: #cdc7bc;
  line-height: 1.75;
  margin: 0 0 16px 0;
  border: none;
  padding: 0;
  background: none;
}

.qotd-source {
  font-size: 13px;
  color: var(--gold-dim);
  letter-spacing: 0.03em;
  margin: 0;
  font-weight: 500;
}

        
      `}</style>

      <div className="layout">
        <Sidebar />
        <main className="main-content">
          <div className="main-inner">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/posts/:slug" element={<Post />} />
              <Route path="*" element={<Home />} />
            </Routes>
          </div>
        </main>
      </div>
    </Router>
  );
}
