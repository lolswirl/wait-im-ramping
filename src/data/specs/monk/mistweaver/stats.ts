export const stats = {
    intellect: 17647,
    mastery: 55.44,
    masteryBonus: (baseHealing: number) => baseHealing * (1 + 55.44 / 100),
};