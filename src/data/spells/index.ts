import RESTORATION_DRUID from './druid/restoration.ts';
import PRESERVATION_EVOKER from './evoker/preservation.ts';
import MISTWEAVER_MONK from './monk/mistweaver.ts';
import HOLY_PALADIN from './paladin/holy.ts';
import DISCIPLINE_PRIEST from './priest/discipline.ts';
import HOLY_PRIEST from './priest/holy.ts';
import RESTORATION_SHAMAN from './shaman/restoration.ts';

const SPELLS = {
    ...RESTORATION_DRUID,
    ...MISTWEAVER_MONK,
    ...PRESERVATION_EVOKER,
    ...HOLY_PALADIN,
    ...DISCIPLINE_PRIEST,
    ...HOLY_PRIEST,
    ...RESTORATION_SHAMAN
}

export default SPELLS;