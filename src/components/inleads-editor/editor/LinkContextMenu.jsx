"use client";
import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useEditor } from "./ctx";

export default function LinkContextMenu() {
  const { editorEl, refreshHTML } = useEditor();
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [visible, setVisible] = useState(false);
  const linkRef = useRef(null);

  useEffect(() => {
    const root = editorEl?.current;
    if (!root) return;

    const onContext = (e) => {
      if (!root.contains(e.target)) {
        setVisible(false);
        return;
      }

      const a = e.target.closest("a");
      if (a && root.contains(a)) {
        e.preventDefault();
        linkRef.current = a;
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

  const editLink = () => {
    const a = linkRef.current;
    if (!a) return;
    // Fire a custom event the AnchorGroup listens to
    window.dispatchEvent(new CustomEvent("rte:link-edit", { detail: { link: a } }));
    setVisible(false);
  };

  const removeLink = () => {
    const a = linkRef.current;
    if (a && editorEl?.current?.contains(a)) {
      const textNode = document.createTextNode(a.textContent || "");
      a.replaceWith(textNode);
      refreshHTML?.();
    }
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
      minWidth: 180,
    },
    item: { padding: "8px 14px", cursor: "pointer", fontSize: 14, whiteSpace: "nowrap" },
  };

  if (!visible) return null;
  return createPortal(
    <div style={S.menu}>
      <div
        style={S.item}
        onMouseEnter={(e) => (e.currentTarget.style.background = "#f3f4f6")}
        onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
        onClick={editLink}
      >
        ✏️ Edit Link
      </div>
      <div
        style={{ ...S.item, color: "#b91c1c" }}
        onMouseEnter={(e) => (e.currentTarget.style.background = "#fee2e2")}
        onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
        onClick={removeLink}
      >
        🗑 Remove Link
      </div>
    </div>,
    document.body
  );
}
