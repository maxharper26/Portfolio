import Head from 'next/head'
import { useEffect, useRef, useState } from 'react'
import {
  LineChart, Line, XAxis, YAxis, Tooltip,
  ResponsiveContainer, Legend, CartesianGrid
} from 'recharts'

// ── Palette ────────────────────────────────────────────────────────────────
const MODEL_COLORS = {
  'Linear Regression':    '#6366f1',
  'Ridge Regression':     '#22c55e',
  'Lasso Regression':     '#f59e0b',
  'Random Forest':        '#ef4444',
  'Gradient Boosting':    '#38bdf8',
  'Neural Network':       '#a78bfa',
  'Nearest Neighbors':    '#fb923c',
  'LSTM':                 '#94a3b8',
}
const TWR_COLOR = '#6366f1'
const VGS_COLOR = '#22c55e'

// ── Tooltip ────────────────────────────────────────────────────────────────
function DarkTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div style={{
      background: '#1a1d27', border: '1px solid #2a2d3e',
      borderRadius: 8, padding: '0.6rem 0.9rem', fontSize: 12,
    }}>
      <p style={{ color: '#8b8fa8', marginBottom: 4 }}>{label}</p>
      {payload.map(p => (
        <p key={p.dataKey} style={{ color: p.color, margin: '2px 0' }}>
          {p.name}: {typeof p.value === 'number' ? p.value.toFixed(2) : p.value}
        </p>
      ))}
    </div>
  )
}

// ── Scroll reveal hook ─────────────────────────────────────────────────────
function useReveal() {
  useEffect(() => {
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('is-visible'); obs.unobserve(e.target) }
      }),
      { threshold: 0.12 }
    )
    document.querySelectorAll('.reveal').forEach(el => obs.observe(el))
    return () => obs.disconnect()
  }, [])
}

