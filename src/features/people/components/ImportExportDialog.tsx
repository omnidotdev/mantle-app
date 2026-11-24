import {
  DialogBackdrop,
  DialogCloseTrigger,
  DialogContent,
  DialogPortal,
  DialogPositioner,
  DialogRoot,
  DialogTitle,
} from "@omnidotdev/thornberry/dialog";
import { useQueryClient } from "@tanstack/react-query";
import { Download } from "lucide-react";
import Papa from "papaparse";
import { useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { SegmentedControl } from "@/components/ui/segmented-control";
import {
  useAllCompaniesQuery,
  useAllPeopleQuery,
  useCreateCompanyMutation,
  useCreatePersonMutation,
} from "@/generated/graphql";
import { planLimitMessage } from "@/lib/graphql/errors";
import { resolveRegion, toE164 } from "@/lib/phone";

import type { Company, Person } from "@/features/people/types";

interface ImportExportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  context: "contacts" | "companies";
  organizationId: string;
  companies: Company[];
  people: Person[];
}

const ImportExportDialog = ({
  open,
  onOpenChange,
  context,
  organizationId,
  companies,
  people,
}: ImportExportDialogProps) => {
  const queryClient = useQueryClient();
  const [mode, setMode] = useState<"export" | "import">("export");
  const [importError, setImportError] = useState<string | null>(null);
  const [importing, setImporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const createCompanyMutation = useCreateCompanyMutation();
  const createPersonMutation = useCreatePersonMutation();

  const invalidateAll = () => {
    queryClient.invalidateQueries({
      queryKey: useAllCompaniesQuery.getKey({ organizationId }),
    });
    queryClient.invalidateQueries({
      queryKey: useAllPeopleQuery.getKey({ organizationId }),
    });
  };

  const exportJSON = () => {
    const data = context === "contacts" ? people : companies;
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${context === "contacts" ? "people" : "companies"}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportCSV = () => {
    const data = context === "contacts" ? people : companies;
    const rows = data.map((item) => {
      const row: Record<string, string> = {};
      for (const [key, value] of Object.entries(item)) {
        row[key] = Array.isArray(value) ? value.join(";") : String(value ?? "");
      }
      return row;
    });

    const csv = Papa.unparse(rows);
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${context === "contacts" ? "people" : "companies"}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importCompanies = async (
    records: Omit<
      Company,
      "id" | "createdAt" | "updatedAt" | "organizationId"
    >[],
  ) => {
    for (const record of records) {
      await createCompanyMutation.mutateAsync({
        input: {
          company: {
            organizationId,
            name: record.name,
            website: record.website ?? null,
            industry: record.industry ?? null,
            phone: toE164(record.phone, resolveRegion(record.country)),
            email: record.email ?? null,
            addressLine1: record.addressLine1 ?? null,
            addressLine2: record.addressLine2 ?? null,
            city: record.city ?? null,
            state: record.state ?? null,
            postalCode: record.postalCode ?? null,
            country: record.country ?? null,
            notes: record.notes ?? null,
          },
        },
      });
    }
  };

  const importPeople = async (
    records: Omit<
      Person,
      "id" | "createdAt" | "updatedAt" | "organizationId"
    >[],
  ) => {
    for (const record of records) {
      await createPersonMutation.mutateAsync({
        input: {
          person: {
            organizationId,
            firstName: record.firstName,
            lastName: record.lastName,
            emails: record.emails ?? [],
            phone: toE164(record.phone),
            avatarUrl: record.avatarUrl ?? null,
            tags: record.tags ?? null,
            internal: record.internal ?? false,
            notes: record.notes ?? null,
          },
        },
      });
    }
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImportError(null);

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        setImporting(true);
        const text = event.target?.result as string;

        if (file.name.endsWith(".json")) {
          const data = JSON.parse(text);
          if (!Array.isArray(data)) {
            setImportError("The JSON file must contain a list of records.");
            return;
          }
          if (context === "contacts") {
            await importPeople(data);
          } else {
            await importCompanies(data);
          }
        } else if (file.name.endsWith(".csv")) {
          const result = Papa.parse<Record<string, string>>(text, {
            header: true,
          });
          if (result.errors.length > 0) {
            const row = result.errors[0]?.row;
            setImportError(
              row === undefined
                ? "The CSV file could not be read. Check its format and try again."
                : `The CSV file could not be read (problem near row ${row + 1}). Check its format and try again.`,
            );
            return;
          }
          if (context === "contacts") {
            const parsed = result.data.map((row) => ({
              firstName: row.firstName ?? "",
              lastName: row.lastName ?? "",
              emails: row.emails ? row.emails.split(";").filter(Boolean) : [],
              phone: row.phone || null,
              avatarUrl: row.avatarUrl || null,
              tags: row.tags ? row.tags.split(";").filter(Boolean) : null,
              internal: row.internal === "true",
              notes: row.notes || null,
            }));
            await importPeople(parsed);
          } else {
            const parsed = result.data.map((row) => ({
              name: row.name ?? "",
              website: row.website || null,
              industry: row.industry || null,
              phone: row.phone || null,
              email: row.email || null,
              addressLine1: row.addressLine1 || null,
              addressLine2: row.addressLine2 || null,
              city: row.city || null,
              state: row.state || null,
              postalCode: row.postalCode || null,
              country: row.country || null,
              notes: row.notes || null,
            }));
            await importCompanies(parsed);
          }
        } else {
          setImportError("Unsupported file type. Use a .json or .csv file.");
          return;
        }

        invalidateAll();
        onOpenChange(false);
      } catch (err) {
        const limit = planLimitMessage(err);
        if (limit) invalidateAll();
        setImportError(
          err instanceof SyntaxError
            ? "The file could not be read. Check its format and try again."
            : limit
              ? `Some contacts were not imported. ${limit}.`
              : "Some records could not be imported. Check the file and try again.",
        );
      } finally {
        setImporting(false);
      }
    };

    reader.onerror = () => setImportError("The file could not be read.");
    reader.readAsText(file);
    // Reset input
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const noun = context === "contacts" ? "contacts" : "companies";
  const count = context === "contacts" ? people.length : companies.length;
  const countLabel =
    context === "contacts"
      ? `${count} ${count === 1 ? "contact" : "contacts"}`
      : `${count} ${count === 1 ? "company" : "companies"}`;

  return (
    <DialogRoot
      open={open}
      onOpenChange={(details) => onOpenChange(details.open)}
      lazyMount
      unmountOnExit
    >
      <DialogPortal>
        <DialogBackdrop />
        <DialogPositioner>
          <DialogContent>
            <DialogTitle>Import or export {noun}</DialogTitle>

            <SegmentedControl
              label="Import or export"
              value={mode}
              onValueChange={setMode}
              options={[
                { value: "export", label: "Export" },
                { value: "import", label: "Import" },
              ]}
              className="w-fit"
            />

            {mode === "export" ? (
              <div className="space-y-3">
                <p className="text-muted-foreground text-sm">
                  Download all <span className="tabular">{countLabel}</span> as
                  a file.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" onClick={exportJSON}>
                    <Download />
                    Export JSON
                  </Button>
                  <Button variant="outline" onClick={exportCSV}>
                    <Download />
                    Export CSV
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-muted-foreground text-sm">
                  Import {noun} from a JSON or CSV file.
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".json,.csv"
                  aria-label="Choose file to import"
                  onChange={handleImport}
                  disabled={importing}
                  className="block w-full text-muted-foreground text-sm file:mr-4 file:h-9 file:cursor-pointer file:rounded-full file:border-0 file:bg-primary/10 file:px-4 file:font-medium file:text-primary-600 file:text-sm hover:file:bg-primary/15 dark:file:text-primary-300"
                />
                {importing && (
                  <p className="text-muted-foreground text-sm">Importing...</p>
                )}
                {importError && (
                  <p className="rounded-xl bg-destructive/10 px-3 py-2 text-destructive text-sm">
                    {importError}
                  </p>
                )}
              </div>
            )}
            <DialogCloseTrigger />
          </DialogContent>
        </DialogPositioner>
      </DialogPortal>
    </DialogRoot>
  );
};

export default ImportExportDialog;
