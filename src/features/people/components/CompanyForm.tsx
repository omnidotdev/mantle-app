import { Input } from "@omnidotdev/thornberry/input";
import { Label } from "@omnidotdev/thornberry/label";
import { Textarea } from "@omnidotdev/thornberry/textarea";

import SectionCard from "@/components/core/SectionCard";
import { PhoneInput } from "@/components/ui/phone-input";
import { resolveRegion } from "@/lib/phone";

import type { Company } from "@/features/people/types";

interface CompanyFormProps {
  company: Partial<Company>;
  onCompanyChange: (company: Partial<Company>) => void;
}

/** Company fields grouped into section cards. Save and cancel live in the page header */
const CompanyForm = ({ company, onCompanyChange }: CompanyFormProps) => {
  const handleChange = (field: keyof Company, value: string | null) => {
    onCompanyChange({ ...company, [field]: value });
  };

  return (
    <div className="space-y-5">
      <SectionCard title="Details">
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
      </SectionCard>

      <SectionCard title="Address">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="company-address1">Address line 1</Label>
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
            <Label htmlFor="company-address2">Address line 2</Label>
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
            <Label htmlFor="company-postal">Postal code</Label>
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
      </SectionCard>

      <SectionCard title="Notes">
        <Label htmlFor="company-notes" className="sr-only">
          Notes
        </Label>
        <Textarea
          id="company-notes"
          value={company.notes ?? ""}
          onChange={(e) => handleChange("notes", e.target.value || null)}
          rows={3}
          placeholder="Additional notes about this company"
        />
      </SectionCard>
    </div>
  );
};

export default CompanyForm;
