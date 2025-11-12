"use client";

import { useReactFlow, type Node, type NodeProps } from "@xyflow/react";
import { memo, useState } from "react";
import { BaseExecutionNode } from "../base-execution-node";
import { OpenAiDialog, OpenAiFormValues, AVAILABLE_MODELS } from "./dialog";
import { useNodeStatus } from "../../hooks/use-node-status";
import { OPENAI_CHANNEL_NAME } from "@/inngest/channels/openai";
import { fetchOpenAiRealtimeToken } from "./actions";

type OpenAiNodeData = {
    variableName?: string;
    model?: (typeof AVAILABLE_MODELS)[number];
    systemPrompt?: string;
    userPrompt?: string;
};

type OpenAiNodeType = Node<OpenAiNodeData>;

export const OpenAiNode = memo((props: NodeProps<OpenAiNodeType>) => {
    const [dialogOpen, setDialogOpen] = useState(false);
    const { setNodes } = useReactFlow();

    const nodeStatus = useNodeStatus({
        nodeId: props.id,
        channel: OPENAI_CHANNEL_NAME,
        topic: "status",
        refreshToken: fetchOpenAiRealtimeToken,
    });

    const handleOpenSettings = () => setDialogOpen(true);

    const handleSubmit = (values: OpenAiFormValues) => {
        setNodes((currentNodes) =>
            currentNodes.map((node) => {
                if (node.id === props.id) {
                    return {
                        ...node,
                        data: {
                            ...node.data,
                            ...values,
                        },
                    };
                } else return node;
            })
        );
    };

    const nodeData = props.data;
    const description = nodeData?.userPrompt
        ? `${
              nodeData.model || AVAILABLE_MODELS[0]
          }: ${nodeData.userPrompt.slice(0, 50)}...`
        : "Not configured";

    return (
        <>
            <OpenAiDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                onSubmit={handleSubmit}
                defaultValues={nodeData}
            />
            <BaseExecutionNode
                {...props}
                id={props.id}
                icon="/logos/openai.svg"
                name="OpenAI"
                status={nodeStatus}
                description={description}
                onSettings={handleOpenSettings}
                onDoubleClick={handleOpenSettings}
            />
        </>
    );
});

OpenAiNode.displayName = "OpenAiNode";
