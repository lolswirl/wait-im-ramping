export const toRomanNumeral = (num: number): string => {

    const romanMap: { [key: number]: string } = {
        1: "I",
        2: "II",
        3: "III",
        4: "IV",
        5: "V",
    };

    return romanMap[num] || num.toString();
};
  