'use client';

import React from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { RefreshCw, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function SyncFromEnvModal({ isOpen, onOpenChange, onConfirm, isLoading }) {
    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[450px] rounded-3xl overflow-hidden border-none shadow-2xl">
                <div className="absolute top-0 left-0 w-full h-1 bg-[#1BABA9]" />
                
                <DialogHeader className="pt-6 px-6">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="bg-[#1BABA9]/10 p-2.5 rounded-2xl">
                            <RefreshCw className={`w-6 h-6 text-[#1BABA9] ${isLoading ? 'animate-spin' : ''}`} />
                        </div>
                        <DialogTitle className="text-2xl font-bold tracking-tight text-gray-900">
                            Sync Environments
                        </DialogTitle>
                    </div>
                    <DialogDescription className="text-gray-500 font-medium leading-relaxed">
                        Synchronize your database configurations with the local <code className="bg-gray-100 px-1.5 py-0.5 rounded text-[#1BABA9] font-bold">.env</code> file.
                    </DialogDescription>
                </DialogHeader>

                <div className="px-6 py-4 space-y-4">
                    <div className="bg-amber-50 border border-amber-100 p-4 rounded-2xl flex gap-3 items-start">
                        <div className="bg-amber-100 p-1.5 rounded-lg text-amber-600 shrink-0">
                            <AlertCircle className="w-4 h-4" />
                        </div>
                        <div className="space-y-1">
                            <h4 className="text-sm font-bold text-amber-900">Operational Notice</h4>
                            <p className="text-xs text-amber-700 leading-relaxed font-medium">
                                This action will scan your environment file and add any missing keys to the database. Existing values in the database will <span className="underline decoration-amber-300 decoration-2 underline-offset-2">not</span> be overwritten.
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div className="bg-gray-50 border border-gray-100 p-3 rounded-xl flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-[#1BABA9]" />
                            <span className="text-[10px] font-bold text-gray-600 uppercase tracking-wider">Add Missing Keys</span>
                        </div>
                        <div className="bg-gray-50 border border-gray-100 p-3 rounded-xl flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-[#1BABA9]" />
                            <span className="text-[10px] font-bold text-gray-600 uppercase tracking-wider">Safe Processing</span>
                        </div>
                    </div>
                </div>

                <DialogFooter className="bg-gray-50/80 px-6 py-4 flex sm:flex-row flex-col gap-2">
                    <Button 
                        variant="ghost" 
                        onClick={() => onOpenChange(false)} 
                        disabled={isLoading}
                        className="rounded-xl font-bold text-gray-500 hover:text-gray-700 hover:bg-gray-200"
                    >
                        Cancel Operation
                    </Button>
                    <Button 
                        onClick={onConfirm} 
                        disabled={isLoading} 
                        className="bg-[#1BABA9] hover:bg-[#0D9488] text-white rounded-xl font-bold px-6 shadow-lg shadow-[#1BABA9]/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                    >
                        {isLoading ? (
                            <RefreshCw className="w-4 h-4 animate-spin mr-2" />
                        ) : (
                            <RefreshCw className="w-4 h-4 mr-2" />
                        )}
                        Start Sync Process
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
