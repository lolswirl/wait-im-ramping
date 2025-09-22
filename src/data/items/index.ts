import spell from '@data/spells/spell';
import TIER from "@data/items/tier";

const items = {
    ...TIER,
    NEXUS_KINGS_COMMAND: {
        name: "Nexus-Kings Command",
        id: 242400,
        icon: 'inv_112_raidtrinkets_oathbindersauthority',
    },
} satisfies Record<string, spell>;

export default items;
export { items as ITEMS };