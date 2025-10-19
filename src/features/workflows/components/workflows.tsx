"use client";

import {
    EntityHeader,
    EntityContainer,
    EntitySearch,
    EntityPagination,
} from "@/components/entity-components";
import {
    useCreateWorkflow,
    useSuspenseWorkflows,
} from "../hooks/use-workflows";
import { useUpgradeModal } from "@/hooks/use-upgrade-modal";
import { useRouter } from "next/navigation";
import { useWorkflowsParams } from "../hooks/use-workflows-params";
import { useEntitySearch } from "@/hooks/use-entity-search";

export function WorkflowsSearch() {
    const [params, setParams] = useWorkflowsParams();
    const { searchValue, onSearchChange } = useEntitySearch({
        params,
        setParams,
    });
    return (
        <EntitySearch
            value={searchValue}
            onChange={onSearchChange}
            placeholder="Search workflows"
        />
    );
}

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

export function WorkflowsPagination() {
    const workflows = useSuspenseWorkflows();
    const [params, setParams] = useWorkflowsParams();

    return (
        <EntityPagination
            disabled={workflows.isFetching}
            totalPages={workflows.data.totalPages}
            page={workflows.data.page}
            onPageChange={(page) => setParams({ ...params, page: page })}
        />
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
            search={<WorkflowsSearch></WorkflowsSearch>}
            pagination={<WorkflowsPagination></WorkflowsPagination>}
        >
            {children}
        </EntityContainer>
    );
}
