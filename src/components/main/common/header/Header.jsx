import React from "react";
import styles from "./Header.module.css";
import Link from "next/link";
import Image from "next/image";

export default function Header() {
  return (
    <header className={styles.main_header}>
      <div className="container-lg">
        <div className="flex items-center justify-between">
          <Link href="/">
            <Image
              src={"/assets/img/logo.png"}
              alt="TLA Logo"
              width={150}
              height={40}
            />
          </Link>
          <nav className="hidden lg:flex">
            <ul className="flex items-center gap-6">
              <li>
                <Link href="/services" className={styles.nav_link}>
                  <span>Find Clients</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="11"
                    height="7"
                    viewBox="0 0 11 7"
                    fill="none"
                  >
                    <path
                      d="M1.5 1L5.5 5L9.5 1"
                      stroke="#0B1C2D"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                </Link>
              </li>
              <li>
                <Link href="/services" className={styles.nav_link}>
                  <span>Find Lawyers</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="11"
                    height="7"
                    viewBox="0 0 11 7"
                    fill="none"
                  >
                    <path
                      d="M1.5 1L5.5 5L9.5 1"
                      stroke="#0B1C2D"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                </Link>
              </li>
              <li>
                <Link href="/services" className={styles.nav_link}>
                  <span>Pricing</span>
                </Link>
              </li>
              <li>
                <Link href="/services" className={styles.nav_link}>
                  <span>About Us</span>
                </Link>
              </li>
            </ul>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/login" className={styles.nav_link}>
              <span>Log In</span>
            </Link>
            <Link href="/register" className={styles.btn_register}>
              <span>Register With TLA</span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
