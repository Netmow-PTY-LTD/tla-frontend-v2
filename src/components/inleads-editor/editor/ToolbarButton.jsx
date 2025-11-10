"use client";
import React from "react";

export default function ToolbarButton({ title, onClick, onMouseDown, children }) {
  const S = { btn: { border: 0, background: "transparent", cursor: "pointer", padding: 4, color: "#111827", borderRadius: 8 } };
  const onOver = (e) => (e.currentTarget.style.background = "#f3f4f6");
  const onOut  = (e) => (e.currentTarget.style.background = "transparent");
  return (
    <button
      type="button"
      title={title}
      aria-label={title}
      style={S.btn}
      onMouseEnter={onOver}
      onMouseLeave={onOut}
      onMouseDown={onMouseDown}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
