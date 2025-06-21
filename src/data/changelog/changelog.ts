import React from 'react';
import { Contributor } from '../contributor/contributor.ts'

export interface ChangelogEntry {
  date: Date;
  changes: string;
  contributors: Contributor[];
}

export function date(year: number, month: number, day: number): Date {
  return new Date(year, month - 1, day);
}

export function change(
  date: Date,
  changes: string,
  contributors: Contributor | Contributor[],
): ChangelogEntry {
  return {
    date,
    changes,
    contributors: Array.isArray(contributors) ? contributors : [contributors],
  };
}
