"use client";
import React, { useState } from "react";
import { useEditor } from "./ctx";
import ToolbarButton from "./ToolbarButton";

export default function HeadingGroup() {
  const { actions, icons, saveSelection } = useEditor();
  const [open, setOpen] = useState(false);

  const hold = (e) => { saveSelection(); e.preventDefault(); };

  const S = {
    wrap: { position: "relative", display: "inline-flex", alignItems: "center" },
    btn: { display: "inline-flex", alignItems: "center", gap: 4, fontWeight: 600, fontSize: 18 },
    menu: {
      position: "absolute",
      top: "100%",
      left: 0,
      marginTop: 0,
      background: "#fff",
      border: "1px solid #e5e7eb",
      borderRadius: 10,
      boxShadow: "0 10px 20px rgba(0,0,0,0.06)",
      overflow: "hidden",
      zIndex: 10000, // 🔥 always on top of other elements
      minWidth: 160,
    },
    item: { padding: "5px 12px", fontSize: 14, cursor: "pointer", whiteSpace: "nowrap" },
  };

  const Item = ({ children, onClick }) => (
    <div
      style={S.item}
      onMouseDown={hold}
      onClick={() => { onClick(); setOpen(false); }}
      onMouseEnter={(e) => e.currentTarget.style.background = "#f8fafc"}
      onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
    >
      {children}
    </div>
  );

  return (
    <div style={S.wrap} onMouseLeave={() => setOpen(false)}>
      <ToolbarButton title="Heading" onMouseDown={hold} onClick={() => setOpen(s => !s)}>
        <span style={S.btn}>{icons.H}{icons.caret}</span>
      </ToolbarButton>

      {open && (
        <div style={S.menu}>
          <Item onClick={actions.p}>Paragraph</Item>
          <Item onClick={() => actions.h(1)}>Heading 1</Item>
          <Item onClick={() => actions.h(2)}>Heading 2</Item>
          <Item onClick={() => actions.h(3)}>Heading 3</Item>
          <Item onClick={() => actions.h(4)}>Heading 4</Item>
        </div>
      )}
    </div>
  );
}
