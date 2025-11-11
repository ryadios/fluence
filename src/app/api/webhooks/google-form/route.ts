import { sendWorkflowExecution } from "@/inngest/utils";
import { type NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const url = new URL(req.url);
        const workflowId = url.searchParams.get("workflowId");

        if (!workflowId)
            return NextResponse.json(
                {
                    success: false,
                    error: "Missing required query parameter: workflowId",
                },
                { status: 400 }
            );

        const body = await req.json();

        const formData = {
            formId: body.formId,
            formTitle: body.formTitle,
            responseId: body.responseId,
            timestamp: body.timestamp,
            respondentEmail: body.respondentEmail,
            responses: body.responses,
            raw: body,
        };

        // Trigger an inngest job
        await sendWorkflowExecution({
            workflowId,
            initialData: {
                googleForm: formData,
            },
        });
    } catch (err) {
        console.error("Google form webhook error: ", err);
        return NextResponse.json(
            {
                success: false,
                error: "Failed to process Google Form submission",
            },
            { status: 500 }
        );
    }
}
