import type { JsonValue } from "../types/json";
import { JsonTreeNode } from "./JsonTreeNode";

type JsonTreeProps = {
  value: string;
};

export function JsonTree({ value }: JsonTreeProps) {
  let parsedValue: JsonValue;

  try {
    parsedValue = JSON.parse(value);
  } catch {
    return null;
  }

  return (
  <div className="json-tree">
    <JsonTreeNode
      name="root"
      value={parsedValue}
    />
  </div>
);
}