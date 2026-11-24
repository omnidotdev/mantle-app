import SectionCard from "@/components/core/SectionCard";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PhoneInput } from "@/components/ui/phone-input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import EmailList from "./EmailList";
import TagList from "./TagList";

import type { Person } from "@/features/people/types";

interface ContactFormProps {
  person: Partial<Person>;
  onPersonChange: (person: Partial<Person>) => void;
}

/** Contact fields grouped into section cards. Save and cancel live in the page header */
const ContactForm = ({ person, onPersonChange }: ContactFormProps) => {
  const handleChange = (
    field: keyof Person,
    value: string | string[] | boolean | null,
  ) => {
    onPersonChange({ ...person, [field]: value });
  };

  return (
    <div className="space-y-5">
      <SectionCard title="Details">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="contact-first-name">First name *</Label>
            <Input
              id="contact-first-name"
              value={person.firstName ?? ""}
              onChange={(e) => handleChange("firstName", e.target.value)}
              placeholder="First name"
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="contact-last-name">Last name *</Label>
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
            <PhoneInput
              id="contact-phone"
              value={person.phone ?? null}
              onChange={(phone) => handleChange("phone", phone)}
              placeholder="(555) 555-5555"
            />
          </div>

          <div className="flex items-center justify-between gap-3 rounded-xl border border-border px-3 py-2 sm:self-end">
            <Label htmlFor="contact-internal">Internal team member</Label>
            <Switch
              id="contact-internal"
              checked={person.internal ?? false}
              onCheckedChange={(checked) => handleChange("internal", checked)}
            />
          </div>
        </div>
      </SectionCard>

      <SectionCard title="Email addresses">
        <EmailList
          emails={person.emails ?? []}
          onChange={(emails) => handleChange("emails", emails)}
        />
      </SectionCard>

      <SectionCard title="Tags">
        <TagList
          tags={person.tags ?? []}
          onChange={(tags) =>
            handleChange("tags", tags.length > 0 ? tags : null)
          }
        />
      </SectionCard>

      <SectionCard title="Notes">
        <Label htmlFor="contact-notes" className="sr-only">
          Notes
        </Label>
        <Textarea
          id="contact-notes"
          value={person.notes ?? ""}
          onChange={(e) => handleChange("notes", e.target.value || null)}
          rows={3}
          placeholder="Additional notes about this contact"
        />
      </SectionCard>
    </div>
  );
};

export default ContactForm;
