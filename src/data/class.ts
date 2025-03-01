import { disciplinePriestSpells } from './spells/classes/priest/discipline/discipline.ts';
import { holyPriestSpells } from './spells/classes/priest/holy/holy.ts';
import { restorationDruidSpells } from './spells/classes/druid/restoration/restoration.ts';
import { mistweaverMonkSpells } from './spells/classes/monk/mistweaver/mistweaver.ts';
import { restorationShamanSpells } from './spells/classes/shaman/restoration/restoration.ts';
import { preservationEvokerSpells } from './spells/classes/evoker/preservation/preservation.ts';
import { holyPaladinSpells } from './spells/classes/paladin/holy/holy.ts';
import type { spell } from './spell';

interface classs {
  name: class_names;
  specializations: specialization[];
  color: string;
}

type class_names = 'Priest' | 'Druid' | 'Monk' | 'Shaman' | 'Evoker' | 'Paladin';

interface specialization {
  spells: spell[];
  icon: string;
  name: string;
  color: string;
  buffs?: (spellList: spell[]) => spell[];
}

const classes: classs[] = [
  {
    name: 'Priest',
    specializations: [
      {
        spells: disciplinePriestSpells,   
        icon: 'spell_holy_powerwordshield',  
        name: 'Discipline',
        color: "#e1cbd2",
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
        color: "#29ab30",
      }
    ],
    color: "#ff7c0a"
  },
  {
    name: 'Monk',
    specializations: [
      {
        spells: mistweaverMonkSpells,     
        icon: 'spell_monk_mistweaver_spec', 
        name: 'Mistweaver',
        color: "#4ea55c"
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

export { classes };
