import type { NodeExecutor } from "@/features/executions/types";
import { NonRetriableError } from "inngest";
import HandleBars from "handlebars";
import { geminiChannel } from "@/inngest/channels/gemini";
import { AVAILABLE_MODELS } from "./dialog";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateText } from "ai";

HandleBars.registerHelper("json", (context) => {
    const jsonString = JSON.stringify(context, null, 2);
    const safeString = new HandleBars.SafeString(jsonString);

    return safeString;
});

type GeminiData = {
    variableName?: string;
    model?: (typeof AVAILABLE_MODELS)[number];
    systemPrompt?: string;
    userPrompt?: string;
};

export const geminiExecutor: NodeExecutor<GeminiData> = async ({
    data,
    nodeId,
    context,
    step,
    publish,
}) => {
    await publish(geminiChannel().status({ nodeId, status: "loading" }));

    if (!data.variableName) {
        await publish(geminiChannel().status({ nodeId, status: "error" }));
        throw new NonRetriableError("Gemini Node: variable name is missing");
    }

    if (!data.userPrompt) {
        await publish(geminiChannel().status({ nodeId, status: "error" }));
        throw new NonRetriableError("Gemini Node: user prompt is missing");
    }

    // TODO: Throw if credentials is missing

    const systemPrompt = data.systemPrompt
        ? HandleBars.compile(data.systemPrompt)(context)
        : "You are an helpful assistant";
    const userPrompt = HandleBars.compile(data.userPrompt)(context);

    // TODO: Fetch credential that user selected
    const credentialValue = process.env.GOOGLE_GENERATIVE_AI_API_KEY!;

    const google = createGoogleGenerativeAI({
        apiKey: credentialValue,
    });

    try {
        const { steps } = await step.ai.wrap(
            "gemini-generate-text",
            generateText,
            {
                model: google(data.model || "gemini-1.5-flash"),
                system: systemPrompt,
                prompt: userPrompt,
                experimental_telemetry: {
                    isEnabled: true,
                    recordInputs: true,
                    recordOutputs: true,
                },
            }
        );

        const text =
            steps[0].content[0].type === "text" ? steps[0].content[0].text : "";

        await publish(geminiChannel().status({ nodeId, status: "success" }));

        return {
            ...context,
            [data.variableName]: {
                text,
            },
        };
    } catch (err) {
        await publish(geminiChannel().status({ nodeId, status: "error" }));

        throw err;
    }
};
