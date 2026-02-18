"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { css } from "../../../styled-system/css";
import { flex } from "../../../styled-system/patterns";

interface TodoAddFormProps {
  onAdd: (title: string) => void;
}

export function TodoAddForm({ onAdd }: TodoAddFormProps) {
  const [title, setTitle] = useState("");

  const handleSubmit = () => {
    const trimmed = title.trim();
    if (!trimmed) return;
    onAdd(trimmed);
    setTitle("");
  };

  return (
    <div className={flex({ align: "center", gap: "2", mt: "3" })}>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
        placeholder="할 일 추가..."
        className={css({
          flex: 1,
          px: "3",
          py: "2",
          fontSize: "sm",
          border: "1px solid",
          borderColor: "gray.200",
          borderRadius: "md",
          outline: "none",
          _focus: { borderColor: "blue.400", ring: "2px", ringColor: "blue.100" },
          _placeholder: { color: "gray.400" },
        })}
      />
      <button
        onClick={handleSubmit}
        disabled={!title.trim()}
        className={css({
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          w: "8",
          h: "8",
          bg: "blue.500",
          color: "white",
          borderRadius: "md",
          cursor: "pointer",
          flexShrink: 0,
          _hover: { bg: "blue.600" },
          _disabled: { bg: "gray.300", cursor: "not-allowed" },
        })}
      >
        <Plus size={16} />
      </button>
    </div>
  );
}
