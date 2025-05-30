import React from 'react';

export default function SectionHeading({ title, subtitle, paragraph }) {
  return (
    <div className="section-heading">
      <h3 className="section-subtitle">{subtitle}</h3>
      <h2 className="section-title">{title}</h2>
      <p>{paragraph}</p>
    </div>
  );
}
