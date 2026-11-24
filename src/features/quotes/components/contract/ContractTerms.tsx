import type { QuoteLineItem } from "@/features/quotes/types/quote";

interface ContractTermsProps {
  timeRange: string | null;
  lineItems: Partial<QuoteLineItem>[];
}

const ContractTerms = ({ timeRange, lineItems }: ContractTermsProps) => {
  const hasRoyalty = lineItems.some((li) => li.pricingType === "royalty");
  const hasHourly = lineItems.some((li) => li.pricingType === "hourly");
  const hasMinBilling = lineItems.some(
    (li) => li.pricingType === "hourly" && Number(li.minimumBillingMinutes) > 0,
  );

  return (
    <div className="space-y-4 text-sm">
      {/* Section 3: Timeline */}
      <div>
        <h3 className="text-lg font-semibold">3. Timeline</h3>
        <p>
          {timeRange
            ? `The estimated project timeline is ${timeRange}.`
            : "The project timeline will be determined upon commencement of work."}{" "}
          Timelines are estimates and may be adjusted with mutual agreement.
        </p>
      </div>

      {/* Section 4: Ownership */}
      <div>
        <h3 className="text-lg font-semibold">4. Ownership and licensing</h3>
        <p>
          Upon full payment, the Client receives a perpetual, non-exclusive
          license to use all deliverables. The Developer retains ownership of
          underlying tools, frameworks, and reusable components developed
          independently.
        </p>
      </div>

      {/* Section 5: Portfolio */}
      <div>
        <h3 className="text-lg font-semibold">
          5. Portfolio and marketing rights
        </h3>
        <p>
          The Developer may reference this project in portfolios and marketing
          materials unless the Client provides written notice to the contrary
          within 30 days of project completion.
        </p>
      </div>

      {/* Section 6: Confidentiality */}
      <div>
        <h3 className="text-lg font-semibold">6. Confidentiality</h3>
        <p>
          Both parties agree to keep confidential any proprietary information
          shared during the course of this engagement. This obligation survives
          termination of this Agreement for a period of two (2) years.
        </p>
      </div>

      {/* Section 7: Maintenance */}
      <div>
        <h3 className="text-lg font-semibold">7. Maintenance and support</h3>
        <p>
          A 30-day warranty period for bug fixes begins upon delivery of each
          milestone.
        </p>
        {hasRoyalty && (
          <p className="mt-1">
            For royalty-based items, ongoing maintenance is included for the
            duration of the royalty period. The Client may opt out of royalty
            obligations by exercising the buyout option specified in the Payment
            Terms.
          </p>
        )}
      </div>

      {/* Section 8: Change requests */}
      <div>
        <h3 className="text-lg font-semibold">
          8. Change requests and scope creep
        </h3>
        <p>
          Changes outside the original scope require a written change request.
          The Developer will provide a cost and timeline estimate before
          proceeding.
        </p>
        {hasHourly && (
          <p className="mt-1">
            Hourly-billed items will be tracked and reported on a weekly basis.
            Work will pause when hourly caps are reached unless the Client
            authorizes additional hours in writing.
          </p>
        )}
        {hasMinBilling && (
          <p className="mt-1">
            Hourly-billed items with a minimum billing increment will be billed
            at no less than the specified minimum, regardless of actual time
            spent.
          </p>
        )}
      </div>

      {/* Section 9: External costs */}
      <div>
        <h3 className="text-lg font-semibold">9. External provider costs</h3>
        <p>
          Any third-party services, APIs, hosting, or tools required for the
          project are the Client&apos;s financial responsibility unless
          explicitly included in this Agreement.
        </p>
      </div>
    </div>
  );
};

export default ContractTerms;
