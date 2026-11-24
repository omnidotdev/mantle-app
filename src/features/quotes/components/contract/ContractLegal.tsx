import DocumentHint from "@/features/quotes/components/DocumentHint";

interface ContractLegalProps {
  registrationState: string | null;
  /** Quote-specific terms, numbered after the standard legal sections */
  additionalTerms: string[] | null;
}

const ContractLegal = ({
  registrationState,
  additionalTerms,
}: ContractLegalProps) => {
  // Never assume a state: without one set, name the jurisdiction generically
  const governingState = registrationState?.trim() || null;

  return (
    <div className="space-y-4 text-sm">
      {/* Section 10: Liability */}
      <div>
        <h3 className="text-lg font-semibold">10. Limitation of liability</h3>
        <p>
          The Developer&apos;s total liability under this Agreement shall not
          exceed the total amount paid by the Client for services. Neither party
          shall be liable for indirect, incidental, or consequential damages.
        </p>
      </div>

      {/* Section 11: Compliance */}
      <div>
        <h3 className="text-lg font-semibold">11. Compliance disclaimer</h3>
        <p>
          The Developer makes no guarantees regarding regulatory compliance
          (e.g. HIPAA, GDPR, PCI-DSS). The Client is responsible for ensuring
          that the deliverables meet applicable regulatory requirements.
        </p>
      </div>

      {/* Section 12: Termination */}
      <div>
        <h3 className="text-lg font-semibold">
          12. Termination and refund policy
        </h3>
        <p>
          Either party may terminate this Agreement with 14 days&apos; written
          notice. Upon termination, the Client shall pay for all work completed
          to date. No refunds for completed milestones.
        </p>
      </div>

      {/* Section 13: Governing law */}
      <div>
        <h3 className="text-lg font-semibold">
          13. Governing law and dispute resolution
        </h3>
        {governingState ? (
          <p>
            This Agreement shall be governed by the laws of the State of{" "}
            {governingState}. Any disputes shall first be resolved through good
            faith mediation. If mediation fails, disputes shall be settled by
            binding arbitration in {governingState}.
          </p>
        ) : (
          <p>
            This Agreement shall be governed by the laws of the jurisdiction in
            which the Developer is registered. Any disputes shall first be
            resolved through good faith mediation. If mediation fails, disputes
            shall be settled by binding arbitration in that jurisdiction.{" "}
            <DocumentHint>
              Add your registration state in Settings to name it here.
            </DocumentHint>
          </p>
        )}
      </div>

      {/* Section 14: Miscellaneous */}
      <div>
        <h3 className="text-lg font-semibold">14. Miscellaneous</h3>
        <p>
          This Agreement constitutes the entire agreement between the parties.
          Any amendments must be in writing and signed by both parties. If any
          provision is found unenforceable, the remaining provisions shall
          continue in full force.
        </p>
      </div>

      {/* Section 15: Additional terms */}
      {additionalTerms && additionalTerms.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold">15. Additional terms</h3>
          <ul className="list-disc space-y-1 pl-5">
            {additionalTerms.map((term) => (
              <li key={term}>{term}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ContractLegal;
