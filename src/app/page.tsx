import { requireAuth } from "@/lib/auth-utils";
import { caller } from "@/trpc/server";
import Logout from "./logout";

export default async function Home() {
    await requireAuth();

    const data = await caller.getUser();
    return (
        <div className="min-h-screen min-w-screen flex flex-col items-center justify-center gap-y-6">
            <div>Protected Server Component</div>
            <div className="mx-32">{JSON.stringify(data, null, 2)}</div>
            <Logout />
        </div>
    );
}
