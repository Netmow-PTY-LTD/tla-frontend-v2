import React from "react";

export default function SectionHeading({ title, subtitle, paragraph }) {
  return (
    <div className="section-heading">
      <h3>{title}</h3>
      <h2>{subtitle}</h2>
      <p>{paragraph}</p>
    </div>
  );
}
