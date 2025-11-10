import { Connection, Node } from "@/generated/prisma";
import toposort from "toposort";

export const topologicalSort = (
    nodes: Node[],
    connections: Connection[]
): Node[] => {
    // No connections = no sorting required
    if (connections.length === 0) return nodes;

    // Create edges arary for toposort
    const edges: [string, string][] = connections.map((connection) => [
        connection.fromNodeId,
        connection.toNodeId,
    ]);

    // Add nodes with no connection as self-edges to make sure they are included
    const connectedNodeIds = new Set<string>();

    for (const conn of connections) {
        connectedNodeIds.add(conn.fromNodeId);
        connectedNodeIds.add(conn.toNodeId);
    }

    for (const node of nodes) {
        if (!connectedNodeIds.has(node.id)) {
            edges.push([node.id, node.id]);
        }
    }

    // Perform topological sort
    let sortedNodeIds: string[];
    try {
        sortedNodeIds = toposort(edges);

        // Remove duplicates (from self-edges)
        sortedNodeIds = [...new Set(sortedNodeIds)];
    } catch (err) {
        if (err instanceof Error && err.message.includes("Cyclic")) {
            throw new Error("Workflow contains a cycle");
        }

        throw err;
    }

    // Map sorted ID back to node objects
    const nodeMap = new Map(nodes.map((n) => [n.id, n]));
    return sortedNodeIds.map((id) => nodeMap.get(id)!).filter(Boolean);
};
