'use client';

import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import Cookies from 'js-cookie';
import { 
    useGetAllEnvConfigsQuery, 
    useBulkUpdateEnvConfigsMutation, 
    useSyncFromEnvMutation, 
    useReloadEnvConfigsMutation,
    useLazyGetEnvConfigByKeyQuery 
} from '@/store/features/admin/envConfigApiService';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from 'sonner';
import { Loader2, RefreshCw, Save, Download, AlertTriangle, ShieldCheck, ShieldAlert, Zap, Eye, EyeOff } from 'lucide-react';

export default function EnvConfigPage() {
    const { data, isLoading, refetch, isFetching } = useGetAllEnvConfigsQuery();
    const [bulkUpdate] = useBulkUpdateEnvConfigsMutation();
    const [syncFromEnv] = useSyncFromEnvMutation();
    const [reloadConfigs] = useReloadEnvConfigsMutation();
    const [getByKey] = useLazyGetEnvConfigByKeyQuery();

    const [isUpdating, setIsUpdating] = useState(false);
    const [isSyncing, setIsSyncing] = useState(false);
    const [isReloading, setIsReloading] = useState(false);
    const [localChanges, setLocalChanges] = useState({});
    const [revealedValues, setRevealedValues] = useState({});
    const [revealingKey, setRevealingKey] = useState(null);

    const configs = data?.data || {};
    const groups = Object.keys(configs);

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
            // Also update local changes if they haven't been edited yet
            if (localChanges[key] === undefined) {
                // We don't necessarily want to set it as a change, just show it
            }
        } catch (error) {
            toast.error('Failed to reveal sensitive value');
        } finally {
            setRevealingKey(null);
        }
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

    const handleSync = async () => {
        if (!confirm('This will sync missing configurations from the .env file. Existing ones will not be overwritten unless you force it. Continue?')) return;
        
        try {
            setIsSyncing(true);
            const res = await syncFromEnv({ force: false }).unwrap();
            toast.success(res.message);
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

    const handleExport = async () => {
        try {
            const token = Cookies.get('token');
            const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/env-config/export/to-env`, {
                method: 'POST',
                headers: {
                    'Authorization': `${token}`
                }
            });
            
            if (!res.ok) throw new Error('Export failed');
            
            const blob = await res.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `.env.export-${new Date().toISOString().split('T')[0]}.env`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            toast.success('Exported successfully');
        } catch (error) {
            toast.error('Export failed');
            console.error(error);
        }
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
                <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
                <p className="text-gray-500 animate-pulse">Loading configurations...</p>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-[1200px] mx-auto space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-3">
                        <Zap className="text-amber-500" />
                        <span className="bg-gradient-to-r from-blue-700 to-indigo-600 bg-clip-text text-transparent">
                            Environment Configuration
                        </span>
                    </h1>
                    <p className="text-gray-500">Manage your application runtime settings and env variables.</p>
                </div>
                <div className="flex flex-wrap gap-2">
                    <Button variant="outline" size="sm" onClick={handleReload} disabled={isReloading}>
                        <RefreshCw className={`w-4 h-4 mr-2 ${isReloading ? 'animate-spin' : ''}`} />
                        Reload
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleSync} disabled={isSyncing}>
                        <RefreshCw className={`w-4 h-4 mr-2 ${isSyncing ? 'animate-spin' : ''}`} />
                        Sync from .env
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleExport}>
                        <Download className="w-4 h-4 mr-2" />
                        Export
                    </Button>
                </div>
            </div>

            <Tabs defaultValue={groups[0]} className="w-full">
                <TabsList className="mb-4 flex flex-wrap h-auto bg-gray-100 p-1 rounded-lg">
                    {groups.map(group => (
                        <TabsTrigger key={group} value={group} className="px-6 py-2.5 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md transition-all">
                            {group}
                        </TabsTrigger>
                    ))}
                </TabsList>

                {groups.map(group => (
                    <TabsContent key={group} value={group} className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                            <div className="p-4 bg-gray-50/80 border-b border-gray-200 flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                    <h3 className="font-bold text-gray-800 uppercase tracking-tight text-sm">
                                        {group} Properties
                                    </h3>
                                    <span className="bg-gray-200 text-gray-600 text-[10px] px-2 py-0.5 rounded-full font-bold">
                                        {configs[group].length} items
                                    </span>
                                </div>
                                <Button 
                                    size="sm" 
                                    onClick={() => handleSave(group)}
                                    disabled={isUpdating}
                                    className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
                                >
                                    {isUpdating ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                                    Save Group Changes
                                </Button>
                            </div>
                            <div className="divide-y divide-gray-100">
                                {configs[group].map((config) => {
                                    const isRevealed = !!revealedValues[config.key];
                                    const currentValue = localChanges[config.key] ?? (isRevealed ? revealedValues[config.key] : config.value);
                                    const isModified = localChanges[config.key] !== undefined && localChanges[config.key] !== (isRevealed ? revealedValues[config.key] : config.value);

                                    return (
                                        <div key={config.key} className="p-5 grid grid-cols-1 md:grid-cols-12 gap-6 items-start hover:bg-gray-50/50 transition-colors">
                                            <div className="md:col-span-4 space-y-2">
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <code className="text-sm font-bold bg-blue-50 px-2.5 py-1 rounded text-blue-800 border border-blue-100">
                                                        {config.key}
                                                    </code>
                                                    {config.isSensitive && (
                                                        <span className="flex items-center text-[10px] bg-indigo-100 text-indigo-700 font-bold px-1.5 py-0.5 rounded uppercase">
                                                            <ShieldCheck className="w-3 h-3 mr-1" />
                                                            Sensitive
                                                        </span>
                                                    )}
                                                    {config.requiresRestart && (
                                                        <span className="flex items-center text-[10px] bg-amber-100 text-amber-700 font-bold px-1.5 py-0.5 rounded uppercase">
                                                            <AlertTriangle className="w-3 h-3 mr-1" />
                                                            Restart Req
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-xs text-gray-500 leading-relaxed">{config.description}</p>
                                            </div>
                                            <div className="md:col-span-8 flex flex-col gap-2">
                                                <div className="relative group/input">
                                                    {config.type === 'boolean' ? (
                                                        <select
                                                            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all appearance-none bg-white shadow-sm"
                                                            value={currentValue}
                                                            onChange={(e) => handleValueChange(config.key, e.target.value)}
                                                        >
                                                            <option value="true">True</option>
                                                            <option value="false">False</option>
                                                        </select>
                                                    ) : (
                                                        <div className="flex gap-2">
                                                            <input
                                                                type={config.isSensitive && !isRevealed ? 'password' : 'text'}
                                                                className={`flex-1 border ${isModified ? 'border-amber-400 bg-amber-50/30' : 'border-gray-300'} rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all shadow-sm font-mono`}
                                                                value={currentValue}
                                                                onChange={(e) => handleValueChange(config.key, e.target.value)}
                                                                placeholder={`Enter ${config.type} value`}
                                                            />
                                                            {config.isSensitive && (
                                                                <Button
                                                                    variant="ghost" 
                                                                    size="icon"
                                                                    onClick={() => handleReveal(config.key)}
                                                                    disabled={revealingKey === config.key}
                                                                    className="shrink-0 text-gray-400 hover:text-blue-600"
                                                                >
                                                                    {revealingKey === config.key ? <Loader2 className="w-4 h-4 animate-spin" /> : 
                                                                     isRevealed ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                                                </Button>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                                {isModified && (
                                                    <div className="flex items-center gap-1.5 pl-1">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                                                        <p className="text-[10px] text-amber-600 font-bold uppercase tracking-wider">Unsaved Change</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </TabsContent>
                ))}
            </Tabs>
            
            {groups.length === 0 && !isFetching && (
                 <div className="bg-white border-2 border-dashed border-gray-200 rounded-2xl p-12 text-center space-y-4">
                    <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto text-gray-400">
                        <AlertTriangle className="w-8 h-8" />
                    </div>
                    <div className="max-w-xs mx-auto">
                        <h3 className="text-lg font-bold text-gray-900">No Configurations Found</h3>
                        <p className="text-gray-500 text-sm mt-1">Try syncing from your .env file to get started.</p>
                    </div>
                    <Button onClick={handleSync} variant="outline" className="mt-4">
                        Sync Now
                    </Button>
                 </div>
            )}
        </div>
    );
}

