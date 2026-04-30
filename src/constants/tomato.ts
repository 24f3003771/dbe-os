// Ranks based on total tomatoes earned
export const RANKS = [
    { name: "Tomato Seedling", min: 0 },
    { name: "Growing Vine", min: 51 },
    { name: "Blossoming Scholar", min: 201 },
    { name: "Ripe Leader", min: 501 },
    { name: "Harvest Master", min: 1001 },
    { name: "Golden Tomato Sage", min: 2001 },
];

export function getRank(total: number) {
    const rank = [...RANKS].reverse().find(r => total >= r.min);
    return rank ? rank.name : RANKS[0].name;
}
