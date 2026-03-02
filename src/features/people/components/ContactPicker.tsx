import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePeopleStore } from "@/features/people/store/peopleStore";

interface ContactPickerProps {
  value: string;
  onValueChange: (value: string) => void;
}

const ContactPicker = ({ value, onValueChange }: ContactPickerProps) => {
  const { people } = usePeopleStore();

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
