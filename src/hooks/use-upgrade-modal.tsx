"use client";

import { TRPCClientError } from "@trpc/client";
import { UpgradeModal } from "@/components/upgrade-modal";
import { useState } from "react";

export const useUpgradeModal = () => {
    const [open, setOpen] = useState(false);

    const handleError = (err: unknown) => {
        if (err instanceof TRPCClientError) {
            if (err.data?.code === "FORBIDDEN") {
                setOpen(true);
                return true;
            }
        }

        return false;
    };

    const modal = <UpgradeModal open={open} onOpenChange={setOpen} />;

    return { handleError, modal };
};
