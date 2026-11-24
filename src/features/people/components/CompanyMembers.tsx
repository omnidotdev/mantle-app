import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";

import {
  useCompanyMembersByCompanyQuery,
  useCreateCompanyMemberMutation,
  useDeleteCompanyMemberMutation,
  useUpdateCompanyMemberMutation,
} from "@/generated/graphql";
import ContactPicker from "./ContactPicker";
import MembershipList from "./MembershipList";

import type { CompanyMembersByCompanyQuery } from "@/generated/graphql";

interface CompanyMembersProps {
  companyId: string;
  organizationId: string;
}

const CompanyMembers = ({ companyId, organizationId }: CompanyMembersProps) => {
  const queryClient = useQueryClient();
  const [newPersonId, setNewPersonId] = useState("");
  const [newTitle, setNewTitle] = useState("");

  const { data } = useCompanyMembersByCompanyQuery(
    { companyId },
    { enabled: !!companyId },
  );

  const members = (data?.companyMembers?.nodes ?? []).flatMap((node) =>
    node ? [node] : [],
  );

  const invalidate = () => {
    queryClient.invalidateQueries({
      queryKey: useCompanyMembersByCompanyQuery.getKey({ companyId }),
    });
  };

  const createMutation = useCreateCompanyMemberMutation();
  const updateMutation = useUpdateCompanyMemberMutation();
  const deleteMutation = useDeleteCompanyMemberMutation();

  const handleAdd = async () => {
    if (!newPersonId) return;

    try {
      await createMutation.mutateAsync({
        input: {
          companyMember: {
            companyId,
            personId: newPersonId,
            title: newTitle || null,
          },
        },
      });
      invalidate();
      setNewPersonId("");
      setNewTitle("");
      toast.success("Member added");
    } catch {
      toast.error("Failed to add member");
    }
  };

  const handleUpdateTitle = async (rowId: string, title: string) => {
    try {
      await updateMutation.mutateAsync({
        input: { rowId, patch: { title: title || null } },
      });
      invalidate();
    } catch {
      toast.error("Failed to update member");
    }
  };

  const handleTogglePrimary = async (
    rowId: string,
    currentValue: boolean | null,
  ) => {
    const key = useCompanyMembersByCompanyQuery.getKey({ companyId });
    const previous =
      queryClient.getQueryData<CompanyMembersByCompanyQuery>(key);

    // Optimistically flip the star so the UI updates instantly
    queryClient.setQueryData<CompanyMembersByCompanyQuery>(key, (old) =>
      old?.companyMembers
        ? {
            ...old,
            companyMembers: {
              ...old.companyMembers,
              nodes: old.companyMembers.nodes.map((node) =>
                node?.rowId === rowId
                  ? { ...node, isPrimary: !currentValue }
                  : node,
              ),
            },
          }
        : old,
    );

    try {
      await updateMutation.mutateAsync({
        input: { rowId, patch: { isPrimary: !currentValue } },
      });
      invalidate();
    } catch {
      queryClient.setQueryData(key, previous);
      toast.error("Failed to update member");
    }
  };

  const handleRemove = async (rowId: string) => {
    try {
      await deleteMutation.mutateAsync({ input: { rowId } });
      invalidate();
      toast.success("Member removed");
    } catch {
      toast.error("Failed to remove member");
    }
  };

  return (
    <MembershipList
      heading="Members"
      items={members.map((member) => ({
        rowId: member.rowId,
        name: [member.person?.firstName, member.person?.lastName]
          .filter(Boolean)
          .join(" "),
        title: member.title ?? null,
        isPrimary: member.isPrimary ?? false,
      }))}
      emptyLabel="No members yet"
      primaryLabel="Primary contact"
      removeDescription="The contact stays in People. Only their link to this company is removed."
      picker={
        <ContactPicker
          value={newPersonId}
          onValueChange={setNewPersonId}
          organizationId={organizationId}
        />
      }
      canAdd={!!newPersonId && !createMutation.isPending}
      newTitle={newTitle}
      onNewTitleChange={setNewTitle}
      onAdd={handleAdd}
      onUpdateTitle={handleUpdateTitle}
      onTogglePrimary={handleTogglePrimary}
      onRemove={handleRemove}
    />
  );
};

export default CompanyMembers;
