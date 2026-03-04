import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import EmailList from "./EmailList";
import TagList from "./TagList";

import type { Person } from "@/features/people/types";

interface ContactFormProps {
  person: Partial<Person>;
  onPersonChange: (person: Partial<Person>) => void;
  onSave: () => void;
  onCancel: () => void;
  saving?: boolean;
}

const ContactForm = ({
  person,
  onPersonChange,
  onSave,
  onCancel,
  saving,
}: ContactFormProps) => {
  const handleChange = (
    field: keyof Person,
    value: string | string[] | boolean | null,
  ) => {
    onPersonChange({ ...person, [field]: value });
  };

  const isValid = person.firstName?.trim() && person.lastName?.trim();

  return (
    <div className="space-y-6">
      {/* Basic information */}
      <div className="space-y-4">
        <h3 className="font-medium text-foreground text-lg">
          Basic Information
        </h3>

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
            <Label htmlFor="contact-phone">Phone</Label>
            <Input
              id="contact-phone"
              type="tel"
              value={person.phone ?? ""}
              onChange={(e) => handleChange("phone", e.target.value || null)}
              placeholder="(555) 555-5555"
            />
          </div>

          <div className="flex items-center gap-3 self-end pb-1">
            <Switch
              id="contact-internal"
              checked={person.internal ?? false}
              onCheckedChange={(checked) => handleChange("internal", checked)}
            />
            <Label htmlFor="contact-internal">Internal team member</Label>
          </div>
        </div>
      </div>

      {/* Emails */}
      <div className="space-y-4">
        <h3 className="font-medium text-foreground text-lg">Email Addresses</h3>
        <EmailList
          emails={person.emails ?? []}
          onChange={(emails) => handleChange("emails", emails)}
        />
      </div>

      {/* Tags */}
      <div className="space-y-4">
        <h3 className="font-medium text-foreground text-lg">Tags</h3>
        <TagList
          tags={person.tags ?? []}
          onChange={(tags) =>
            handleChange("tags", tags.length > 0 ? tags : null)
          }
        />
      </div>

      {/* Notes */}
      <div className="space-y-4">
        <Label htmlFor="contact-notes">Notes</Label>
        <Textarea
          id="contact-notes"
          value={person.notes ?? ""}
          onChange={(e) => handleChange("notes", e.target.value || null)}
          rows={3}
          placeholder="Additional notes about this contact"
        />
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-2 border-border border-t pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg border border-input px-4 py-2 hover:bg-muted"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={onSave}
          disabled={!isValid || saving}
          className="rounded-lg bg-primary px-4 py-2 text-white hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default ContactForm;
