import { Input } from "@omnidotdev/thornberry/input";
import { Plus, X } from "lucide-react";
import { useState } from "react";

interface BulletListEditorProps {
  items: string[];
  onChange: (items: string[]) => void;
  placeholder?: string;
  addLabel?: string;
}

const BulletListEditor = ({
  items,
  onChange,
  placeholder = "Add an item",
  addLabel = "Add",
}: BulletListEditorProps) => {
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

  const handleKeyDown = (e: React.KeyboardEvent) => {
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
          className="flex-1"
        />
        <button
          type="button"
          onClick={addItem}
          disabled={!input.trim()}
          className="flex items-center gap-1 rounded-lg bg-primary px-3 py-2 text-sm text-white hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Plus size={14} />
          {addLabel}
        </button>
      </div>

      {items.length > 0 && (
        <ul className="space-y-1">
          {items.map((item, index) => (
            <li
              key={`bullet-${index}`}
              className="flex items-center justify-between rounded bg-muted px-3 py-2 text-foreground text-sm"
            >
              <span>{item}</span>
              <button
                type="button"
                onClick={() => removeItem(index)}
                className="text-muted-foreground hover:text-destructive"
                aria-label="Remove item"
              >
                <X size={14} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default BulletListEditor;
