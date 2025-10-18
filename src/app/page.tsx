"use client";

import Logout from "./logout";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function Home() {
    const trpc = useTRPC();
    const { data } = useQuery(trpc.getWorkflows.queryOptions());

    const create = useMutation(
        trpc.createWorkflow.mutationOptions({
            onSuccess: () => {
                toast.success("Job queued!");
            },
        })
    );

    return (
        <div className="min-h-screen min-w-screen flex flex-col items-center justify-center gap-y-6">
            <div>Protected Server Component</div>
            <div className="mx-32">{JSON.stringify(data, null, 2)}</div>
            <Button onClick={() => create.mutate()} disabled={create.isPending}>
                Create Workflow
            </Button>
            <Logout />
        </div>
    );
}
