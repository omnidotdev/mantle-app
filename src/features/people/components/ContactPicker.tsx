import { useMemo } from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

  const items = people.map((p) => p.id);

  return (
    <Select
      items={items}
      value={value}
      onValueChange={onValueChange}
      itemToString={(id) => {
        const p = people.find((p) => p.id === id);
        return p ? `${p.firstName} ${p.lastName}` : id;
      }}
      itemToValue={(id) => id}
    >
      <SelectTrigger>
        <SelectValue placeholder="Select a contact" />
      </SelectTrigger>
      <SelectContent>
        {people.map((person) => (
          <SelectItem key={person.id} value={person.id}>
            {person.firstName} {person.lastName}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default ContactPicker;
