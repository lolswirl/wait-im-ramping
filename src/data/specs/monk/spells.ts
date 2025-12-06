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
    }
} satisfies Record<string, spell>;

export default spells;
export { spells as SHARED_MONK_SPELLS };