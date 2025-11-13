import type { NodeExecutor } from "@/features/executions/types";
import { NonRetriableError } from "inngest";
import HandleBars from "handlebars";
import { slackChannel } from "@/inngest/channels/slack";
import { decode } from "html-entities";
import ky from "ky";

HandleBars.registerHelper("json", (context) => {
    const jsonString = JSON.stringify(context, null, 2);
    const safeString = new HandleBars.SafeString(jsonString);

    return safeString;
});

type SlackData = {
    variableName?: string;
    webhookUrl?: string;
    content?: string;
};

export const slackExecutor: NodeExecutor<SlackData> = async ({ data, nodeId, context, step, publish }) => {
    await publish(slackChannel().status({ nodeId, status: "loading" }));

    if (!data.content) {
        await publish(slackChannel().status({ nodeId, status: "error" }));
        throw new NonRetriableError("Slack Node: message content is missing");
    }

    const rawContent = HandleBars.compile(data.content)(context);
    const content = decode(rawContent);

    try {
        const result = await step.run("slack-webhook", async () => {
            if (!data.variableName) {
                await publish(slackChannel().status({ nodeId, status: "error" }));
                throw new NonRetriableError("Slack Node: variable name is missing");
            }

            if (!data.webhookUrl) {
                await publish(slackChannel().status({ nodeId, status: "error" }));
                throw new NonRetriableError("Slack Node: webhook url is missing");
            }

            await ky.post(data.webhookUrl, {
                json: {
                    content,
                },
            });

            return {
                ...context,
                [data.variableName]: {
                    messageContent: content.slice(0, 2000),
                },
            };
        });

        await publish(slackChannel().status({ nodeId, status: "success" }));

        return result;
    } catch (err) {
        await publish(slackChannel().status({ nodeId, status: "error" }));

        throw err;
    }
};
