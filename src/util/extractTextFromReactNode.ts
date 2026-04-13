import React from "react";

export const extractTextFromReactNode = (node: React.ReactNode): string => {
    if (typeof node === "string") return node;
    if (typeof node === "number") return String(node);
    if (Array.isArray(node)) return node.map(extractTextFromReactNode).join("");
    if (React.isValidElement(node)) {
        const props = node.props as Record<string, any>;
        return extractTextFromReactNode(props.children);
    }
    return "";
};
