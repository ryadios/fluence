import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "./auth";

export const requireAuth = async () => {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    console.log("Checking your session....");

    console.log(session);
    if (!session) redirect("/login");
    return session;
};

export const requireUnAuth = async () => {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (session) redirect("/");
};
