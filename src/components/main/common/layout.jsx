import React, { Children } from "react";
import Header from "./header/Header";
import Footer from "./footer/Footer";

export default function MainLayout({ children }) {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
}
