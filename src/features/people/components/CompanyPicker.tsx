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
  organizationId?: string;
}

const CompanyPicker = ({
  value,
  onValueChange,
  organizationId,
}: CompanyPickerProps) => {
  const { companies: allCompanies, getCompaniesForOrg } = usePeopleStore();
  const companies = organizationId
    ? getCompaniesForOrg(organizationId)
    : allCompanies;

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
