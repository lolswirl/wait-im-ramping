import { change, date } from './changelog.ts';
import CONTRIBUTORS from '../contributor/contributors.tsx';

const CHANGELOG = [
  change(date(2025, 6, 20), "Added changelog.", CONTRIBUTORS.swirl),
];

export default CHANGELOG;
