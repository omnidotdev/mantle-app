import { Link } from "@tanstack/react-router";
import {
  ChevronRightIcon,
  FileTextIcon,
  ReceiptIcon,
  UserPlusIcon,
} from "lucide-react";

import SectionCard from "@/components/core/SectionCard";
import {
  IconChip,
  RowText,
  dashboardRowClass,
} from "@/features/dashboard/components/DashboardRow";

/**
 * First-run card for a brand-new workspace: the three records most people
 * create first, each one click away
 */
const GetStartedCard = ({ workspaceSlug }: { workspaceSlug: string }) => (
  <SectionCard title="Get started" flush className="mb-4 lg:mb-6">
    <ul className="divide-y divide-border">
      <li>
        <Link
          to="/@{$workspaceSlug}/people/contacts/new"
          params={{ workspaceSlug }}
          className={dashboardRowClass}
        >
          <IconChip icon={UserPlusIcon} tone="rose" />
          <RowText
            title="Add a contact"
            sub="The people and companies you work with"
          />
          <ChevronRightIcon className="size-4 shrink-0 text-muted-foreground" />
        </Link>
      </li>
      <li>
        <Link
          to="/@{$workspaceSlug}/quotes/new"
          params={{ workspaceSlug }}
          className={dashboardRowClass}
        >
          <IconChip icon={FileTextIcon} tone="warning" />
          <RowText title="Create a quote" sub="Price out work for a client" />
          <ChevronRightIcon className="size-4 shrink-0 text-muted-foreground" />
        </Link>
      </li>
      <li>
        <Link
          to="/@{$workspaceSlug}/invoices/new"
          params={{ workspaceSlug }}
          className={dashboardRowClass}
        >
          <IconChip icon={ReceiptIcon} tone="brand" />
          <RowText
            title="Create an invoice"
            sub="Bill a client and track payment"
          />
          <ChevronRightIcon className="size-4 shrink-0 text-muted-foreground" />
        </Link>
      </li>
    </ul>
  </SectionCard>
);

export default GetStartedCard;
