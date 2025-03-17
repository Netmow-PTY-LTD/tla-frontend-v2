import Image from "next/image";
import Link from "next/link";
import React from "react";
import HeroShowcase from "./HeroShowcase";
import { data } from "@/data/data";

export default function HeroHome() {
  return (
    <section
      className="hero-home"
      style={{ backgroundImage: `url('/assets/img/hero_bg.png')` }}
    >
      <div className="container-lg">
        <div className="hero-content">
          <h3>Find the lawyer & clients in one platform.</h3>
          <h1>
            Need legal help? <br /> Find a lawyer On your terms
          </h1>
          <form className="w-full">
            <div className="hero-search-area flex gap-2 items-center w-full">
              <div className="tla-form-group w-5/12">
                <input
                  type="text"
                  className="tla-form-control"
                  placeholder="What type of lawyer are you looking for?"
                />
              </div>
              <div className="tla-form-group w-5/12">
                <input
                  type="text"
                  className="tla-form-control"
                  placeholder="Your location"
                />
              </div>
              <div className="tla-btn-wrapper w-1/6">
                <button type="submit" className="tla-btn-search">
                  <span>Search</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                  >
                    <path
                      d="M10.8048 11.1297L14.6509 14.9642M12.4339 7.20484C12.4339 10.2658 9.95247 12.7473 6.8915 12.7473C3.83049 12.7473 1.34906 10.2658 1.34906 7.20484C1.34906 4.14383 3.83049 1.6624 6.8915 1.6624C9.95247 1.6624 12.4339 4.14383 12.4339 7.20484Z"
                      stroke="#0B1C2D"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </form>
          <div className="flex flex-wrap justify-between gap-5 w-full mt-5 suggestion-area">
            {data.map((item) => (
              <Link
                href="#"
                className="flex flex-col items-center gap-3 text-center"
                key={item.id}
              >
                <Image
                  src={item.icon}
                  width={70}
                  height={70}
                  className="object-cover"
                  alt={item.title}
                />
                <h5>{item.title}</h5>
              </Link>
            ))}
          </div>
        </div>
        <HeroShowcase />
      </div>
    </section>
  );
}
