import React from 'react';

export default function PageBanner({ title }) {
  return (
    <section className="page-banner bg-[var(--secondary-color)] py-[50px]">
      <div className="container">
        <div className="page-banner-content">
          <h1 className="text-white text-center uppercase">{title}</h1>
        </div>
      </div>
    </section>
  );
}
