import { useQueryClient } from "@tanstack/react-query";
import { Plus, Star, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Input } from "@/components/ui/input";
import {
  useCompanyMembersByCompanyQuery,
  useCreateCompanyMemberMutation,
  useDeleteCompanyMemberMutation,
  useUpdateCompanyMemberMutation,
} from "@/generated/graphql";
import ContactPicker from "./ContactPicker";

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
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to add member");
    }
  };

  const handleUpdateTitle = async (rowId: string, title: string) => {
    try {
      await updateMutation.mutateAsync({
        input: { rowId, patch: { title: title || null } },
      });
      invalidate();
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to update member",
      );
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
    } catch (err) {
      queryClient.setQueryData(key, previous);
      toast.error(
        err instanceof Error ? err.message : "Failed to update member",
      );
    }
  };

  const handleRemove = async (rowId: string) => {
    try {
      await deleteMutation.mutateAsync({ input: { rowId } });
      invalidate();
      toast.success("Member removed");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to remove member",
      );
    }
  };

  return (
    <div className="mt-4 rounded-lg border border-border bg-card p-6">
      <h3 className="mb-4 font-medium text-sm">Members</h3>

      {members.length > 0 && (
        <div className="mb-4 space-y-2">
          {members.map((member) => (
            <div
              key={member.rowId}
              className="flex items-center gap-3 rounded-md border border-border px-3 py-2"
            >
              <span className="min-w-[140px] text-sm">
                {member.person?.firstName} {member.person?.lastName}
              </span>
              <Input
                placeholder="Title"
                defaultValue={member.title ?? ""}
                onBlur={(e) => {
                  if (e.target.value !== (member.title ?? "")) {
                    handleUpdateTitle(member.rowId, e.target.value);
                  }
                }}
                className="h-9 max-w-[200px] text-sm"
              />
              <button
                type="button"
                onClick={() =>
                  handleTogglePrimary(member.rowId, member.isPrimary ?? false)
                }
                className={`p-1 ${member.isPrimary ? "text-amber-500" : "text-muted-foreground hover:text-foreground"}`}
                aria-label={
                  member.isPrimary ? "Remove primary" : "Set as primary"
                }
                title={member.isPrimary ? "Primary contact" : "Set as primary"}
              >
                <Star
                  size={16}
                  fill={member.isPrimary ? "currentColor" : "none"}
                />
              </button>
              <button
                type="button"
                onClick={() => handleRemove(member.rowId)}
                className="p-1 text-destructive hover:text-destructive/90"
                aria-label="Remove member"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="flex items-center gap-3">
        <div className="min-w-[140px]">
          <ContactPicker
            value={newPersonId}
            onValueChange={setNewPersonId}
            organizationId={organizationId}
          />
        </div>
        <Input
          placeholder="Title"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          className="h-9 max-w-[200px] text-sm"
        />
        <button
          type="button"
          onClick={handleAdd}
          disabled={!newPersonId}
          className="flex items-center gap-1 rounded-md bg-primary px-3 py-1.5 text-sm text-white hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Plus size={14} />
          Add
        </button>
      </div>
    </div>
  );
};

export default CompanyMembers;
