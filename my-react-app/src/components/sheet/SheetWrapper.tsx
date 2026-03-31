import type { ReactNode } from "react";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "../ui/sheet";
import { Separator } from "../ui/separator";

export interface SheetWrapperProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  footer?: ReactNode
  children?: ReactNode;
  side?: "top" | "bottom" | "left" | "right";
  size?: 'small' | 'medium' | 'large' | 'xl';
}

export function SheetWrapper({
  open,
  onClose,
  title,
  description,
  footer,
  children,
  side = 'right',
  size = 'medium',
}: SheetWrapperProps) {
  return (
    <Sheet open={open} onOpenChange={(open) => !open && onClose()}>
      <SheetContent
        side={side}
        size={size}
      >
        <SheetHeader className="items-center">
          <SheetTitle>{title}</SheetTitle>
          {description && (
            <SheetDescription className="text-gray-600 text-md">{description}</SheetDescription>
          )}
        </SheetHeader>
        <Separator />
        <div className="overflow-y-auto scroll-smooth">
          {children}
        </div>
        {footer && (
          <SheetFooter>
            {footer}
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  )
}