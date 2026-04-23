"use client";

import { useEffect, useState } from "react";
import { getLeaderboardData } from "@/actions/leaderboard";
import { motion } from "framer-motion";
import { Flame, Trophy, Medal, Star } from "lucide-react";
import LoadingScreen from "@/components/LoadingScreen";

export default function LeaderboardPage() {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getLeaderboardData().then(data => {
            setUsers(data);
            setLoading(false);
        });
    }, []);

    const getRankIcon = (rank: number) => {
        switch (rank) {
            case 1: return <Trophy className="w-8 h-8 text-yellow-500" />;
            case 2: return <Medal className="w-8 h-8 text-slate-400" />;
            case 3: return <Medal className="w-8 h-8 text-amber-600" />;
            default: return <span className="text-xl font-bold text-on-surface-variant w-8 text-center">{rank}</span>;
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-20">
            <header className="text-center space-y-4">
                <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-1 rounded-full text-primary font-bold text-sm">
                    <Flame className="w-4 h-4" /> Global Rankings
                </div>
                <h1 className="text-4xl md:text-6xl font-black font-headline tracking-tighter text-on-surface">Tomato Legends.</h1>
                <p className="text-on-surface-variant font-medium text-lg">The more you grow, the higher you go.</p>
            </header>

            {loading ? (
                <LoadingScreen message="Calculating rankings..." fullScreen={false} />
            ) : (
                <div className="bg-surface-container rounded-[2.5rem] overflow-hidden border border-outline-variant/10 shadow-xl">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-surface-container-highest/50">
                                    <th className="px-8 py-6 text-sm font-black uppercase tracking-widest text-on-surface-variant">Rank</th>
                                    <th className="px-8 py-6 text-sm font-black uppercase tracking-widest text-on-surface-variant">Scholar</th>
                                    <th className="px-8 py-6 text-sm font-black uppercase tracking-widest text-on-surface-variant">Streak</th>
                                    <th className="px-8 py-6 text-sm font-black uppercase tracking-widest text-on-surface-variant text-right">Total Tomatoes</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-outline-variant/10">
                                {users.map((user, index) => (
                                    <motion.tr 
                                        key={user.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        className={`hover:bg-primary/5 transition-colors group ${index < 3 ? 'bg-primary/5' : ''}`}
                                    >
                                        <td className="px-8 py-6 whitespace-nowrap">
                                            {getRankIcon(user.rank)}
                                        </td>
                                        <td className="px-8 py-6 whitespace-nowrap">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-full bg-surface-container-highest flex items-center justify-center font-bold text-primary shadow-sm">
                                                    {user.name.charAt(0)}
                                                </div>
                                                <span className="font-bold text-lg text-on-surface group-hover:text-primary transition-colors">{user.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 whitespace-nowrap">
                                            <div className="flex items-center gap-2 text-secondary font-bold">
                                                <Star className="w-4 h-4 fill-secondary" />
                                                <span>{user.streak} days</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 whitespace-nowrap text-right">
                                            <div className="flex items-center justify-end gap-2 px-4 py-2 bg-white rounded-xl border border-outline-variant/10 shadow-sm inline-flex">
                                                <span className="text-2xl">🍅</span>
                                                <span className="font-black text-xl text-on-surface">{user.totalTomatoesEarned}</span>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
