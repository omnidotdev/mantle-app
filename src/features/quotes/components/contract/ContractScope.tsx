interface ContractScopeProps {
  projectName: string;
  projectType: string | null;
  description: string | null;
}

const ContractScope = ({
  projectName,
  projectType,
  description,
}: ContractScopeProps) => {
  return (
    <div className="space-y-3">
      <h3 className="font-semibold text-gray-900 text-lg">1. Scope of Work</h3>

      <div className="space-y-2 text-gray-700 text-sm">
        <p>
          <strong>Project:</strong> {projectName}
        </p>
        {projectType && (
          <p>
            <strong>Type:</strong> {projectType}
          </p>
        )}
        {description && (
          <p>
            <strong>Description:</strong> {description}
          </p>
        )}
        <p className="text-gray-500 text-xs italic">
          Any modifications outside the defined scope will require a separate
          agreement or amendment to this contract.
        </p>
      </div>
    </div>
  );
};

export default ContractScope;
