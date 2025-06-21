import { Contributor } from './contributor';

const avatars = require.context('../../assets/avatars', false, /\.(png|jpe?g)$/);

function avatar(filename: string): string {
  try {
    return avatars(`./${filename}`);
  } catch (e) {
    return avatars('./default.png');
  }
}

const CONTRIBUTORS: Record<string, Contributor> = {
  swirl: {
    name: 'swirl',
    github: 'lolswirl',
    avatar: avatar('swirl.png'),
    color: "#12f52f"
  },
};

export default CONTRIBUTORS;
