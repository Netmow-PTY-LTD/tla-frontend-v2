"use client";
import React, { useState } from "react";
import ToolbarButton from "./ToolbarButton";
import { useEditor } from "./ctx";

const PALETTE = [
  "#000000","#434343","#666666","#999999","#B7B7B7","#CCCCCC","#D9D9D9","#EFEFEF","#F3F4F6","#FFFFFF",
  "#EF4444","#F97316","#F59E0B","#EAB308","#84CC16","#22C55E","#10B981","#14B8A6","#06B6D4","#3B82F6",
  "#6366F1","#8B5CF6","#A855F7","#D946EF","#EC4899","#F43F5E"
];

export default function TextColorGroup() {
  const { saveSelection } = useEditor();
  const [open, setOpen] = useState(false);
  const [hex, setHex]   = useState("");

  const hold = (e) => { saveSelection(); e.preventDefault(); };

  const applyColor = (color) => {
    // selection is still held because we used onMouseDown + preventDefault
    try {
      document.execCommand("styleWithCSS", false, true);
    } catch {}
    document.execCommand("foreColor", false, color);
    setOpen(false);
  };

  const clearColor = () => {
    // Try to clear only color by setting to 'inherit'
    document.execCommand("foreColor", false, "inherit");
    // As a fallback, removeFormat (may strip some inline styles/bold in the range)
    // document.execCommand("removeFormat", false, null);
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

  // Inline icon (if you don’t have icons.textColor)
  const Icon = (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M5 20h14" />
      <path d="M7 20l5-16 5 16" />
      <path d="M8.5 14h7" />
    </svg>
  );

  return (
    <div style={S.wrap} onMouseLeave={() => setOpen(false)}>
      <ToolbarButton title="Text color" onMouseDown={hold} onClick={() => setOpen(s=>!s)}>
        {Icon}
      </ToolbarButton>

      {open && (
        <div style={S.menu}>
          <div style={S.grid}>
            {PALETTE.map(c => (
              <div key={c} style={S.sw(c)} title={c}
                   onMouseDown={hold}
                   onClick={() => applyColor(c)} />
            ))}
          </div>
          <div style={S.row}>
            <input
              style={S.input}
              placeholder="#000000"
              value={hex}
              onChange={(e)=>setHex(e.target.value)}
              onKeyDown={(e)=>{
                if (e.key === "Enter") {
                  const val = hex.trim();
                  if (val) applyColor(val);
                }
              }}
            />
            <button type="button" style={S.btn} onMouseDown={hold} onClick={() => hex.trim() && applyColor(hex.trim())}>
              Apply
            </button>
            <button type="button" style={S.btn} onMouseDown={hold} onClick={clearColor}>
              Clear
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
