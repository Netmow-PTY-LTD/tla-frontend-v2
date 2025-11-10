"use client";
import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useEditor } from "./ctx";

export default function ImageContextMenu() {
  const { editorEl, refreshHTML } = useEditor();
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [visible, setVisible] = useState(false);
  const imgRef = useRef(null);

  useEffect(() => {
    const root = editorEl?.current;
    if (!root) return;

    const onContext = (e) => {
      if (!root.contains(e.target)) { setVisible(false); return; }

      const img = e.target.closest("img");
      if (img && root.contains(img)) {
        e.preventDefault();
        imgRef.current = img;
        setPos({ x: e.pageX, y: e.pageY });
        setVisible(true);
      } else {
        setVisible(false);
      }
    };

    const onAnyClick = () => setVisible(false);
    const onEsc = (e) => { if (e.key === "Escape") setVisible(false); };

    document.addEventListener("contextmenu", onContext);
    document.addEventListener("click", onAnyClick);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("contextmenu", onContext);
      document.removeEventListener("click", onAnyClick);
      document.removeEventListener("keydown", onEsc);
    };
  }, [editorEl]);

  const editImage = () => {
    const img = imgRef.current;
    if (!img) return;
    // Ask ImageGroup to open its modal in "edit" mode with this <img>
    window.dispatchEvent(new CustomEvent("rte:image-edit", { detail: { img } }));
    setVisible(false);
  };

  const deleteImage = () => {
    const img = imgRef.current;
    if (img && editorEl?.current?.contains(img)) {
      img.remove();
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
        style={{ ...S.item }}
        onMouseEnter={(e)=>e.currentTarget.style.background="#f3f4f6"}
        onMouseLeave={(e)=>e.currentTarget.style.background="transparent"}
        onClick={editImage}
      >
        ✏️ Edit Image
      </div>
      <div
        style={{ ...S.item, color: "#b91c1c" }}
        onMouseEnter={(e)=>e.currentTarget.style.background="#fee2e2"}
        onMouseLeave={(e)=>e.currentTarget.style.background="transparent"}
        onClick={deleteImage}
      >
        🗑 Delete Image
      </div>
    </div>,
    document.body
  );
}
