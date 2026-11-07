import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Settings, ChevronRight, Check, Copy, Mail, MessageSquare, ExternalLink, LogOut, Layout, Menu, X, Shield, Zap, Activity, ShoppingBag, AlertTriangle, User, Github } from 'lucide-react';
import { Sidebar } from './components/Sidebar';
import { Hero } from './components/Hero';
import { APICard } from './components/APICard';
import { APIModal } from './components/APIModal';
import { Profile } from './components/Profile';
import { apiList, categories } from './data/apiList';
import { About } from './components/About';
import { Contact } from './components/Contact';
import { AdminGate } from './components/AdminGate';
import { LiveChat } from './components/LiveChat';
import { SupportChat } from './components/SupportChat';
import { NewsFeed } from './components/NewsFeed';
import { StatsGrid } from './components/StatsGrid';
import { Bot } from 'lucide-react';
import './App.css';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

console.log("--- CRIMINAL API v1.1.0 LOADED ---");

function AdminPasswordGate({ children }) {
  const [password, setPassword] = useState('');
  const [unlocked, setUnlocked] = useState(() => sessionStorage.getItem('criminal_admin_unlocked') === 'yes');
  const [error, setError] = useState('');
  const submit = (e) => {
    e.preventDefault();
    if (password === 'damith') {
      sessionStorage.setItem('criminal_admin_unlocked', 'yes');
      setUnlocked(true);
      setError('');
    } else {
      setError('Incorrect password');
    }
  };
  if (unlocked) return children;
  return <div style={{ minHeight: '65vh', display: 'grid', placeItems: 'center', padding: '24px' }}>
    <form onSubmit={submit} style={{ width: '100%', maxWidth: 420, padding: 32, borderRadius: 20, background: '#111827', border: '1px solid #374151', color: 'white' }}>
      <h2 style={{ marginTop: 0 }}>🔐 Admin Unlock</h2>
      <p style={{ color: '#9ca3af' }}>CRIMINAL API · Owner access</p>
      <input aria-label="Admin password" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter admin password" autoComplete="current-password" style={{ boxSizing: 'border-box', width: '100%', padding: 14, borderRadius: 10, background: '#030712', color: 'white', border: '1px solid #4b5563', marginBottom: 12 }} />
      {error && <p style={{ color: '#f87171' }}>{error}</p>}
      <button type="submit" style={{ width: '100%', padding: 14, border: 0, borderRadius: 10, background: '#facc15', color: '#111827', fontWeight: 800, cursor: 'pointer' }}>UNLOCK ADMIN</button>
    </form>
  </div>;
}

