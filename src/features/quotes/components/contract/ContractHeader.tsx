import dayjs from "dayjs";

interface ContractHeaderProps {
  contractId: string;
  date: string;
}

const ContractHeader = ({ contractId, date }: ContractHeaderProps) => {
  return (
    <div className="rounded-t-lg bg-linear-to-r from-primary-700 to-primary-500 p-8 text-white">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <img
            src="/omni-logo.svg"
            alt="Omni Logo"
            className="h-12 w-12 object-contain"
            style={{ filter: "brightness(0) invert(1)" }}
          />
          <div>
            <h1 className="font-bold text-2xl">Service Agreement</h1>
            <p className="text-primary-100">Professional Services Contract</p>
          </div>
        </div>
        <div className="text-right text-sm">
          <p>Date: {dayjs(date).format("MMMM D, YYYY")}</p>
          <p>Contract ID: {contractId}</p>
        </div>
      </div>
    </div>
  );
};

export default ContractHeader;
