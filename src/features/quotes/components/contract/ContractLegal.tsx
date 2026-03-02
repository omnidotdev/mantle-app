interface ContractLegalProps {
  registrationState: string | null;
}

const ContractLegal = ({ registrationState }: ContractLegalProps) => {
  const governingState = registrationState || "Minnesota";

  return (
    <div className="space-y-4 text-gray-700 text-sm">
      {/* Section 10: Liability */}
      <div>
        <h3 className="font-semibold text-gray-900 text-lg">
          10. Limitation of Liability
        </h3>
        <p>
          The Developer&apos;s total liability under this Agreement shall not
          exceed the total amount paid by the Client for services. Neither party
          shall be liable for indirect, incidental, or consequential damages.
        </p>
      </div>

      {/* Section 11: Compliance */}
      <div>
        <h3 className="font-semibold text-gray-900 text-lg">
          11. Compliance Disclaimer
        </h3>
        <p>
          The Developer makes no guarantees regarding regulatory compliance
          (e.g. HIPAA, GDPR, PCI-DSS). The Client is responsible for ensuring
          that the deliverables meet applicable regulatory requirements.
        </p>
      </div>

      {/* Section 12: Termination */}
      <div>
        <h3 className="font-semibold text-gray-900 text-lg">
          12. Termination & Refund Policy
        </h3>
        <p>
          Either party may terminate this Agreement with 14 days&apos; written
          notice. Upon termination, the Client shall pay for all work completed
          to date. No refunds for completed milestones.
        </p>
      </div>

      {/* Section 13: Governing law */}
      <div>
        <h3 className="font-semibold text-gray-900 text-lg">
          13. Governing Law & Dispute Resolution
        </h3>
        <p>
          This Agreement shall be governed by the laws of the State of{" "}
          {governingState}. Any disputes shall first be resolved through good
          faith mediation. If mediation fails, disputes shall be settled by
          binding arbitration in {governingState}.
        </p>
      </div>

      {/* Section 14: Miscellaneous */}
      <div>
        <h3 className="font-semibold text-gray-900 text-lg">
          14. Miscellaneous
        </h3>
        <p>
          This Agreement constitutes the entire agreement between the parties.
          Any amendments must be in writing and signed by both parties. If any
          provision is found unenforceable, the remaining provisions shall
          continue in full force.
        </p>
      </div>
    </div>
  );
};

export default ContractLegal;
