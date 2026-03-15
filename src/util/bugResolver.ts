import SPELLS from '@data/spells';
import TALENTS from '@data/talents';
import ITEMS from '@data/items';
import CORE_PASSIVE from '@data/core-passives';
import { TAGS } from '@data/shared/tags';
import { Bug } from '@data/bugs';

const categories = [
    { name: 'SPELLS', data: SPELLS },
    { name: 'TALENTS', data: TALENTS },
    { name: 'ITEMS', data: ITEMS },
    { name: 'CORE_PASSIVE', data: CORE_PASSIVE },
    { name: 'TAGS', data: TAGS },
];

export const resolveReference = (ref: string): any => {
    if (!ref) return undefined;
    
    const key = ref.toUpperCase().replace(/ /g, '_');

    for (const category of categories) {
        const result = category.data[key as keyof typeof category.data];
        if (result) {
            return result;
        }
    }
    
    return undefined;
};

const resolveTags = (tags: string[]): any[] => {
    if (!tags) return [];

    return tags.map(tag => {
        const key = tag.toUpperCase().replace(/ /g, '_');
        return TAGS[key as keyof typeof TAGS];
    }).filter(Boolean);
}

export const resolveBug = (data: any): Bug => {
    return {
        spell: resolveReference(data.spell),
        affectedSpells: data.affectedSpells?.map(resolveReference).filter(Boolean),
        severity: data.severity,
        title: data.title,
        description: data.description,
        tags: resolveTags(data.tags),
        lastBuildTested: data.lastBuildTested,
        notes: data.notes,
        status: data.status,
    };
};

export const resolveBugs = (data: any[]): Bug[] => {
    if (!data || !Array.isArray(data)) return [];

    return data.map(resolveBug).filter(Boolean);
};
