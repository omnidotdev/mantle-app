import { Link } from "@tanstack/react-router";
import { PrinterIcon } from "lucide-react";
import { useState } from "react";

import BackLink from "@/components/core/BackLink";
import MobileActionBar from "@/components/core/MobileActionBar";
import PageContainer from "@/components/core/PageContainer";
import PageHeader from "@/components/core/PageHeader";
import { Button, buttonVariants } from "@/components/ui/button";
import { SegmentedControl } from "@/components/ui/segmented-control";
import cn from "@/lib/utils";
import { PREVIEW_TYPE_OPTIONS, printQuoteDocument } from "../lib/previewType";
import ContractPreview from "./ContractPreview";
import QuoteForm from "./QuoteForm";
import QuotePreview from "./QuotePreview";

import type { ComponentProps, ReactNode } from "react";
import type { PreviewType } from "../lib/previewType";

type EditorPane = "form" | "preview";

const PANE_OPTIONS: { value: EditorPane; label: string }[] = [
  { value: "form", label: "Form" },
  { value: "preview", label: "Preview" },
];

interface QuoteEditorLayoutProps
  extends Omit<ComponentProps<typeof QuoteForm>, "organizationId"> {
  organizationId: string;
  workspaceSlug: string;
  /** Page title ("New quote", "Edit Q-0042") */
  title: ReactNode;
  onSave: () => void;
  saving: boolean;
}

/**
 * Shared shell for the new and edit quote pages: header with Cancel, Print, and
 * Save, the form beside a live quote/contract preview on wide screens, and a
 * Form/Preview switch below `xl`. On phones the actions move to the bottom bar
 */
const QuoteEditorLayout = ({
  organizationId,
  workspaceSlug,
  title,
  onSave,
  saving,
  ...formProps
}: QuoteEditorLayoutProps) => {
  const { quote, lineItems } = formProps;
  const [pane, setPane] = useState<EditorPane>("form");
  const [previewType, setPreviewType] = useState<PreviewType>("quote");

  const canSave = !saving && !!quote.title?.trim();
  const saveLabel = saving ? "Saving..." : "Save";
  const handlePrint = () => printQuoteDocument(previewType, quote.quoteNumber);

  return (
    <PageContainer width="wide">
      <PageHeader
        back={
          <BackLink to="/@{$workspaceSlug}/quotes" params={{ workspaceSlug }}>
            Quotes
          </BackLink>
        }
        title={title}
        description={
          quote.title?.trim() ? undefined : "Add a title to save this quote"
        }
        actions={
          <div className="hidden md:flex md:flex-wrap md:gap-2">
            <Link
              to="/@{$workspaceSlug}/quotes"
              params={{ workspaceSlug }}
              className={buttonVariants({ variant: "ghost" })}
            >
              Cancel
            </Link>
            <Button variant="outline" onClick={handlePrint}>
              <PrinterIcon />
              Print
            </Button>
            <Button onClick={onSave} disabled={!canSave}>
              {saveLabel}
            </Button>
          </div>
        }
      />

      <SegmentedControl
        label="Editor view"
        className="mb-4 w-fit xl:hidden"
        options={PANE_OPTIONS}
        value={pane}
        onValueChange={setPane}
      />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2 xl:items-start print:block">
        <div
          className={cn(
            "min-w-0 print:hidden",
            pane !== "form" && "max-xl:hidden",
          )}
        >
          <QuoteForm organizationId={organizationId} {...formProps} />
        </div>

        <div
          className={cn(
            "print:block! min-w-0",
            pane !== "preview" && "max-xl:hidden",
          )}
        >
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2 print:hidden">
            <h2 className="font-semibold text-sm">Preview</h2>
            <SegmentedControl
              label="Document"
              options={PREVIEW_TYPE_OPTIONS}
              value={previewType}
              onValueChange={setPreviewType}
            />
          </div>
          {previewType === "contract" ? (
            <ContractPreview
              quote={quote}
              lineItems={lineItems}
              organizationId={organizationId}
            />
          ) : (
            <QuotePreview
              quote={quote}
              lineItems={lineItems}
              organizationId={organizationId}
            />
          )}
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
        <Button className="flex-1" onClick={onSave} disabled={!canSave}>
          {saveLabel}
        </Button>
      </MobileActionBar>
    </PageContainer>
  );
};

export default QuoteEditorLayout;
