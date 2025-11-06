"use client";
import React from "react";
import { useEditor } from "./ctx";
import ToolbarButton from "./ToolbarButton";

export default function InlineStyleGroup() {
  const { actions, icons, saveSelection } = useEditor();
  const hold = (e) => { saveSelection(); e.preventDefault(); };

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
      <ToolbarButton title="Bold" onMouseDown={hold} onClick={actions.bold}>
        {icons.bold}
      </ToolbarButton>
      <ToolbarButton title="Italic" onMouseDown={hold} onClick={actions.italic}>
        {icons.italic}
      </ToolbarButton>
      <ToolbarButton title="Underline" onMouseDown={hold} onClick={actions.underline}>
        {icons.underline}
      </ToolbarButton>
    </div>
  );
}
