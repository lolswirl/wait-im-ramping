import React, { ReactNode, ReactElement } from "react";
import { GetTitle } from "@util/stringManipulation";

export const applyGetTitle = (node: ReactNode): ReactNode => {
    if (node == null || typeof node === 'boolean') {
        return node;
    }

    if (typeof node === 'string') {
        return GetTitle(node);
    }

    if (typeof node === 'number') {
        return node;
    }

    if (Array.isArray(node)) {
        return node.map((child, index) => (
            <React.Fragment key={index}>{applyGetTitle(child)}</React.Fragment>
        ));
    }

    if (React.isValidElement(node)) {
        const element = node as ReactElement;
        const props = element.props as Record<string, any>;
        
        if (props && 'children' in props && props.children) {
            return React.cloneElement(element, {
                ...props,
                children: applyGetTitle(props.children),
            } as any);
        }
        
        return element;
    }

    return node;
};
