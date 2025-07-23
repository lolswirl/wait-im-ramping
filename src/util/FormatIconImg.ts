const icons = require.context("../assets/icons", false, /\.png$/);

export function FormatIconImg(image: string): string {
  return image ? `/icons/${image}.png` : "";
}

export function FormatIconLink(image: string): string {
  return `https://wow.zamimg.com/images/wow/icons/large/${image}.jpg`;
}