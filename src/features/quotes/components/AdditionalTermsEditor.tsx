import { Plus, X } from "lucide-react";
import { useState } from "react";

import { Input } from "@/components/ui/input";

interface AdditionalTermsEditorProps {
  terms: string[];
  onChange: (terms: string[]) => void;
}

const AdditionalTermsEditor = ({
  terms,
  onChange,
}: AdditionalTermsEditorProps) => {
  const [input, setInput] = useState("");

  const addTerm = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    onChange([...terms, trimmed]);
    setInput("");
  };

  const removeTerm = (index: number) => {
    onChange(terms.filter((_, i) => i !== index));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTerm();
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Add a term or condition"
          aria-label="Add additional term"
          className="flex-1"
        />
        <button
          type="button"
          onClick={addTerm}
          disabled={!input.trim()}
          className="flex items-center gap-1 rounded-lg bg-teal-600 px-3 py-2 text-sm text-white hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Plus size={14} />
          Add
        </button>
      </div>

      {terms.length > 0 && (
        <ul className="space-y-1">
          {terms.map((term, index) => (
            <li
              key={`term-${index}`}
              className="flex items-center justify-between rounded bg-gray-50 px-3 py-2 text-gray-700 text-sm"
            >
              <span>{term}</span>
              <button
                type="button"
                onClick={() => removeTerm(index)}
                className="text-gray-400 hover:text-red-500"
                aria-label="Remove term"
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

export default AdditionalTermsEditor;
