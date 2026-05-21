import type spell from '@data/spells/spell';

export interface SharePayload {
    spec?: string;
    rotations: number[][];
}

export const encodeShare = (rotations: { steps: spell[] }[], spec?: string): string => {
    const rotPart = rotations.map(r => r.steps.map(s => s.id).join('.')).join('-');
    return spec ? `${spec}-${rotPart}` : rotPart;
};

export const decodeShare = (encoded: string, hasSpec: boolean): SharePayload | null => {
    try {
        if (hasSpec) {
            const idx = encoded.indexOf('-');
            if (idx === -1) return null;
            const spec = encoded.slice(0, idx);
            const rotParts = encoded.slice(idx + 1).split('-');
            const rotations = rotParts.map(part => part.split('.').map(Number));
            return { spec, rotations };
        } else {
            const rotations = encoded.split('-').map(part => part.split('.').map(Number));
            return { rotations };
        }
    } catch {
        return null;
    }
};
