import type { NodeExecutor } from "@/features/executions/types";
import { NonRetriableError } from "inngest";
import HandleBars from "handlebars";
import { openAiChannel } from "@/inngest/channels/openai";
import { AVAILABLE_MODELS } from "./dialog";
import { createOpenAI } from "@ai-sdk/openai";
import { generateText } from "ai";

HandleBars.registerHelper("json", (context) => {
    const jsonString = JSON.stringify(context, null, 2);
    const safeString = new HandleBars.SafeString(jsonString);

    return safeString;
});

type OpenAiData = {
    variableName?: string;
    model?: (typeof AVAILABLE_MODELS)[number];
    systemPrompt?: string;
    userPrompt?: string;
};

export const openAiExecutor: NodeExecutor<OpenAiData> = async ({
    data,
    nodeId,
    context,
    step,
    publish,
}) => {
    await publish(openAiChannel().status({ nodeId, status: "loading" }));

    if (!data.variableName) {
        await publish(openAiChannel().status({ nodeId, status: "error" }));
        throw new NonRetriableError("OpenAI Node: variable name is missing");
    }

    if (!data.userPrompt) {
        await publish(openAiChannel().status({ nodeId, status: "error" }));
        throw new NonRetriableError("OpenAI Node: user prompt is missing");
    }

    // TODO: Throw if credentials is missing

    const systemPrompt = data.systemPrompt
        ? HandleBars.compile(data.systemPrompt)(context)
        : "You are an helpful assistant";
    const userPrompt = HandleBars.compile(data.userPrompt)(context);

    // TODO: Fetch credential that user selected
    const credentialValue = process.env.OPENAI_API_KEY!;

    const openai = createOpenAI({
        apiKey: credentialValue,
    });

    try {
        const { steps } = await step.ai.wrap(
            "openai-generate-text",
            generateText,
            {
                model: openai(data.model || "gpt-4o-mini"),
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

        await publish(openAiChannel().status({ nodeId, status: "success" }));

        return {
            ...context,
            [data.variableName]: {
                text,
            },
        };
    } catch (err) {
        await publish(openAiChannel().status({ nodeId, status: "error" }));

        throw err;
    }
};
