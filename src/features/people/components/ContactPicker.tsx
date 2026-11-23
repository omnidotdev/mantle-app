import { useMemo } from "react";

import FieldSelect from "@/components/core/FieldSelect";
import { useAllPeopleQuery } from "@/generated/graphql";

interface ContactPickerProps {
  value: string;
  onValueChange: (value: string) => void;
  organizationId?: string;
}

const ContactPicker = ({
  value,
  onValueChange,
  organizationId,
}: ContactPickerProps) => {
  const { data } = useAllPeopleQuery(
    { organizationId: organizationId ?? "" },
    { enabled: !!organizationId },
  );

  const people = useMemo(
    () =>
      (data?.people?.nodes ?? []).flatMap((node) => {
        if (!node) return [];
        return [
          {
            id: node.rowId,
            firstName: node.firstName,
            lastName: node.lastName,
          },
        ];
      }),
    [data],
  );

  const options = useMemo(
    () =>
      people.map((person) => ({
        value: person.id,
        label: `${person.firstName} ${person.lastName}`,
      })),
    [people],
  );

  return (
    <FieldSelect
      value={value}
      options={options}
      onValueChange={onValueChange}
      placeholder="Select a contact"
    />
  );
};

export default ContactPicker;
