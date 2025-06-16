const icons = require.context("../assets/icons", false, /\.png$/);

export function FormatIconImg(image: string): string {
  try {
    return icons(`./${image}.png`);
  } catch {
    return "";
  }
}

export function FormatIconLink(image) {
    return `https://wow.zamimg.com/images/wow/icons/large/${image}.jpg`;
}