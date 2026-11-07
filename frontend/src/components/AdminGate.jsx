import React, { useState } from 'react';
import { LockKeyhole, ShieldCheck } from 'lucide-react';
import { AdminPanel } from './AdminPanel';

const ADMIN_PASSWORD = 'damith';

export function AdminGate({ user, onRefreshCategories }) {
  const [unlocked, setUnlocked] = useState(() => sessionStorage.getItem('criminal_admin_unlocked') === 'yes');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const submit = (event) => {
    event.preventDefault();
    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem('criminal_admin_unlocked', 'yes');
      setUnlocked(true);
      setError('');
    } else {
      setError('Wrong password. Try again.');
      setPassword('');
    }
  };

  if (unlocked) return <AdminPanel user={user} onRefreshCategories={onRefreshCategories} />;

  return (
    <div style={{ minHeight: '65vh', display: 'grid', placeItems: 'center', padding: '24px' }}>
      <form onSubmit={submit} style={{ width: '100%', maxWidth: 420, padding: 30, borderRadius: 22, background: 'rgba(18,20,35,.92)', border: '1px solid rgba(139,92,246,.35)', boxShadow: '0 20px 60px rgba(0,0,0,.3)' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}><div style={{ width: 64, height: 64, display: 'grid', placeItems: 'center', borderRadius: 20, background: 'rgba(139,92,246,.15)', color: '#a78bfa' }}><ShieldCheck size={32} /></div></div>
        <h2 style={{ textAlign: 'center', color: '#fff', margin: '0 0 8px' }}>CRIMINAL API Admin</h2>
        <p style={{ textAlign: 'center', color: '#a1a1aa', margin: '0 0 24px' }}>Enter the admin password to unlock the panel.</p>
        <label htmlFor="admin-password" style={{ display: 'block', color: '#e4e4e7', marginBottom: 8 }}>Admin password</label>
        <div style={{ position: 'relative' }}><LockKeyhole size={18} style={{ position: 'absolute', left: 13, top: 14, color: '#a1a1aa' }} /><input id="admin-password" type="password" value={password} onChange={e => setPassword(e.target.value)} autoComplete="current-password" placeholder="Enter password" required style={{ boxSizing: 'border-box', width: '100%', padding: '12px 14px 12px 40px', borderRadius: 12, border: '1px solid #3f3f52', background: '#0b0c15', color: '#fff', outline: 'none' }} /></div>
        {error && <p role="alert" style={{ color: '#f87171', margin: '10px 0 0' }}>{error}</p>}
        <button type="submit" style={{ width: '100%', marginTop: 18, padding: 13, border: 0, borderRadius: 12, color: '#fff', fontWeight: 700, cursor: 'pointer', background: 'linear-gradient(90deg,#7c3aed,#4f46e5)' }}>Unlock Admin Panel</button>
      </form>
    </div>
  );
}
