import { useQueryClient } from "@tanstack/react-query";
import { Link, createFileRoute } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import ContactCompanies from "@/features/people/components/ContactCompanies";
import ContactForm from "@/features/people/components/ContactForm";
import {
  useAllPeopleQuery,
  useUpdatePersonMutation,
} from "@/generated/graphql";

import type { Person } from "@/features/people/types";

const EditContactPage = () => {
  const { organizationId } = Route.useRouteContext();
  const { workspaceSlug, contactId } = Route.useParams();
  const queryClient = useQueryClient();

  const [saving, setSaving] = useState(false);
  const [currentPerson, setCurrentPerson] = useState<Partial<Person>>({});
  const [initialized, setInitialized] = useState(false);

  const { data: peopleData, isLoading } = useAllPeopleQuery(
    { organizationId: organizationId ?? "" },
    { enabled: !!organizationId },
  );

  const people = useMemo(
    () =>
      (peopleData?.people?.nodes ?? []).flatMap((node) => {
        if (!node) return [];
        return [
          {
            id: node.rowId,
            organizationId: node.organizationId,
            firstName: node.firstName,
            lastName: node.lastName,
            emails: (node.emails as string[]) ?? [],
            phone: node.phone ?? null,
            avatarUrl: node.avatarUrl ?? null,
            tags: (node.tags as string[]) ?? null,
            internal: node.internal ?? false,
            notes: node.notes ?? null,
            createdAt: node.createdAt ?? "",
            updatedAt: node.updatedAt ?? "",
          },
        ];
      }),
    [peopleData],
  );

  const person = useMemo(
    () => people.find((p) => p.id === contactId),
    [people, contactId],
  );

  useEffect(() => {
    if (person && !initialized) {
      setCurrentPerson(person);
      setInitialized(true);
    }
  }, [person, initialized]);

  const invalidatePeople = () => {
    queryClient.invalidateQueries({
      queryKey: useAllPeopleQuery.getKey({
        organizationId: organizationId ?? "",
      }),
    });
  };

  const updatePersonMutation = useUpdatePersonMutation();

  const handleSave = async () => {
    setSaving(true);
    try {
      await updatePersonMutation.mutateAsync({
        input: {
          rowId: contactId,
          patch: {
            firstName: currentPerson.firstName,
            lastName: currentPerson.lastName,
            emails: currentPerson.emails,
            phone: currentPerson.phone,
            avatarUrl: currentPerson.avatarUrl,
            tags: currentPerson.tags,
            internal: currentPerson.internal,
            notes: currentPerson.notes,
          },
        },
      });
      invalidatePeople();
      toast.success("Contact saved");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to save contact",
      );
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (person) {
      setCurrentPerson(person);
    }
  };

  if (!organizationId) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-muted-foreground">
          Select a workspace to edit contacts
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-6">
        <Loader2
          className="h-8 w-8 animate-spin text-muted-foreground"
          aria-label="Loading contact"
        />
      </div>
    );
  }

  if (!person) {
    return (
      <div className="p-6">
        <Link
          to="/@{$workspaceSlug}/people"
          params={{ workspaceSlug }}
          search={{ tab: "contacts" }}
          className="text-muted-foreground text-sm hover:text-foreground"
        >
          &larr; Back to list
        </Link>
        <div className="mt-8 text-center">
          <p className="text-muted-foreground">Contact not found</p>
        </div>
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
        <h2 className="mb-6 font-semibold text-lg">Edit Contact</h2>
        <ContactForm
          person={currentPerson}
          onPersonChange={setCurrentPerson}
          onSave={handleSave}
          onCancel={handleCancel}
          saving={saving}
        />
      </div>

      <ContactCompanies personId={contactId} organizationId={organizationId} />
    </div>
  );
};

export const Route = createFileRoute(
  "/_app/@{$workspaceSlug}/people/contacts/$contactId/edit",
)({
  component: EditContactPage,
});
