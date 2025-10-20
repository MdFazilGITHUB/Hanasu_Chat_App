import { useRef, useState } from "react";

export function AutoResizeTextarea({ value, onChange, onKeyDown, ...props }) {
  const textareaRef = useRef(null);

  // Adjust height based on scrollHeight, but clamp to 3 rows
  const handleInput = (e) => {
    const textarea = textareaRef.current;
    textarea.style.height = "auto"; // Reset to shrink if needed
    const maxHeight = 3 * 24; // 3 rows * line-height (adjust if you use larger font)
    textarea.style.height = Math.min(textarea.scrollHeight, maxHeight) + "px";
    if (onChange) onChange(e); // Pass event up
  };

  return (
    <textarea
      ref={textareaRef}
      value={value}
      onChange={handleInput}
      onInput={handleInput}
      onKeyDown={onKeyDown}
      rows={1}
      style={{ maxHeight: 3 * 24, minHeight: 24 }} // adjust 24 to your line-height px
      className="w-full input input-bordered rounded-lg input-sm sm:input-md focus:outline-none resize-none overflow-y-auto py-2 leading-normal"
      placeholder="Type a message..."
      {...props}
    />
  );
}
