"use client";
import React from "react";
import { useEditor } from "./ctx";
import ToolbarButton from "./ToolbarButton";

export default function HistoryGroup() {
  const { actions, icons, saveSelection } = useEditor();
  const hold = (e) => { saveSelection(); e.preventDefault(); };

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
      <ToolbarButton title="Undo" onMouseDown={hold} onClick={actions.undo}>
        {icons.undo}
      </ToolbarButton>
      <ToolbarButton title="Redo" onMouseDown={hold} onClick={actions.redo}>
        {icons.redo}
      </ToolbarButton>
    </div>
  );
}
