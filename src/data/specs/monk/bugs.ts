import SPELLS from '@data/spells';
import TALENTS from '@data/talents';
import { Bug, SEVERITY, STATUS } from "@data/bugs";
import { TAGS } from "@data/shared/tags";

const BUGS: Bug[] = [
    {
        spell: TALENTS.STILLSTEP_COIL,
        affectedSpells: [SPELLS.LEG_SWEEP, SPELLS.DISABLE],
        severity: SEVERITY.LOW,
        title: "Stillstep Coil requires melee range",
        description: "Player must be in melee range when Leg Sweep expires otherwise Disable is not applied",
        lastBuildTested: "65337",
        notes: "I assume bug because it says 'Leg Sweep applies' rather than 'When Leg Sweep ends, player applies'",
        tags: [],
        status: STATUS.FIXED,
    },
    {
        spell: SPELLS.TOUCH_OF_DEATH,
        affectedSpells: [SPELLS.CELESTIAL_CONDUIT],
        severity: SEVERITY.LOW,
        title: "ToD usable during Celestial Conduit channel",
        description: "Touch of Death is usable during the Celestial Conduit channel, despite canceling on damage/healing abilities",
        lastBuildTested: "65727",
    }
];

export default BUGS;