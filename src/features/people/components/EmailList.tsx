import { Plus, X } from "lucide-react";
import { useState } from "react";

import { Input } from "@/components/ui/input";

interface EmailListProps {
  emails: string[];
  onChange: (emails: string[]) => void;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const EmailList = ({ emails, onChange }: EmailListProps) => {
  const [input, setInput] = useState("");

  const addEmail = () => {
    const normalized = input.trim().toLowerCase();
    if (
      !normalized ||
      !EMAIL_REGEX.test(normalized) ||
      emails.includes(normalized)
    )
      return;
    onChange([...emails, normalized]);
    setInput("");
  };

  const removeEmail = (index: number) => {
    onChange(emails.filter((_, i) => i !== index));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addEmail();
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <Input
          type="email"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="email@example.com"
          className="flex-1"
        />
        <button
          type="button"
          onClick={addEmail}
          disabled={!input.trim() || !EMAIL_REGEX.test(input.trim())}
          className="flex items-center gap-1 rounded-lg bg-teal-600 px-3 py-2 text-sm text-white hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Plus size={14} />
          Add
        </button>
      </div>

      {emails.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {emails.map((email, index) => (
            <span
              key={email}
              className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 text-gray-700 text-sm"
            >
              {email}
              <button
                type="button"
                onClick={() => removeEmail(index)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={14} />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default EmailList;
