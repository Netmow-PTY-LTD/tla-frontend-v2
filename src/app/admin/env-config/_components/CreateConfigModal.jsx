'use client';

import React, { useState } from 'react';
import { useCreateEnvConfigMutation } from '@/store/features/admin/envConfigApiService';
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
import { Loader2, PlusCircle } from 'lucide-react';

export default function CreateConfigModal({ isOpen, onOpenChange, refetch }) {
    const [createConfig] = useCreateEnvConfigMutation();
    const [isLoading, setIsLoading] = useState(false);
    
    const [formData, setFormData] = useState({
        key: '',
        value: '',
        group: 'GENERAL',
        type: 'string',
        isSensitive: false,
        requiresRestart: false,
        description: ''
    });

    const handleChange = (name, value) => {
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Basic validation
        if (!formData.key || !formData.value) {
            toast.error('Key and Value are required');
            return;
        }

        if (!/^[A-Z0-9_]+$/.test(formData.key)) {
            toast.error('Key must be uppercase, numbers or underscores');
            return;
        }

        try {
            setIsLoading(true);
            await createConfig(formData).unwrap();
            toast.success('Configuration created successfully');
            onOpenChange(false);
            setFormData({
                key: '',
                value: '',
                group: 'GENERAL',
                type: 'string',
                isSensitive: false,
                requiresRestart: false,
                description: ''
            });
            if (refetch) refetch();
        } catch (error) {
            toast.error(error?.data?.message || 'Failed to create configuration');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <PlusCircle className="w-5 h-5 text-blue-600" />
                        Create New Configuration
                    </DialogTitle>
                    <DialogDescription>
                        Add a new environment variable to the system.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="key" className="text-right">Key</Label>
                        <Input
                            id="key"
                            value={formData.key}
                            onChange={(e) => handleChange('key', e.target.value)}
                            className="col-span-3 font-mono"
                            placeholder="e.g. API_ENDPOINT_URL"
                            required
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="value" className="text-right">Value</Label>
                        <Input
                            id="value"
                            value={formData.value}
                            onChange={(e) => handleChange('value', e.target.value)}
                            className="col-span-3"
                            placeholder="Value for the variable"
                            required
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="group" className="text-right">Group</Label>
                        <Input
                            id="group"
                            value={formData.group}
                            onChange={(e) => handleChange('group', e.target.value.toUpperCase())}
                            className="col-span-3"
                            placeholder="e.g. AWS, REDIS, GENERAL"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="type" className="text-right">Type</Label>
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
                        <Label htmlFor="description" className="text-right">Description</Label>
                        <Textarea
                            id="description"
                            value={formData.description}
                            onChange={(e) => handleChange('description', e.target.value)}
                            className="col-span-3"
                            placeholder="Describe what this config does"
                        />
                    </div>
                    <div className="flex items-center justify-between pt-2">
                        <div className="flex items-center space-x-2">
                            <Switch
                                id="isSensitive"
                                checked={formData.isSensitive}
                                onCheckedChange={(v) => handleChange('isSensitive', v)}
                            />
                            <Label htmlFor="isSensitive">Sensitive</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Switch
                                id="requiresRestart"
                                checked={formData.requiresRestart}
                                onCheckedChange={(v) => handleChange('requiresRestart', v)}
                            />
                            <Label htmlFor="requiresRestart">Requires Restart</Label>
                        </div>
                    </div>
                </form>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} disabled={isLoading} className="bg-blue-600 hover:bg-blue-700">
                        {isLoading && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                        Create Configuration
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
