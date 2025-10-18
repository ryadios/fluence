import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import Client from "./client";
import { Suspense } from "react";

export default async function Home() {
    const queryClient = getQueryClient();

    void queryClient.prefetchQuery(trpc.getUser.queryOptions());

    return (
        <div className="min-h-screen min-w-screen flex items-center justify-center">
            <HydrationBoundary state={dehydrate(queryClient)}>
                <Suspense fallback={<p className="text-2xl">Loading...</p>}>
                    <Client />
                </Suspense>
            </HydrationBoundary>
        </div>
    );
}
