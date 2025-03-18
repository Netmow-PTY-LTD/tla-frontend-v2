import React from 'react';

export default function SideNav() {
  return (
    <aside className="sidebar">
      <nav>
        <h2>Main</h2>
        <ul>
          <li>
            <a href="/dashboard/lawyer/lead-board">Lead Boards</a>
          </li>
          <li>
            <a href="/dashboard/lawyer/my-stats">My Stats</a>
          </li>
          <li>
            <a href="#">Response</a>
          </li>
        </ul>
      </nav>
      <nav>
        <h2>Helps</h2>
        <ul>
          <li>
            <a href="/dashboard/lawyer/lead-board">Lead Boards</a>
          </li>
          <li>
            <a href="/dashboard/lawyer/my-stats">My Stats</a>
          </li>
          <li>
            <a href="#">Response</a>
          </li>
        </ul>
      </nav>
    </aside>
  );
}
