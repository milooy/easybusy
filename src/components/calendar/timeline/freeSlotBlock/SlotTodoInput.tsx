"use client";

import { useState, useRef } from "react";
import { Plus } from "lucide-react";
import { css } from "../../../../../styled-system/css";
import { flex } from "../../../../../styled-system/patterns";

interface SlotTodoInputProps {
  onAdd: (title: string) => void;
}

export function SlotTodoInput({ onAdd }: SlotTodoInputProps) {
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = () => {
    const trimmed = inputValue.trim();
    if (!trimmed) return;
    onAdd(trimmed);
    setInputValue("");
  };

  return (
    <div
      className={flex({
        align: "center",
        gap: "1",
        px: "2",
        pb: "1.5",
        mt: "auto",
        flexShrink: 0,
      })}
    >
      <input
        ref={inputRef}
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") handleSubmit();
          if (e.key === "Escape") {
            setInputValue("");
            inputRef.current?.blur();
          }
        }}
        placeholder="할 일 추가..."
        className={css({
          flex: 1,
          px: "1.5",
          py: "0.5",
          fontSize: "xs",
          bg: "transparent",
          border: "1px solid",
          borderColor: "yellow.300",
          borderRadius: "sm",
          outline: "none",
          color: "gray.700",
          _focus: { borderColor: "yellow.500", bg: "white" },
          _placeholder: { color: "yellow.400" },
        })}
      />
      <button
        onClick={handleSubmit}
        disabled={!inputValue.trim()}
        className={css({
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          w: "5",
          h: "5",
          bg: "yellow.400",
          color: "white",
          borderRadius: "sm",
          cursor: "pointer",
          flexShrink: 0,
          _hover: { bg: "yellow.500" },
          _disabled: { bg: "yellow.200", cursor: "not-allowed" },
        })}
      >
        <Plus size={12} />
      </button>
    </div>
  );
}
