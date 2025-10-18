"use client";

import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";

export default function Client() {
    const trpc = useTRPC();
    const { data: users } = useSuspenseQuery(trpc.getUser.queryOptions());
    return (
        <div className="text-2xl">
            Client Component: {JSON.stringify(users)}
        </div>
    );
}
