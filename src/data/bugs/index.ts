import spell from "@data/spells/spell";
import { Tags } from "@data/shared/tags";

export enum SEVERITY {
    CRITICAL = "Critical",
    HIGH = "High",
    MEDIUM = "Medium",
    LOW = "Low",
}

export enum STATUS {
    OPEN = "Open",
    FIXED = "Fixed",
}

export const SEVERITY_COLORS: Record<SEVERITY, string> = {
    [SEVERITY.CRITICAL]: "#d32f2f",
    [SEVERITY.HIGH]: "#f57c00",
    [SEVERITY.MEDIUM]: "#fbc02d",
    [SEVERITY.LOW]: "#388e3c",
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
