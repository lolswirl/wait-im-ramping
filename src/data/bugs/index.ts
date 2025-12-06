import spell from "@data/spells/spell";
import { Tags } from "@data/shared/tags";

export enum SEVERITY {
    CRITICAL = "Critical",
    HIGH = "High",
    MEDIUM = "Medium",
    LOW = "Low",
}

export const SEVERITY_ORDER = [SEVERITY.CRITICAL, SEVERITY.HIGH, SEVERITY.MEDIUM, SEVERITY.LOW] as const;

export const SEVERITY_COLORS: Record<SEVERITY, string> = {
    [SEVERITY.CRITICAL]: "#d32f2f",
    [SEVERITY.HIGH]: "#f57c00",
    [SEVERITY.MEDIUM]: "#fbc02d",
    [SEVERITY.LOW]: "#388e3c",
};

export enum STATUS {
    OPEN = "Open",
    FIXED = "Fixed",
    REMOVED = "Removed",
}

export const STATUS_COLORS: Record<STATUS, string> = {
    [STATUS.OPEN]: "",
    [STATUS.FIXED]: "#43a047",
    [STATUS.REMOVED]: "#ff5555ff",
};

export const STATUS_BADGES: Record<STATUS, string> = {
    [STATUS.OPEN]: "",
    [STATUS.FIXED]: "✓",
    [STATUS.REMOVED]: "⨉",
};

export interface Bug {
    spell: spell;
    affectedSpells?: spell[];
    severity: SEVERITY;
    title: string;
    description: string;
    tags: Tags[];
    status?: STATUS;
    lastBuildTested?: string;
    notes?: string;
}
