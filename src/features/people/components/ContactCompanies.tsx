import { useQueryClient } from "@tanstack/react-query";
import { Plus, Star, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Input } from "@/components/ui/input";
import {
  useCompanyMembersByPersonQuery,
  useCreateCompanyMemberMutation,
  useDeleteCompanyMemberMutation,
  useUpdateCompanyMemberMutation,
} from "@/generated/graphql";
import CompanyPicker from "./CompanyPicker";

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
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to add company");
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
        err instanceof Error ? err.message : "Failed to update membership",
      );
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
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to update membership",
      );
    }
  };

  const handleRemove = async (rowId: string) => {
    try {
      await deleteMutation.mutateAsync({ input: { rowId } });
      invalidate();
      toast.success("Company removed");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to remove company",
      );
    }
  };

  return (
    <div className="mt-4 rounded-lg border border-border bg-card p-6">
      <h3 className="mb-4 font-medium text-sm">Companies</h3>

      {memberships.length > 0 && (
        <div className="mb-4 space-y-2">
          {memberships.map((membership) => (
            <div
              key={membership.rowId}
              className="flex items-center gap-3 rounded-md border border-border px-3 py-2"
            >
              <span className="min-w-[140px] text-sm">
                {membership.company?.name}
              </span>
              <Input
                placeholder="Title"
                defaultValue={membership.title ?? ""}
                onBlur={(e) => {
                  if (e.target.value !== (membership.title ?? "")) {
                    handleUpdateTitle(membership.rowId, e.target.value);
                  }
                }}
                className="h-9 max-w-[200px] text-sm"
              />
              <button
                type="button"
                onClick={() =>
                  handleTogglePrimary(
                    membership.rowId,
                    membership.isPrimary ?? false,
                  )
                }
                className={`p-1 ${membership.isPrimary ? "text-amber-500" : "text-muted-foreground hover:text-foreground"}`}
                aria-label={
                  membership.isPrimary ? "Remove primary" : "Set as primary"
                }
                title={
                  membership.isPrimary ? "Primary company" : "Set as primary"
                }
              >
                <Star
                  size={16}
                  fill={membership.isPrimary ? "currentColor" : "none"}
                />
              </button>
              <button
                type="button"
                onClick={() => handleRemove(membership.rowId)}
                className="p-1 text-destructive hover:text-destructive/90"
                aria-label="Remove company"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="flex items-center gap-3">
        <div className="min-w-[140px]">
          <CompanyPicker
            value={newCompanyId}
            onValueChange={setNewCompanyId}
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
          disabled={!newCompanyId}
          className="flex items-center gap-1 rounded-md bg-primary px-3 py-1.5 text-sm text-white hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Plus size={14} />
          Add
        </button>
      </div>
    </div>
  );
};

export default ContactCompanies;
