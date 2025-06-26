import React, { memo } from 'react';
import Link from 'next/link';
import AuthButton from "./AuthButton";

const NavBar = ({ children }: { children: React.ReactNode }) => {
  return (
    <nav style={{ padding: '1rem', borderBottom: '1px solid #eee', marginBottom: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <div>
        <Link href="/" style={{ marginRight: '1rem' }}>Home</Link>
        <Link href="/about" style={{ marginRight: '1rem' }}>About</Link>
        <Link href="/contact" style={{ marginRight: '1rem' }}>Contact</Link>
        <Link href="/portfolio-insights" style={{ marginRight: '1rem' }}>Portfolio Insights</Link>
      </div>
      <AuthButton />
    </nav>
  );
};

export default memo(NavBar); 