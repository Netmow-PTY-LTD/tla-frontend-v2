'use client';
import React, { useState } from 'react';
import ToolbarButton from './ToolbarButton';
import { useEditor } from './ctx';

export default function CleanGroup() {
  const { editorEl, saveSelection, refreshHTML } = useEditor();
  const [open, setOpen] = useState(false);

  const hold = (e) => {
    saveSelection();
    e.preventDefault();
  };

  // Utilities
  const getWorkRoot = () => {
    const root = editorEl?.current;
    if (!root) return null;

    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return root;

    const range = sel.getRangeAt(0);
    if (range.collapsed) return root; // nothing selected -> clean all

    // Use the smallest shared ancestor inside the editor
    let ancestor = range.commonAncestorContainer;
    if (ancestor.nodeType === 3) ancestor = ancestor.parentNode;
    return root.contains(ancestor) ? ancestor : root;
  };

  const elementIntersectsSelection = (el, selRange) => {
    // Quick accept if selection is collapsed (handled earlier)
    const r = document.createRange();
    try {
      r.selectNodeContents(el);
    } catch {
      return false;
    }
    // If either range intersects, they’re not disjoint
    return !(
      r.compareBoundaryPoints(Range.END_TO_START, selRange) <= 0 ||
      r.compareBoundaryPoints(Range.START_TO_END, selRange) >= 0
    );
  };

  const walkElements = (root, fn) => {
    const tw = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT, null);
    let node = tw.currentNode;
    while (node) {
      const current = node;
      node = tw.nextNode();
      fn(current);
    }
  };

  const stripClassStyle = (root, onlyInSelection) => {
    const sel = window.getSelection();
    const selRange = sel && sel.rangeCount ? sel.getRangeAt(0) : null;

    // walkElements(root, (el) => {
    //   if (onlyInSelection && selRange && !elementIntersectsSelection(el, selRange)) return;
    //   el.removeAttribute("class");
    //   el.removeAttribute("style");
    // });

    walkElements(root, (el) => {
      // Skip cleaning if this element has the 'rte' class
      if (el.classList.contains('rte')) return;

      if (
        onlyInSelection &&
        selRange &&
        !elementIntersectsSelection(el, selRange)
      )
        return;

      el.removeAttribute('class');
      el.removeAttribute('style');
    });
  };

  const stripAllAttributes = (root, onlyInSelection) => {
    const sel = window.getSelection();
    const selRange = sel && sel.rangeCount ? sel.getRangeAt(0) : null;

    walkElements(root, (el) => {
      if (
        onlyInSelection &&
        selRange &&
        !elementIntersectsSelection(el, selRange)
      )
        return;

      // Recreate element with no attributes but same tag name & children
      const clean = document.createElement(el.tagName);
      // Move children
      while (el.firstChild) clean.appendChild(el.firstChild);
      el.replaceWith(clean);
    });
  };

  const doClean = (mode) => {
    const root = editorEl?.current;
    if (!root) return;

    const sel = window.getSelection();
    const selected = sel && sel.rangeCount && !sel.getRangeAt(0).collapsed;

    const targetRoot = getWorkRoot();

    if (mode === 'inline') {
      // remove class/style
      stripClassStyle(targetRoot, selected);
    } else if (mode === 'deep') {
      // remove ALL attributes
      stripAllAttributes(targetRoot, selected);
    }

    refreshHTML?.();
    setOpen(false);
  };

  const S = {
    wrap: {
      position: 'relative',
      display: 'inline-flex',
      alignItems: 'center',
    },
    menu: {
      position: 'absolute',
      top: 'cal(100%)',
      right: 0,
      marginTop: 6,
      background: '#fff',
      border: '1px solid #e5e7eb',
      borderRadius: 10,
      boxShadow: '0 10px 20px rgba(0,0,0,0.06)',
      overflow: 'hidden',
      zIndex: 10000,
      minWidth: 220,
    },
    item: {
      padding: '8px 12px',
      fontSize: 14,
      cursor: 'pointer',
      whiteSpace: 'nowrap',
    },
    danger: { color: '#b91c1c' },
  };

  // Simple broom icon
  const Icon = (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M3 21h6l7-7a4 4 0 10-6-6L3 15v6z" />
      <path d="M14 7l3 3" />
    </svg>
  );

  const Item = ({ children, onClick, danger }) => (
    <div
      style={{ ...S.item, ...(danger ? S.danger : null) }}
      onMouseDown={hold}
      onClick={onClick}
      onMouseEnter={(e) => (e.currentTarget.style.background = '#f8fafc')}
      onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
    >
      {children}
    </div>
  );

  return (
    <div style={S.wrap} onMouseLeave={() => setOpen(false)}>
      <ToolbarButton
        title="Clean / Reset"
        onMouseDown={hold}
        onClick={() => setOpen((s) => !s)}
      >
        {Icon}
      </ToolbarButton>

      {open && (
        <div style={S.menu}>
          <Item onClick={() => doClean('inline')}>
            Strip <strong>class</strong> &amp; <strong>style</strong> (selection
            or all)
          </Item>
          <Item onClick={() => doClean('deep')} danger>
            Deep Clean — remove <strong>all attributes</strong>
          </Item>
        </div>
      )}
    </div>
  );
}
