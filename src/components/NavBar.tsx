import React, { memo } from 'react';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import AuthButton from "./AuthButton";

const NavBar = ({ children }: { children: React.ReactNode }) => {
  const { theme, setTheme } = useTheme();

  return (
    <nav style={{ padding: '1rem', borderBottom: '1px solid #eee', marginBottom: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <div>
        <Link href="/" style={{ marginRight: '1rem' }}>Home</Link>
        <Link href="/about" style={{ marginRight: '1rem' }}>About</Link>
        <Link href="/contact" style={{ marginRight: '1rem' }}>Contact</Link>
        <Link href="/portfolio-insights" style={{ marginRight: '1rem' }}>Portfolio Insights</Link>
      </div>
      <button
        onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
        aria-label="Toggle theme"
        style={{ marginLeft: 16, padding: '6px 12px', borderRadius: 6, background: '#f3f4f6', border: 'none', fontSize: 20, cursor: 'pointer' }}
      >
        {theme === 'light' ? '🌙' : '☀️'}
      </button>
      <AuthButton />
    </nav>
  );
};

export default memo(NavBar); 