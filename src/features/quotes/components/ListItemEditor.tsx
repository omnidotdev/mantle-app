import { PlusIcon, XIcon } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import type { KeyboardEvent } from "react";

interface ListItemEditorProps {
  items: string[];
  onChange: (items: string[]) => void;
  /** Placeholder for the add field */
  placeholder?: string;
  /** Accessible name for the add field (defaults to the placeholder) */
  inputLabel?: string;
  /** Accessible name for each remove button */
  removeLabel?: string;
}

/**
 * Editable list of short strings (deliverables, acceptance criteria,
 * additional terms): type and press Enter or "Add", remove with the x
 */
const ListItemEditor = ({
  items,
  onChange,
  placeholder = "Add an item",
  inputLabel,
  removeLabel = "Remove item",
}: ListItemEditorProps) => {
  const [input, setInput] = useState("");

  const addItem = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    onChange([...items, trimmed]);
    setInput("");
  };

  const removeItem = (index: number) => {
    onChange(items.filter((_, i) => i !== index));
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addItem();
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          aria-label={inputLabel ?? placeholder}
          className="min-w-0 flex-1"
        />
        <Button variant="outline" onClick={addItem} disabled={!input.trim()}>
          <PlusIcon />
          Add
        </Button>
      </div>

      {items.length > 0 && (
        <ul className="space-y-1">
          {items.map((item, index) => (
            <li
              // biome-ignore lint/suspicious/noArrayIndexKey: items are plain strings that may repeat
              key={`item-${index}`}
              className="flex items-center justify-between gap-2 rounded-lg bg-muted py-1 pr-1 pl-3 text-sm"
            >
              <span className="min-w-0 break-words">{item}</span>
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => removeItem(index)}
                className="text-muted-foreground hover:text-destructive"
                aria-label={removeLabel}
              >
                <XIcon />
              </Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ListItemEditor;
