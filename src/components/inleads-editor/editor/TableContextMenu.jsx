"use client";
import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useEditor } from "./ctx";

export default function TableContextMenu() {
  const { editorEl, refreshHTML } = useEditor();

  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [visible, setVisible] = useState(false);

  // What was right-clicked
  const tableRef = useRef(null);  // <table>
  const cellRef  = useRef(null);  // <td> or <th>
  const cellIdx  = useRef(-1);    // column index in row
  const rowRef   = useRef(null);  // <tr>

  useEffect(() => {
    const root = editorEl?.current;
    if (!root) return;

    const onContext = (e) => {
      if (!root.contains(e.target)) {
        setVisible(false);
        return;
      }

      const cell  = e.target.closest("td, th");
      const row   = e.target.closest("tr");
      const table = e.target.closest("table");

      if (table && cell && row && root.contains(table)) {
        e.preventDefault();

        tableRef.current = table;
        cellRef.current  = cell;
        rowRef.current   = row;
        cellIdx.current  = Array.from(row.children).indexOf(cell);

        setPos({ x: e.pageX, y: e.pageY });
        setVisible(true);
      } else {
        setVisible(false);
      }
    };

    const onAnyClick = () => setVisible(false);
    const onEscape = (e) => { if (e.key === "Escape") setVisible(false); };

    document.addEventListener("contextmenu", onContext);
    document.addEventListener("click", onAnyClick);
    document.addEventListener("keydown", onEscape);
    return () => {
      document.removeEventListener("contextmenu", onContext);
      document.removeEventListener("click", onAnyClick);
      document.removeEventListener("keydown", onEscape);
    };
  }, [editorEl]);

  const deleteTable = () => {
    const tbl = tableRef.current;
    if (tbl && editorEl?.current?.contains(tbl)) {
      tbl.remove();
      refreshHTML?.();
    }
    setVisible(false);
  };

  // ----- shared style helper (per row) -----
  const styleForRow = (tr, idx) => {
    const refCell = tr.children[idx] || tr.children[0];
    const fallback = "border:1px solid #e5e7eb;padding:6px;vertical-align:top;";
    if (!refCell) return fallback;

    const inline = refCell.getAttribute("style");
    if (inline && inline.trim()) return inline;

    const cs = window.getComputedStyle(refCell);
    const borderColor = cs.borderColor || "#e5e7eb";
    const borderWidth = parseInt(cs.borderTopWidth || "1", 10);
    const pad = parseInt(cs.paddingTop || "6", 10);
    const bg = cs.backgroundColor && cs.backgroundColor !== "rgba(0, 0, 0, 0)"
      ? `background:${cs.backgroundColor};`
      : "";
    const weight = refCell.tagName === "TH" ? "font-weight:600;text-align:left;" : "";
    return `border:${borderWidth}px solid ${borderColor};padding:${pad}px;vertical-align:top;${bg}${weight}`;
  };

  // ===== COLUMNS =====
  const addColumnRight = () => {
    const tbl = tableRef.current;
    const baseCell = cellRef.current;
    const idx = cellIdx.current;
    if (!tbl || !baseCell || idx < 0) { setVisible(false); return; }

    const allRows = Array.from(tbl.querySelectorAll("tr"));
    allRows.forEach((tr) => {
      const isHeaderRow = tr.closest("thead") != null;
      const tag = isHeaderRow ? "th" : "td";
      const newCell = document.createElement(tag);
      newCell.setAttribute("style", styleForRow(tr, idx));
      newCell.innerHTML = "&nbsp;";

      const insertPos = idx + 1;
      if (insertPos >= tr.children.length) tr.appendChild(newCell);
      else tr.insertBefore(newCell, tr.children[insertPos]);
    });

    refreshHTML?.();
    setVisible(false);
  };

  const addColumnLeft = () => {
    const tbl = tableRef.current;
    const baseCell = cellRef.current;
    const idx = cellIdx.current;
    if (!tbl || !baseCell || idx < 0) { setVisible(false); return; }

    const allRows = Array.from(tbl.querySelectorAll("tr"));
    allRows.forEach((tr) => {
      const isHeaderRow = tr.closest("thead") != null;
      const tag = isHeaderRow ? "th" : "td";
      const newCell = document.createElement(tag);
      newCell.setAttribute("style", styleForRow(tr, idx));
      newCell.innerHTML = "&nbsp;";

      const insertPos = Math.max(0, idx);
      tr.insertBefore(newCell, tr.children[insertPos] || null);
    });

    refreshHTML?.();
    setVisible(false);
  };

  // ✅ Delete current column
  const deleteColumnCurrent = () => {
    const tbl = tableRef.current;
    const idx = cellIdx.current;
    if (!tbl || idx < 0) { setVisible(false); return; }

    const allRows = Array.from(tbl.querySelectorAll("tr"));
    // If there is only 1 column in the first row, remove the table
    const firstRow = allRows[0];
    if (!firstRow) { setVisible(false); return; }
    const colCount = firstRow.children.length;
    if (colCount <= 1) {
      deleteTable();
      return;
    }

    allRows.forEach((tr) => {
      if (tr.children[idx]) tr.removeChild(tr.children[idx]);
    });

    refreshHTML?.();
    setVisible(false);
  };

  // ===== ROWS =====
  const addRow = (position /* "above" | "below" */) => {
    const tbl = tableRef.current;
    const baseRow = rowRef.current;
    const idx = cellIdx.current;
    if (!tbl || !baseRow) { setVisible(false); return; }

    const section = baseRow.parentElement; // thead or tbody (or table)
    const isHeaderRow = section.tagName === "THEAD";

    let targetSection = section;
    if (targetSection.tagName === "TABLE") {
      let tbody = tbl.querySelector("tbody");
      if (!tbody) {
        tbody = document.createElement("tbody");
        const all = Array.from(tbl.querySelectorAll(":scope > tr"));
        all.forEach((tr) => tbody.appendChild(tr));
        tbl.appendChild(tbody);
      }
      targetSection = tbody;
    }

    const rowsInSection = Array.from(targetSection.children).filter(n => n.tagName === "TR");
    const baseIndex = rowsInSection.indexOf(baseRow);
    const insertIndex = position === "above" ? baseIndex : baseIndex + 1;

    const colCount = baseRow.children.length || 1;

    const newTr = document.createElement("tr");
    for (let c = 0; c < colCount; c++) {
      const tag = isHeaderRow ? "th" : "td";
      const cell = document.createElement(tag);
      cell.setAttribute("style", styleForRow(baseRow, Math.min(c, colCount - 1)));
      cell.innerHTML = "&nbsp;";
      newTr.appendChild(cell);
    }

    if (insertIndex >= rowsInSection.length) targetSection.appendChild(newTr);
    else targetSection.insertBefore(newTr, rowsInSection[insertIndex]);

    refreshHTML?.();
    setVisible(false);
  };

  const addRowAbove = () => addRow("above");
  const addRowBelow = () => addRow("below");

  // ✅ Delete current row
  const deleteRowCurrent = () => {
    const tbl = tableRef.current;
    const baseRow = rowRef.current;
    if (!tbl || !baseRow) { setVisible(false); return; }

    // If table would become empty after removal, remove entire table
    const totalRows = tbl.querySelectorAll("tr").length;
    if (totalRows <= 1) {
      deleteTable();
      return;
    }

    const section = baseRow.parentElement; // thead or tbody or table
    section.removeChild(baseRow);

    // If <thead> becomes empty, remove it
    if (section.tagName === "THEAD" && section.querySelectorAll("tr").length === 0) {
      section.remove();
    }
    // If tbody becomes empty and there is no other section with rows, remove table
    if (section.tagName === "TBODY") {
      const stillHasRows = tbl.querySelectorAll("tr").length > 0;
      if (!stillHasRows) {
        deleteTable();
        return;
      }
    }

    refreshHTML?.();
    setVisible(false);
  };

  const S = {
    menu: {
      position: "absolute",
      left: pos.x,
      top: pos.y,
      background: "#fff",
      border: "1px solid #e5e7eb",
      borderRadius: 8,
      boxShadow: "0 10px 20px rgba(0,0,0,0.1)",
      padding: "6px 0",
      zIndex: 999999,
      minWidth: 240,
    },
    sep: { height: 1, background: "#eef2f7", margin: "6px 0" },
  };

  if (!visible) return null;
  return createPortal(
    <div style={S.menu}>
      {/* Delete */}
      <MenuItemDanger label="🗑 Delete Table" onClick={deleteTable} />
      <MenuItemDanger label="🗑 Delete Column" onClick={deleteColumnCurrent} />
      <MenuItemDanger label="🗑 Delete Row" onClick={deleteRowCurrent} />
      <div style={S.sep} />

      {/* Columns */}
      <MenuItem label="➕ Add Column Left" onClick={addColumnLeft} />
      <MenuItem label="➕ Add Column Right" onClick={addColumnRight} />
      <div style={S.sep} />

      {/* Rows */}
      <MenuItem label="➕ Add Row Above" onClick={addRowAbove} />
      <MenuItem label="➕ Add Row Below" onClick={addRowBelow} />
    </div>,
    document.body
  );
}

/* ----- tiny menu items ----- */
function MenuItem({ label, onClick }) {
  const base = {
    padding: "8px 14px",
    cursor: "pointer",
    fontSize: 14,
    whiteSpace: "nowrap",
  };
  return (
    <div
      style={base}
      onMouseEnter={(e) => (e.currentTarget.style.background = "#f3f4f6")}
      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
      onClick={onClick}
    >
      {label}
    </div>
  );
}

function MenuItemDanger({ label, onClick }) {
  const base = {
    padding: "8px 14px",
    cursor: "pointer",
    fontSize: 14,
    whiteSpace: "nowrap",
    color: "#b91c1c",
  };
  return (
    <div
      style={base}
      onMouseEnter={(e) => (e.currentTarget.style.background = "#fee2e2")}
      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
      onClick={onClick}
    >
      {label}
    </div>
  );
}
