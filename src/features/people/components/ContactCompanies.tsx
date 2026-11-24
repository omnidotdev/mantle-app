import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";

import {
  useCompanyMembersByPersonQuery,
  useCreateCompanyMemberMutation,
  useDeleteCompanyMemberMutation,
  useUpdateCompanyMemberMutation,
} from "@/generated/graphql";
import CompanyPicker from "./CompanyPicker";
import MembershipList from "./MembershipList";

interface ContactCompaniesProps {
  personId: string;
  organizationId: string;
}

const ContactCompanies = ({
  personId,
  organizationId,
}: ContactCompaniesProps) => {
  const queryClient = useQueryClient();
  const [newCompanyId, setNewCompanyId] = useState("");
  const [newTitle, setNewTitle] = useState("");

  const { data } = useCompanyMembersByPersonQuery(
    { personId },
    { enabled: !!personId },
  );

  const memberships = (data?.companyMembers?.nodes ?? []).flatMap((node) =>
    node ? [node] : [],
  );

  const invalidate = () => {
    queryClient.invalidateQueries({
      queryKey: useCompanyMembersByPersonQuery.getKey({ personId }),
    });
  };

  const createMutation = useCreateCompanyMemberMutation();
  const updateMutation = useUpdateCompanyMemberMutation();
  const deleteMutation = useDeleteCompanyMemberMutation();

  const handleAdd = async () => {
    if (!newCompanyId) return;

    try {
      await createMutation.mutateAsync({
        input: {
          companyMember: {
            companyId: newCompanyId,
            personId,
            title: newTitle || null,
          },
        },
      });
      invalidate();
      setNewCompanyId("");
      setNewTitle("");
      toast.success("Company added");
    } catch {
      toast.error("Failed to add company");
    }
  };

  const handleUpdateTitle = async (rowId: string, title: string) => {
    try {
      await updateMutation.mutateAsync({
        input: { rowId, patch: { title: title || null } },
      });
      invalidate();
    } catch {
      toast.error("Failed to update membership");
    }
  };

  const handleTogglePrimary = async (
    rowId: string,
    currentValue: boolean | null,
  ) => {
    try {
      await updateMutation.mutateAsync({
        input: { rowId, patch: { isPrimary: !currentValue } },
      });
      invalidate();
    } catch {
      toast.error("Failed to update membership");
    }
  };

  const handleRemove = async (rowId: string) => {
    try {
      await deleteMutation.mutateAsync({ input: { rowId } });
      invalidate();
      toast.success("Company removed");
    } catch {
      toast.error("Failed to remove company");
    }
  };

  return (
    <MembershipList
      heading="Companies"
      items={memberships.map((membership) => ({
        rowId: membership.rowId,
        name: membership.company?.name ?? "",
        title: membership.title ?? null,
        isPrimary: membership.isPrimary ?? false,
      }))}
      emptyLabel="No companies yet"
      primaryLabel="Primary company"
      removeDescription="The company stays in People. Only this contact's link to it is removed."
      picker={
        <CompanyPicker
          value={newCompanyId}
          onValueChange={setNewCompanyId}
          organizationId={organizationId}
        />
      }
      canAdd={!!newCompanyId && !createMutation.isPending}
      newTitle={newTitle}
      onNewTitleChange={setNewTitle}
      onAdd={handleAdd}
      onUpdateTitle={handleUpdateTitle}
      onTogglePrimary={handleTogglePrimary}
      onRemove={handleRemove}
    />
  );
};

export default ContactCompanies;
