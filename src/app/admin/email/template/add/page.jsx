'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { RotateCw } from 'lucide-react';

export default function EmailTemplateAddPage() {
    const router = useRouter();

    useEffect(() => {
        router.replace('/admin/email/builder');
    }, [router]);

    return (
        <div className="flex h-[80vh] items-center justify-center">
            <div className="flex flex-col items-center gap-2">
                <RotateCw className="h-8 w-8 animate-spin text-[#00c3c0]" />
                <p className="text-sm font-medium text-slate-500 italic">Redirecting to Visual Builder...</p>
            </div>
        </div>
    );
}