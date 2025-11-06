"use client";
import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useEditor } from "./ctx";
import ToolbarButton from "./ToolbarButton";

export default function Table() {
  const { icons, saveSelection, insertHTML, editorEl, refreshHTML } = useEditor();

  const [mounted, setMounted] = useState(false);
  const [show, setShow] = useState(false);
  const [mode, setMode] = useState("insert"); // insert | edit

  // insert fields
  const [rows, setRows] = useState(3);
  const [cols, setCols] = useState(3);
  const [withHeader, setWithHeader] = useState(true);

  // shared style fields
  const [widthPct, setWidthPct] = useState(100);
  const [border, setBorder] = useState(1);
  const [cellPadding, setCellPadding] = useState(6);

  const tableRef = useRef(null);

  useEffect(() => setMounted(true), []);

  const S = {
    wrap: { display: "flex", alignItems: "center", gap: 16 },
    overlay: {
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.25)",
      display: "flex", justifyContent: "center", alignItems: "flex-start",
      paddingTop: 64, zIndex: 99999
    },
    box: {
      background: "#fff", borderRadius: 12, padding: 24,
      width: "500px", maxWidth: "90vw", boxShadow: "0 10px 25px rgba(0,0,0,0.25)"
    },
    title: { margin: "0 0 10px", fontSize: 17, fontWeight: 600 },
    row: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 },
    label: { fontSize: 13, fontWeight: 500, color: "#374151", marginBottom: 4, display: "block" },
    input: { width: "100%", padding: "6px 8px", fontSize: 14, border: "1px solid #e5e7eb", borderRadius: 6, outline: "none" },
    check: { display: "flex", alignItems: "center", gap: 8, margin: "4px 0 10px" },
    btnRow: { display: "flex", justifyContent: "space-between", marginTop: 14 },
    btn: (variant) => ({
      padding: "6px 14px", borderRadius: 6, border: "none", cursor: "pointer",
      background: variant === "primary" ? "#2563eb" : "#f3f4f6",
      color: variant === "primary" ? "#fff" : "#111827", fontWeight: 500
    }),
    muted: { fontSize: 12, color: "#6b7280" },
  };

  const reset = () => {
    setMode("insert");
    setRows(3); setCols(3); setWithHeader(true);
    setWidthPct(100); setBorder(1); setCellPadding(6);
    tableRef.current = null;
  };

  // Find nearest <table> if selection is inside the editor
  const getSelectedTable = () => {
    const root = editorEl?.current;
    if (!root) return null;
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return null;
    let node = sel.anchorNode;
    if (!node) return null;
    if (node.nodeType === 3) node = node.parentElement;
    if (!(node instanceof Element)) return null;
    const tbl = node.closest("table");
    return tbl && root.contains(tbl) ? tbl : null;
  };

  const openModal = (e) => {
    saveSelection();
    e.preventDefault();

    const tbl = getSelectedTable();
    if (tbl) {
      tableRef.current = tbl;
      setMode("edit");

      // pull attributes / styles
      const style = tbl.getAttribute("style") || "";
      const wMatch = style.match(/width:\s*(\d+)%/i);
      const widthFromStyle = wMatch ? parseInt(wMatch[1], 10) : null;

      const borderVal = parseInt(tbl.getAttribute("border") || "1", 10);
      const padVal = style.match(/padding:\s*(\d+)px/i) ? parseInt(RegExp.$1, 10) : null;

      const rCount = tbl.querySelectorAll(":scope > tbody > tr").length || tbl.querySelectorAll("tr").length;
      const cCount = (tbl.querySelector("tr")?.children?.length) || 0;
      const head = !!tbl.querySelector("thead tr");

      setRows(rCount || 3);
      setCols(cCount || 3);
      setWithHeader(head);
      setWidthPct(widthFromStyle ?? 100);
      setBorder(Number.isFinite(borderVal) ? borderVal : 1);
      setCellPadding(Number.isFinite(padVal) ? padVal : 6);
    } else {
      reset();
    }

    setShow(true);
  };

  // build a simple table HTML string
  const buildTableHTML = () => {
    const safeRows = Math.max(1, Math.min(50, parseInt(rows || 0, 10)));
    const safeCols = Math.max(1, Math.min(20, parseInt(cols || 0, 10)));
    const w = Math.max(1, Math.min(100, parseInt(widthPct || 0, 10)));
    const b = Math.max(0, Math.min(10, parseInt(border || 0, 10)));
    const p = Math.max(0, Math.min(24, parseInt(cellPadding || 0, 10)));

    const tableStyle = `width:${w}%;border-collapse:collapse;`;
    const cellStyle = `border:${b}px solid #e5e7eb;padding:${p}px;vertical-align:top;`;

    // header
    let thead = "";
    if (withHeader) {
      thead =
        "<thead><tr>" +
        Array.from({ length: safeCols }).map(() => `<th style="${cellStyle};background:#f9fafb;font-weight:600;text-align:left;">Heading</th>`).join("") +
        "</tr></thead>";
    }

    // body
    const rowsHTML = Array.from({ length: safeRows }).map(() =>
      "<tr>" + Array.from({ length: safeCols }).map(() => `<td style="${cellStyle}">&nbsp;</td>`).join("") + "</tr>"
    ).join("");

    return `<table border="${b}" style="${tableStyle}">${thead}<tbody>${rowsHTML}</tbody></table>`;
  };

  const handleInsertOrUpdate = () => {
    if (mode === "edit" && tableRef.current) {
      // Update existing table
      const tbl = tableRef.current;

      // width/border/padding updates
      const w = Math.max(1, Math.min(100, parseInt(widthPct || 0, 10)));
      const b = Math.max(0, Math.min(10, parseInt(border || 0, 10)));
      const p = Math.max(0, Math.min(24, parseInt(cellPadding || 0, 10)));

      tbl.setAttribute("border", String(b));
      tbl.style.width = `${w}%`;
      tbl.style.borderCollapse = "collapse";

      // ensure thead/tbody structure matches "withHeader"
      let thead = tbl.querySelector("thead");
      let tbody = tbl.querySelector("tbody");
      if (!tbody) {
        // create tbody if missing and move rows in
        tbody = document.createElement("tbody");
        const allRows = Array.from(tbl.querySelectorAll("tr"));
        allRows.forEach((tr) => tbody.appendChild(tr));
        tbl.appendChild(tbody);
      }

      if (withHeader) {
        if (!thead) {
          thead = document.createElement("thead");
          const firstRow = tbody.querySelector("tr");
          const headRow = document.createElement("tr");
          if (firstRow) {
            const cols = firstRow.children.length;
            for (let i = 0; i < cols; i++) {
              const th = document.createElement("th");
              th.textContent = "Heading";
              th.setAttribute("style", `border:${b}px solid #e5e7eb;padding:${p}px;vertical-align:top;background:#f9fafb;font-weight:600;text-align:left;`);
              headRow.appendChild(th);
            }
            thead.appendChild(headRow);
            tbl.insertBefore(thead, tbody);
          }
        }
      } else if (thead) {
        thead.remove();
      }

      // normalize all cells with border/padding
      tbl.querySelectorAll("td, th").forEach((cell) => {
        if (cell.tagName === "TH" && withHeader) {
          cell.setAttribute("style", `border:${b}px solid #e5e7eb;padding:${p}px;vertical-align:top;background:#f9fafb;font-weight:600;text-align:left;`);
        } else {
          cell.setAttribute("style", `border:${b}px solid #e5e7eb;padding:${p}px;vertical-align:top;`);
        }
      });

      refreshHTML && refreshHTML();
    } else {
      // Insert new table
      const html = buildTableHTML();
      insertHTML(html);
    }

    setShow(false);
    // reset(); // keep recent inputs if you want
  };

  useEffect(() => {
    if (!show) return;
    const onKey = (e) => {
      if (e.key === "Escape") setShow(false);
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") handleInsertOrUpdate();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [show, rows, cols, withHeader, widthPct, border, cellPadding]);

  const Modal = mounted && show ? createPortal(
    <div style={S.overlay} onClick={() => setShow(false)}>
      <div style={S.box} onClick={(e) => e.stopPropagation()}>
        <h3 style={S.title}>{mode === "edit" ? "Edit Table" : "Insert Table"}</h3>

        {mode === "insert" && (
          <>
            <div className="row" style={S.row}>
              <div>
                <label style={S.label}>Rows</label>
                <input style={S.input} type="number" min={1} max={50} value={rows} onChange={(e) => setRows(e.target.value)} />
              </div>
              <div>
                <label style={S.label}>Columns</label>
                <input style={S.input} type="number" min={1} max={20} value={cols} onChange={(e) => setCols(e.target.value)} />
              </div>
            </div>
            <label style={S.check}>
              <input type="checkbox" checked={withHeader} onChange={(e) => setWithHeader(e.target.checked)} />
              Add header row
            </label>
          </>
        )}

        <div className="row" style={S.row}>
          <div>
            <label style={S.label}>Width (%)</label>
            <input style={S.input} type="number" min={1} max={100} value={widthPct} onChange={(e) => setWidthPct(e.target.value)} />
          </div>
          <div>
            <label style={S.label}>Border (px)</label>
            <input style={S.input} type="number" min={0} max={10} value={border} onChange={(e) => setBorder(e.target.value)} />
          </div>
        </div>

        <div className="row" style={S.row}>
          <div>
            <label style={S.label}>Cell padding (px)</label>
            <input style={S.input} type="number" min={0} max={24} value={cellPadding} onChange={(e) => setCellPadding(e.target.value)} />
          </div>
          <div style={{ display: "flex", alignItems: "flex-end" }}>
            <span style={S.muted}>Tip: place cursor inside a table to edit it.</span>
          </div>
        </div>

        <div style={S.btnRow}>
          {mode === "edit" && tableRef.current && (
            <button
              type="button"
              style={S.btn("default")}
              onClick={() => {
                const el = tableRef.current;
                if (el && editorEl?.current?.contains(el)) {
                  el.remove();
                  refreshHTML && refreshHTML();
                  setShow(false);
                }
              }}
            >
              Remove Table
            </button>
          )}
          <div>
            <button type="button" style={S.btn("default")} onClick={() => setShow(false)}>Cancel</button>{" "}
            <button type="button" style={S.btn("primary")} onClick={handleInsertOrUpdate}>
              {mode === "edit" ? "Update" : "Insert"}
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  ) : null;

  return (
    <div style={S.wrap}>
      <ToolbarButton
        title="Insert/Edit Table"
        onMouseDown={(e) => { saveSelection(); e.preventDefault(); }}
        onClick={openModal}
      >
        {icons.table ?? (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="5" width="18" height="14" rx="1" />
            <path d="M3 10h18M8 5v14M16 5v14" />
          </svg>
        )}
      </ToolbarButton>
      {Modal}
    </div>
  );
}
