import { useState } from "react";
import type { JsonValue } from "../types/json";
import { JsonTreeNode } from "./JsonTreeNode";

type JsonTreeProps = {
  value: string;
};

export function JsonTree({ value }: JsonTreeProps) {
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(
    new Set(["root"]),
  );

  let parsedValue: JsonValue;

  try {
    parsedValue = JSON.parse(value);
  } catch {
    return null;
  }

  const toggleNode = (nodeId: string) => {
    setExpandedNodes((current) => {
      const next = new Set(current);

      if (next.has(nodeId)) {
        next.delete(nodeId);
      } else {
        next.add(nodeId);
      }

      return next;
    });
  };

  const expandAll = () => {
    const allNodes = new Set<string>();

    const collectNodes = (node: JsonValue, nodeId: string) => {
      if (node === null || typeof node !== "object") {
        return;
      }

      allNodes.add(nodeId);

      if (Array.isArray(node)) {
        node.forEach((item, index) => {
          collectNodes(item, `${nodeId}.${index}`);
        });
      } else {
        Object.entries(node).forEach(([key, item]) => {
          collectNodes(item, `${nodeId}.${key}`);
        });
      }
    };

    collectNodes(parsedValue, "root");

    setExpandedNodes(allNodes);
  };

  const collapseAll = () => {
    setExpandedNodes(new Set());
  };

  return (
    <div className="json-tree">
      <div className="json-tree-actions">
        <button onClick={expandAll}>Expand all</button>
        <button onClick={collapseAll}>Collapse all</button>
      </div>

      <JsonTreeNode
        name="root"
        value={parsedValue}
        nodeId="root"
        expandedNodes={expandedNodes}
        onToggle={toggleNode}
      />
    </div>
  );
}