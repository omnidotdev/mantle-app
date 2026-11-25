import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useMemo } from "react";

import { useCustomFieldsQuery } from "@/generated/graphql";
import { fieldsFor, toCustomField } from "./values";

import type { CustomField, CustomFieldEntity } from "./types";

/**
 * The workspace's custom fields for one record type, in display order. Pass
 * no entity for every field (the settings screen)
 */
const useCustomFields = (
  organizationId: string | null | undefined,
  entity?: CustomFieldEntity,
) => {
  const queryClient = useQueryClient();
  const variables = { organizationId: organizationId ?? "" };

  const { data, isLoading } = useCustomFieldsQuery(variables, {
    enabled: !!organizationId,
  });

  const all = useMemo(
    () =>
      (data?.customFields?.nodes ?? []).flatMap((node) => {
        const field = node ? toCustomField(node) : null;
        return field ? [field] : [];
      }),
    [data],
  );

  const fields = useMemo<CustomField[]>(
    () =>
      entity
        ? fieldsFor(all, entity)
        : [...fieldsFor(all, "person"), ...fieldsFor(all, "company")],
    [all, entity],
  );

  const key = variables.organizationId;
  const invalidate = useCallback(
    () =>
      queryClient.invalidateQueries({
        queryKey: useCustomFieldsQuery.getKey({ organizationId: key }),
      }),
    [queryClient, key],
  );

  return { fields, isLoading, invalidate };
};

export default useCustomFields;
