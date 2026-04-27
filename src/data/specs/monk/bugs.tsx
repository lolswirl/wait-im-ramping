import SPELLS from '@data/spells';
import TALENTS from '@data/talents';
import { Bug, SEVERITY, STATUS } from "@data/bugs";
import { TAGS } from "@data/shared/tags";
import React from 'react';
import SpellLink from '@components/SpellLink';

const BUGS: Bug[] = [
    {
        spell: TALENTS.STILLSTEP_COIL,
        severity: SEVERITY.LOW,
        title: <>Stillstep Coil requires melee range</>,
        description: <>Player must be in melee range when <SpellLink spell={SPELLS.LEG_SWEEP}/> expires otherwise <SpellLink spell={SPELLS.DISABLE}/> is not applied</>,
        buildsTested: ["63728", "65337"],
        notes: "I assume bug because it says 'Leg Sweep applies' rather than 'When Leg Sweep ends, player applies'",
        tags: [],
        status: STATUS.FIXED,
    },
    {
        spell: SPELLS.TOUCH_OF_DEATH,
        severity: SEVERITY.LOW,
        title: <>Usable during <SpellLink spell={SPELLS.CELESTIAL_CONDUIT}/> channel</>,
        description: <><SpellLink spell={SPELLS.TOUCH_OF_DEATH}/> is usable during the <SpellLink spell={SPELLS.CELESTIAL_CONDUIT}/> channel, despite canceling on damage/healing abilities</>,
        buildsTested: ["65727", "65769", "65848", "67186"],
        logs: [{ label: "", url: "https://www.warcraftlogs.com/reports/vkLZ3MzFDa7GRdY8?fight=26&type=summary&source=6&view=events&start=3553847&end=3557704" }],
        tags: [TAGS.CONDUIT],
    },
    {
        spell: SPELLS.TIGERS_LUST,
        severity: SEVERITY.MEDIUM,
        title: <>Global cooldown after casting is unhasted</>,
        description: <>The global cooldown after casting <SpellLink spell={SPELLS.TIGERS_LUST}/> is unhasted, meaning it is a full 1.5s global.</>,
        buildsTested: ["67088", "67186"],
        notes: "This makes for awkward gameplay with higher haste levels.",
    }
];

export default BUGS;