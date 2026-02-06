'use client';

import React, { useState, useEffect } from 'react';
import { useUpdateEnvConfigMutation, useLazyGetEnvConfigByKeyQuery } from '@/store/features/admin/envConfigApiService';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Loader2, Settings2 } from 'lucide-react';

export default function EditConfigModal({ isOpen, onOpenChange, config, refetch }) {
    const [updateConfig] = useUpdateEnvConfigMutation();
    const [getByKey] = useLazyGetEnvConfigByKeyQuery();
    const [isLoading, setIsLoading] = useState(false);
    const [isFetchingValue, setIsFetchingValue] = useState(false);
    
    const [formData, setFormData] = useState({
        value: '',
        group: '',
        type: 'string',
        isSensitive: false,
        requiresRestart: false,
        description: ''
    });

    useEffect(() => {
        if (config && isOpen) {
            setFormData({
                value: config.value === '***MASKED***' ? '' : config.value,
                group: config.group || 'GENERAL',
                type: config.type || 'string',
                isSensitive: !!config.isSensitive,
                requiresRestart: !!config.requiresRestart,
                description: config.description || ''
            });

            if (config.isSensitive) {
                fetchFullValue(config.key);
            }
        }
    }, [config, isOpen]);

    const fetchFullValue = async (key) => {
        try {
            setIsFetchingValue(true);
            const res = await getByKey(key).unwrap();
            setFormData(prev => ({
                ...prev,
                value: res.data.value
            }));
        } catch (error) {
            toast.error('Failed to fetch full value for editing');
        } finally {
            setIsFetchingValue(false);
        }
    };

    const handleChange = (name, value) => {
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.value) {
            toast.error('Value is required');
            return;
        }

        try {
            setIsLoading(true);
            await updateConfig({ 
                key: config.key, 
                data: formData 
            }).unwrap();
            
            toast.success('Configuration updated successfully');
            onOpenChange(false);
            if (refetch) refetch();
        } catch (error) {
            toast.error(error?.data?.message || 'Failed to update configuration');
        } finally {
            setIsLoading(false);
        }
    };

    if (!config) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Settings2 className="w-5 h-5 text-indigo-600" />
                        Edit Configuration: {config.key}
                    </DialogTitle>
                    <DialogDescription>
                        Modify metadata and secure values for this environment variable.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="edit-value" className="text-right">Value</Label>
                        <div className="col-span-3 relative">
                            <Input
                                id="edit-value"
                                value={formData.value}
                                onChange={(e) => handleChange('value', e.target.value)}
                                className="font-mono"
                                placeholder="Enter value"
                                required
                            />
                            {isFetchingValue && (
                                <div className="absolute right-2 top-1/2 -translate-y-1/2">
                                    <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="edit-group" className="text-right">Group</Label>
                        <Input
                            id="edit-group"
                            value={formData.group}
                            onChange={(e) => handleChange('group', e.target.value.toUpperCase())}
                            className="col-span-3 text-xs font-bold"
                            placeholder="e.g. GENERAL, DATABASE"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="edit-type" className="text-right">Type</Label>
                        <div className="col-span-3">
                            <Select 
                                value={formData.type} 
                                onValueChange={(v) => handleChange('type', v)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="string">String</SelectItem>
                                    <SelectItem value="number">Number</SelectItem>
                                    <SelectItem value="boolean">Boolean</SelectItem>
                                    <SelectItem value="url">URL</SelectItem>
                                    <SelectItem value="email">Email</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="edit-description" className="text-right">Description</Label>
                        <Textarea
                            id="edit-description"
                            value={formData.description}
                            onChange={(e) => handleChange('description', e.target.value)}
                            className="col-span-3"
                            placeholder="Describe this variable"
                        />
                    </div>
                    <div className="flex items-center justify-between pt-2">
                        <div className="flex items-center space-x-2">
                            <Switch
                                id="edit-isSensitive"
                                checked={formData.isSensitive}
                                onCheckedChange={(v) => handleChange('isSensitive', v)}
                            />
                            <Label htmlFor="edit-isSensitive">Sensitive</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Switch
                                id="edit-requiresRestart"
                                checked={formData.requiresRestart}
                                onCheckedChange={(v) => handleChange('requiresRestart', v)}
                            />
                            <Label htmlFor="edit-requiresRestart">Requires Restart</Label>
                        </div>
                    </div>
                </form>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} disabled={isLoading || isFetchingValue} className="bg-indigo-600 hover:bg-indigo-700">
                        {isLoading && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                        Save Changes
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
