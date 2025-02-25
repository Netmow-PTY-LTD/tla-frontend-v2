import React from "react";
import styles from "./Header.module.css";
import Link from "next/link";
import Image from "next/image";

export default function Header() {
  return (
    <header className={styles.main_header}>
      <div className="container">
        <div className="flex items-center justify-between">
          <Link href="/">
            <Image
              src={"/assets/img/logo.png"}
              alt="TLA Logo"
              width={150}
              height={40}
            />
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/about">
              <span className={styles.nav_link}>Log In</span>
            </Link>
            <Link href="/services">
              <span className={styles.btn_register}>Register With TLA</span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
