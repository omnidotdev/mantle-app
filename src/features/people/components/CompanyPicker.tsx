import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePeopleStore } from "@/features/people/store/peopleStore";

interface CompanyPickerProps {
  value: string;
  onValueChange: (value: string) => void;
}

const CompanyPicker = ({ value, onValueChange }: CompanyPickerProps) => {
  const { companies } = usePeopleStore();

  const items = companies.map((c) => c.id);

  return (
    <Select
      items={items}
      value={value}
      onValueChange={onValueChange}
      itemToString={(id) => companies.find((c) => c.id === id)?.name ?? id}
      itemToValue={(id) => id}
    >
      <SelectTrigger>
        <SelectValue placeholder="Select a company" />
      </SelectTrigger>
      <SelectContent>
        {companies.map((company) => (
          <SelectItem key={company.id} value={company.id}>
            {company.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default CompanyPicker;
