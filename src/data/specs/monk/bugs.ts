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
        lastBuildTested: "63728",
        notes: "I assume bug because it says 'Leg Sweep applies' rather than 'When Leg Sweep ends, player applies'",
        tags: [],
    },
];

export default BUGS;