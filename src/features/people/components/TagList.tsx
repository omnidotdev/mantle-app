import { X } from "lucide-react";
import { useState } from "react";

import { Input } from "@/components/ui/input";
import { getTagChipClass } from "@/features/people/tagPalette";
import { COMMON_TAGS } from "@/features/people/types";
import cn from "@/lib/utils";
import TagChip from "./TagChip";

interface TagListProps {
  tags: string[];
  onChange: (tags: string[]) => void;
}

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
              className={cn(
                "inline-flex h-7 select-none items-center rounded-full border px-3 font-medium text-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                isActive
                  ? cn("border-transparent", getTagChipClass(tag))
                  : "border-input bg-card text-muted-foreground hover:bg-accent hover:text-foreground",
              )}
            >
              {tag}
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
        className="sm:max-w-xs"
      />

      {/* Active tags */}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <TagChip key={tag} tag={tag}>
              <button
                type="button"
                onClick={() => removeTag(tag)}
                className="-mr-1 rounded-full p-0.5 opacity-70 hover:opacity-100"
                aria-label={`Remove ${tag} tag`}
              >
                <X size={12} />
              </button>
            </TagChip>
          ))}
        </div>
      )}
    </div>
  );
};

export default TagList;
