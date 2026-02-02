
"use client";
import React, { useRef, useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useEditor } from "./ctx";
import ToolbarButton from "./ToolbarButton";

export default function ImageGroup() {
  const { icons, saveSelection, insertHTML, editorEl, refreshHTML } = useEditor();
  const [show, setShow] = useState(false);
  const [mounted, setMounted] = useState(false); // for portal
  const [mode, setMode] = useState("insert"); // insert | edit
  const [url, setUrl] = useState("");
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  //   alt text, title, description
  const [alt, setAlt] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  //  preview
  const [preview, setPreview] = useState("");
  const imgRef = useRef(null);
  const fileRef = useRef(null);

  useEffect(() => setMounted(true), []);

  // Open ImageGroup modal from context menu (right-click)
useEffect(() => {
  const onEdit = (e) => {
    const img = e.detail?.img;
    const root = editorEl?.current;
    if (!img || !root || !root.contains(img)) return;

    imgRef.current = img;
    setMode("edit");
    const src = img.getAttribute("src") || "";
    const style = img.getAttribute("style") || "";
    const wMatch = style.match(/width:\s*(\d+)px/i);
    const hMatch = style.match(/height:\s*(\d+)px/i);
    const wVal = wMatch ? wMatch[1] : img.getAttribute("width") || "";
    const hVal = hMatch ? hMatch[1] : img.getAttribute("height") || "";

    setUrl(src);
    setPreview(src);
    setWidth(wVal);
    setHeight(hVal);

    //  set alt, title, description
    setAlt(img.getAttribute("alt") || "");
    setTitle(img.getAttribute("title") || "");
    setDescription(img.getAttribute("data-description") || "");
    setShow(true);
  };

  window.addEventListener("rte:image-edit", onEdit);
  return () => window.removeEventListener("rte:image-edit", onEdit);
}, [editorEl]);


  const reset = () => {
    setUrl(""); setWidth(""); setHeight(""); setPreview("");
    // setalt set title
    setAlt(""); setTitle(""); setDescription("");
    imgRef.current = null; setMode("insert");
  };

  // Detect if caret is on an <img>
  const getSelectedImg = () => {
    const root = editorEl?.current;
    if (!root) return null;
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return null;
    let node = sel.anchorNode;
    if (!node) return null;
    if (node.nodeType === 3) node = node.parentElement;
    if (!(node instanceof Element)) return null;
    const img = node.closest("img");
    return img && root.contains(img) ? img : null;
  };

  const openModal = (e) => {
    saveSelection();
    e.preventDefault();

    const img = getSelectedImg();
    if (img) {
      imgRef.current = img;
      setMode("edit");
      setUrl(img.getAttribute("src") || "");
      const style = img.getAttribute("style") || "";
      const wMatch = style.match(/width:\s*(\d+)px/i);
      const hMatch = style.match(/height:\s*(\d+)px/i);
      const wVal = wMatch ? wMatch[1] : img.getAttribute("width") || "";
      const hVal = hMatch ? hMatch[1] : img.getAttribute("height") || "";
      setWidth(wVal);
      setHeight(hVal);
      setAlt(img.getAttribute("alt") || "");
      setTitle(img.getAttribute("title") || "");
      setDescription(img.getAttribute("data-description") || "");
      setPreview(img.getAttribute("src") || "");
    } else {
      reset();
    }

    setShow(true);
  };

  // ESC closes, Ctrl/Cmd+Enter confirms
  useEffect(() => {
    if (!show) return;
    const onKey = (e) => {
      if (e.key === "Escape") { setShow(false); reset(); }
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") handleConfirm();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [show, url, width, height, alt, title, description]); // alt title desc

  const handleConfirm = () => {
    const src = (url || "").trim();
    if (!src) { alert("Please provide an image URL or upload a file."); return; }

    const w = width  ? `width:${parseInt(width, 10)}px;`  : "";
    const h = height ? `height:${parseInt(height, 10)}px;` : "";
    const style = `max-width:100%;${w}${h}`;

    if (mode === "edit" && imgRef.current) {
      const img = imgRef.current;
      img.setAttribute("src", src);
      img.setAttribute("style", style);
      if (width) img.setAttribute("width", width); else img.removeAttribute("width");
      if (height) img.setAttribute("height", height); else img.removeAttribute("height");
      if (alt) img.setAttribute("alt", alt); else img.removeAttribute("alt");
      if (title) img.setAttribute("title", title); else img.removeAttribute("title");
      if (description) img.setAttribute("data-description", description); else img.removeAttribute("data-description");
      refreshHTML && refreshHTML();
    } else {
      insertHTML(
        `<img src="${src}" alt="${alt || ''}" ${title ? `title="${title}"` : ''} ${description ? `data-description="${description}"` : ''} style="${style}" ${width?`width="${width}"`:''} ${height?`height="${height}"`:''} />`
      );
    }
    setShow(false);
    reset();
  };

  const onPickFile = () => fileRef.current?.click();
  const onFileChange = (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (!/^image\//.test(file.type)) { alert("Please select an image file."); return; }
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = String(reader.result);
      setUrl(dataUrl);
      setPreview(dataUrl);
    };
    reader.readAsDataURL(file);
  };

  /* ---------- Styles ---------- */
  const S = {
    wrap: { display: "flex", alignItems: "center", gap: 16 },
    overlay: {
      position: "fixed",         // ✅ fixed to viewport
      inset: 0,                  // top:0 right:0 bottom:0 left:0
      background: "rgba(0,0,0,0.25)",
      display: "flex",
      justifyContent: "center",
      alignItems: "flex-start",
      paddingTop: 64,            // push down under toolbar
      zIndex: 99999,             // ✅ topmost
    },
    box: {
      background: "#fff",
      borderRadius: 12,
      padding: 24,
      width: "500px",            // ✅ strict width
      maxWidth: "90vw",
      boxShadow: "0 10px 25px rgba(0,0,0,0.25)",
    },
    title: { margin: "0 0 10px", fontSize: 17, fontWeight: 600 },
    label: { fontSize: 13, fontWeight: 500, color: "#374151", marginBottom: 4 },
    input: {
      width: "100%", padding: "6px 8px", fontSize: 14, marginBottom: 10,
      border: "1px solid #e5e7eb", borderRadius: 6, outline: "none",
    },
    row: { display: "flex", gap: 10 },
    col: { flex: 1 },
    hr: { height: 1, background: "#eef2f7", border: "none", margin: "10px 0" },
    muted: { fontSize: 12, color: "#6b7280", margin: "2px 0 8px" },
    uploadBtn: { padding: "6px 10px", borderRadius: 6, border: "1px solid #e5e7eb", background: "#f9fafb", cursor: "pointer", fontSize: 14 },
    preview: { maxWidth: "100%", maxHeight: 200, display: "block", margin: "10px 0 6px", borderRadius: 6, objectFit: "contain", background: "#f9fafb" },
    btnRow: { display: "flex", justifyContent: "space-between", marginTop: 14 },
    btn: (variant) => ({
      padding: "6px 14px", borderRadius: 6, border: "none", cursor: "pointer",
      background: variant === "primary" ? "#2563eb" : "#f3f4f6",
      color: variant === "primary" ? "#fff" : "#111827", fontWeight: 500
    }),
  };

  // Modal element (portaled to body so it always sits on top)
  const Modal = show && mounted ? createPortal(
    <div style={S.overlay} onClick={() => { setShow(false); reset(); }}>
      <div style={S.box} onClick={(e) => e.stopPropagation()}>
        <h3 style={S.title}>{mode === "edit" ? "Edit Image" : "Insert Image"}</h3>

        {/* URL */}
        <label style={S.label}>Image URL</label>
        <input
          style={S.input}
          type="text"
          placeholder="https://example.com/image.jpg"
          value={url}
          onChange={(e) => { setUrl(e.target.value); setPreview(e.target.value); }}
        />

        {/* Dimensions */}
        <div style={S.row}>
          <div style={S.col}>
            <label style={S.label}>Width (px)</label>
            <input style={S.input} type="number" placeholder="auto" value={width} onChange={(e) => setWidth(e.target.value)} />
          </div>
          <div style={S.col}>
            <label style={S.label}>Height (px)</label>
            <input style={S.input} type="number" placeholder="auto" value={height} onChange={(e) => setHeight(e.target.value)} />
          </div>
        </div>

        {/* Alt Text */}
        <label style={S.label}>Alt Text (for accessibility)</label>
        <input
          style={S.input}
          type="text"
          placeholder="Describe the image for screen readers"
          value={alt}
          onChange={(e) => setAlt(e.target.value)}
        />

        {/* Title */}
        <label style={S.label}>Title (tooltip on hover)</label>
        <input
          style={S.input}
          type="text"
          placeholder="Optional tooltip text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        {/* Description */}
        <label style={S.label}>Description</label>
        <input
          style={S.input}
          type="text"
          placeholder="Optional image description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <hr style={S.hr} />

        {/* Upload */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <button type="button" style={S.uploadBtn} onClick={onPickFile}>Upload from device</button>
          <span style={S.muted}>— or paste a URL above</span>
          <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={onFileChange} />
        </div>

        {/* Preview */}
        {preview && <img src={preview} alt="preview" style={S.preview} />}

        {/* Buttons */}
        <div style={S.btnRow}>
          {mode === "edit" && imgRef.current && (
            <button
              type="button"
              style={S.btn("default")}
              onClick={() => {
                const el = imgRef.current;
                if (el && editorEl?.current?.contains(el)) {
                  el.remove();
                  refreshHTML && refreshHTML();
                  setShow(false);
                  reset();
                }
              }}
            >
              Remove Image
            </button>
          )}
          <div>
            <button type="button" style={S.btn("default")} onClick={() => { setShow(false); reset(); }}>Cancel</button>{" "}
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
      <ToolbarButton title="Insert/Edit Image" onMouseDown={(e)=>{ saveSelection(); e.preventDefault(); }} onClick={openModal}>
        {icons.image}
      </ToolbarButton>
      {Modal}
    </div>
  );
}




// //   previosus code
// "use client";
// import React, { useRef, useState, useEffect } from "react";
// import { createPortal } from "react-dom";
// import { useEditor } from "./ctx";
// import ToolbarButton from "./ToolbarButton";

// export default function ImageGroup() {
//   const { icons, saveSelection, insertHTML, editorEl, refreshHTML } = useEditor();
//   const [show, setShow] = useState(false);
//   const [mounted, setMounted] = useState(false); // for portal
//   const [mode, setMode] = useState("insert"); // insert | edit
//   const [url, setUrl] = useState("");
//   const [width, setWidth] = useState("");
//   const [height, setHeight] = useState("");
//   const [preview, setPreview] = useState("");
//   const imgRef = useRef(null);
//   const fileRef = useRef(null);

//   useEffect(() => setMounted(true), []);

//   // Open ImageGroup modal from context menu (right-click)
// useEffect(() => {
//   const onEdit = (e) => {
//     const img = e.detail?.img;
//     const root = editorEl?.current;
//     if (!img || !root || !root.contains(img)) return;

//     imgRef.current = img;
//     setMode("edit");
//     const src = img.getAttribute("src") || "";
//     const style = img.getAttribute("style") || "";
//     const wMatch = style.match(/width:\s*(\d+)px/i);
//     const hMatch = style.match(/height:\s*(\d+)px/i);
//     const wVal = wMatch ? wMatch[1] : img.getAttribute("width") || "";
//     const hVal = hMatch ? hMatch[1] : img.getAttribute("height") || "";

//     setUrl(src);
//     setPreview(src);
//     setWidth(wVal);
//     setHeight(hVal);
//     setShow(true);
//   };

//   window.addEventListener("rte:image-edit", onEdit);
//   return () => window.removeEventListener("rte:image-edit", onEdit);
// }, [editorEl]);


//   const reset = () => {
//     setUrl(""); setWidth(""); setHeight(""); setPreview("");
//     imgRef.current = null; setMode("insert");
//   };

//   // Detect if caret is on an <img>
//   const getSelectedImg = () => {
//     const root = editorEl?.current;
//     if (!root) return null;
//     const sel = window.getSelection();
//     if (!sel || sel.rangeCount === 0) return null;
//     let node = sel.anchorNode;
//     if (!node) return null;
//     if (node.nodeType === 3) node = node.parentElement;
//     if (!(node instanceof Element)) return null;
//     const img = node.closest("img");
//     return img && root.contains(img) ? img : null;
//   };

//   const openModal = (e) => {
//     saveSelection();
//     e.preventDefault();

//     const img = getSelectedImg();
//     if (img) {
//       imgRef.current = img;
//       setMode("edit");
//       setUrl(img.getAttribute("src") || "");
//       const style = img.getAttribute("style") || "";
//       const wMatch = style.match(/width:\s*(\d+)px/i);
//       const hMatch = style.match(/height:\s*(\d+)px/i);
//       const wVal = wMatch ? wMatch[1] : img.getAttribute("width") || "";
//       const hVal = hMatch ? hMatch[1] : img.getAttribute("height") || "";
//       setWidth(wVal);
//       setHeight(hVal);
//       setPreview(img.getAttribute("src") || "");
//     } else {
//       reset();
//     }

//     setShow(true);
//   };

//   // ESC closes, Ctrl/Cmd+Enter confirms
//   useEffect(() => {
//     if (!show) return;
//     const onKey = (e) => {
//       if (e.key === "Escape") { setShow(false); reset(); }
//       if ((e.ctrlKey || e.metaKey) && e.key === "Enter") handleConfirm();
//     };
//     document.addEventListener("keydown", onKey);
//     return () => document.removeEventListener("keydown", onKey);
//   }, [show, url, width, height]);

//   const handleConfirm = () => {
//     const src = (url || "").trim();
//     if (!src) { alert("Please provide an image URL or upload a file."); return; }

//     const w = width  ? `width:${parseInt(width, 10)}px;`  : "";
//     const h = height ? `height:${parseInt(height, 10)}px;` : "";
//     const style = `max-width:100%;${w}${h}`;

//     if (mode === "edit" && imgRef.current) {
//       const img = imgRef.current;
//       img.setAttribute("src", src);
//       img.setAttribute("style", style);
//       if (width) img.setAttribute("width", width); else img.removeAttribute("width");
//       if (height) img.setAttribute("height", height); else img.removeAttribute("height");
//       refreshHTML && refreshHTML();
//     } else {
//       insertHTML(
//         `<img src="${src}" alt="" style="${style}" ${width?`width="${width}"`:''} ${height?`height="${height}"`:''} />`
//       );
//     }
//     setShow(false);
//     reset();
//   };

//   const onPickFile = () => fileRef.current?.click();
//   const onFileChange = (e) => {
//     const file = e.target.files?.[0];
//     e.target.value = "";
//     if (!file) return;
//     if (!/^image\//.test(file.type)) { alert("Please select an image file."); return; }
//     const reader = new FileReader();
//     reader.onload = () => {
//       const dataUrl = String(reader.result);
//       setUrl(dataUrl);
//       setPreview(dataUrl);
//     };
//     reader.readAsDataURL(file);
//   };

//   /* ---------- Styles ---------- */
//   const S = {
//     wrap: { display: "flex", alignItems: "center", gap: 16 },
//     overlay: {
//       position: "fixed",         // ✅ fixed to viewport
//       inset: 0,                  // top:0 right:0 bottom:0 left:0
//       background: "rgba(0,0,0,0.25)",
//       display: "flex",
//       justifyContent: "center",
//       alignItems: "flex-start",
//       paddingTop: 64,            // push down under toolbar
//       zIndex: 99999,             // ✅ topmost
//     },
//     box: {
//       background: "#fff",
//       borderRadius: 12,
//       padding: 24,
//       width: "500px",            // ✅ strict width
//       maxWidth: "90vw",
//       boxShadow: "0 10px 25px rgba(0,0,0,0.25)",
//     },
//     title: { margin: "0 0 10px", fontSize: 17, fontWeight: 600 },
//     label: { fontSize: 13, fontWeight: 500, color: "#374151", marginBottom: 4 },
//     input: {
//       width: "100%", padding: "6px 8px", fontSize: 14, marginBottom: 10,
//       border: "1px solid #e5e7eb", borderRadius: 6, outline: "none",
//     },
//     row: { display: "flex", gap: 10 },
//     col: { flex: 1 },
//     hr: { height: 1, background: "#eef2f7", border: "none", margin: "10px 0" },
//     muted: { fontSize: 12, color: "#6b7280", margin: "2px 0 8px" },
//     uploadBtn: { padding: "6px 10px", borderRadius: 6, border: "1px solid #e5e7eb", background: "#f9fafb", cursor: "pointer", fontSize: 14 },
//     preview: { maxWidth: "100%", maxHeight: 200, display: "block", margin: "10px 0 6px", borderRadius: 6, objectFit: "contain", background: "#f9fafb" },
//     btnRow: { display: "flex", justifyContent: "space-between", marginTop: 14 },
//     btn: (variant) => ({
//       padding: "6px 14px", borderRadius: 6, border: "none", cursor: "pointer",
//       background: variant === "primary" ? "#2563eb" : "#f3f4f6",
//       color: variant === "primary" ? "#fff" : "#111827", fontWeight: 500
//     }),
//   };

//   // Modal element (portaled to body so it always sits on top)
//   const Modal = show && mounted ? createPortal(
//     <div style={S.overlay} onClick={() => { setShow(false); reset(); }}>
//       <div style={S.box} onClick={(e) => e.stopPropagation()}>
//         <h3 style={S.title}>{mode === "edit" ? "Edit Image" : "Insert Image"}</h3>

//         {/* URL */}
//         <label style={S.label}>Image URL</label>
//         <input
//           style={S.input}
//           type="text"
//           placeholder="https://example.com/image.jpg"
//           value={url}
//           onChange={(e) => { setUrl(e.target.value); setPreview(e.target.value); }}
//         />

//         {/* Dimensions */}
//         <div style={S.row}>
//           <div style={S.col}>
//             <label style={S.label}>Width (px)</label>
//             <input style={S.input} type="number" placeholder="auto" value={width} onChange={(e) => setWidth(e.target.value)} />
//           </div>
//           <div style={S.col}>
//             <label style={S.label}>Height (px)</label>
//             <input style={S.input} type="number" placeholder="auto" value={height} onChange={(e) => setHeight(e.target.value)} />
//           </div>
//         </div>

//         <hr style={S.hr} />

//         {/* Upload */}
//         <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
//           <button type="button" style={S.uploadBtn} onClick={onPickFile}>Upload from device</button>
//           <span style={S.muted}>— or paste a URL above</span>
//           <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={onFileChange} />
//         </div>

//         {/* Preview */}
//         {preview && <img src={preview} alt="preview" style={S.preview} />}

//         {/* Buttons */}
//         <div style={S.btnRow}>
//           {mode === "edit" && imgRef.current && (
//             <button
//               type="button"
//               style={S.btn("default")}
//               onClick={() => {
//                 const el = imgRef.current;
//                 if (el && editorEl?.current?.contains(el)) {
//                   el.remove();
//                   refreshHTML && refreshHTML();
//                   setShow(false);
//                   reset();
//                 }
//               }}
//             >
//               Remove Image
//             </button>
//           )}
//           <div>
//             <button type="button" style={S.btn("default")} onClick={() => { setShow(false); reset(); }}>Cancel</button>{" "}
//             <button type="button" style={S.btn("primary")} onClick={handleConfirm}>
//               {mode === "edit" ? "Update" : "Insert"}
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>,
//     document.body
//   ) : null;

//   return (
//     <div style={S.wrap}>
//       <ToolbarButton title="Insert/Edit Image" onMouseDown={(e)=>{ saveSelection(); e.preventDefault(); }} onClick={openModal}>
//         {icons.image}
//       </ToolbarButton>
//       {Modal}
//     </div>
//   );
// }


