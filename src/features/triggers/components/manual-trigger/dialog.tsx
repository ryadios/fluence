"use client";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function ManualTriggerDialog({ open, onOpenChange }: Props) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Manual Trigger</DialogTitle>
                    <DialogDescription>
                        Configure the settings for manual trigger node.
                    </DialogDescription>
                </DialogHeader>
                <div className="py-2">
                    <p className="text-sm text-muted-foreground">
                        Used to manually execute a workflow, no configuration
                        available.
                    </p>
                </div>
            </DialogContent>
        </Dialog>
    );
}
