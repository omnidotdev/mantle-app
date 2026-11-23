import { useMemo } from "react";

import FieldSelect from "@/components/core/FieldSelect";
import { useAllCompaniesQuery } from "@/generated/graphql";

interface CompanyPickerProps {
  value: string;
  onValueChange: (value: string) => void;
  organizationId?: string;
}

const CompanyPicker = ({
  value,
  onValueChange,
  organizationId,
}: CompanyPickerProps) => {
  const { data } = useAllCompaniesQuery(
    { organizationId: organizationId ?? "" },
    { enabled: !!organizationId },
  );

  const companies = useMemo(
    () =>
      (data?.companies?.nodes ?? []).flatMap((node) => {
        if (!node) return [];
        return [{ id: node.rowId, name: node.name }];
      }),
    [data],
  );

  const options = useMemo(
    () => companies.map(({ id, name }) => ({ value: id, label: name })),
    [companies],
  );

  return (
    <FieldSelect
      value={value}
      options={options}
      onValueChange={onValueChange}
      placeholder="Select a company"
    />
  );
};

export default CompanyPicker;
