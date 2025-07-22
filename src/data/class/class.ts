import spell from '../spells/spell.ts';

import MISTWEAVER from './monk/mistweaver.ts';
import DISCIPLINE from './priest/discipline.ts';
import HOLY_PRIEST from './priest/holy.ts';
import RESTO_DRUID from './druid/restoration.ts';
import RESTO_SHAMAN from './shaman/restoration.ts';
import PRESERVATION from './evoker/preservation.ts';
import HOLY_PALADIN from './paladin/holy.ts';
import { Bug } from '../bugs/bugs.ts';

type ClassInfo<TSpecs extends Record<string, specialization>> = {
  name: string;
  color: string;
  SPECS: TSpecs;
}

export interface specialization {
  spells: Record<string, spell>;
  talents?: Record<string, spell>;
  icon: string;
  name: string;
  class: string;
  color: string;
  intellect?: number;
  mastery?: number;
  buffs?: (spellList: spell[]) => spell[];

  getSpell?: (spellName: string) => spell | undefined;
  getTalent?: (talentName: string) => spell | undefined;

  rotations?: Record<string, spell[]>;
  bugs?: Bug[];
}

export const CLASSES = {
  MONK: {
    name: 'Monk',
    color: '#00cc77',
    SPECS: {
      MISTWEAVER: MISTWEAVER,
    },
  },
  PRIEST: {
    name: 'Priest',
    color: '#fffff6',
    SPECS: {
      DISCIPLINE: DISCIPLINE,
      HOLY: HOLY_PRIEST,
    },
  },
  DRUID: {
    name: 'Druid',
    color: '#ff7c0a',
    SPECS: {
      RESTORATION: RESTO_DRUID,
    },
  },
  SHAMAN: {
    name: 'Shaman',
    color: '#0070dd',
    SPECS: {
      RESTORATION: RESTO_SHAMAN,
    },
  },
  EVOKER: {
    name: 'Evoker',
    color: '#33937f',
    SPECS: {
      PRESERVATION: PRESERVATION,
    },
  },
  PALADIN: {
    name: 'Paladin',
    color: '#f48cba',
    SPECS: {
      HOLY: HOLY_PALADIN,
    },
  },
} satisfies Record<string, ClassInfo<Record<string, specialization>>>;

export function getSpec(className: keyof typeof CLASSES, specName: string) {
  const classData = CLASSES[className];
  if (!classData) {
    return undefined;
  }

  const spec = classData[specName as keyof typeof classData];
  return spec;
}

export function getSpecs(): specialization[] {
  return Object.values(CLASSES).flatMap(c => Object.values(c.SPECS));
}

export function getSpecializationByKey(key: string): specialization | undefined {
  const [className, specName] = key.split(':');
  const classData = CLASSES[className.toUpperCase() as keyof typeof CLASSES];
  return classData?.SPECS[specName.toUpperCase() as keyof typeof classData.SPECS];
}

