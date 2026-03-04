import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSettingsStore } from "@/features/settings/store/settingsStore";

import type { OrganizationProfile } from "@/features/settings/types";

type FormState = Omit<OrganizationProfile, "id" | "createdAt" | "updatedAt">;

const SettingsPage = () => {
  const { organizationId } = Route.useRouteContext();
  const { createProfile, updateProfile, profiles } = useSettingsStore();
  const existing = useMemo(
    () =>
      organizationId
        ? profiles.find((p) => p.organizationId === organizationId)
        : undefined,
    [profiles, organizationId],
  );

  const defaultForm: FormState = {
    organizationId: organizationId ?? "",
    companyName: "",
    contactName: "",
    contactTitle: null,
    email: "",
    phone: null,
    website: null,
    addressLine1: null,
    addressLine2: null,
    city: null,
    state: null,
    postalCode: null,
    country: null,
    logoUrl: null,
    registrationState: null,
    invoiceAccentColor: null,
  };

  const [form, setForm] = useState<FormState>(defaultForm);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (existing) {
      setForm({
        organizationId: existing.organizationId,
        companyName: existing.companyName,
        contactName: existing.contactName,
        contactTitle: existing.contactTitle,
        email: existing.email,
        phone: existing.phone,
        website: existing.website,
        addressLine1: existing.addressLine1,
        addressLine2: existing.addressLine2,
        city: existing.city,
        state: existing.state,
        postalCode: existing.postalCode,
        country: existing.country,
        logoUrl: existing.logoUrl,
        registrationState: existing.registrationState,
        invoiceAccentColor: existing.invoiceAccentColor,
      });
    }
  }, [existing]);

  const handleChange = (field: keyof FormState, value: string | null) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setSaved(false);
  };

  const handleSave = () => {
    if (existing) {
      updateProfile(existing.id, form);
    } else {
      createProfile(form);
    }
    setSaved(true);
  };

  const isValid =
    form.companyName.trim() && form.contactName.trim() && form.email.trim();

  if (!organizationId) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-muted-foreground">
          Select an organization to view settings
        </p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-semibold text-xl">Organization Profile</h1>
          <p className="text-muted-foreground text-sm">
            Configure your company details for auto-filling invoices and
            contracts
          </p>
        </div>
      </div>

      <div className="space-y-6 rounded-lg border border-border bg-card p-6">
        {/* Company info */}
        <div className="space-y-4">
          <h3 className="font-medium text-foreground text-lg">
            Company Information
          </h3>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="org-company-name">Company Name *</Label>
              <Input
                id="org-company-name"
                value={form.companyName}
                onChange={(e) => handleChange("companyName", e.target.value)}
                placeholder="Your company name"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="org-website">Website</Label>
              <Input
                id="org-website"
                value={form.website ?? ""}
                onChange={(e) =>
                  handleChange("website", e.target.value || null)
                }
                placeholder="https://example.com"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="org-logo-url">Logo URL</Label>
              <Input
                id="org-logo-url"
                value={form.logoUrl ?? ""}
                onChange={(e) =>
                  handleChange("logoUrl", e.target.value || null)
                }
                placeholder="https://example.com/logo.svg"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="org-registration-state">Registration State</Label>
              <Input
                id="org-registration-state"
                value={form.registrationState ?? ""}
                onChange={(e) =>
                  handleChange("registrationState", e.target.value || null)
                }
                placeholder="e.g. Minnesota"
              />
            </div>
          </div>
        </div>

        {/* Contact info */}
        <div className="space-y-4">
          <h3 className="font-medium text-foreground text-lg">
            Primary Contact
          </h3>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="org-contact-name">Contact Name *</Label>
              <Input
                id="org-contact-name"
                value={form.contactName}
                onChange={(e) => handleChange("contactName", e.target.value)}
                placeholder="Full name"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="org-contact-title">Title</Label>
              <Input
                id="org-contact-title"
                value={form.contactTitle ?? ""}
                onChange={(e) =>
                  handleChange("contactTitle", e.target.value || null)
                }
                placeholder="e.g. CEO"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="org-email">Email *</Label>
              <Input
                id="org-email"
                type="email"
                value={form.email}
                onChange={(e) => handleChange("email", e.target.value)}
                placeholder="contact@company.com"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="org-phone">Phone</Label>
              <Input
                id="org-phone"
                type="tel"
                value={form.phone ?? ""}
                onChange={(e) => handleChange("phone", e.target.value || null)}
                placeholder="(555) 555-5555"
              />
            </div>
          </div>
        </div>

        {/* Address */}
        <div className="space-y-4">
          <h3 className="font-medium text-foreground text-lg">Address</h3>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="org-address1">Address Line 1</Label>
              <Input
                id="org-address1"
                value={form.addressLine1 ?? ""}
                onChange={(e) =>
                  handleChange("addressLine1", e.target.value || null)
                }
                placeholder="Street address"
              />
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="org-address2">Address Line 2</Label>
              <Input
                id="org-address2"
                value={form.addressLine2 ?? ""}
                onChange={(e) =>
                  handleChange("addressLine2", e.target.value || null)
                }
                placeholder="Suite, unit, etc."
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="org-city">City</Label>
              <Input
                id="org-city"
                value={form.city ?? ""}
                onChange={(e) => handleChange("city", e.target.value || null)}
                placeholder="City"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="org-state">State</Label>
              <Input
                id="org-state"
                value={form.state ?? ""}
                onChange={(e) => handleChange("state", e.target.value || null)}
                placeholder="State"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="org-postal">Postal Code</Label>
              <Input
                id="org-postal"
                value={form.postalCode ?? ""}
                onChange={(e) =>
                  handleChange("postalCode", e.target.value || null)
                }
                placeholder="12345"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="org-country">Country</Label>
              <Input
                id="org-country"
                value={form.country ?? ""}
                onChange={(e) =>
                  handleChange("country", e.target.value || null)
                }
                placeholder="Country"
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 border-border border-t pt-4">
          {saved && (
            <span className="text-emerald-600 text-sm dark:text-emerald-400">
              Saved successfully
            </span>
          )}
          <button
            type="button"
            onClick={handleSave}
            disabled={!isValid}
            className="rounded-md bg-primary px-4 py-1.5 text-sm text-white hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Save Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export const Route = createFileRoute("/_auth/settings/")({
  component: SettingsPage,
});
