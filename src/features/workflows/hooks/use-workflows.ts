import { useTRPC } from "@/trpc/client";
import {
    useMutation,
    useQueryClient,
    useSuspenseQuery,
} from "@tanstack/react-query";
import { toast } from "sonner";
import { useWorkflowsParams } from "./use-workflows-params";

/**
 * Hook to fetch all workflows using suspense
 */
export const useSuspenseWorkflows = () => {
    const trpc = useTRPC();
    const [params] = useWorkflowsParams();

    return useSuspenseQuery(trpc.workflows.getMany.queryOptions(params));
};

/**
 * Hook to fetch a single workflow using suspense
 */
export const useSuspenseWorkflow = (id: string) => {
    const trpc = useTRPC();

    return useSuspenseQuery(trpc.workflows.getOne.queryOptions({ id }));
};

/**
 * Hook to create new workflow
 */
export const useCreateWorkflow = () => {
    const queryClient = useQueryClient();
    const trpc = useTRPC();

    return useMutation(
        trpc.workflows.create.mutationOptions({
            onSuccess: (data) => {
                toast.success(`Workflow "${data.name}" has been created!`);
                queryClient.invalidateQueries(
                    trpc.workflows.getMany.queryOptions({})
                );
            },
            onError: (err) =>
                toast.error(`Failed to create workflow: ${err.message}`),
        })
    );
};

/**
 * Hook to remove workflow
 */
export const useRemoveWorkflow = () => {
    const trpc = useTRPC();
    const queryClient = useQueryClient();

    return useMutation(
        trpc.workflows.remove.mutationOptions({
            onSuccess: (data) => {
                toast.success(`Workflow "${data.name}" removed`);
                queryClient.invalidateQueries(
                    trpc.workflows.getMany.queryOptions({})
                );
                queryClient.invalidateQueries(
                    trpc.workflows.getOne.queryFilter({ id: data.id })
                );
            },
            onError: (err) =>
                toast.error(`Failed to remove workflow: ${err.message}`),
        })
    );
};

/**
 * Hook to update workflow name
 */
export const useUpdateWorkflowName = () => {
    const queryClient = useQueryClient();
    const trpc = useTRPC();

    return useMutation(
        trpc.workflows.updateName.mutationOptions({
            onSuccess: (data) => {
                toast.success(`Workflow "${data.name}" updated`);
                queryClient.invalidateQueries(
                    trpc.workflows.getMany.queryOptions({})
                );
                queryClient.invalidateQueries(
                    trpc.workflows.getOne.queryOptions({ id: data.id })
                );
            },
            onError: (err) =>
                toast.error(`Failed to update workflow: ${err.message}`),
        })
    );
};
