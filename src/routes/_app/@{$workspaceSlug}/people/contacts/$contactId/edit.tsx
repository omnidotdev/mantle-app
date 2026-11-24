import { useQueryClient } from "@tanstack/react-query";
import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { Trash2, Users } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import BackLink from "@/components/core/BackLink";
import EmptyState from "@/components/core/EmptyState";
import LoadingState from "@/components/core/LoadingState";
import MobileActionBar from "@/components/core/MobileActionBar";
import PageContainer from "@/components/core/PageContainer";
import PageHeader from "@/components/core/PageHeader";
import { Button, buttonVariants } from "@/components/ui/button";
import ConfirmDialog from "@/components/ui/confirm-dialog";
import ContactCompanies from "@/features/people/components/ContactCompanies";
import ContactForm from "@/features/people/components/ContactForm";
import { MobileDeleteMenu } from "@/features/people/components/RowActions";
import {
  useAllPeopleQuery,
  useDeletePersonMutation,
  useUpdatePersonMutation,
} from "@/generated/graphql";

import type { Person } from "@/features/people/types";

const EditContactPage = () => {
  const { organizationId } = Route.useRouteContext();
  const { workspaceSlug, contactId } = Route.useParams();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [saving, setSaving] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
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
    } catch {
      toast.error("Failed to save contact");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (person) {
      setCurrentPerson(person);
    }
  };

  const deletePersonMutation = useDeletePersonMutation();

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deletePersonMutation.mutateAsync({ input: { rowId: contactId } });
      invalidatePeople();
      toast.success("Contact deleted");
      setDeleteOpen(false);
      navigate({
        to: "/@{$workspaceSlug}/people",
        params: { workspaceSlug },
        search: { tab: "contacts" },
      });
    } catch {
      toast.error("Failed to delete contact");
    } finally {
      setDeleting(false);
    }
  };

  const canSave =
    !!(currentPerson.firstName?.trim() && currentPerson.lastName?.trim()) &&
    !saving;

  const headerActions = (
    <div className="hidden md:flex md:flex-wrap md:gap-2">
      <Button
        variant="ghost"
        onClick={() => setDeleteOpen(true)}
        disabled={saving || deleting}
        className="text-destructive hover:bg-destructive/10 hover:text-destructive"
      >
        <Trash2 />
        Delete
      </Button>
      <Button variant="outline" onClick={handleCancel} disabled={saving}>
        Cancel
      </Button>
      <Button onClick={handleSave} disabled={!canSave}>
        {saving ? "Saving..." : "Save"}
      </Button>
    </div>
  );

  const backLink = (
    <BackLink
      to="/@{$workspaceSlug}/people"
      params={{ workspaceSlug }}
      search={{ tab: "contacts" }}
    >
      People
    </BackLink>
  );

  if (!organizationId) {
    return (
      <PageContainer width="narrow">
        <EmptyState
          icon={Users}
          title="No workspace selected"
          description="Select a workspace to edit contacts."
        />
      </PageContainer>
    );
  }

  if (isLoading) {
    return (
      <PageContainer width="narrow">
        <LoadingState label="Loading contact" />
      </PageContainer>
    );
  }

  if (!person) {
    return (
      <PageContainer width="narrow">
        <PageHeader back={backLink} title="Contact" />
        <EmptyState
          icon={Users}
          title="Contact not found"
          description="It may have been deleted, or the link is out of date."
          action={
            <Link
              to="/@{$workspaceSlug}/people"
              params={{ workspaceSlug }}
              search={{ tab: "contacts" }}
              className={buttonVariants({ variant: "outline" })}
            >
              Back to people
            </Link>
          }
        />
      </PageContainer>
    );
  }

  return (
    <PageContainer width="narrow">
      <PageHeader
        back={backLink}
        title={`Edit ${person.firstName} ${person.lastName}`}
        actions={headerActions}
      />

      <div className="space-y-5">
        <ContactForm person={currentPerson} onPersonChange={setCurrentPerson} />

        <ContactCompanies
          personId={contactId}
          organizationId={organizationId}
        />
      </div>

      <MobileActionBar>
        <MobileDeleteMenu
          label="Delete contact"
          onDelete={() => setDeleteOpen(true)}
          disabled={saving || deleting}
        />
        <Button variant="outline" onClick={handleCancel} disabled={saving}>
          Cancel
        </Button>
        <Button className="flex-1" onClick={handleSave} disabled={!canSave}>
          {saving ? "Saving..." : "Save"}
        </Button>
      </MobileActionBar>

      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title={`Delete contact "${`${person.firstName} ${person.lastName}`}"?`}
        description="This permanently deletes the contact. This action cannot be undone."
        confirmLabel="Delete contact"
        closeOnConfirm={false}
        loading={deleting}
        loadingLabel="Deleting..."
        onConfirm={handleDelete}
      />
    </PageContainer>
  );
};

export const Route = createFileRoute(
  "/_app/@{$workspaceSlug}/people/contacts/$contactId/edit",
)({
  staticData: { title: "Edit contact" },
  component: EditContactPage,
});
