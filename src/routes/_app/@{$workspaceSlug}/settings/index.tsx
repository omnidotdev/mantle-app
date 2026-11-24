import { Input } from "@omnidotdev/thornberry/input";
import { Label } from "@omnidotdev/thornberry/label";
import { Link, createFileRoute, redirect } from "@tanstack/react-router";
import { SettingsIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import EmptyState from "@/components/core/EmptyState";
import PageContainer from "@/components/core/PageContainer";
import PageHeader from "@/components/core/PageHeader";
import SectionCard from "@/components/core/SectionCard";
import { Button, buttonVariants } from "@/components/ui/button";
import { PhoneInput } from "@/components/ui/phone-input";
import { isDemoHref } from "@/features/demo/config";
import DocumentNumberingSettings from "@/features/settings/components/DocumentNumberingSettings";
import WorkspacePlanCard from "@/features/settings/components/WorkspacePlanCard";
import { useWorkspaceProfile } from "@/features/settings/hooks/useWorkspaceProfile";
import { profileSaveErrorMessage } from "@/lib/graphql/errors";
import { resolveRegion } from "@/lib/phone";
import cn from "@/lib/utils";

import type { ReactNode } from "react";
import type { OrganizationProfile } from "@/features/settings/types";

type FormState = Omit<OrganizationProfile, "id" | "createdAt" | "updatedAt">;

/** Label above a control, with an optional wide (two-column) span */
const Field = ({
  id,
  label,
  required,
  wide,
  children,
}: {
  id: string;
  label: string;
  required?: boolean;
  wide?: boolean;
  children: ReactNode;
}) => (
  <div className={cn("space-y-1.5", wide && "sm:col-span-2")}>
    <Label htmlFor={id}>
      {label}
      {required && (
        <span aria-hidden className="ml-0.5 text-muted-foreground">
          *
        </span>
      )}
    </Label>
    {children}
  </div>
);

/** Small heading that splits the profile card into groups */
const GroupHeading = ({ children }: { children: ReactNode }) => (
  <h3 className="text-sm font-semibold">{children}</h3>
);

/** Preview of the logo URL, hidden until the image actually loads */
const LogoPreview = ({ url }: { url: string }) => {
  const [failed, setFailed] = useState(false);

  // biome-ignore lint/correctness/useExhaustiveDependencies: reset when the URL changes
  useEffect(() => setFailed(false), [url]);

  if (failed) {
    return (
      <p className="text-xs text-muted-foreground">
        This image could not be loaded. Check the URL.
      </p>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <img
        src={url}
        alt="Logo preview"
        onError={() => setFailed(true)}
        className="h-12 max-w-40 rounded-lg bg-muted object-contain p-1.5"
      />
      <span className="text-xs text-muted-foreground">Preview</span>
    </div>
  );
};

const SettingsPage = () => {
  const { organizationId, workspaceSlug, session } = Route.useRouteContext();
  const { profile: existing, save } = useWorkspaceProfile(organizationId);
  const [saving, setSaving] = useState(false);

  // Only owners and admins may change workspace-wide settings (the API
  // enforces it); members see the profile read-only
  const roles =
    session?.organizations?.find((org) => org.id === organizationId)?.roles ??
    [];
  const canEdit = roles.includes("owner") || roles.includes("admin");

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
    accentColor: null,
  };

  const [form, setForm] = useState<FormState>(defaultForm);

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
        accentColor: existing.accentColor,
      });
    }
  }, [existing]);

  const handleChange = (field: keyof FormState, value: string | null) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    const { organizationId: _organizationId, ...fields } = form;
    setSaving(true);
    try {
      await save(fields);
      toast.success("Workspace profile saved");
    } catch (err) {
      toast.error(profileSaveErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const isValid =
    form.companyName.trim() && form.contactName.trim() && form.email.trim();

  if (!organizationId) {
    return (
      <PageContainer width="narrow">
        <PageHeader title="Settings" />
        <SectionCard>
          <EmptyState
            icon={SettingsIcon}
            title="No workspace selected"
            description="Pick a workspace to edit its settings."
            action={
              <Link to="/" className={buttonVariants({ variant: "solid" })}>
                Go home
              </Link>
            }
          />
        </SectionCard>
      </PageContainer>
    );
  }

  return (
    <PageContainer width="narrow">
      <PageHeader
        title="Settings"
        description="Company details that fill in your invoices and contracts, your plan, and how documents are numbered"
      />

      <div className="grid gap-4 md:gap-6">
        <SectionCard title="Workspace profile">
          <form
            method="post"
            className="space-y-6"
            onSubmit={(e) => {
              e.preventDefault();
              if (isValid && canEdit) void handleSave();
            }}
          >
            {!canEdit && (
              <p className="rounded-lg bg-muted px-3 py-2 text-sm text-muted-foreground">
                Only workspace owners and admins can change the workspace
                profile.
              </p>
            )}
            <fieldset
              disabled={!canEdit}
              className="m-0 min-w-0 space-y-6 border-0 p-0"
            >
              <div className="space-y-4">
                <GroupHeading>Company</GroupHeading>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Field id="org-company-name" label="Company name" required>
                    <Input
                      id="org-company-name"
                      value={form.companyName}
                      onChange={(e) =>
                        handleChange("companyName", e.target.value)
                      }
                      placeholder="Your company name"
                      required
                    />
                  </Field>

                  <Field id="org-website" label="Website">
                    <Input
                      id="org-website"
                      value={form.website ?? ""}
                      onChange={(e) =>
                        handleChange("website", e.target.value || null)
                      }
                      placeholder="https://example.com"
                    />
                  </Field>

                  <Field id="org-logo-url" label="Logo URL" wide>
                    <Input
                      id="org-logo-url"
                      value={form.logoUrl ?? ""}
                      onChange={(e) =>
                        handleChange("logoUrl", e.target.value || null)
                      }
                      placeholder="https://example.com/logo.svg"
                    />
                    {form.logoUrl && <LogoPreview url={form.logoUrl} />}
                  </Field>

                  <Field id="org-registration-state" label="Registration state">
                    <Input
                      id="org-registration-state"
                      value={form.registrationState ?? ""}
                      onChange={(e) =>
                        handleChange(
                          "registrationState",
                          e.target.value || null,
                        )
                      }
                      placeholder="e.g. Minnesota"
                    />
                  </Field>
                </div>
              </div>

              <div className="space-y-4">
                <GroupHeading>Primary contact</GroupHeading>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Field id="org-contact-name" label="Contact name" required>
                    <Input
                      id="org-contact-name"
                      value={form.contactName}
                      onChange={(e) =>
                        handleChange("contactName", e.target.value)
                      }
                      placeholder="Full name"
                      required
                    />
                  </Field>

                  <Field id="org-contact-title" label="Title">
                    <Input
                      id="org-contact-title"
                      value={form.contactTitle ?? ""}
                      onChange={(e) =>
                        handleChange("contactTitle", e.target.value || null)
                      }
                      placeholder="e.g. CEO"
                    />
                  </Field>

                  <Field id="org-email" label="Email" required>
                    <Input
                      id="org-email"
                      type="email"
                      value={form.email}
                      onChange={(e) => handleChange("email", e.target.value)}
                      placeholder="contact@company.com"
                      required
                    />
                  </Field>

                  <Field id="org-phone" label="Phone">
                    <PhoneInput
                      id="org-phone"
                      value={form.phone ?? null}
                      onChange={(phone) => handleChange("phone", phone)}
                      region={resolveRegion(form.country)}
                      placeholder="(555) 555-5555"
                    />
                  </Field>
                </div>
              </div>

              <div className="space-y-4">
                <GroupHeading>Address</GroupHeading>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Field id="org-address1" label="Address line 1" wide>
                    <Input
                      id="org-address1"
                      value={form.addressLine1 ?? ""}
                      onChange={(e) =>
                        handleChange("addressLine1", e.target.value || null)
                      }
                      placeholder="Street address"
                    />
                  </Field>

                  <Field id="org-address2" label="Address line 2" wide>
                    <Input
                      id="org-address2"
                      value={form.addressLine2 ?? ""}
                      onChange={(e) =>
                        handleChange("addressLine2", e.target.value || null)
                      }
                      placeholder="Suite, unit, etc."
                    />
                  </Field>

                  <Field id="org-city" label="City">
                    <Input
                      id="org-city"
                      value={form.city ?? ""}
                      onChange={(e) =>
                        handleChange("city", e.target.value || null)
                      }
                      placeholder="City"
                    />
                  </Field>

                  <Field id="org-state" label="State">
                    <Input
                      id="org-state"
                      value={form.state ?? ""}
                      onChange={(e) =>
                        handleChange("state", e.target.value || null)
                      }
                      placeholder="State"
                    />
                  </Field>

                  <Field id="org-postal" label="Postal code">
                    <Input
                      id="org-postal"
                      value={form.postalCode ?? ""}
                      onChange={(e) =>
                        handleChange("postalCode", e.target.value || null)
                      }
                      placeholder="12345"
                    />
                  </Field>

                  <Field id="org-country" label="Country">
                    <Input
                      id="org-country"
                      value={form.country ?? ""}
                      onChange={(e) =>
                        handleChange("country", e.target.value || null)
                      }
                      placeholder="Country"
                    />
                  </Field>
                </div>
              </div>

              <div className="flex flex-col-reverse items-stretch gap-3 border-t border-border pt-4 sm:flex-row sm:items-center sm:justify-end">
                {!isValid && (
                  <p className="text-xs text-muted-foreground">
                    Company name, contact name, and email are required.
                  </p>
                )}
                <Button type="submit" disabled={!isValid || !canEdit || saving}>
                  {saving ? "Saving..." : "Save profile"}
                </Button>
              </div>
            </fieldset>
          </form>
        </SectionCard>

        <WorkspacePlanCard
          organizationId={organizationId}
          workspaceSlug={workspaceSlug}
          canManage={canEdit}
        />

        <DocumentNumberingSettings organizationId={organizationId} />
      </div>
    </PageContainer>
  );
};

export const Route = createFileRoute("/_app/@{$workspaceSlug}/settings/")({
  staticData: { title: "Settings" },
  // The demo workspace has no settings to change (its plan and branding are
  // fixed sample data), so send links here back to the dashboard
  beforeLoad: ({ location, params }) => {
    if (isDemoHref(location.publicHref)) {
      throw redirect({ to: "/@{$workspaceSlug}", params });
    }
  },
  component: SettingsPage,
});
