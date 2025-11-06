"use client";
import React from "react";
import { useEditor } from "./ctx";
import ToolbarButton from "./ToolbarButton";

export default function AlignmentGroup() {
  const { actions, icons, saveSelection } = useEditor();
  const hold = (e) => { saveSelection(); e.preventDefault(); };

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
      <ToolbarButton title="Align Left"   onMouseDown={hold} onClick={actions.left}>{icons.left}</ToolbarButton>
      <ToolbarButton title="Align Center" onMouseDown={hold} onClick={actions.center}>{icons.center}</ToolbarButton>
      <ToolbarButton title="Align Right"  onMouseDown={hold} onClick={actions.right}>{icons.right}</ToolbarButton>
      <ToolbarButton title="Justify"      onMouseDown={hold} onClick={actions.justify}>{icons.justify}</ToolbarButton>
    </div>
  );
}