function AppContent() {
  const location = useLocation();
  const navigate = useNavigate();

  const getBreadcrumbs = () => {
    const path = location.pathname;
    if (path === '/' || path === '/home') return 'DASHBOARD';
    if (path.startsWith('/apis/')) {
      const cat = path.split('/')[2]?.replace(/-/g, ' ').toUpperCase() || 'CATALOG';
      return `CRIMINALAPI / ${cat}`;
    }
    return path.substring(1).toUpperCase().replace(/\//g, ' / ');
  };

  const getActiveTab = (pathname) => {
    if (pathname === '/' || pathname === '/home') return 'Home';
    if (pathname.startsWith('/apis/')) return 'API';
    if (pathname === '/chat') return 'Chat';
    if (pathname === '/terminal') return 'Profile';
    if (pathname === '/admin') return 'Admin';
    if (pathname === '/about') return 'About';
    if (pathname === '/contact') return 'Contact';
    return 'Home';
  };

  const activeTab = getActiveTab(location.pathname);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedApi, setSelectedApi] = useState(null);
  // Single-owner mode: no Google/GitHub login required.
  const [user, setUser] = useState({ uid: 'local-owner', id: 'local-owner', displayName: 'Madusanka', email: 'owner@criminal-api.local', photoURL: '/logo.png', role: 'admin', apikey: 'YOUR_API_KEY' });
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showSupport, setShowSupport] = useState(false);
  const [news, setNews] = useState([]);
  const [categoryStatuses, setCategoryStatuses] = useState({});

  const CLIENT_ID = "913109613888-8of14n9l2ekh0eu2rvnelltkabct88ph.apps.googleusercontent.com";
  const GITHUB_CLIENT_ID = "Ov23liaEm4ZLYQHLQfLk"; // Updated from screenshot

  const fetchNews = async () => {
    try {
      const res = await axios.get('/api/auth/news/list');
      if (res.data.status) setNews(res.data.news);
    } catch (e) {
      console.error("News fetch error:", e);
    }
  };

  const fetchCategoryStatuses = async () => {
    try {
      const res = await axios.get('/api/auth/categories/status');
      if (res.data.status) setCategoryStatuses(res.data.statuses);
    } catch (e) {
      console.error("Category fetch error:", e);
    }
  };

  const refreshUserData = async (uid) => {
    try {
      const res = await axios.get(`/api/auth/user-data?uid=${uid}`);
      if (res.data.status) {
        setUser(res.data.user);
        localStorage.setItem('chama_user_session', JSON.stringify(res.data.user));
      }
    } catch (e) {
      console.error("User refresh error:", e);
    }
  };

  useEffect(() => {
    fetchNews();
    fetchCategoryStatuses();
  }, []);

  // Sync category from URL
  useEffect(() => {
    if (location.pathname.startsWith('/apis/')) {
      const catPath = location.pathname.split('/')[2]; // /apis/news -> news
      if (catPath) {
        const matched = categories.find(c =>
          c.toLowerCase().replace(/\s+/g, '-') === catPath.toLowerCase()
        );
        if (matched) setSelectedCategory(matched);
        else if (catPath === 'all') setSelectedCategory('All');
      }
    }
  }, [location.pathname]);

  // Authentication removed for this single-owner private dashboard.
  const loginWithGithub = () => {};

  const handleLogout = () => {
    // Single-owner mode has no login/logout flow.
    setShowUserMenu(false);
  };

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  if (loading) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#090a12' }}>
        <div className="loader"></div>
      </div>
    );
  }


  return (
    <div className={`app-container ${sidebarOpen ? 'sidebar-mobile-open' : ''}`}>
      <Sidebar user={user} handleLogout={handleLogout} />

      <main className="main-content">
        <header className="top-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button className="mobile-menu-btn" onClick={toggleSidebar}>
              {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <div className="breadcrumbs hide-mobile">
              <span className="crumb-root">CRIMINAL API</span>
              <span className="crumb-sep">/</span>
              <span className="crumb-current">{activeTab}</span>
            </div>
          </div>

          <div className="header-actions">
            <div className="points-badge hide-mobile">{user.role?.toUpperCase()}</div>
            <div style={{ position: 'relative' }}>
              <div className="user-avatar" onClick={() => setShowUserMenu(!showUserMenu)} style={{ cursor: 'pointer' }}>
                <img src={user.photoURL} alt="user" />
              </div>

              {showUserMenu && (
                <div className="user-dropdown glass animate-fade-in">
                  <div className="dropdown-header">
                    <h4 className="dropdown-title">USER PROFILE</h4>
                  </div>
                  <div className="dropdown-body">
                    <div className="profile-info-mini">
                      <label>USERNAME</label>
                      <div className="info-box">{user.displayName}</div>
                    </div>
                    <div className="profile-info-mini">
                      <label>API KEY</label>
                      <div className="info-box key-box">
                        <span className="key-text">{user.apikey || 'No Key'}</span>
                        <button className="copy-btn-mini" onClick={() => {
                          navigator.clipboard.writeText(user.apikey);
                          alert("API Key copied to matrix!");
                        }}>
                          <Copy size={14} />
                        </button>
                      </div>
                    </div>
                    <div className="profile-info-mini">
                      <label>API LIMIT</label>
                      <div className="info-box">UNLIMITED REQUESTS</div>
                    </div>

                    <div className="dropdown-actions">
                      <button className="drop-btn profile" onClick={() => { navigate('/terminal'); setShowUserMenu(false); }}>
                        <User size={16} /> PROFILE
                      </button>
                      <button className="drop-btn shop">
                        <ShoppingBag size={16} /> SHOP
                      </button>
                      <button className="drop-btn logout" onClick={handleLogout}>
                        <LogOut size={16} /> LOGOUT
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        <div className="content-body">
          <Routes>
            <Route path="/" element={
              <div className="dashboard-home">
                <h1 className="cyber-title" style={{ fontSize: '3rem', marginBottom: '3rem' }}>CRIMINAL <span style={{ color: 'var(--primary)' }}>API</span> <span style={{ fontSize: '0.9rem', opacity: 0.4, fontWeight: 400 }}>v1.2.1</span></h1>
                <StatsGrid />
                <Hero username={user.displayName} />
                <div style={{ marginTop: '4rem' }} id="news-section">
                  <NewsFeed news={news} />
                </div>
              </div>
            } />
            <Route path="/home" element={<Navigate to="/" replace />} />
            <Route path="/apis" element={<Navigate to="/apis/all" replace />} />
            <Route path="/apis/:cat" element={
              <div className="api-catalog">
                <div className="catalog-header">
                  <div>
                    <h2 style={{ margin: 0 }}>API Catalog</h2>
                    <p className="subtitle">Powerful tools at your fingertips.</p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div className="system-health-badge glass" style={{ padding: '8px 15px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Activity size={16} color="#10b981" className="animate-pulse" />
                      <span style={{ fontSize: '0.8rem', color: '#10b981', fontWeight: 800 }}>ALL SYSTEMS NOMINAL</span>
                    </div>
                  </div>
                  <div className="category-tabs">
                    {categories.filter(cat => {
                      if (cat === 'All' || cat === 'Movie Old') return true;
                      return categoryStatuses[cat]?.status !== 'off';
                    }).map(cat => (
                      <button
                        key={cat}
                        className={`cat-tab ${selectedCategory === cat ? 'active' : ''}`}
                        onClick={() => {
                          setSelectedCategory(cat);
                          navigate(`/apis/${cat.toLowerCase().replace(/\s+/g, '-')}`);
                        }}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="api-catalog-content">
                  {categories.filter(cat => {
                    if (cat === 'All') return false;
                    if (cat === 'Movie Old') return true;
                    return categoryStatuses[cat]?.status !== 'off';
                  }).map(cat => (
                    (() => {
                      const filteredApis = apiList.filter(api => api.category === cat);
                      if (selectedCategory !== 'All' && selectedCategory !== cat) return null;
                      if (filteredApis.length === 0) return null;
                      return (
                        <div key={cat} className="category-group">
                          <div className="category-header">
                            <Layout size={18} color="var(--primary)" />
                            <h2 style={{ margin: 0, fontSize: '1rem' }}>{cat.toUpperCase()}</h2>
                          </div>

                          {cat === 'Movies' && (
                            <div className="coming-soon-banner animate-pulse-green" style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '15px',
                              background: 'rgba(16, 185, 129, 0.1)',
                              borderColor: 'rgba(16, 185, 129, 0.4)'
                            }}>
                              <Zap size={24} color="#10b981" />
                              <div style={{ textAlign: 'left' }}>
                                <div style={{ fontWeight: 900, letterSpacing: '1px', color: '#10b981' }}>MOVIE v2 ULTRA IS LIVE</div>
                                <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>Sonic Cloud & Ultra-speed bypass are now active. Enjoy premium downloads.</div>
                              </div>
                            </div>
                          )}

                          <div className="api-grid">
                            {filteredApis.map(api => (
                              <APICard key={api.id} api={api} onClick={() => setSelectedApi(api)} />
                            ))}
                          </div>
                        </div>
                      );
                    })()
                  ))}
                </div>
              </div>
            } />
            <Route path="/endpoints" element={<Navigate to="/apis/all" replace />} />
            <Route path="/terminal" element={<Profile user={user} setUser={setUser} />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/chat" element={<LiveChat user={user} />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/admin" element={user?.role === 'admin' ? <AdminGate user={user} onRefreshCategories={fetchCategoryStatuses} /> : <Navigate to="/" replace />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </main>

      {selectedApi && <APIModal selectedApi={selectedApi} user={user} onClose={() => setSelectedApi(null)} />}
      {sidebarOpen && <div className="mobile-overlay" onClick={toggleSidebar} />}
      {showSupport && <SupportChat user={user} onClose={() => setShowSupport(false)} />}

      <div className="floating-actions" style={{ position: 'fixed', bottom: '30px', right: '30px', display: 'flex', flexDirection: 'column', gap: '15px', zIndex: 100 }}>
        {location.pathname !== '/chat' && (
          <div className="floating-chat-bubble" style={{ position: 'relative', bottom: 'auto', right: 'auto' }} onClick={() => navigate('/chat')}>
            <MessageSquare size={24} />
            <div className="notification-dot"></div>
          </div>
        )}
        <div className="floating-ai-bubble" onClick={() => setShowSupport(!showSupport)} style={{
          width: '60px',
          height: '60px',
          background: 'var(--primary)',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          cursor: 'pointer',
          boxShadow: '0 10px 30px rgba(217, 70, 239, 0.4)',
          transition: 'all 0.3s ease',
          position: 'relative'
        }}>
          <Bot size={24} />
          <div style={{ position: 'absolute', top: '5px', right: '5px', width: '12px', height: '12px', background: '#10b981', borderRadius: '50%', border: '2px solid #000' }}></div>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

function PrivacyPolicy() {
  return (
    <div className="glass" style={{ padding: '3rem', borderRadius: '24px', maxWidth: '800px', margin: '0 auto' }}>
      <h1 className="cyber-title" style={{ marginBottom: '2rem' }}>Privacy <span style={{ color: 'var(--primary)' }}>Policy</span></h1>
      <div style={{ color: '#9ca3af', lineHeight: '1.8' }}>
        <p>Your privacy is important to us. This policy explains how we handle your information.</p>
        <h3 style={{ color: 'white', marginTop: '1.5rem' }}>Data Collection</h3>
        <p>We only collect data necessary to provide our API services, such as your usage logs and basic account information.</p>
        <h3 style={{ color: 'white', marginTop: '1.5rem' }}>Usage</h3>
        <p>Your data is used solely for service improvements and security monitoring.</p>
        <h3 style={{ color: 'white', marginTop: '1.5rem' }}>Protection</h3>
        <p>We use industry-standard encryption to protect your account and API keys.</p>
      </div>
    </div>
  );
}

export default App;
