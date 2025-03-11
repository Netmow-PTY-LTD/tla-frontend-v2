import React from "react";

export default function SectionHeading({ title, subtitle, paragraph }) {
  return (
    <div className="section-heading">
      <h3>{subtitle}</h3>
      <h2>{title}</h2>
      <p>{paragraph}</p>
    </div>
  );
}
