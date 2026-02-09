'use client';

import React, { useState, useMemo } from 'react';

import { 
    useGetAllEnvConfigsQuery, 
    useBulkUpdateEnvConfigsMutation, 
    useSyncFromEnvMutation, 
    useReloadEnvConfigsMutation,
    useLazyGetEnvConfigByKeyQuery,
    useExportToEnvMutation,
    useClearCacheMutation
} from '@/store/features/admin/envConfigApiService';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { 
    Loader2, 
    RefreshCw, 
    Save, 
    Download, 
    AlertTriangle, 
    ShieldCheck, 
    Zap, 
    Eye, 
    EyeOff, 
    Search, 
    Database,
    FileJson,
    Server,
    Layout,
    Settings,
    Eraser
} from 'lucide-react';
import EditConfigModal from './_components/EditConfigModal';
import SyncFromEnvModal from './_components/SyncFromEnvModal';

export default function EnvConfigPage() {
    const { data, isLoading, refetch, isFetching } = useGetAllEnvConfigsQuery();
    const [bulkUpdate] = useBulkUpdateEnvConfigsMutation();
    const [syncFromEnv] = useSyncFromEnvMutation();
    const [reloadConfigs] = useReloadEnvConfigsMutation();
    const [getByKey] = useLazyGetEnvConfigByKeyQuery();
    const [exportToEnv, { isLoading: isExporting }] = useExportToEnvMutation();
    const [clearCache] = useClearCacheMutation();

    const [isUpdating, setIsUpdating] = useState(false);
    const [isSyncing, setIsSyncing] = useState(false);
    const [isReloading, setIsReloading] = useState(false);
    const [isClearingCache, setIsClearingCache] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isSyncModalOpen, setIsSyncModalOpen] = useState(false);
    const [editingConfig, setEditingConfig] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    
    const [localChanges, setLocalChanges] = useState({});
    const [revealedValues, setRevealedValues] = useState({});
    const [revealingKey, setRevealingKey] = useState(null);

    const configs = data?.data || {};
    
    // Filter configs based on search query
    const filteredConfigs = useMemo(() => {
        if (!searchQuery) return configs;
        
        const filtered = {};
        Object.keys(configs).forEach(group => {
            const matches = configs[group].filter(c => 
                c.key.toLowerCase().includes(searchQuery.toLowerCase()) || 
                c.description?.toLowerCase().includes(searchQuery.toLowerCase())
            );
            if (matches.length > 0) {
                filtered[group] = matches;
            }
        });
        return filtered;
    }, [configs, searchQuery]);

    const groups = Object.keys(filteredConfigs);

    const handleValueChange = (key, value) => {
        setLocalChanges(prev => ({
            ...prev,
            [key]: value
        }));
    };

    const handleReveal = async (key) => {
        if (revealedValues[key]) {
            setRevealedValues(prev => {
                const next = { ...prev };
                delete next[key];
                return next;
            });
            return;
        }

        try {
            setRevealingKey(key);
            const res = await getByKey(key).unwrap();
            setRevealedValues(prev => ({
                ...prev,
                [key]: res.data.value
            }));
        } catch (error) {
            toast.error('Failed to reveal sensitive value');
        } finally {
            setRevealingKey(null);
        }
    };

    const handleEdit = (config) => {
        setEditingConfig(config);
        setIsEditModalOpen(true);
    };

    const handleSave = async (group) => {
        const groupConfigs = configs[group];
        const updates = groupConfigs
            .filter(config => {
                const currentVal = localChanges[config.key];
                return currentVal !== undefined && currentVal !== config.value && currentVal !== '***MASKED***';
            })
            .map(config => ({
                key: config.key,
                value: localChanges[config.key]
            }));

        if (updates.length === 0) {
            toast.info('No changes to save for this group');
            return;
        }

        try {
            setIsUpdating(true);
            await bulkUpdate({ configs: updates }).unwrap();
            toast.success('Configurations updated successfully');
            setLocalChanges(prev => {
                const newChanges = { ...prev };
                updates.forEach(u => delete newChanges[u.key]);
                return newChanges;
            });
            // Clear revealed values for updated keys
            setRevealedValues(prev => {
                const next = { ...prev };
                updates.forEach(u => delete next[u.key]);
                return next;
            });
            refetch();
        } catch (error) {
            toast.error(error?.data?.message || 'Failed to update configurations');
        } finally {
            setIsUpdating(false);
        }
    };

    const handleSync = () => {
        setIsSyncModalOpen(true);
    };

    const confirmSync = async () => {
        try {
            setIsSyncing(true);
            const res = await syncFromEnv({ force: false }).unwrap();
            toast.success(res.message);
            setIsSyncModalOpen(false);
            refetch();
        } catch (error) {
            toast.error(error?.data?.message || 'Sync failed');
        } finally {
            setIsSyncing(false);
        }
    };

    const handleReload = async () => {
        try {
            setIsReloading(true);
            await reloadConfigs().unwrap();
            toast.success('Configurations reloaded from database and cache cleared');
            refetch();
        } catch (error) {
            toast.error(error?.data?.message || 'Reload failed');
        } finally {
            setIsReloading(false);
        }
    };
    
    const handleClearCache = async () => {
        try {
            setIsClearingCache(true);
            await clearCache().unwrap();
            toast.success('System cache cleared successfully');
            refetch();
        } catch (error) {
            toast.error(error?.data?.message || 'Failed to clear cache');
        } finally {
            setIsClearingCache(false);
        }
    };

    const handleExport = async () => {
        try {
            const blob = await exportToEnv().unwrap();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `.env.export-${new Date().toISOString().split('T')[0]}.env`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            toast.success('Export downloaded successfully');
        } catch (error) {
            toast.error('Export failed');
            console.error(error);
        }
    };

    const getGroupIcon = (group) => {
        const g = group.toLowerCase();
        if (g.includes('aws') || g.includes('s3') || g.includes('cloud')) return <Server className="w-4 h-4" />;
        if (g.includes('db') || g.includes('mongo') || g.includes('redis')) return <Database className="w-4 h-4" />;
        if (g.includes('api') || g.includes('url')) return <FileJson className="w-4 h-4" />;
        return <Layout className="w-4 h-4" />;
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
                <div className="relative">
                    <div className="w-16 h-16 border-4 border-[#1BABA9]/10 border-t-[#1BABA9] rounded-full animate-spin"></div>
                    <Zap className="w-6 h-6 text-[#1BABA9] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                </div>
                <p className="text-gray-500 font-medium animate-pulse">Initializing Configuration Engine...</p>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-[1400px] mx-auto space-y-8 animate-in fade-in duration-500">
            {/* Header Section */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <div className="space-y-1">
                    <h1 className="text-3xl font-extrabold flex items-center gap-3 tracking-tight">
                        <div className="bg-[#1BABA9]/10 p-2 rounded-xl">
                            <Zap className="text-[#1BABA9] w-6 h-6" />
                        </div>
                        <span className="bg-gradient-to-r from-[#1BABA9] to-[#0D9488] bg-clip-text text-transparent">
                            System Environment
                        </span>
                    </h1>
                    <p className="text-gray-500 text-sm font-medium pl-14">
                        Control application runtime behavior and secure credentials.
                    </p>
                </div>
                
                <div className="flex flex-wrap items-center gap-3 lg:pl-0 pl-14">
                    <div className="relative group">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#1BABA9] transition-colors" />
                        <Input 
                            placeholder="Search keys..." 
                            className="pl-9 w-[280px] bg-gray-50 border-gray-200 focus:bg-white focus:ring-[#1BABA9]/20 focus:border-[#1BABA9] transition-all rounded-xl"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="h-8 w-px bg-gray-200 mx-1 hidden sm:block" />
                    <Button variant="outline" size="icon" onClick={handleReload} disabled={isReloading} title="Reload from Database" className="rounded-xl">
                        <RefreshCw className={`w-4 h-4 ${isReloading ? 'animate-spin' : ''}`} />
                    </Button>
                    <Button 
                        variant="outline" 
                        size="icon" 
                        onClick={handleClearCache} 
                        disabled={isClearingCache} 
                        title="Clear System Cache" 
                        className="rounded-xl text-red-500 hover:text-red-600 hover:bg-red-50 border-red-100"
                    >
                        {isClearingCache ? <Loader2 className="w-4 h-4 animate-spin" /> : <Eraser className="w-4 h-4" />}
                    </Button>
                    <Button 
                        variant="outline" 
                        size="icon" 
                        onClick={handleExport} 
                        disabled={isExporting} 
                        title="Export to .env" 
                        className="rounded-xl"
                    >
                        {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                    </Button>
                </div>
            </div>

            {/* Main Content Area */}
            {groups.length > 0 ? (
                <Tabs defaultValue={groups[0]} className="w-full space-y-6">
                    <div className="flex items-center justify-between pb-2 border-b border-gray-100 overflow-x-auto">
                        <TabsList className="bg-transparent h-auto p-0 flex gap-2">
                            {groups.map(group => (
                                <TabsTrigger 
                                    key={group} 
                                    value={group} 
                                    className="px-4 py-2 rounded-full border border-transparent data-[state=active]:border-[#1BABA9]/20 data-[state=active]:bg-[#1BABA9]/5 data-[state=active]:text-[#1BABA9] font-semibold text-gray-500 transition-all text-sm flex items-center gap-2"
                                >
                                    {getGroupIcon(group)}
                                    {group}
                                    <span className="bg-gray-100 text-[10px] px-1.5 py-0.5 rounded-full group-data-[state=active]:bg-[#1BABA9]/10 group-data-[state=active]:text-[#1BABA9]">
                                        {filteredConfigs[group].length}
                                    </span>
                                </TabsTrigger>
                            ))}
                        </TabsList>
                    </div>

                    {groups.map(group => (
                        <TabsContent key={group} value={group} className="space-y-4 outline-none">
                            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden border-t-4 border-t-[#1BABA9]">
                                <div className="px-6 py-4 bg-gray-50/50 border-b border-gray-200 flex justify-between items-center">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-[#1BABA9]/10 p-1.5 rounded-lg text-[#1BABA9]">
                                            {getGroupIcon(group)}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-900 uppercase tracking-wide text-xs">
                                                {group} OVERVIEW
                                            </h3>
                                            <p className="text-[10px] text-gray-400 font-medium">Manage system variables for this category</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        {(group.toUpperCase() === 'API' || group.toLowerCase().includes('api') || group.toLowerCase().includes('redis')) && (
                                            <Button 
                                                size="sm" 
                                                variant="outline"
                                                onClick={handleClearCache}
                                                disabled={isClearingCache}
                                                className="text-red-500 hover:text-red-700 hover:bg-red-50 border-red-100 rounded-lg px-4 transition-all"
                                            >
                                                {isClearingCache ? <Loader2 className="w-3.5 h-3.5 animate-spin mr-2" /> : <Eraser className="w-3.5 h-3.5 mr-2" />}
                                                Clear Cache
                                            </Button>
                                        )}
                                        <Button 
                                            size="sm" 
                                            onClick={() => handleSave(group)}
                                            disabled={isUpdating}
                                            className="bg-[#1BABA9] hover:bg-[#0D9488] text-white rounded-lg px-4 hover:shadow-lg hover:shadow-[#1BABA9]/20 transition-all"
                                        >
                                            {isUpdating ? <Loader2 className="w-3.5 h-3.5 animate-spin mr-2" /> : <Save className="w-3.5 h-3.5 mr-2" />}
                                            Apply Changes
                                        </Button>
                                    </div>
                                </div>
                                <div className="divide-y divide-gray-100">
                                    {filteredConfigs[group].map((config) => {
                                        const isRevealed = !!revealedValues[config.key];
                                        const currentValue = localChanges[config.key] ?? (isRevealed ? revealedValues[config.key] : config.value);
                                        const isModified = localChanges[config.key] !== undefined && localChanges[config.key] !== (isRevealed ? revealedValues[config.key] : config.value);

                                        return (
                                            <div key={config.key} className="p-6 grid grid-cols-1 md:grid-cols-12 gap-8 items-start hover:bg-blue-50/20 transition-all group/row">
                                                <div className="md:col-span-4 space-y-3">
                                                    <div className="flex flex-wrap items-center gap-2">
                                                        <code className="text-xs font-bold bg-gray-100 px-2.5 py-1 rounded-md text-gray-700 border border-gray-200 group-hover/row:bg-white group-hover/row:border-[#1BABA9]/20 transition-colors">
                                                            {config.key}
                                                        </code>
                                                        <div className="flex gap-1">
                                                            {['CLIENT_SITE_URL', 'FIRM_CLIENT_URL'].includes(config.key) && (
                                                                <span className="flex items-center text-[9px] bg-red-50 text-red-600 font-bold px-1.5 py-0.5 rounded-sm uppercase tracking-wider animate-pulse border border-red-100">
                                                                    <Zap className="w-2.5 h-2.5 mr-1" />
                                                                    Critical Link
                                                                </span>
                                                            )}
                                                            {config.isSensitive && (
                                                                <span className="flex items-center text-[9px] bg-[#1BABA9]/5 text-[#1BABA9] font-bold px-1.5 py-0.5 rounded-sm uppercase tracking-wider border border-[#1BABA9]/10">
                                                                    <ShieldCheck className="w-2.5 h-2.5 mr-1" />
                                                                    Sensitive
                                                                </span>
                                                            )}
                                                            {config.requiresRestart && (
                                                                <span className="flex items-center text-[9px] bg-amber-50 text-amber-600 font-bold px-1.5 py-0.5 rounded-sm uppercase tracking-wider">
                                                                    <AlertTriangle className="w-2.5 h-2.5 mr-1" />
                                                                    Restart Required
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <p className="text-xs text-gray-400 font-medium leading-relaxed pr-4">
                                                        {config.description}
                                                    </p>
                                                    
                                                    {isModified && (
                                                        <div className="flex items-center gap-2 pt-1">
                                                            <div className="w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.5)] animate-pulse" />
                                                            <span className="text-[10px] text-amber-600 font-bold uppercase tracking-widest">Pending local change</span>
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="md:col-span-8 flex flex-col gap-3">
                                                    <div className="flex gap-2">
                                                        <div className="relative flex-1 group/input">
                                                            {config.type === 'boolean' ? (
                                                                <div className="relative">
                                                                    <select
                                                                        className={`w-full border ${isModified ? 'border-amber-300 ring-2 ring-amber-50 bg-amber-50/20' : 'border-gray-200 bg-gray-50/50'} rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#1BABA9] focus:border-[#1BABA9] outline-none transition-all appearance-none cursor-pointer font-semibold pr-10`}
                                                                        value={currentValue}
                                                                        onChange={(e) => handleValueChange(config.key, e.target.value)}
                                                                    >
                                                                        <option value="true">ENABLED (TRUE)</option>
                                                                        <option value="false">DISABLED (FALSE)</option>
                                                                    </select>
                                                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-400">
                                                                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/></svg>
                                                                    </div>
                                                                </div>
                                                            ) : (
                                                                <div className="relative">
                                                                    <input
                                                                        type={config.isSensitive && !isRevealed ? 'password' : 'text'}
                                                                        className={`w-full border ${isModified ? 'border-amber-300 ring-2 ring-amber-50 bg-amber-50/20' : 'border-gray-200 bg-gray-50/50'} rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#1BABA9] focus:border-[#1BABA9] outline-none transition-all font-mono`}
                                                                        value={currentValue}
                                                                        onChange={(e) => handleValueChange(config.key, e.target.value)}
                                                                        placeholder={`Value (${config.type})`}
                                                                    />
                                                                    {config.isSensitive && (
                                                                        <button
                                                                            onClick={() => handleReveal(config.key)}
                                                                            disabled={revealingKey === config.key}
                                                                            className="absolute right-3 top-1/2 -translate-y-1/2 p-2 hover:bg-gray-200 rounded-lg text-gray-500 transition-colors"
                                                                        >
                                                                            {revealingKey === config.key ? <Loader2 className="w-4 h-4 animate-spin" /> : 
                                                                             isRevealed ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                                                        </button>
                                                                    )}
                                                                </div>
                                                            )}
                                                        </div>
                                                        
                                                        <Button 
                                                            variant="ghost" 
                                                            size="icon" 
                                                            onClick={() => handleEdit(config)}
                                                            className="shrink-0 h-10 w-10 text-gray-400 hover:text-[#1BABA9] hover:bg-[#1BABA9]/5 transition-all opacity-0 group-hover/row:opacity-100 rounded-xl border border-transparent hover:border-[#1BABA9]/20"
                                                            title="Advanced Configuration"
                                                        >
                                                            <Settings className="w-4 h-4" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </TabsContent>
                    ))}
                </Tabs>
            ) : (
                <div className="bg-white border-2 border-dashed border-gray-100 rounded-[2rem] p-24 text-center space-y-6 shadow-sm">
                    <div className="bg-[#1BABA9]/10 w-24 h-24 rounded-3xl flex items-center justify-center mx-auto text-[#1BABA9] rotate-12 group hover:rotate-0 transition-transform duration-500">
                        <Database className="w-12 h-12" />
                    </div>
                    <div className="max-w-md mx-auto space-y-2">
                        <h3 className="text-2xl font-black text-gray-900">Config Grid Empty</h3>
                        <p className="text-gray-400 font-medium">
                            {searchQuery ? `No matches found for "${searchQuery}". Try a different term or group.` : "No environment configurations detected in the secure vault."}
                        </p>
                    </div>
                    {!searchQuery && (
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                            <Button onClick={handleSync} variant="outline" className="px-8 py-6 rounded-2xl border-2 hover:bg-gray-50 flex items-center gap-2" disabled={isSyncing}>
                                {isSyncing ? <Loader2 className="w-5 h-5 animate-spin" /> : <RefreshCw className="w-5 h-5" />}
                                Sync from .env File
                            </Button>
                        </div>
                    )}
                </div>
            )}

            {/* Modals and Overlays */}
            <EditConfigModal 
                isOpen={isEditModalOpen} 
                onOpenChange={setIsEditModalOpen}
                config={editingConfig}
                refetch={refetch}
            />
            <SyncFromEnvModal 
                isOpen={isSyncModalOpen}
                onOpenChange={setIsSyncModalOpen}
                onConfirm={confirmSync}
                isLoading={isSyncing}
            />
        </div>
    );
}
