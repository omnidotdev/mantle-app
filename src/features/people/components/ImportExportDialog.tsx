import { Download, Upload } from "lucide-react";
import Papa from "papaparse";
import { useRef, useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  TabsContent,
  TabsList,
  TabsRoot,
  TabsTrigger,
} from "@/components/ui/tabs";
import { usePeopleStore } from "@/features/people/store/peopleStore";

interface ImportExportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  context: "contacts" | "companies";
  organizationId: string;
}

const ImportExportDialog = ({
  open,
  onOpenChange,
  context,
  organizationId,
}: ImportExportDialogProps) => {
  const { getCompaniesForOrg, getPeopleForOrg, importPeople, importCompanies } =
    usePeopleStore();
  const [importTab, setImportTab] = useState<string>("export");
  const [importError, setImportError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const people = getPeopleForOrg(organizationId);
  const companies = getCompaniesForOrg(organizationId);

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

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImportError(null);

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;

        if (file.name.endsWith(".json")) {
          const data = JSON.parse(text);
          if (!Array.isArray(data)) {
            setImportError("Invalid JSON: expected an array of records");
            return;
          }
          if (context === "contacts") {
            importPeople(data, organizationId);
          } else {
            importCompanies(data, organizationId);
          }
        } else if (file.name.endsWith(".csv")) {
          const result = Papa.parse<Record<string, string>>(text, {
            header: true,
          });
          if (result.errors.length > 0) {
            setImportError(
              `CSV parse error: ${result.errors[0].message} (row ${result.errors[0].row})`,
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
            importPeople(parsed, organizationId);
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
            importCompanies(parsed, organizationId);
          }
        } else {
          setImportError("Unsupported file type. Use .json or .csv");
          return;
        }

        onOpenChange(false);
      } catch (err) {
        setImportError(
          err instanceof Error ? err.message : "Failed to parse file",
        );
      }
    };

    reader.readAsText(file);
    // Reset input
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>
            Import / Export {context === "contacts" ? "People" : "Companies"}
          </DialogTitle>
        </DialogHeader>

        <TabsRoot
          value={importTab}
          onValueChange={(d) => setImportTab(d.value)}
        >
          <TabsList className="mb-4">
            <TabsTrigger value="export" className="flex items-center gap-2">
              <Download size={14} />
              Export
            </TabsTrigger>
            <TabsTrigger value="import" className="flex items-center gap-2">
              <Upload size={14} />
              Import
            </TabsTrigger>
          </TabsList>

          <TabsContent value="export">
            <div className="space-y-3">
              <p className="text-gray-600 text-sm">
                Export{" "}
                {context === "contacts"
                  ? `${people.length} contacts`
                  : `${companies.length} companies`}
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={exportJSON}
                  className="rounded-lg border border-gray-300 px-4 py-2 text-sm hover:bg-gray-50"
                >
                  Export JSON
                </button>
                <button
                  type="button"
                  onClick={exportCSV}
                  className="rounded-lg border border-gray-300 px-4 py-2 text-sm hover:bg-gray-50"
                >
                  Export CSV
                </button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="import">
            <div className="space-y-3">
              <p className="text-gray-600 text-sm">
                Import {context === "contacts" ? "contacts" : "companies"} from
                a JSON or CSV file
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json,.csv"
                onChange={handleImport}
                className="block w-full text-gray-500 text-sm file:mr-4 file:rounded-lg file:border-0 file:bg-teal-50 file:px-4 file:py-2 file:font-medium file:text-sm file:text-teal-700 hover:file:bg-teal-100"
              />
              {importError && (
                <p className="rounded-lg bg-red-50 px-3 py-2 text-red-700 text-sm">
                  {importError}
                </p>
              )}
            </div>
          </TabsContent>
        </TabsRoot>
      </DialogContent>
    </Dialog>
  );
};

export default ImportExportDialog;
