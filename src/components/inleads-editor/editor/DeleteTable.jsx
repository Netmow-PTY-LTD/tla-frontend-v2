"use client";
import React from "react";
import { useEditor } from "./ctx";
import ToolbarButton from "./ToolbarButton";

export default function DeleteTable() {
  const { icons, editorEl, refreshHTML } = useEditor();

  const handleDelete = (e) => {
    e.preventDefault();
    const root = editorEl?.current;
    if (!root) return;

    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return;

    let node = sel.anchorNode;
    if (node?.nodeType === 3) node = node.parentElement;
    if (!(node instanceof Element)) return;

    const table = node.closest("table");
    if (table && root.contains(table)) {
      table.remove();
      refreshHTML && refreshHTML();
    } else {
      alert("No table found at current cursor position.");
    }
  };

  return (
    <ToolbarButton title="Delete Table" onMouseDown={(e)=>e.preventDefault()} onClick={handleDelete}>
      {icons.trash ?? (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="3 6 5 6 21 6" />
          <path d="M19 6l-1 14H6L5 6" />
          <path d="M10 11v6M14 11v6" />
          <path d="M9 6l1-3h4l1 3" />
        </svg>
      )}
    </ToolbarButton>
  );
}
