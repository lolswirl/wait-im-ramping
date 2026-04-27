import spell from "@data/spells/spell";
import { Tags } from "@data/shared/tags";
import React, { ReactNode } from "react";
import { Check, Close } from "@mui/icons-material";

export enum SEVERITY {
    CRITICAL = "Critical",
    HIGH = "High",
    MEDIUM = "Medium",
    LOW = "Low",
    TRIVIAL = "Trivial",
}

export const SEVERITY_ORDER = [SEVERITY.CRITICAL, SEVERITY.HIGH, SEVERITY.MEDIUM, SEVERITY.LOW, SEVERITY.TRIVIAL] as const;

export const SEVERITY_COLORS: Record<SEVERITY, string> = {
    [SEVERITY.CRITICAL]: "#d32f2f",
    [SEVERITY.HIGH]: "#f57c00",
    [SEVERITY.MEDIUM]: "#fbc02d",
    [SEVERITY.LOW]: "#388e3c",
    [SEVERITY.TRIVIAL]: "#808080",
};

export enum STATUS {
    OPEN = "Open",
    FIXED = "Fixed",
    REMOVED = "Removed",
}

export const STATUS_COLORS: Record<STATUS, string> = {
    [STATUS.OPEN]: "",
    [STATUS.FIXED]: "#89ff7f",
    [STATUS.REMOVED]: "#ff5555ff",
};

export const getStatusBadge = (status: STATUS): ReactNode => {
    switch (status) {
        case STATUS.FIXED:
            return <Check />;
        case STATUS.REMOVED:
            return <Close />;
        default:
            return null;
    }
};

export interface Bug {
    spell: spell;
    affectedSpells?: spell[];
    severity: SEVERITY;
    title: ReactNode;
    description?: ReactNode;
    tags?: Tags[];
    status?: STATUS;
    buildsTested: string[];
    notes?: string;
    logs?: { label: string; url: string }[];
}
