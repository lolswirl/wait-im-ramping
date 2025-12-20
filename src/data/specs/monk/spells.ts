import spell from "@data/spells/spell";
import { SCHOOLS } from "@data/shared/schools";

const spells = {
    DISABLE: {
        name: "Disable",
        id: 116095,
        icon: 'ability_shockwave',
    },
    LEG_SWEEP: {
        name: "Leg Sweep",
        id: 119381,
        icon: 'ability_monk_legsweep',
    },
    TOUCH_OF_DEATH: {
        name: "Touch of Death",
        id: 115080,
        icon: 'ability_monk_touchofdeath',
        school: SCHOOLS.PHYSICAL,
    },
    TEACHINGS_OF_THE_MONASTERY: {
        name: "Teachings of the Monastery",
        id: 116645,
        icon: 'passive_monk_teachingsofmonastery',
        custom: {
            rskResetChance: 12, // percent
        }
    },
} satisfies Record<string, spell>;

export default spells;
export { spells as SHARED_MONK_SPELLS };