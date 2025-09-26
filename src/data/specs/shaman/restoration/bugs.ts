import SPELLS from '@data/spells';
import TALENTS from '@data/specs/shaman/restoration/talents';
import { Bug, SEVERITY, STATUS } from "@data/bugs";
import { TAGS } from "@data/shared/tags";

const BUGS: Bug[] = [
    {
        spell: TALENTS.WHIRLING_ELEMENTS,
        affectedSpells: [SPELLS.CHAIN_HEAL],
        severity: SEVERITY.MEDIUM,
        title: "Whirling Earth immediately fires Chain Heal when consumed as final buff",
        description:
            "If Whirling Earth is the final Whirling Element buff that you consume, the Chain Heal from the 4pc will immediately fire when you consume Whirling Earth",
        tags: [TAGS.TIER, TAGS.TOTEMIC],
        notes: "Elemental Overflow is the buff from the 4pc",
        lastBuildTested: "62493",
    },
    {
        spell: SPELLS.DOWNPOUR,
        affectedSpells: [TALENTS.ELEMENTAL_OVERFLOW],
        severity: SEVERITY.MEDIUM,
        title: "Simultaneous casts only grant 1 Elemental Overflow stack",
        description:
            "If the Downpour from the 2pc occurs at the same time you cast Downpour, you only get 1 stack of Elemental Overflow. To replicate: Cast Surging Totem, then Healing Wave, then Chain Heal. At the end of the Chain Heal cast, cast Downpour",
        tags: [TAGS.TIER, TAGS.TOTEMIC],
        lastBuildTested: "62493",
    },
    {
        spell: TALENTS.WIND_BARRIER,
        affectedSpells: [],
        severity: SEVERITY.LOW,
        title: "Sometimes refreshes repeatedly",
        description:
            "Wind Barrier sometimes refreshes repeatedly causing excessive combat log events",
        tags: [TAGS.TOTEMIC],
        notes: "Example log: https://www.warcraftlogs.com/reports/FpZVP1dq3fc4R8JW?fight=9&type=healing&source=19",
        lastBuildTested: "62493",
    },
    {
        spell: SPELLS.EARTH_SHIELD,
        affectedSpells: [],
        severity: SEVERITY.LOW,
        title: "Can apply to more than 2 players at instance start",
        description:
            "Earth Shield can sometimes apply to more than 2 players at the start of a new instance",
        tags: [],
        notes: "Video: https://www.youtube.com/watch?v=YjpZfPjAbV4",
        lastBuildTested: "62493",
    },
    {
        spell: TALENTS.CREATION_CORE,
        affectedSpells: [],
        severity: SEVERITY.MEDIUM,
        title: "Does not always restore last 2 totems",
        description:
            "Creation Core does not always correctly restore the last 2 totems used",
        tags: [],
        lastBuildTested: "62493",
    },
    {
        spell: TALENTS.TIDECALLERS_GUARD,
        affectedSpells: [],
        severity: SEVERITY.HIGH,
        title: "Stops working after death",
        description:
            "Tidecaller's Guard stops working if you die",
        tags: [],
        lastBuildTested: "62493",
    },
    {
        spell: TALENTS.ANCESTRAL_SWIFTNESS,
        affectedSpells: [TALENTS.ACID_RAIN],
        severity: SEVERITY.LOW,
        title: "Does not buff Acid Rain damage",
        description:
            "Ancestral Swiftness does not buff the damage of Acid Rain",
        tags: [TAGS.FARSEER],
        lastBuildTested: "62493",
    },
    {
        spell: TALENTS.SPOUTING_SPIRITS,
        affectedSpells: [TALENTS.LIVELY_TOTEMS, SPELLS.SPIRIT_LINK_TOTEM, SPELLS.CHAIN_HEAL],
        severity: SEVERITY.MEDIUM,
        title: "Lively Totems fires 2 Chain Heals with Spouting Spirits",
        description:
            "When using Spouting Spirits, Lively Totems will fire off 2 Chain Heals instead of the expected 1. It fires when Spirit Link Totem is initially placed, and again whenever the Spouting Spirits healing occurs",
        tags: [TAGS.TOTEMIC],
        lastBuildTested: "62493",
    },
    {
        spell: TALENTS.TIDEWATERS,
        affectedSpells: [SPELLS.CLOUDBURST_TOTEM],
        severity: SEVERITY.MEDIUM,
        title: "Does not feed Cloudburst Totem",
        description:
            "Tidewaters does not feed Cloudburst Totem",
        tags: [],
        lastBuildTested: "62493",
    },
    {
        spell: TALENTS.WHIRLING_ELEMENTS,
        affectedSpells: [SPELLS.HEALING_WAVE, SPELLS.HEALING_SURGE],
        severity: SEVERITY.MEDIUM,
        title: "Healing Wave/Surge modifiers don't apply to Water Mote target",
        description:
            "Neither Healing Wave or Healing Surge modifiers apply to the Water Mote target from Whirling Elements",
        tags: [TAGS.TOTEMIC],
        lastBuildTested: "62493",
    },
    {
        spell: SPELLS.DOWNPOUR,
        affectedSpells: [SPELLS.NATURES_SWIFTNESS],
        severity: SEVERITY.MEDIUM,
        title: "Consumes Nature's Swiftness despite being instant",
        description:
            "Downpour consumes Nature's Swiftness, despite being instant cast. Downpour does not consume mana when this occurs. Other instant-cast spells (such as Riptide) do not consume Nature's Swiftness",
        tags: [],
        lastBuildTested: "62493",
    },
    {
        spell: TALENTS.LAVA_SURGE,
        affectedSpells: [SPELLS.FLAME_SHOCK],
        severity: SEVERITY.LOW,
        title: "Proc rates don't increase with multiple Flame Shocks",
        description:
            "Lava Surge does not appear to have increased proc rates if Flame Shock is on multiple targets",
        tags: [],
        lastBuildTested: "62493",
    },
    {
        spell: TALENTS.LAVA_SURGE,
        affectedSpells: [TALENTS.ANCESTRAL_SWIFTNESS, SPELLS.LAVA_BURST],
        severity: SEVERITY.MEDIUM,
        title: "Lava Surge and Ancestral Swiftness both consumed simultaneously",
        description:
            "If you consume your last Lava Burst charge with Ancestral Swiftness right after you get a Lava Surge proc, both the Lava Surge proc and the Ancestral Swiftness will be consumed",
        tags: [TAGS.FARSEER],
        notes: "Example: https://www.twitch.tv/videos/2431064618?t=3h44m55s",
        lastBuildTested: "62493",
    },
];

export default BUGS;