import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { COMMON_TAGS } from "@/features/people/types";

import type { Person } from "@/features/people/types";

interface ContactFormProps {
  person: Partial<Person>;
  onPersonChange: (person: Partial<Person>) => void;
  onSave: () => void;
  onCancel: () => void;
}

const ContactForm = ({
  person,
  onPersonChange,
  onSave,
  onCancel,
}: ContactFormProps) => {
  const handleChange = (
    field: keyof Person,
    value: string | string[] | null,
  ) => {
    onPersonChange({ ...person, [field]: value });
  };

  const toggleTag = (tag: string) => {
    const currentTags = person.tags ?? [];
    const hasTag = currentTags.includes(tag);
    const updatedTags = hasTag
      ? currentTags.filter((t) => t !== tag)
      : [...currentTags, tag];

    handleChange("tags", updatedTags.length > 0 ? updatedTags : null);
  };

  const isValid = person.firstName?.trim() && person.lastName?.trim();

  return (
    <div className="space-y-6">
      {/* Basic information */}
      <div className="space-y-4">
        <h3 className="font-medium text-gray-700 text-lg">Basic Information</h3>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="contact-first-name">First Name *</Label>
            <Input
              id="contact-first-name"
              value={person.firstName ?? ""}
              onChange={(e) => handleChange("firstName", e.target.value)}
              placeholder="First name"
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="contact-last-name">Last Name *</Label>
            <Input
              id="contact-last-name"
              value={person.lastName ?? ""}
              onChange={(e) => handleChange("lastName", e.target.value)}
              placeholder="Last name"
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="contact-email">Email</Label>
            <Input
              id="contact-email"
              type="email"
              value={person.email ?? ""}
              onChange={(e) => handleChange("email", e.target.value || null)}
              placeholder="email@example.com"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="contact-phone">Phone</Label>
            <Input
              id="contact-phone"
              type="tel"
              value={person.phone ?? ""}
              onChange={(e) => handleChange("phone", e.target.value || null)}
              placeholder="(555) 555-5555"
            />
          </div>
        </div>
      </div>

      {/* Tags */}
      <div className="space-y-4">
        <h3 className="font-medium text-gray-700 text-lg">Tags</h3>
        <div className="flex flex-wrap gap-2">
          {COMMON_TAGS.map((tag) => {
            const isActive = (person.tags ?? []).includes(tag);

            return (
              <button key={tag} type="button" onClick={() => toggleTag(tag)}>
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
      </div>

      {/* Notes */}
      <div className="space-y-4">
        <h3 className="font-medium text-gray-700 text-lg">Notes</h3>
        <Textarea
          value={person.notes ?? ""}
          onChange={(e) => handleChange("notes", e.target.value || null)}
          rows={3}
          placeholder="Additional notes about this contact"
        />
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-2 border-gray-200 border-t pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg border border-gray-300 px-4 py-2 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={onSave}
          disabled={!isValid}
          className="rounded-lg bg-teal-600 px-4 py-2 text-white hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default ContactForm;
