// Ranks based on total tomatoes earned
export const RANKS = [
    { name: "Scholar", min: 0 },
    { name: "Academic Merit", min: 51 },
    { name: "Honor Roll", min: 201 },
    { name: "Dean's List", min: 501 },
    { name: "Director's Merit List", min: 1001 },
    { name: "IIMB Gold Medalist", min: 2001 },
];

export function getRank(total: number) {
    const rank = [...RANKS].reverse().find(r => total >= r.min);
    return rank ? rank.name : RANKS[0].name;
}
