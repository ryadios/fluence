import type { NodeExecutor } from "@/features/executions/types";
import { NonRetriableError } from "inngest";
import HandleBars from "handlebars";
import { anthropicChannel } from "@/inngest/channels/anthropic";
import { AVAILABLE_MODELS } from "./dialog";
import { createAnthropic } from "@ai-sdk/anthropic";
import { generateText } from "ai";

HandleBars.registerHelper("json", (context) => {
    const jsonString = JSON.stringify(context, null, 2);
    const safeString = new HandleBars.SafeString(jsonString);

    return safeString;
});

type AnthropicData = {
    variableName?: string;
    model?: (typeof AVAILABLE_MODELS)[number];
    systemPrompt?: string;
    userPrompt?: string;
};

export const anthropicExecutor: NodeExecutor<AnthropicData> = async ({
    data,
    nodeId,
    context,
    step,
    publish,
}) => {
    await publish(anthropicChannel().status({ nodeId, status: "loading" }));

    if (!data.variableName) {
        await publish(anthropicChannel().status({ nodeId, status: "error" }));
        throw new NonRetriableError("Anthropic Node: variable name is missing");
    }

    if (!data.userPrompt) {
        await publish(anthropicChannel().status({ nodeId, status: "error" }));
        throw new NonRetriableError("Anthropic Node: user prompt is missing");
    }

    // TODO: Throw if credentials is missing

    const systemPrompt = data.systemPrompt
        ? HandleBars.compile(data.systemPrompt)(context)
        : "You are an helpful assistant";
    const userPrompt = HandleBars.compile(data.userPrompt)(context);

    // TODO: Fetch credential that user selected
    const credentialValue = process.env.ANTHROPIC_API_KEY!;

    const anthropic = createAnthropic({
        apiKey: credentialValue,
    });

    try {
        const { steps } = await step.ai.wrap(
            "anthropic-generate-text",
            generateText,
            {
                model: anthropic(data.model || "claude-3-5-haiku-latest"),
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

        await publish(anthropicChannel().status({ nodeId, status: "success" }));

        return {
            ...context,
            [data.variableName]: {
                text,
            },
        };
    } catch (err) {
        await publish(anthropicChannel().status({ nodeId, status: "error" }));

        throw err;
    }
};
