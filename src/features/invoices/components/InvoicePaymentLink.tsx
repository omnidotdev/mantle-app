import { isHttpsUrl } from "@/features/invoices/types/invoice";

interface InvoicePaymentLinkProps {
  /** The invoice's payment link; anything but an https link renders nothing */
  url: string | null | undefined;
  /** Button color, the workspace's document accent */
  accentColor: string;
}

/**
 * "Pay online" on the invoice document: a link to the payment page on screen,
 * and the address spelled out in print, since paper cannot be clicked
 */
const InvoicePaymentLink = ({ url, accentColor }: InvoicePaymentLinkProps) => {
  if (!isHttpsUrl(url)) return null;
  const href = url?.trim() ?? "";

  return (
    <div className="mb-8">
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center rounded-md px-4 py-2 font-semibold text-sm text-white print:hidden"
        style={{ backgroundColor: accentColor }}
      >
        Pay online
      </a>
      <p className="hidden text-base-900 print:block">
        <span className="font-bold">Pay online:</span>{" "}
        <span className="break-all">{href}</span>
      </p>
    </div>
  );
};

export default InvoicePaymentLink;
