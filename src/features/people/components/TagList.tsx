import { X } from "lucide-react";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { COMMON_TAGS } from "@/features/people/types";

interface TagListProps {
  tags: string[];
  onChange: (tags: string[]) => void;
}

const TAG_COLORS: Record<string, string> = {
  employee: "bg-blue-100 text-blue-700",
  client: "bg-purple-100 text-purple-700",
  prospect: "bg-yellow-100 text-yellow-700",
  active: "bg-green-100 text-green-700",
  inactive: "bg-gray-100 text-gray-600",
  contractor: "bg-orange-100 text-orange-700",
  leadership: "bg-indigo-100 text-indigo-700",
  engineering: "bg-cyan-100 text-cyan-700",
  design: "bg-pink-100 text-pink-700",
  research: "bg-emerald-100 text-emerald-700",
};

const TagList = ({ tags, onChange }: TagListProps) => {
  const [input, setInput] = useState("");

  const addTag = (tag: string) => {
    const normalized = tag.trim().toLowerCase();
    if (!normalized || tags.includes(normalized)) return;
    onChange([...tags, normalized]);
  };

  const removeTag = (tag: string) => {
    onChange(tags.filter((t) => t !== tag));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(input);
      setInput("");
    }
  };

  const togglePreset = (tag: string) => {
    if (tags.includes(tag)) {
      removeTag(tag);
    } else {
      addTag(tag);
    }
  };

  return (
    <div className="space-y-3">
      {/* Preset tags */}
      <div className="flex flex-wrap gap-2">
        {COMMON_TAGS.map((tag) => {
          const isActive = tags.includes(tag);
          return (
            <button
              key={tag}
              type="button"
              onClick={() => togglePreset(tag)}
              aria-pressed={isActive}
            >
              <Badge
                variant={isActive ? "solid" : "outline"}
                className="cursor-pointer select-none"
              >
                {tag}
              </Badge>
            </button>
          );
        })}
      </div>

      {/* Custom tag input */}
      <Input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Add custom tag (Enter or comma)"
        aria-label="Add custom tag"
        className="max-w-xs"
      />

      {/* Active tags */}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 font-medium text-xs ${TAG_COLORS[tag] ?? "bg-gray-100 text-gray-700"}`}
            >
              {tag}
              <button
                type="button"
                onClick={() => removeTag(tag)}
                className="opacity-60 hover:opacity-100"
                aria-label={`Remove ${tag} tag`}
              >
                <X size={12} />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default TagList;
