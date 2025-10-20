"use client";

import {
    EntityHeader,
    EntityContainer,
    EntitySearch,
    EntityPagination,
    LoadingView,
    ErrorView,
    EmptyView,
    EntityList,
    EntityItem,
} from "@/components/entity-components";
import {
    useCreateWorkflow,
    useRemoveWorkflow,
    useSuspenseWorkflows,
} from "../hooks/use-workflows";
import { useUpgradeModal } from "@/hooks/use-upgrade-modal";
import { useRouter } from "next/navigation";
import { useWorkflowsParams } from "../hooks/use-workflows-params";
import { useEntitySearch } from "@/hooks/use-entity-search";
import type { Workflow } from "@/generated/prisma";
import { WorkflowIcon } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

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
        <EntityList
            items={workflows.data.items}
            getKey={(workflow) => workflow.id}
            renderItem={(workflow) => <WorkflowItem data={workflow} />}
            emptyView={<WorkflowsEmpty />}
        />
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
            search={<WorkflowsSearch />}
            pagination={<WorkflowsPagination />}
        >
            {children}
        </EntityContainer>
    );
}

export function WorkflowsLoading() {
    return <LoadingView message="Loading workflows..." />;
}

export function WorkflowsError() {
    return <ErrorView message="Error loading workflows..." />;
}

export function WorkflowsEmpty() {
    const router = useRouter();
    const createWorkflow = useCreateWorkflow();
    const { handleError, modal } = useUpgradeModal();

    const handleCreate = () => {
        createWorkflow.mutate(undefined, {
            onSuccess: (data) => router.push(`/workflows/${data.id}`),
            onError: (err) => handleError(err),
        });
    };
    return (
        <>
            {modal}
            <EmptyView
                onNew={handleCreate}
                title="No workflows found"
                message="You haven't created any workflows yet. Get started by creating your first workflow"
                buttonLabel="Create Workflow"
            />
        </>
    );
}

export function WorkflowItem({ data }: { data: Workflow }) {
    const removeWorkflow = useRemoveWorkflow();

    const handleRemove = () => {
        removeWorkflow.mutate({
            id: data.id,
        });
    };

    return (
        <EntityItem
            href={`/workflows/${data.id}`}
            title={data.name}
            subtitle={
                <>
                    Updated{" "}
                    {formatDistanceToNow(data.updatedAt, {
                        addSuffix: true,
                    })}{" "}
                    &bull; Created{" "}
                    {formatDistanceToNow(data.createdAt, {
                        addSuffix: true,
                    })}{" "}
                </>
            }
            image={
                <div className="size-8 flex items-center justify-center">
                    <WorkflowIcon className="size-5 text-muted-foreground" />
                </div>
            }
            onRemove={handleRemove}
            isRemoving={removeWorkflow.isPending}
        />
    );
}
