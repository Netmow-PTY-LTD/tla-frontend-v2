"use client";
import React, { useState } from "react";
import ToolbarButton from "./ToolbarButton";
import { useEditor } from "./ctx";

const PALETTE = [
  "#00000000", // transparent
  "#FEF3C7","#FFEDD5","#FFE4E6","#FEE2E2","#DCFCE7","#D1FAE5","#CCFBF1","#E0F2FE","#DBEAFE",
  "#EDE9FE","#FAE8FF","#FCE7F3","#F5F5F5","#F3F4F6","#E5E7EB","#D1D5DB","#FDE68A","#FCA5A5","#86EFAC"
];

export default function BackgroundColorGroup() {
  const { saveSelection } = useEditor();
  const [open, setOpen] = useState(false);
  const [hex, setHex]   = useState("");

  const hold = (e) => { saveSelection(); e.preventDefault(); };

  const applyBg = (color) => {
    try {
      document.execCommand("styleWithCSS", false, true);
    } catch {}
    // Most browsers support 'hiliteColor'. Safari sometimes prefers 'backColor'
    const ok = document.execCommand("hiliteColor", false, color);
    if (!ok) document.execCommand("backColor", false, color);
    setOpen(false);
  };

  const clearBg = () => {
    const ok = document.execCommand("hiliteColor", false, "transparent");
    if (!ok) document.execCommand("backColor", false, "transparent");
    setOpen(false);
  };

  const S = {
    wrap: { position: "relative", display: "inline-flex", alignItems: "center" },
    menu: {
      position: "absolute", top: "100%", left: 0, marginTop: 0, background: "#fff",
      border: "1px solid #e5e7eb", borderRadius: 10, boxShadow: "0 10px 20px rgba(0,0,0,0.06)",
      padding: 10, zIndex: 10000, width: "auto"
    },
    grid: { display: "grid", gridTemplateColumns: "repeat(10, 1fr)", gap: 6, marginBottom: 10 },
    sw: (c) => ({
      width: 18, height: 18, borderRadius: 4, background: c, border: "1px solid #e5e7eb",
      cursor: "pointer"
    }),
    row: { display: "flex", gap: 8 },
    input: {
      flex: 1, padding: "6px 8px", border: "1px solid #e5e7eb", borderRadius: 6, outline: "none", fontSize: 13
    },
    btn: {
      padding: "6px 10px", border: "1px solid #e5e7eb", borderRadius: 6, background: "#f9fafb", cursor: "pointer", fontSize: 13
    }
  };

  // Inline icon (if you don’t have icons.bgColor)
  const Icon = (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
      <path d="M2 20h20v2H2z" />
      <path d="M7 17l5-10 5 10z" fill="none" stroke="currentColor" strokeWidth="2"/>
    </svg>
  );

  return (
    <div style={S.wrap} onMouseLeave={() => setOpen(false)}>
      <ToolbarButton title="Background color" onMouseDown={hold} onClick={() => setOpen(s=>!s)}>
        {Icon}
      </ToolbarButton>

      {open && (
        <div style={S.menu}>
          <div style={S.grid}>
            {PALETTE.map(c => (
              <div key={c} style={S.sw(c)} title={c || "transparent"}
                   onMouseDown={hold}
                   onClick={() => applyBg(c)} />
            ))}
          </div>
          <div style={S.row}>
            <input
              style={S.input}
              placeholder="#FFF7CC"
              value={hex}
              onChange={(e)=>setHex(e.target.value)}
              onKeyDown={(e)=>{
                if (e.key === "Enter") {
                  const val = hex.trim();
                  if (val) applyBg(val);
                }
              }}
            />
            <button type="button" style={S.btn} onMouseDown={hold} onClick={() => hex.trim() && applyBg(hex.trim())}>
              Apply
            </button>
            <button type="button" style={S.btn} onMouseDown={hold} onClick={clearBg}>
              Clear
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
