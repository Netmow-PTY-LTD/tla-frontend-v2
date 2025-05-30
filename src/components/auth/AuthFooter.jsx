import Link from 'next/link';
import React from 'react';

export default function AuthFooter() {
  return (
    <footer className="auth-footer py-3">
      <div className="container">
        <div className="copyright-text text-center">
          <p>
            Copywriter © {new Date().getFullYear()} by{' '}
            <Link href="/" className="text-[var(--primary-color)]">
              TheLawApp
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
