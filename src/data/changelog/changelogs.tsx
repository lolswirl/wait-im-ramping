import { change, date } from './changelog';
import CONTRIBUTORS from '../contributor/contributors';

const CHANGELOG = [
  change(date(2025, 6, 20), "Added changelog.", CONTRIBUTORS.swirl),
];

export default CHANGELOG;
