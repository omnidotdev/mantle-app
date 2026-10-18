import { useQueryClient } from "@tanstack/react-query";
import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";

import ContactForm from "@/features/people/components/ContactForm";
import {
  useAllPeopleQuery,
  useCreatePersonMutation,
} from "@/generated/graphql";

import type { Person } from "@/features/people/types";

const defaultPerson: Partial<Person> = {
  firstName: "",
  lastName: "",
  emails: [],
  phone: null,
  avatarUrl: null,
  tags: null,
  internal: false,
  notes: null,
};

const NewContactPage = () => {
  const { organizationId } = Route.useRouteContext();
  const { workspaceSlug } = Route.useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [currentPerson, setCurrentPerson] =
    useState<Partial<Person>>(defaultPerson);
  const [saving, setSaving] = useState(false);

  const createPersonMutation = useCreatePersonMutation();

  const invalidatePeople = () => {
    queryClient.invalidateQueries({
      queryKey: useAllPeopleQuery.getKey({
        organizationId: organizationId ?? "",
      }),
    });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const result = await createPersonMutation.mutateAsync({
        input: {
          person: {
            organizationId: organizationId ?? "",
            firstName: currentPerson.firstName ?? "",
            lastName: currentPerson.lastName ?? "",
            emails: currentPerson.emails ?? [],
            phone: currentPerson.phone ?? null,
            avatarUrl: currentPerson.avatarUrl ?? null,
            tags: currentPerson.tags ?? null,
            internal: currentPerson.internal ?? false,
            notes: currentPerson.notes ?? null,
          },
        },
      });

      const newId = result.createPerson?.person?.rowId;
      invalidatePeople();
      toast.success("Contact saved");

      if (newId) {
        navigate({
          to: "/@{$workspaceSlug}/people/contacts/$contactId/edit",
          params: { workspaceSlug, contactId: newId },
        });
      }
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to save contact",
      );
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    navigate({
      to: "/@{$workspaceSlug}/people",
      params: { workspaceSlug },
      search: { tab: "contacts" },
    });
  };

  if (!organizationId) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-muted-foreground">
          Select a workspace to create contacts
        </p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <Link
          to="/@{$workspaceSlug}/people"
          params={{ workspaceSlug }}
          search={{ tab: "contacts" }}
          className="text-muted-foreground text-sm hover:text-foreground"
        >
          &larr; Back to list
        </Link>
      </div>

      <div className="rounded-lg border border-border bg-card p-6">
        <h2 className="mb-6 font-semibold text-lg">New Contact</h2>
        <ContactForm
          person={currentPerson}
          onPersonChange={setCurrentPerson}
          onSave={handleSave}
          onCancel={handleCancel}
          saving={saving}
        />
      </div>
    </div>
  );
};

export const Route = createFileRoute(
  "/_app/@{$workspaceSlug}/people/contacts/new",
)({
  component: NewContactPage,
});
