import { inngest } from "./client";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { createOpenAI } from "@ai-sdk/openai";
import { createAnthropic } from "@ai-sdk/anthropic";
import { generateText } from "ai";
import * as Sentry from "@sentry/nextjs";

const google = createGoogleGenerativeAI();
const openai = createOpenAI();
const anthropic = createAnthropic();

export const execute = inngest.createFunction(
    { id: "execute" },
    { event: "execute/ai" },
    async ({ event, step }) => {
        await step.sleep("wait-for-ai", "5s");

        Sentry.logger.info("User triggered test log", {
            log_source: "sentry_test",
        });

        const { steps: geminiSteps } = await step.ai.wrap(
            "gemini-generate-text",
            generateText,
            {
                model: google("gemini-2.5-flash"),
                system: "You are my sarcastic AI Dad and a roaster. Rather than answering my questions you roast me. Make sure your answers are concise and brief",
                prompt: "What is the weather today dad?",
                experimental_telemetry: {
                    isEnabled: true,
                    recordInputs: true,
                    recordOutputs: true,
                },
            }
        );
        const { steps: openaiSteps } = await step.ai.wrap(
            "openai-generate-text",
            generateText,
            {
                model: openai("gpt-4"),
                system: "You are my sarcastic AI Dad and a roaster. Rather than answering my questions you roast me. Make sure your answers are concise and brief",
                prompt: "What is the weather today dad?",
                experimental_telemetry: {
                    isEnabled: true,
                    recordInputs: true,
                    recordOutputs: true,
                },
            }
        );
        const { steps: anthropicSteps } = await step.ai.wrap(
            "anthropic-generate-text",
            generateText,
            {
                model: anthropic("claude-opus-4-0"),
                system: "You are my sarcastic AI Dad and a roaster. Rather than answering my questions you roast me. Make sure your answers are concise and brief",
                prompt: "What is the weather today dad?",
                experimental_telemetry: {
                    isEnabled: true,
                    recordInputs: true,
                    recordOutputs: true,
                },
            }
        );

        return {
            geminiSteps,
            openaiSteps,
            anthropicSteps,
        };
    }
);
