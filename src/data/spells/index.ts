import RESTORATION_DRUID from '@data/specs/druid/restoration/druid/spells';
import PRESERVATION_EVOKER from '@data/specs/evoker/preservation/spells';
import MISTWEAVER_MONK from '@data/specs/monk/mistweaver/spells';
import SHARED_MONK_SPELLS from '@data/specs/monk/spells';
import HOLY_PALADIN from '@data/specs/paladin/holy/spells';
import PALADIN_TALENTS from '@data/specs/paladin/talents';
import DISCIPLINE_PRIEST from '@data/specs/priest/discipline/spells';
import HOLY_PRIEST from '@data/specs/priest/holy/spells';
import RESTORATION_SHAMAN from '@data/specs/shaman/restoration/spells';

const SPELLS = {
    ...RESTORATION_DRUID,
    ...SHARED_MONK_SPELLS,
    ...MISTWEAVER_MONK,
    ...PRESERVATION_EVOKER,
    ...HOLY_PALADIN,
    ...PALADIN_TALENTS,
    ...DISCIPLINE_PRIEST,
    ...HOLY_PRIEST,
    ...RESTORATION_SHAMAN
}

export const getSpellById = (id: number) =>
    Object.values(SPELLS).find(s => s.id === id);

export default SPELLS;