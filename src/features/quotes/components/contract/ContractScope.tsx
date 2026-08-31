import { formatProjectType } from "@/features/quotes/lib/projectType";

import type { QuoteLineItem } from "@/features/quotes/types/quote";

interface ContractScopeProps {
  projectName: string;
  projectType: string | null;
  description: string | null;
  lineItems: Partial<QuoteLineItem>[];
}

const ContractScope = ({
  projectName,
  projectType,
  description,
  lineItems,
}: ContractScopeProps) => {
  const itemsWithDeliverables = lineItems.filter(
    (li) => li.deliverables?.length || li.acceptanceCriteria?.length,
  );

  return (
    <div className="space-y-3">
      <h3 className="font-semibold text-foreground text-lg">
        1. Scope of Work
      </h3>

      <div className="space-y-2 text-foreground text-sm">
        <p>
          <strong>Project:</strong> {projectName}
        </p>
        {projectType && (
          <p>
            <strong>Type:</strong> {formatProjectType(projectType)}
          </p>
        )}
        {description && (
          <p>
            <strong>Description:</strong> {description}
          </p>
        )}

        {itemsWithDeliverables.length > 0 && (
          <div className="mt-4 space-y-4">
            {itemsWithDeliverables.map((item) => (
              <div key={item.id} className="rounded bg-muted p-3">
                <p className="font-medium">{item.description}</p>

                {item.deliverables && item.deliverables.length > 0 && (
                  <div className="mt-2">
                    <p className="font-medium text-xs">Deliverables:</p>
                    <ul className="list-disc space-y-0.5 pl-5 text-sm">
                      {item.deliverables.map((d) => (
                        <li key={d}>{d}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {item.acceptanceCriteria &&
                  item.acceptanceCriteria.length > 0 && (
                    <div className="mt-2">
                      <p className="font-medium text-xs">
                        Acceptance Criteria:
                      </p>
                      <ul className="list-disc space-y-0.5 pl-5 text-sm">
                        {item.acceptanceCriteria.map((c) => (
                          <li key={c}>{c}</li>
                        ))}
                      </ul>
                    </div>
                  )}
              </div>
            ))}
          </div>
        )}

        <p className="text-muted-foreground text-xs italic">
          Any modifications outside the defined scope will require a separate
          agreement or amendment to this contract.
        </p>
      </div>
    </div>
  );
};

export default ContractScope;
