import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PhoneInput } from "@/components/ui/phone-input";
import { Textarea } from "@/components/ui/textarea";
import { resolveRegion } from "@/lib/phone";

import type { Company } from "@/features/people/types";

interface CompanyFormProps {
  company: Partial<Company>;
  onCompanyChange: (company: Partial<Company>) => void;
  onSave: () => void;
  onCancel: () => void;
  saving?: boolean;
}

const CompanyForm = ({
  company,
  onCompanyChange,
  onSave,
  onCancel,
  saving,
}: CompanyFormProps) => {
  const handleChange = (field: keyof Company, value: string | null) => {
    onCompanyChange({ ...company, [field]: value });
  };

  return (
    <div className="space-y-6">
      {/* Basic information */}
      <div className="space-y-4">
        <h3 className="font-medium text-foreground text-lg">
          Basic Information
        </h3>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="company-name">Name *</Label>
            <Input
              id="company-name"
              value={company.name ?? ""}
              onChange={(e) => handleChange("name", e.target.value)}
              placeholder="Company name"
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="company-website">Website</Label>
            <Input
              id="company-website"
              value={company.website ?? ""}
              onChange={(e) => handleChange("website", e.target.value || null)}
              placeholder="https://example.com"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="company-industry">Industry</Label>
            <Input
              id="company-industry"
              value={company.industry ?? ""}
              onChange={(e) => handleChange("industry", e.target.value || null)}
              placeholder="e.g. Technology"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="company-phone">Phone</Label>
            <PhoneInput
              id="company-phone"
              value={company.phone ?? null}
              onChange={(phone) => handleChange("phone", phone)}
              region={resolveRegion(company.country)}
              placeholder="(555) 555-5555"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="company-email">Email</Label>
            <Input
              id="company-email"
              type="email"
              value={company.email ?? ""}
              onChange={(e) => handleChange("email", e.target.value || null)}
              placeholder="contact@example.com"
            />
          </div>
        </div>
      </div>

      {/* Address */}
      <div className="space-y-4">
        <h3 className="font-medium text-foreground text-lg">Address</h3>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="company-address1">Address Line 1</Label>
            <Input
              id="company-address1"
              value={company.addressLine1 ?? ""}
              onChange={(e) =>
                handleChange("addressLine1", e.target.value || null)
              }
              placeholder="123 Main St"
            />
          </div>

          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="company-address2">Address Line 2</Label>
            <Input
              id="company-address2"
              value={company.addressLine2 ?? ""}
              onChange={(e) =>
                handleChange("addressLine2", e.target.value || null)
              }
              placeholder="Suite 100"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="company-city">City</Label>
            <Input
              id="company-city"
              value={company.city ?? ""}
              onChange={(e) => handleChange("city", e.target.value || null)}
              placeholder="City"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="company-state">State</Label>
            <Input
              id="company-state"
              value={company.state ?? ""}
              onChange={(e) => handleChange("state", e.target.value || null)}
              placeholder="State"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="company-postal">Postal Code</Label>
            <Input
              id="company-postal"
              value={company.postalCode ?? ""}
              onChange={(e) =>
                handleChange("postalCode", e.target.value || null)
              }
              placeholder="12345"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="company-country">Country</Label>
            <Input
              id="company-country"
              value={company.country ?? ""}
              onChange={(e) => handleChange("country", e.target.value || null)}
              placeholder="Country"
            />
          </div>
        </div>
      </div>

      {/* Notes */}
      <div className="space-y-4">
        <Label htmlFor="company-notes">Notes</Label>
        <Textarea
          id="company-notes"
          value={company.notes ?? ""}
          onChange={(e) => handleChange("notes", e.target.value || null)}
          rows={3}
          placeholder="Additional notes about this company"
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
          disabled={!company.name?.trim() || saving}
          className="rounded-lg bg-primary px-4 py-2 text-white hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default CompanyForm;
