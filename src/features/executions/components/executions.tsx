"use client";

import {
    EntityHeader,
    EntityContainer,
    EntityPagination,
    LoadingView,
    ErrorView,
    EmptyView,
    EntityList,
    EntityItem,
} from "@/components/entity-components";
import { useSuspenseExecutions } from "../hooks/use-executions";
import { useExecutionsParams } from "../hooks/use-executions-params";
import { ExecutionStatus, type Execution } from "@/generated/prisma";
import { formatDistanceToNow } from "date-fns";
import { CheckCircle2Icon, ClockIcon, Loader2Icon, XCircleIcon } from "lucide-react";

export function ExecutionsList() {
    const executions = useSuspenseExecutions();

    return (
        <EntityList
            items={executions.data.items}
            getKey={(execution) => execution.id}
            renderItem={(execution) => <ExecutionItem data={execution} />}
            emptyView={<ExecutionsEmpty />}
        />
    );
}

export function ExecutionsHeader() {
    return <EntityHeader title="Executions" description="View your workflow executions history" />;
}

export function ExecutionsPagination() {
    const executions = useSuspenseExecutions();
    const [params, setParams] = useExecutionsParams();

    return (
        <EntityPagination
            disabled={executions.isFetching}
            totalPages={executions.data.totalPages}
            page={executions.data.page}
            onPageChange={(page) => setParams({ ...params, page: page })}
        />
    );
}

export function ExecutionsContainer({ children }: { children: React.ReactNode }) {
    return (
        <EntityContainer header={<ExecutionsHeader />} pagination={<ExecutionsPagination />}>
            {children}
        </EntityContainer>
    );
}

export function ExecutionsLoading() {
    return <LoadingView message="Loading executions..." />;
}

export function ExecutionsError() {
    return <ErrorView message="Error loading executions..." />;
}

export function ExecutionsEmpty() {
    return <EmptyView message="You haven't created any executions yet. Get started by running your first workflow" />;
}

const getStatusIcon = (status: ExecutionStatus) => {
    switch (status) {
        case ExecutionStatus.SUCCESS:
            return <CheckCircle2Icon className="size-5 text-green-600" />;
        case ExecutionStatus.FAILED:
            return <XCircleIcon className="size-5 text-red-600" />;
        case ExecutionStatus.RUNNING:
            return <Loader2Icon className="size-5 text-blue-600 animate-spin" />;
        default:
            return <ClockIcon className="size-5 text-muted-foreground" />;
    }
};

const formatStatus = (status: ExecutionStatus) => status.charAt(0) + status.slice(1).toLowerCase();

export function ExecutionItem({ data }: { data: Execution & { workflow: { id: string; name: string } } }) {
    const duration = data.completedAt
        ? Math.round((new Date(data.completedAt).getTime() - new Date(data.startedAt).getTime()) / 1000)
        : null;

    const subtitle = (
        <>
            {data.workflow.name} &bull; Started {formatDistanceToNow(data.startedAt, { addSuffix: true })}
            {duration != null && <> &bull; Took {duration}s</>}
        </>
    );

    return (
        <EntityItem
            href={`/executions/${data.id}`}
            title={formatStatus(data.status)}
            subtitle={subtitle}
            image={<div className="size-8 flex items-center justify-center">{getStatusIcon(data.status)}</div>}
        />
    );
}
