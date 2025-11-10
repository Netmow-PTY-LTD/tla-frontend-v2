"use client";
import React, { createContext, useContext } from "react";

const EditorCtx = createContext(null);

export function EditorProvider({ value, children }) {
  return <EditorCtx.Provider value={value}>{children}</EditorCtx.Provider>;
}

export function useEditor() {
  const ctx = useContext(EditorCtx);
  if (!ctx) throw new Error("useEditor must be used inside <EditorProvider>");
  return ctx; // { actions, icons, saveSelection }
}
