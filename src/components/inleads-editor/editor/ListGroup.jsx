"use client";
import React from "react";
import { useEditor } from "./ctx";
import ToolbarButton from "./ToolbarButton";

export default function ListGroup() {
  const { actions, icons, saveSelection } = useEditor();
  const hold = (e) => { saveSelection(); e.preventDefault(); };

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
      <ToolbarButton title="Bulleted List" onMouseDown={hold} onClick={actions.ul}>
        {icons.ul}
      </ToolbarButton>
      <ToolbarButton title="Numbered List" onMouseDown={hold} onClick={actions.ol}>
        {icons.ol}
      </ToolbarButton>
    </div>
  );
}
