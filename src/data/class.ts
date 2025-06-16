import type { spell } from './spell';
import { mistweaverMonkSpells } from './spells/classes/monk/mistweaver/mistweaver.ts';
import { mistweaverMonkTalents } from './spells/classes/monk/mistweaver/talents.ts';
import { mistweaverMonkRotations } from './spells/classes/monk/mistweaver/rotations.ts';

import { disciplinePriestSpells } from './spells/classes/priest/discipline/discipline.ts';
import { holyPriestSpells } from './spells/classes/priest/holy/holy.ts';
import { restorationDruidSpells } from './spells/classes/druid/restoration/restoration.ts';
import { restorationShamanSpells } from './spells/classes/shaman/restoration/restoration.ts';
import { preservationEvokerSpells } from './spells/classes/evoker/preservation/preservation.ts';
import { holyPaladinSpells } from './spells/classes/paladin/holy/holy.ts';

import { Capitalize } from "../util/stringManipulation.tsx";

interface classs {
  name: classNames;
  specializations: specialization[];
  color: string;
}

type classNames = 'Priest' | 'Druid' | 'Monk' | 'Shaman' | 'Evoker' | 'Paladin';

interface prebuiltRotation {
  name: string;
  spells: string[] | spell[];
}

export function getSpec(specName: string, className: string) {
  specName = Capitalize(specName.toLowerCase());
  className = Capitalize(className.toLowerCase());
  return classes.find(cls => cls.name === className)?.specializations.find(spec => spec.name === specName);
}

interface specialization {
  spells: spell[];
  talents?: spell[];
  icon: string;
  name: string;
  color: string;
  intellect?: number;
  buffs?: (spellList: spell[]) => spell[];

  getSpell?: (spellName: string) => spell | undefined;
  getTalent?: (talentName: string) => spell | undefined;

  prebuiltRotations?: prebuiltRotation[];
}

const addSpecializationMethods = (spec: specialization) => {
  spec.getSpell = (spellName: string) => spec.spells.find(spell => spell.name === spellName);
  spec.getTalent = (talentName: string) => spec.talents?.find(talent => talent.name === talentName);

  if (spec.prebuiltRotations) {
    spec.prebuiltRotations = spec.prebuiltRotations.map(rotation => {
      if (typeof rotation.spells[0] === "string") {
        return {
          name: rotation.name,
          spells: (rotation.spells as string[])
            .map(spellName => spec.getSpell ? spec.getSpell(spellName) : undefined)
            .filter((s): s is spell => s !== undefined)
        };
      } else {
        return rotation as prebuiltRotation;
      }
    });
  }
};

const classes: classs[] = [
  {
    name: 'Priest',
    specializations: [
      {
        spells: disciplinePriestSpells,
        icon: 'spell_holy_powerwordshield',
        name: 'Discipline',
        color: "#e1cbd2"
      },
      {
        spells: holyPriestSpells,
        icon: 'spell_holy_guardianspirit',
        name: 'Holy',
        color: "#668ea7"
      }
    ],
    color: "#fffff6"
  },
  {
    name: 'Druid',
    specializations: [
      {
        spells: restorationDruidSpells,
        icon: 'spell_nature_healingtouch',
        name: 'Restoration',
        color: "#29ab30"
      }
    ],
    color: "#ff7c0a"
  },
  {
    name: 'Monk',
    specializations: [
      {
        spells: mistweaverMonkSpells,
        talents: mistweaverMonkTalents,
        icon: 'spell_monk_mistweaver_spec',
        name: 'Mistweaver',
        color: "#4ea55c",
        intellect: 17647,
        prebuiltRotations: mistweaverMonkRotations,
      }
    ],
    color: "#00ff96"
  },
  {
    name: 'Shaman',
    specializations: [
      {
        spells: restorationShamanSpells,
        icon: 'spell_nature_magicimmunity',
        name: 'Restoration',
        color: "#7cb63c"
      }
    ],
    color: "0070dd"
  },
  {
    name: 'Evoker',
    specializations: [
      {
        spells: preservationEvokerSpells,
        icon: 'classicon_evoker_preservation',
        name: 'Preservation',
        color: "#175a2e"
      }
    ],
    color: "#33937f"
  },
  {
    name: 'Paladin',
    specializations: [
      {
        spells: holyPaladinSpells,
        icon: 'spell_holy_holybolt',
        name: 'Holy',
        color: "ffe38e"
      }
    ],
    color: "#f48cba"
  }
];

classes.forEach(cls => {
  cls.specializations.forEach(addSpecializationMethods);
});

export { classes };
