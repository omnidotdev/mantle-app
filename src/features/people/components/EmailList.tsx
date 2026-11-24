import { Input } from "@omnidotdev/thornberry/input";
import { Plus, X } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";

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
          aria-label="Add email address"
          className="min-w-0 flex-1"
        />
        <Button
          variant="outline"
          onClick={addEmail}
          disabled={!input.trim() || !EMAIL_REGEX.test(input.trim())}
        >
          <Plus />
          Add
        </Button>
      </div>

      {emails.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {emails.map((email, index) => (
            <span
              key={email}
              className="inline-flex max-w-full items-center gap-1 rounded-full bg-foreground/6 px-3 py-1 text-foreground text-sm"
            >
              <span className="truncate">{email}</span>
              <button
                type="button"
                onClick={() => removeEmail(index)}
                className="text-muted-foreground hover:text-foreground"
                aria-label={`Remove ${email}`}
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
