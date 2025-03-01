import axios from 'axios';
import * as cheerio from 'cheerio';


export async function getSpellIcon(spellID: number): Promise<string | null> {
  try {
    const url = `https://www.wowhead.com/spell=${spellID}`;
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    // Extract icon name from the tooltip script
    const scriptContent = $('script:contains("WH.Tooltip.add")').html();
    if (!scriptContent) return null;

    const match = scriptContent.match(/icon: '([^']+)'/);
    return match ? match[1] : "0";
  } catch (error) {
    console.error(`Failed to fetch spell icon for ID ${spellID}:`, error);
    return null;
  }
}
