'use client';
import React, {
  useId,
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from 'react';
import SimpleHtmlEditorNoDeps from './SimpleHtmlEditorNoDeps';

const EditorField = forwardRef(function EditorField(
  {
    name = 'content',
    value,
    defaultValue = '<p></p>',
    onChange,
    label,
    placeholder = 'Type here…',
    height = 420,
    required = false,
    disabled = false,
  },
  ref
) {
  const htmlId = useId();
  const controlled = value !== undefined;
  const [localHtml, setLocalHtml] = useState(controlled ? value : defaultValue);

  useEffect(() => {
    if (controlled) setLocalHtml(value);
  }, [controlled, value]);

  const handleChange = (next) => {
    if (!controlled) setLocalHtml(next);
    onChange?.(next);
  };

  useImperativeHandle(ref, () => ({
    getHTML: () => (controlled ? value : localHtml),
    setHTML: (h) => (controlled ? onChange?.(h) : setLocalHtml(h)),
    clear: () => (controlled ? onChange?.('<p></p>') : setLocalHtml('<p></p>')),
  }));

  return (
    <div style={{ display: 'grid', gap: 8 }}>
      {label && (
        <label
          htmlFor={htmlId}
          style={{ fontSize: 14, color: '#374151', fontWeight: 600 }}
        >
          {label}{' '}
          {required ? <span style={{ color: '#ef4444' }}>*</span> : null}
        </label>
      )}

      <SimpleHtmlEditorNoDeps
        initialHTML={localHtml}
        onChange={handleChange}
        placeholder={placeholder}
        height={height}
        readOnly={disabled}
      />

      <input
        id={htmlId}
        type="hidden"
        name={name}
        value={controlled ? value : localHtml}
        readOnly
      />
    </div>
  );
});

export default EditorField;
