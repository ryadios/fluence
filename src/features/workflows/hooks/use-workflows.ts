import { useTRPC } from "@/trpc/client";
import {
    useMutation,
    useQueryClient,
    useSuspenseQuery,
} from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

/**
 * Hook to fetch all workflows using suspense
 */
export const useSuspenseWorkflows = () => {
    const trpc = useTRPC();

    return useSuspenseQuery(trpc.workflows.getMany.queryOptions());
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
                    trpc.workflows.getMany.queryOptions()
                );
            },
            onError: (err) =>
                toast.error(`Failed to create workflow: ${err.message}`),
        })
    );
};
