'use client';

import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { useFormContext, useWatch } from 'react-hook-form';
import { Badge } from './ui/badge';

export default function MultipleTagsSelector({
  name,
  label,
  placeholder = 'Add item...',
}) {
  const { register, setValue, control } = useFormContext();
  const watchedTags = useWatch({ name, control }); // <-- watches form state
  const [inputValue, setInputValue] = useState('');
  const [tags, setTags] = useState(watchedTags || []);

  // Keep local `tags` in sync with form state
  useEffect(() => {
    if (Array.isArray(watchedTags)) {
      setTags(watchedTags);
    }
  }, [watchedTags]);

  const addTag = () => {
    const trimmed = inputValue.trim();
    if (trimmed && !tags.includes(trimmed)) {
      const newTags = [...tags, trimmed];
      setTags(newTags);
      setValue(name, newTags);
    }
    setInputValue('');
  };

  const removeTag = (tag) => {
    const newTags = tags.filter((t) => t !== tag);
    setTags(newTags);
    setValue(name, newTags);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag();
    }
  };

  return (
    <div className="w-full">
      <input type="hidden" {...register(name)} value={tags.join(',')} />
      {label && (
        <label htmlFor={name} className="mb-2 inline-block">
          {label}
        </label>
      )}
      <div className="flex flex-wrap gap-2 border rounded-lg p-2 bg-[#F2F2F2] min-h-[44px]">
        {tags.map((tag, idx) => (
          <Badge
            key={idx}
            variant="primary"
            className="flex items-center gap-1"
          >
            {tag}
            <button
              type="button"
              onClick={() => removeTag(tag)}
              className="ml-1 rounded-full hover:bg-red-500 hover:text-white p-0.5"
            >
              <X className="w-3 h-3" />
            </button>
          </Badge>
        ))}

        <input
          type="text"
          value={inputValue}
          placeholder={placeholder}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={addTag}
          className="flex-1 min-w-[120px] bg-transparent outline-none text-sm"
        />
      </div>
    </div>
  );
}
