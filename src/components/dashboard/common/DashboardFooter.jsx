import Link from "next/link";
import React from "react";

export default function DashboardFooter() {
  return (
    <footer className="db-footer">
      <div className="container">
        <p>
          Copyright &copy; {new Date().getFullYear()} |{" "}
          <Link href="/dashboard/client">The LawAppOnline</Link>.
        </p>
      </div>
    </footer>
  );
}