// ── Main page ──────────────────────────────────────────────────────────────
export default function Home() {
  useReveal()

  const [twrData, setTwrData]       = useState(null)
  const [twrError, setTwrError]     = useState(false)
  const [mlData, setMlData]         = useState(null)
  const [hiddenModels, setHiddenModels] = useState({})

  // Fetch TWR
  useEffect(() => {
    fetch('/api/twr')
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(data => setTwrData(data))
      .catch(() => setTwrError(true))
  }, [])

  // Load ML returns JSON from public folder once you drop it in
  useEffect(() => {
    fetch('/data/twr_by_model.json')
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(raw => {
        // raw: { "Linear Regression": { "2015-01-05": 0.12, ... }, ... }
        const dates = Object.keys(Object.values(raw)[0]).sort()
        const rows = dates.map(date => {
          const row = { date }
          for (const [model, series] of Object.entries(raw)) {
            row[model] = series[date] ?? null
          }
          return row
        })
        setMlData(rows)
      })
      .catch(() => {}) // silently hide chart until data is present
  }, [])

  const toggleModel = name =>
    setHiddenModels(prev => ({ ...prev, [name]: !prev[name] }))

  return (
    <>
      <Head>
        <title>Max Harper</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" />
      </Head>

      {/* ── NAV ── */}
      <nav>
        <span className="logo">Max Harper</span>
        <div className="nav-links">
          <a href="#projects">Projects</a>
          <a href="#experience">Experience</a>
          <a href="#education">Education</a>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section id="hero">
        <div className="container">
          <div className="hero-inner">
            <div className="hero-text">
              <p className="eyebrow">Data · Quant · Technology</p>
              <h1>Max<br /><span>Harper</span></h1>
              <p className="bio">
                Data analyst and quantitative researcher with experience across investment management,
                analytics, and financial data science. Currently a Graduate Analyst at
                Quantium CBAiQ. Passionate about leveraging data and technology to solve hard problems.
              </p>
              <div className="hero-links">
                <a href="/pdfs/CV.pdf" target="_blank" className="btn btn-primary"><i className="fa fa-file-pdf" /> CV</a>
                <a href="/pdfs/Thesis.pdf" target="_blank" className="btn btn-ghost"><i className="fa fa-graduation-cap" /> Honours Thesis</a>
                <a href="mailto:maxharper26@icloud.com" className="btn btn-ghost"><i className="fa fa-envelope" /> Email</a>
                <a href="https://www.linkedin.com/in/max-harper-0207a3203" target="_blank" className="btn btn-ghost"><i className="fab fa-linkedin" /> LinkedIn</a>
              </div>
              <div className="hero-skills">
                {['Python','SQL','R','pandas','scikit-learn','PyTorch','PCA & Autoencoders','AWS','GCP','Serverless','Backtesting','Volatility Derivatives','Portfolio Construction'].map(s => (
                  <span key={s} className="hero-skill-pill">{s}</span>
                ))}
              </div>
            </div>
            <div className="hero-photo">
              <img src="/imgs/best_one copy.JPG" alt="Max Harper" />
            </div>
          </div>
        </div>
      </section>

      {/* ── PROJECTS ── */}
      <section id="projects">
        <div className="container">
          <h2 className="section-title">Projects</h2>



          <div className="projects-grid">
            {/* VIX card */}
            <div className="project-card reveal">
              <p className="project-sub">Honours Thesis · 2024–2025</p>
              <h3>VIX Futures Forecasting via Implied Volatility Surface</h3>
              <p>
                Investigated whether the S&P 500 implied volatility surface contains predictive information for VIX futures.
                Applied PCA and autoencoders to compress the high-dimensional IV surface into forecasting features,
                evaluated across multiple ML models. Trading simulations demonstrated economically significant cumulative
                returns across the 2015–2023 backtest period.
              </p>
              <div className="pills">
                {['Python','PCA & Autoencoders','Gradient Boosting','LSTM','VIX Futures','Implied Volatility'].map(t => (
                  <span key={t} className="pill">{t}</span>
                ))}
              </div>
              {mlData && (
                <>
                  <ResponsiveContainer width="100%" height={260}>
                    <LineChart data={mlData} margin={{ top: 4, right: 16, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#2a2d3e" />
                      <XAxis dataKey="date" tick={{ fill: '#8b8fa8', fontSize: 11 }} tickLine={false} axisLine={{ stroke: '#2a2d3e' }}
                        tickFormatter={d => d?.slice(0, 7)} interval={Math.floor(mlData.length / 6)} />
                      <YAxis tick={{ fill: '#8b8fa8', fontSize: 11 }} tickLine={false} axisLine={{ stroke: '#2a2d3e' }} domain={[() => 0, 13]} />
                      <Tooltip content={<DarkTooltip />} />
                      <Legend wrapperStyle={{ fontSize: 11, color: '#8b8fa8' }} />
                      {Object.entries(MODEL_COLORS).map(([name, color]) => (
                        <Line key={name} type="monotone" dataKey={name} name={name}
                          stroke={color} strokeWidth={1.5} dot={false} />
                      ))}
                    </LineChart>
                  </ResponsiveContainer>
                </>
              )}
              <div style={{ marginTop: 'auto' }}>
                <a href="/pdfs/Thesis.pdf" target="_blank" className="btn btn-ghost"><i className="fa fa-graduation-cap" /> Read Thesis</a>
              </div>
            </div>

            {/* NJR card */}
            <div className="project-card reveal reveal-delay-1">
              <p className="project-sub">NJR Partners · 2024–2026</p>
              <h3>Investment Process Automation</h3>
              <p>
                Investment data is fragmented across PDFs, emails, websites, and APIs — making manual collection
                time-consuming and error-prone. I built a lightweight serverless system automating these core
                workflows: ingesting data from emails, web endpoints, and PDFs; normalising it in SQL; and piping
                governance-ready summaries to dashboards and email. LLM prompts extract concise risk highlights,
                reducing manual effort and supporting consistent monitoring.
              </p>
              <div className="pills">
                {['Serverless (GCP)','Python','SQL + Object Storage','LLM Extraction','Automated Reporting'].map(t => (
                  <span key={t} className="pill">{t}</span>
                ))}
              </div>
              <div className="arch-wrap">
                <svg viewBox="0 0 980 240" width="100%" role="img" aria-label="Architecture diagram">
                  <defs>
                    <marker id="arr" markerWidth="8" markerHeight="8" refX="5" refY="3" orient="auto" markerUnits="strokeWidth">
                      <path d="M0,0 L0,6 L6,3 z" fill="#6366f1"/>
                    </marker>
                  </defs>
                  <rect x="20" y="40" width="160" height="56" rx="10" fill="#21253a" stroke="#3a3d55"/>
                  <text x="100" y="73" textAnchor="middle" fontSize="13" fill="#e8eaf0" fontFamily="Inter,sans-serif">Web / APIs</text>
                  <rect x="20" y="130" width="160" height="56" rx="10" fill="#21253a" stroke="#3a3d55"/>
                  <text x="100" y="163" textAnchor="middle" fontSize="13" fill="#e8eaf0" fontFamily="Inter,sans-serif">Email (ingest)</text>
                  <rect x="240" y="30" width="220" height="170" rx="10" fill="#21253a" stroke="#6366f1" strokeDasharray="4 3"/>
                  <text x="350" y="58" textAnchor="middle" fontSize="13" fill="#818cf8" fontFamily="Inter,sans-serif" fontWeight="600">Serverless Processing</text>
                  <text x="350" y="82" textAnchor="middle" fontSize="11" fill="#8b8fa8" fontFamily="Inter,sans-serif">Extract numbers · Parse PDFs</text>
                  <text x="350" y="102" textAnchor="middle" fontSize="11" fill="#8b8fa8" fontFamily="Inter,sans-serif">LLM summarisation</text>
                  <text x="350" y="122" textAnchor="middle" fontSize="11" fill="#8b8fa8" fontFamily="Inter,sans-serif">Validation / dedupe</text>
                  <rect x="520" y="40" width="160" height="56" rx="10" fill="#21253a" stroke="#3a3d55"/>
                  <text x="600" y="73" textAnchor="middle" fontSize="13" fill="#e8eaf0" fontFamily="Inter,sans-serif">SQL (facts)</text>
                  <rect x="520" y="130" width="160" height="56" rx="10" fill="#21253a" stroke="#3a3d55"/>
                  <text x="600" y="157" textAnchor="middle" fontSize="11" fill="#e8eaf0" fontFamily="Inter,sans-serif">Object Storage</text>
                  <text x="600" y="174" textAnchor="middle" fontSize="11" fill="#8b8fa8" fontFamily="Inter,sans-serif">(PDFs)</text>
                  <rect x="750" y="40" width="200" height="56" rx="10" fill="#21253a" stroke="#3a3d55"/>
                  <text x="850" y="73" textAnchor="middle" fontSize="13" fill="#e8eaf0" fontFamily="Inter,sans-serif">Internal Dashboards</text>
                  <rect x="750" y="130" width="200" height="56" rx="10" fill="#21253a" stroke="#3a3d55"/>
                  <text x="850" y="163" textAnchor="middle" fontSize="13" fill="#e8eaf0" fontFamily="Inter,sans-serif">Email Reports</text>
                  <line x1="180" y1="68" x2="240" y2="90" stroke="#6366f1" strokeWidth="1.5" markerEnd="url(#arr)"/>
                  <line x1="180" y1="158" x2="240" y2="140" stroke="#6366f1" strokeWidth="1.5" markerEnd="url(#arr)"/>
                  <line x1="460" y1="90" x2="520" y2="68" stroke="#6366f1" strokeWidth="1.5" markerEnd="url(#arr)"/>
                  <line x1="460" y1="110" x2="520" y2="158" stroke="#6366f1" strokeWidth="1.5" markerEnd="url(#arr)"/>
                  <line x1="680" y1="68" x2="750" y2="68" stroke="#6366f1" strokeWidth="1.5" markerEnd="url(#arr)"/>
                  <line x1="680" y1="158" x2="750" y2="158" stroke="#6366f1" strokeWidth="1.5" markerEnd="url(#arr)"/>
                  <line x1="680" y1="68" x2="750" y2="158" stroke="#6366f1" strokeWidth="1" strokeDasharray="3 3" markerEnd="url(#arr)"/>
                </svg>
              </div>
              <div className="two-col">
                <div className="info-card">
                  <h4>Data Flow</h4>
                  <ol>
                    <li><strong>Ingestion</strong> — scrapes, API calls, email triggers</li>
                    <li><strong>Extraction</strong> — numeric selectors; documents stored</li>
                    <li><strong>Understanding</strong> — LLM risk highlights</li>
                    <li><strong>Validation</strong> — threshold checks, anomaly flagging</li>
                    <li><strong>Delivery</strong> — SQL, dashboards, email briefings</li>
                  </ol>
                </div>
                <div className="info-card">
                  <h4>Impact</h4>
                  <ul>
                    <li>Faster reporting, less manual collection</li>
                    <li>Auditable parameters for risk governance</li>
                    <li>Surfaces material changes across sources</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>


          {/* Portfolio TWR chart — full width below cards */}
          {twrData && !twrError && (
            <div className="chart-panel" style={{ marginTop: '1.5rem' }}>
              <p className="chart-sub">Personal Investments</p>
              <h3>Portfolio Time-Weighted Return</h3>
              <p style={{ color: '#8b8fa8', fontSize: 13, margin: '0.4rem 0 1rem' }}>
                Long-only portfolio benchmarked against VGS (global equities). Indexed to 100 at inception.
                Macro-aware positioning across quality factor, infrastructure, and thematic exposures.
              </p>
              <ResponsiveContainer width="100%" height={280}>
                <LineChart
                  data={twrData.twr.map((row, i) => ({
                    date: row.date,
                    twr: row.twr,
                    vgs: twrData.vgs?.[i]?.twr ?? null,
                  }))}
                  margin={{ top: 4, right: 16, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#2a2d3e" />
                  <XAxis dataKey="date" tick={{ fill: '#8b8fa8', fontSize: 11 }} tickLine={false} axisLine={{ stroke: '#2a2d3e' }}
                    tickFormatter={d => d?.slice(0, 7)} interval={Math.floor((twrData.twr?.length || 1) / 6)} />
                  <YAxis
                    tick={{ fill: '#8b8fa8', fontSize: 11 }} tickLine={false} axisLine={{ stroke: '#2a2d3e' }}
                    tickFormatter={v => v?.toFixed(1)}
                    domain={[95, 'auto']}
                  />
                  <Tooltip content={<DarkTooltip />} />
                  <Legend wrapperStyle={{ fontSize: 12, color: '#8b8fa8' }} />
                  <Line type="monotone" dataKey="twr" name="Portfolio" stroke={TWR_COLOR} strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="vgs" name="VGS (benchmark)" stroke={VGS_COLOR} strokeWidth={1.5} dot={false} strokeDasharray="4 3" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </section>

      {/* ── EXPERIENCE ── */}
      <section id="experience">
        <div className="container">
          <h2 className="section-title">Experience</h2>
          <div className="exp-list">
            {[
              { dates: 'Feb 2026 – Present', role: 'Graduate Analyst', company: 'Quantium CBAiQ', desc: "Applying machine learning and data science to deliver insights at scale within CBA's analytics division." },
              { dates: 'Jan 2025 – Nov 2025', role: 'Quantitative Analyst', company: 'Bishopsgate Capital', desc: 'Developed and backtested systematic trading strategies in volatility derivatives, leveraging the SPX implied volatility surface and ML models to forecast VIX futures. Conducted in parallel with Honours thesis.' },
              { dates: 'Feb 2024 – Jan 2026', role: 'Investment Technology Analyst', company: 'NJR Partners', desc: 'Built a serverless GCP system automating core investment management processes — risk monitoring, reporting, and LLM-powered extraction of unstructured data into structured investment governance insights.' },
              { dates: 'May 2024 – Dec 2024', role: 'Quantitative Analyst', company: 'Blue Lake Partners', desc: 'Researched and backtested systematic strategies in commodity equities, including signal generation and portfolio construction across the sector.' },
              { dates: 'Dec 2023 – Feb 2024', role: 'Data Analyst Intern', company: 'Fulton Market Group', desc: 'Contributed to agricultural commodity price forecasting research.' },
              { dates: 'Dec 2022 – Feb 2023', role: 'Data Analyst Intern', company: 'Quantium', desc: 'FMCG division — data investigations and backtesting an analytical model in an agile team environment.' },
            ].map((e, i) => (
              <div key={i} className="exp-item reveal">
                <div className="exp-dates">{e.dates}</div>
                <div>
                  <div className="exp-role">{e.role}</div>
                  <div className="exp-company">{e.company}</div>
                  <div className="exp-desc">{e.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── EDUCATION ── */}
      <section id="education">
        <div className="container">
          <h2 className="section-title">Education</h2>
          <div className="edu-card reveal">
            <h3>University of Sydney</h3>
            <div className="degree">Bachelor of Advanced Computing and Commerce (Honours) · Data Science &amp; Business Analytics</div>
            <div className="edu-meta">Graduated 2025</div>
            <div className="award-list">
              {['First Class Honours','HD 86 WAM','Engineering Entry Scholarship','Daylell Scholarship','Academic High Honour Roll',"Dean's List",'Business Analytics Prize'].map(a => (
                <span key={a} className="award">{a}</span>
              ))}
            </div>
          </div>
          <div className="edu-card reveal reveal-delay-1">
            <h3>Sydney Grammar School</h3>
            <div className="degree">HSC 2020</div>
            <div className="edu-meta">99.85 ATAR</div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer>
        <div className="container">
          <p>
            <a href="/pdfs/CV.pdf" target="_blank">CV</a> &nbsp;·&nbsp;
            <a href="/pdfs/Thesis.pdf" target="_blank">Thesis</a> &nbsp;·&nbsp;
            <a href="https://www.linkedin.com/in/max-harper-0207a3203" target="_blank">LinkedIn</a>
          </p>
          <p style={{ marginTop: '0.5rem' }}>&copy; {new Date().getFullYear()} Max Harper</p>
        </div>
      </footer>
    </>
  )
}
