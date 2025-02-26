import React from "react";

export default function HeroHome() {
  return (
    <section
      className="hero-home"
      style={{ backgroundImage: `url('/assets/img/hero_bg.png')` }}
    >
      <div className="container">
        <div className="hero-content">
          <h3>Find the lawyer & clients in one platform.</h3>
          <h1>
            Need legal help? <br /> Find a lawyer On your terms
          </h1>
        </div>
      </div>
    </section>
  );
}
