"use client";

import { useState, useCallback } from "react";
import {
    ReactFlow,
    applyNodeChanges,
    applyEdgeChanges,
    addEdge,
    Background,
    Controls,
    MiniMap,
    Panel,
} from "@xyflow/react";
import type {
    Node,
    Edge,
    NodeChange,
    EdgeChange,
    Connection,
} from "@xyflow/react";
import { ErrorView, LoadingView } from "@/components/entity-components";
import { useSuspenseWorkflow } from "@/features/workflows/hooks/use-workflows";

import "@xyflow/react/dist/style.css";
import { nodeComponents } from "@/config/node-components";
import { AddNodeButton } from "./add-node-button";
import { useSetAtom } from "jotai";
import { editorAtom } from "../store/atoms";

export function EditorLoading() {
    return <LoadingView message="Loading editor..." />;
}

export function EditorError() {
    return <ErrorView message="Error loading editor" />;
}

export function Editor({ workflowId }: { workflowId: string }) {
    const { data: workflow } = useSuspenseWorkflow(workflowId);

    const setEditor = useSetAtom(editorAtom);

    const [nodes, setNodes] = useState<Node[]>(workflow.nodes);
    const [edges, setEdges] = useState<Edge[]>(workflow.edges);

    const onNodesChange = useCallback(
        (changes: NodeChange[]) =>
            setNodes((nodesSnapshot) =>
                applyNodeChanges(changes, nodesSnapshot)
            ),
        []
    );
    const onEdgesChange = useCallback(
        (changes: EdgeChange[]) =>
            setEdges((edgesSnapshot) =>
                applyEdgeChanges(changes, edgesSnapshot)
            ),
        []
    );
    const onConnect = useCallback(
        (params: Connection) =>
            setEdges((edgesSnapshot) => addEdge(params, edgesSnapshot)),
        []
    );

    return (
        <div className="size-full">
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                nodeTypes={nodeComponents}
                onInit={setEditor}
                fitView
                snapGrid={[10, 10]}
                snapToGrid
                panOnScroll
                proOptions={{
                    hideAttribution: true,
                }}
            >
                <Background />
                <Controls />
                <MiniMap />
                <Panel position="top-right">
                    <AddNodeButton />
                </Panel>
            </ReactFlow>
        </div>
    );
}
