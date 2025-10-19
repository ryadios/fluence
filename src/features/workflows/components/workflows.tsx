"use client";

import { EntityHeader, EntityContainer } from "@/components/entity-components";
import {
    useCreateWorkflow,
    useSuspenseWorkflows,
} from "../hooks/use-workflows";
import { err } from "inngest/types";
import { useUpgradeModal } from "@/hooks/use-upgrade-modal";
import { useRouter } from "next/navigation";

export function WorkflowsList() {
    const workflows = useSuspenseWorkflows();

    return (
        <div className="flex flex-1 justify-center items-center">
            <p>{JSON.stringify(workflows.data, null, 2)}</p>
        </div>
    );
}

export function WorkflowsHeader({ disabled }: { disabled?: boolean }) {
    const createWorkflow = useCreateWorkflow();
    const router = useRouter();
    const { handleError, modal } = useUpgradeModal();

    const handleCreate = () => {
        createWorkflow.mutate(undefined, {
            onSuccess: (data) => {
                router.push(`/workflows/${data.id}`);
            },
            onError: (err) => {
                handleError(err);
            },
        });
    };
    return (
        <>
            {modal}
            <EntityHeader
                title="Workflows"
                description="Create and manage your workflows"
                onNew={handleCreate}
                newButtonLabel="New Workflow"
                disabled={disabled}
                isCreating={createWorkflow.isPending}
            />
        </>
    );
}

export function WorkflowsContainer({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <EntityContainer
            header={<WorkflowsHeader />}
            search={<></>}
            pagination={<></>}
        >
            {children}
        </EntityContainer>
    );
}
