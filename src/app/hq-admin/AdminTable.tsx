"use client";

import { useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { Loader2, UserX, UserCheck, Shield, Star, User, MoreVertical, Search, Users as UsersIcon, Activity } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type UserData = {
    id: string;
    name: string;
    email: string;
    phone: string;
    zone: string;
    batch: string;
    pincode: string;
    state: string;
    city: string;
    type: number;
    role: string;
    created_at: string;
};

export default function AdminTable({ initialUsers }: { initialUsers: UserData[] }) {
    const [users, setUsers] = useState<UserData[]>(initialUsers);
    const [loadingId, setLoadingId] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const usersPerPage = 10;

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        (process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
    );

    const toggleUserStatus = async (userId: string, currentType: number) => {
        setLoadingId(userId + "-status");
        try {
            const user = users.find(u => u.id === userId);
            let newType = 0;
            if (currentType === 0) {
                newType = user?.email.toLowerCase().endsWith('@iimb.ac.in') ? 1 : 2;
            }
            
            const { error } = await supabase
                .from('users')
                .update({ type: newType })
                .eq('id', userId);

            if (error) throw error;

            setUsers(users.map(u => u.id === userId ? { ...u, type: newType } : u));
        } catch (error) {
            console.error("Error updating user status:", error);
            alert("Failed to update user status.");
        } finally {
            setLoadingId(null);
        }
    };

    const changeUserRole = async (userId: string, newRole: string) => {
        setLoadingId(userId + "-role");
        try {
            const { error } = await supabase
                .from('users')
                .update({ role: newRole })
                .eq('id', userId);

            if (error) throw error;

            setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
        } catch (error) {
            console.error("Error updating user role:", error);
            alert("Failed to update user role.");
        } finally {
            setLoadingId(null);
        }
    };

    const filteredUsers = users.filter(user => 
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.phone?.includes(searchTerm)
    );

    const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
    const currentUsers = filteredUsers.slice((currentPage - 1) * usersPerPage, currentPage * usersPerPage);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1); // Reset to first page on new search
    };

    const activeUsers = users.filter(u => u.type === 1).length;
    const disabledUsers = users.filter(u => u.type === 0).length;
    const adminUsers = users.filter(u => u.role === 'SUPER_ADMIN' || u.role === 'MODERATOR').length;

    return (
        <div className="space-y-6">
            {/* Stats Dashboard */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-surface-container rounded-3xl p-6 border border-outline-variant/20 shadow-sm relative overflow-hidden group">
                    <div className="absolute -right-4 -top-4 w-24 h-24 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors" />
                    <UsersIcon className="w-6 h-6 text-primary mb-4" />
                    <p className="text-2xl font-black text-on-surface">{users.length}</p>
                    <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mt-1">Total Users</p>
                </motion.div>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-surface-container rounded-3xl p-6 border border-outline-variant/20 shadow-sm relative overflow-hidden group">
                    <div className="absolute -right-4 -top-4 w-24 h-24 bg-green-500/5 rounded-full blur-2xl group-hover:bg-green-500/10 transition-colors" />
                    <Activity className="w-6 h-6 text-green-500 mb-4" />
                    <p className="text-2xl font-black text-on-surface">{activeUsers}</p>
                    <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mt-1">Active</p>
                </motion.div>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-surface-container rounded-3xl p-6 border border-outline-variant/20 shadow-sm relative overflow-hidden group">
                    <div className="absolute -right-4 -top-4 w-24 h-24 bg-error/5 rounded-full blur-2xl group-hover:bg-error/10 transition-colors" />
                    <UserX className="w-6 h-6 text-error mb-4" />
                    <p className="text-2xl font-black text-on-surface">{disabledUsers}</p>
                    <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mt-1">Disabled</p>
                </motion.div>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-surface-container rounded-3xl p-6 border border-outline-variant/20 shadow-sm relative overflow-hidden group">
                    <div className="absolute -right-4 -top-4 w-24 h-24 bg-secondary/5 rounded-full blur-2xl group-hover:bg-secondary/10 transition-colors" />
                    <Shield className="w-6 h-6 text-secondary mb-4" />
                    <p className="text-2xl font-black text-on-surface">{adminUsers}</p>
                    <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mt-1">Admins</p>
                </motion.div>
            </div>

            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Search className="w-5 h-5 text-on-surface-variant/50" />
                </div>
                <input 
                    type="text" 
                    placeholder="Search by name, email or phone..." 
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="w-full bg-surface-container border border-outline-variant/20 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                />
            </div>

            <div className="bg-surface-container rounded-3xl overflow-hidden border border-outline-variant/20 shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-surface-container-highest border-b border-outline-variant/20">
                                <th className="p-4 text-[10px] font-black uppercase tracking-widest text-on-surface-variant">User Details</th>
                                <th className="p-4 text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Location & Cohort</th>
                                <th className="p-4 text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Status</th>
                                <th className="p-4 text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Role</th>
                                <th className="p-4 text-[10px] font-black uppercase tracking-widest text-on-surface-variant text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-outline-variant/10">
                            <AnimatePresence mode="popLayout">
                            {currentUsers.map((user, index) => (
                                <motion.tr 
                                    key={user.id} 
                                    layout
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ duration: 0.2, delay: index * 0.03 }}
                                    className="hover:bg-surface-container-highest/50 transition-colors"
                                >
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-black text-xs shrink-0">
                                                {user.name?.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || 'U'}
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <p className="font-black text-sm text-on-surface">{user.name}</p>
                                                    {user.type === 2 && (
                                                        <span className="px-1.5 py-0.5 rounded-md bg-secondary/10 text-secondary text-[8px] font-black uppercase tracking-widest border border-secondary/20">External</span>
                                                    )}
                                                </div>
                                                <p className="text-xs font-bold text-on-surface-variant mt-0.5">{user.email}</p>
                                                <p className="text-[10px] font-bold text-on-surface-variant/70 mt-0.5">{user.phone}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <div className="space-y-1">
                                            <p className="text-xs font-bold text-on-surface bg-surface-container-lowest px-2 py-1 rounded-md inline-block border border-outline-variant/10">{user.batch || 'No Batch'}</p>
                                            <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">{user.zone || 'No Zone'}</p>
                                            <p className="text-[10px] font-bold text-on-surface-variant">{user.city ? `${user.city}, ${user.state}` : 'No location'}</p>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <button 
                                            onClick={() => toggleUserStatus(user.id, user.type)}
                                            disabled={loadingId === user.id + "-status"}
                                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
                                                user.type === 0 
                                                ? 'bg-error/10 text-error hover:bg-error/20 border border-error/20' 
                                                : 'bg-green-500/10 text-green-600 hover:bg-green-500/20 border border-green-500/20'
                                            }`}
                                        >
                                            {loadingId === user.id + "-status" ? (
                                                <Loader2 className="w-3 h-3 animate-spin" />
                                            ) : user.type === 0 ? (
                                                <><UserX className="w-3 h-3" /> Disabled</>
                                            ) : (
                                                <><UserCheck className="w-3 h-3" /> Active</>
                                            )}
                                        </button>
                                    </td>
                                    <td className="p-4">
                                        <div className="relative group">
                                            <select 
                                                value={user.role}
                                                onChange={(e) => changeUserRole(user.id, e.target.value)}
                                                disabled={loadingId === user.id + "-role"}
                                                className={`appearance-none outline-none cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 pr-8 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
                                                    user.role === 'SUPER_ADMIN' ? 'bg-error/10 text-error border border-error/20' :
                                                    user.role === 'MODERATOR' ? 'bg-secondary/10 text-secondary border border-secondary/20' :
                                                    'bg-surface-container-lowest text-on-surface-variant border border-outline-variant/20'
                                                }`}
                                            >
                                                <option value="USER">USER</option>
                                                <option value="MODERATOR">MODERATOR</option>
                                                <option value="SUPER_ADMIN">SUPER_ADMIN</option>
                                            </select>
                                            <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
                                                {loadingId === user.id + "-role" ? (
                                                    <Loader2 className="w-3 h-3 animate-spin text-current" />
                                                ) : user.role === 'SUPER_ADMIN' ? (
                                                    <Shield className="w-3 h-3 text-error" />
                                                ) : user.role === 'MODERATOR' ? (
                                                    <Star className="w-3 h-3 text-secondary" />
                                                ) : (
                                                    <User className="w-3 h-3 text-on-surface-variant" />
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4 text-right">
                                        <button className="p-2 text-on-surface-variant hover:text-primary transition-colors hover:bg-primary/10 rounded-xl">
                                            <MoreVertical className="w-4 h-4" />
                                        </button>
                                    </td>
                                </motion.tr>
                            ))}
                            </AnimatePresence>

                            {filteredUsers.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="p-8 text-center text-sm font-bold text-on-surface-variant">
                                        No users found matching "{searchTerm}"
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-2">
                    <p className="text-xs font-bold text-on-surface-variant">
                        Showing <span className="text-on-surface font-black">{(currentPage - 1) * usersPerPage + 1}</span> to <span className="text-on-surface font-black">{Math.min(currentPage * usersPerPage, filteredUsers.length)}</span> of <span className="text-on-surface font-black">{filteredUsers.length}</span> users
                    </p>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className="px-4 py-2 bg-surface-container border border-outline-variant/20 rounded-xl font-black text-xs uppercase tracking-widest text-on-surface hover:bg-surface-container-highest transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Previous
                        </button>
                        <div className="px-3 py-2 bg-surface-container-highest rounded-xl text-xs font-black text-on-surface">
                            {currentPage} / {totalPages}
                        </div>
                        <button
                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                            className="px-4 py-2 bg-primary text-on-primary rounded-xl font-black text-xs uppercase tracking-widest hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
