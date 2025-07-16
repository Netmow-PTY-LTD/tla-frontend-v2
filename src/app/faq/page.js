
import MainLayout from '@/components/main/common/layout'
import React from 'react'
import Faqs from './_components/Faqs'
import SectionHeading from '@/components/main/home/SectionHeading'
import { clientsfaqsData, lawyerfaqsData } from '@/data/data'

export default function page() {
    return (
        <MainLayout>
            <div className="mt-12 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                <SectionHeading
                    title="Frequently Asked Questions"
                    subtitle="We've got answers!"
                    className="mb-10"
                />

                <section className="mb-16">
                    <h3 className="text-2xl font-semibold  border-b border-gray-300 ">
                        For Clients
                    </h3>
                    <Faqs data={clientsfaqsData} />
                </section>

                <section>
                    <h3 className="text-2xl font-semibold  border-b border-gray-300 ">
                        For Lawyers
                    </h3>
                    <Faqs data={lawyerfaqsData} />
                </section>
            </div>
        </MainLayout>
    )
}
