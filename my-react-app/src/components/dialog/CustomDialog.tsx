import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { type ReactNode } from "react";
import { Separator } from "../ui/separator";
import { X } from "lucide-react";

interface CustomDialogProps {
    title?: string;
    description?: string;
    children?: ReactNode;
    onConfirm?: () => void;
    onCancel?: () => void;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    confirmLabel?: string;
    cancelLabel?: string;
    showFooter?: boolean;
}

export function CustomDialog({
    title = "Dialog",
    description,
    children,
    onConfirm,
    onCancel,
    open,
    onOpenChange,
    confirmLabel = "Save changes",
    cancelLabel = "Cancel",
    showFooter = true,
}: CustomDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                className="w-full sm:max-w-3xl max-h-[90vh] min-h-[400px] flex flex-col overflow-hidden"
            >
                <DialogHeader>
                    <DialogTitle className="text-center !text-[22px] !font-semibold">
                        {title}
                    </DialogTitle>
                    <DialogClose asChild className="absolute right-2 top-2 bg-white h-8 w-8 z-10">
                        <Button variant="link" onClick={onCancel}>
                            <X className="h-5 w-5 " />
                        </Button>
                    </DialogClose>
                    {description && (
                        <DialogDescription className="text-center text-gray-400 text-base font-semibold">
                            {description}
                        </DialogDescription>
                    )}
                </DialogHeader>

                <Separator />

                {/* Scrollable content wrapper */}
                <div className="flex-1 overflow-y-auto px-4 py-2">
                    {children}
                </div>

                {showFooter && (<DialogFooter
                    className="border-t sticky bottom-0 left-0 right-0 bg-white z-10 mt-auto px-4 py-3">
                    <div className="flex justify-end gap-2">
                        <DialogClose asChild>
                            <Button variant="outline" onClick={onCancel}>
                                {cancelLabel}
                            </Button>
                        </DialogClose>
                        <Button color="green" onClick={onConfirm}>
                            {confirmLabel}
                        </Button>
                    </div>
                </DialogFooter>
                )}
            </DialogContent>
        </Dialog>
    );
}

