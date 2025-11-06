"use client";
import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import ToolbarButton from "./ToolbarButton";
import { useEditor } from "./ctx";

export default function AnchorGroup() {
  const { icons, saveSelection, insertHTML, editorEl, refreshHTML } = useEditor();
  const [show, setShow] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [mode, setMode] = useState("insert"); // insert | edit
  const [url, setUrl] = useState("");
  const [text, setText] = useState("");
  const [target, setTarget] = useState("_self");
  const [classes, setClasses] = useState("");      // 👈 NEW
  const linkRef = useRef(null);

  useEffect(() => setMounted(true), []);

  // Open link editor modal from context menu
  useEffect(() => {
    const onEdit = (e) => {
      const link = e.detail?.link;
      const root = editorEl?.current;
      if (!link || !root || !root.contains(link)) return;

      linkRef.current = link;
      setMode("edit");
      setUrl(link.getAttribute("href") || "");
      setText(link.textContent || "");
      setTarget(link.getAttribute("target") || "_self");
      setClasses(link.getAttribute("class") || "");     // 👈 read existing classes
      setShow(true);
    };

    window.addEventListener("rte:link-edit", onEdit);
    return () => window.removeEventListener("rte:link-edit", onEdit);
  }, [editorEl]);

  const reset = () => {
    setUrl(""); setText(""); setTarget("_self"); setClasses("");
    linkRef.current = null; setMode("insert");
  };

  // Detect if caret inside <a>
  const getSelectedLink = () => {
    const root = editorEl?.current;
    if (!root) return null;
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return null;
    let node = sel.anchorNode;
    if (!node) return null;
    if (node.nodeType === 3) node = node.parentElement;
    if (!(node instanceof Element)) return null;
    const a = node.closest("a");
    return a && root.contains(a) ? a : null;
  };

  const openModal = (e) => {
    saveSelection();
    e.preventDefault();

    const a = getSelectedLink();
    if (a) {
      linkRef.current = a;
      setMode("edit");
      setUrl(a.getAttribute("href") || "");
      setText(a.textContent || "");
      setTarget(a.getAttribute("target") || "_self");
      setClasses(a.getAttribute("class") || "");     // 👈 read existing classes
    } else {
      reset();
      // Pre-fill text with selected content if any
      const sel = window.getSelection();
      const selectedText = sel && !sel.isCollapsed ? sel.toString() : "";
      setText(selectedText);
    }
    setShow(true);
  };

  // Support Ctrl+Enter to confirm, Escape to close
  useEffect(() => {
    if (!show) return;
    const onKey = (e) => {
      if (e.key === "Escape") { setShow(false); reset(); }
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") handleConfirm();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [show, url, text, target, classes]);

  const handleConfirm = () => {
    const href = (url || "").trim();
    if (!href) { alert("Please enter a valid URL."); return; }

    const safeText = text || href;
    const classAttr = (classes || "").trim();

    if (mode === "edit" && linkRef.current) {
      const a = linkRef.current;
      a.setAttribute("href", href);
      a.setAttribute("target", target);
      a.setAttribute("rel", "noopener noreferrer");
      if (classAttr) a.setAttribute("class", classAttr); else a.removeAttribute("class");  // 👈 set/remove classes
      a.textContent = safeText;
      refreshHTML && refreshHTML();
    } else {
      const cls = classAttr ? ` class="${classAttr}"` : "";
      const linkHTML = `<a href="${href}" target="${target}" rel="noopener noreferrer"${cls}>${safeText}</a>`; // 👈 include classes on insert
      insertHTML(linkHTML);
    }
    setShow(false);
    reset();
  };

  const handleRemove = () => {
    const a = linkRef.current;
    if (a && editorEl?.current?.contains(a)) {
      const textNode = document.createTextNode(a.textContent || "");
      a.replaceWith(textNode);
      refreshHTML && refreshHTML();
    }
    setShow(false);
    reset();
  };

  const S = {
    wrap: { display: "flex", alignItems: "center", gap: 16 },
    overlay: {
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.25)",
      display: "flex", justifyContent: "center", alignItems: "flex-start",
      paddingTop: 64, zIndex: 99999,
    },
    box: {
      background: "#fff", borderRadius: 12, padding: 24, width: "500px",
      maxWidth: "90vw", boxShadow: "0 10px 25px rgba(0,0,0,0.25)",
    },
    title: { margin: "0 0 10px", fontSize: 17, fontWeight: 600 },
    label: { fontSize: 13, fontWeight: 500, color: "#374151", marginBottom: 4 },
    input: {
      width: "100%", padding: "6px 8px", fontSize: 14, marginBottom: 10,
      border: "1px solid #e5e7eb", borderRadius: 6, outline: "none",
    },
    select: { width: "100%", padding: "6px 8px", fontSize: 14, border: "1px solid #e5e7eb", borderRadius: 6, outline: "none" },
    btnRow: { display: "flex", justifyContent: "space-between", marginTop: 14 },
    btn: (variant) => ({
      padding: "6px 14px", borderRadius: 6, border: "none", cursor: "pointer",
      background: variant === "primary" ? "#2563eb" : "#f3f4f6",
      color: variant === "primary" ? "#fff" : "#111827", fontWeight: 500
    }),
  };

  const Modal = show && mounted ? createPortal(
    <div style={S.overlay} onClick={() => { setShow(false); reset(); }}>
      <div style={S.box} onClick={(e) => e.stopPropagation()}>
        <h3 style={S.title}>{mode === "edit" ? "Edit Link" : "Insert Link"}</h3>

        <label style={S.label}>URL</label>
        <input style={S.input} type="url" placeholder="https://example.com" value={url} onChange={(e)=>setUrl(e.target.value)} />

        <label style={S.label}>Link Text</label>
        <input style={S.input} type="text" placeholder="Visible text" value={text} onChange={(e)=>setText(e.target.value)} />

        <label style={S.label}>Open In</label>
        <select style={S.select} value={target} onChange={(e)=>setTarget(e.target.value)}>
          <option value="_self">Same Tab</option>
          <option value="_blank">New Tab</option>
        </select>

        {/* 👇 NEW: CSS classes */}
        <label style={S.label}>CSS Classes</label>
        <input
          style={S.input}
          type="text"
          placeholder="e.g. btn btn-primary underline"
          value={classes}
          onChange={(e)=>setClasses(e.target.value)}
        />

        <div style={S.btnRow}>
          {mode === "edit" && linkRef.current && (
            <button type="button" style={S.btn("default")} onClick={handleRemove}>Remove Link</button>
          )}
          <div>
            <button type="button" style={S.btn("default")} onClick={()=>{ setShow(false); reset(); }}>Cancel</button>{" "}
            <button type="button" style={S.btn("primary")} onClick={handleConfirm}>
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
      <ToolbarButton title="Insert/Edit Link" onMouseDown={(e)=>{ saveSelection(); e.preventDefault(); }} onClick={openModal}>
        {icons.link}
      </ToolbarButton>
      {Modal}
    </div>
  );
}
