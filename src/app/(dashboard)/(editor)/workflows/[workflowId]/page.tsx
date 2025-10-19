import { requireAuth } from "@/lib/auth-utils";

interface PageProps {
    params: Promise<{
        workflowId: string;
    }>;
}

export default async function Page({ params }: PageProps) {
    await requireAuth();

    const { workflowId } = await params;
    return <p>Workflow ID: {workflowId}</p>;
}
