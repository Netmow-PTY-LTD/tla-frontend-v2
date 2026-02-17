'use client';
import React, { useEffect } from 'react';
import { useGetSettingsQuery } from '@/store/features/admin/appSettings';
import { useGetPublicHeaderFooterCodesQuery } from '@/store/features/seo/seoApi';

export default function HeadScripts() {
    const { data: appSettings } = useGetSettingsQuery();
    const appData = appSettings?.data || {};

    // Robots meta tag logic
    // Robots meta tag logic removed to prevent conflict with Next.js metadata
    /*
    useEffect(() => {
        if (!appData) return;
        // ... logic removed ...
    }, [appData?.robots]);
    */

    const { data: headerFooterCodes } = useGetPublicHeaderFooterCodesQuery();

    // Header & Footer Scripts Logic
    useEffect(() => {
        if (!headerFooterCodes?.data?.length) return;

        // Filter active scripts for both header and footer
        const activeScripts = headerFooterCodes.data.filter(
            (item) => item.isActive && (item?.position?.toLowerCase() === 'header' || item?.position?.toLowerCase() === 'footer')
        );

        const insertedElements = [];

        activeScripts.forEach((item) => {
            // Parse the code string safely
            const tempContainer = document.createElement('div');
            tempContainer.innerHTML = item.code.trim();

            // Move all child elements (<script>, <meta>, <link>, etc.) to <head>
            Array.from(tempContainer.children).forEach((child) => {
                document.head.appendChild(child);
                insertedElements.push(child);
            });
        });

        // Cleanup on unmount
        return () => {
            insertedElements.forEach((el) => {
                if (document.head.contains(el)) document.head.removeChild(el);
            });
        };
    }, [headerFooterCodes]);

    return null;
}
