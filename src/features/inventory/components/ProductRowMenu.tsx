import { Portal } from "@ark-ui/react";
import {
  MenuContent,
  MenuItem,
  MenuPositioner,
  MenuRoot,
  MenuSeparator,
  MenuTrigger,
} from "@omnidotdev/thornberry/menu";
import {
  EllipsisVerticalIcon,
  EyeIcon,
  PencilIcon,
  Trash2Icon,
} from "lucide-react";

import { buttonVariants } from "@/components/ui/button";

type ProductRowAction = "view" | "edit" | "delete";

interface ProductRowMenuProps {
  productName: string;
  onAction: (action: ProductRowAction) => void;
}

/**
 * Kebab menu for a product row. Stops clicks and key presses from reaching the
 * row, so opening the menu never also opens the product
 */
const ProductRowMenu = ({ productName, onAction }: ProductRowMenuProps) => (
  <div
    className="flex justify-end"
    onClick={(e) => e.stopPropagation()}
    onKeyDown={(e) => e.stopPropagation()}
  >
    <MenuRoot
      positioning={{ placement: "bottom-end" }}
      onSelect={({ value }) => onAction(value as ProductRowAction)}
    >
      <MenuTrigger
        aria-label={`Actions for ${productName}`}
        className={buttonVariants({ variant: "ghost", size: "icon-sm" })}
      >
        <EllipsisVerticalIcon />
      </MenuTrigger>
      <Portal>
        <MenuPositioner>
          <MenuContent className="min-w-40">
            <MenuItem value="view">
              <EyeIcon className="size-4" />
              View
            </MenuItem>
            <MenuItem value="edit">
              <PencilIcon className="size-4" />
              Edit
            </MenuItem>
            <MenuSeparator />
            <MenuItem value="delete" variant="destructive">
              <Trash2Icon className="size-4" />
              Delete
            </MenuItem>
          </MenuContent>
        </MenuPositioner>
      </Portal>
    </MenuRoot>
  </div>
);

export default ProductRowMenu;
export type { ProductRowAction };
