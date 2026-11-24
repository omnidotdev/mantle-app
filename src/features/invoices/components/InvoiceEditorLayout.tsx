import { PrinterIcon } from "lucide-react";
import { useState } from "react";

import MobileActionBar from "@/components/core/MobileActionBar";
import PageContainer from "@/components/core/PageContainer";
import PageHeader from "@/components/core/PageHeader";
import { Button } from "@/components/ui/button";
import { SegmentedControl } from "@/components/ui/segmented-control";
import cn from "@/lib/utils";

import type { ReactNode } from "react";

type EditorView = "form" | "preview";

interface InvoiceEditorLayoutProps {
  title: ReactNode;
  /** A `<BackLink>` shown above the title */
  back: ReactNode;
  /** Render the cancel link with the given button classes */
  renderCancel: (className?: string) => ReactNode;
  onSave: () => void;
  saving: boolean;
  /** Document title used while printing (becomes the PDF file name) */
  printTitle: string;
  form: ReactNode;
  preview: ReactNode;
}

/**
 * Shared frame for the new and edit invoice pages: header with Cancel, Print,
 * and Save; the form beside a live preview on wide screens and a Form/Preview
 * switch below `xl`; Save in a bottom bar on phones. Printing always outputs
 * only the preview document
 */
const InvoiceEditorLayout = ({
  title,
  back,
  renderCancel,
  onSave,
  saving,
  printTitle,
  form,
  preview,
}: InvoiceEditorLayoutProps) => {
  const [view, setView] = useState<EditorView>("form");

  const handlePrint = () => {
    const originalTitle = document.title;
    document.title = printTitle;
    window.print();
    document.title = originalTitle;
  };

  const saveLabel = saving ? "Saving..." : "Save";

  return (
    <PageContainer width="wide">
      <PageHeader
        back={back}
        title={title}
        actions={
          <div className="hidden md:flex md:flex-wrap md:items-center md:gap-2">
            {renderCancel()}
            <Button variant="outline" onClick={handlePrint}>
              <PrinterIcon />
              Print
            </Button>
            <Button onClick={onSave} disabled={saving}>
              {saveLabel}
            </Button>
          </div>
        }
      />

      <SegmentedControl
        label="Editor view"
        options={[
          { value: "form", label: "Form" },
          { value: "preview", label: "Preview" },
        ]}
        value={view}
        onValueChange={setView}
        className="mb-5 w-fit xl:hidden"
      />

      <div className="grid items-start gap-6 xl:grid-cols-2 print:block">
        <div
          className={cn(
            "min-w-0 print:hidden",
            view === "preview" && "max-xl:hidden",
          )}
        >
          {form}
        </div>

        {/* Always printed, whichever view is showing on screen */}
        <div
          className={cn(
            "min-w-0",
            view === "form" && "max-xl:hidden print:block",
          )}
        >
          {preview}
        </div>
      </div>

      <MobileActionBar>
        <Button
          variant="outline"
          size="icon"
          onClick={handlePrint}
          aria-label="Print or save PDF"
        >
          <PrinterIcon />
        </Button>
        {renderCancel("flex-1")}
        <Button className="flex-1" onClick={onSave} disabled={saving}>
          {saveLabel}
        </Button>
      </MobileActionBar>
    </PageContainer>
  );
};

export default InvoiceEditorLayout;
