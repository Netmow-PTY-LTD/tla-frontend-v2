'use client';
import { useAllCategoriesQuery } from '@/store/features/admin/categoryApiService';
import { Ellipsis, MoveRight } from 'lucide-react';
import Link from 'next/link';
import React, { Fragment } from 'react';

export default function HomeCategoryWiseServices() {
  // const categories = [
  //   {
  //     id: 1,
  //     name: 'Family Law',
  //     icon: '/assets/img/familylaw.png',
  //     services: [
  //       {
  //         id: 1,
  //         name: 'Divorce & Separation',
  //         image: '/assets/img/familylaw/divorce.webp',
  //       },
  //       {
  //         id: 2,
  //         name: 'Child Custody & Support',
  //         image: '/assets/img/familylaw/childsupport.webp',
  //       },
  //       {
  //         id: 3,
  //         name: 'Spousal maintenance',
  //         image: '/assets/img/familylaw/maintenance.webp',
  //       },
  //       {
  //         id: 4,
  //         name: 'Domestic Violence',
  //         image: '/assets/img/familylaw/childsupport.webp',
  //       },
  //     ],
  //   },
  //   {
  //     id: 2,
  //     name: 'Property Law',
  //     icon: '/assets/img/propertylaw.png',
  //     services: [
  //       {
  //         id: 1,
  //         name: 'Property Disputes',
  //         image: '/assets/img/property_law/property_settlement.webp',
  //       },
  //       {
  //         id: 2,
  //         name: 'Landlord & Tenant Relations',
  //         image: '/assets/img/property_law/leasing.webp',
  //       },
  //       {
  //         id: 3,
  //         name: 'Real Estate Transactions',
  //         image: '/assets/img/property_law/commercial-property.webp',
  //       },
  //       {
  //         id: 4,
  //         name: 'Estate Planning',
  //         image: '/assets/img/property_law/stratalaw.webp',
  //       },
  //     ],
  //   },
  //   {
  //     id: 3,
  //     name: 'Traffic Offenses',
  //     icon: '/assets/img/civillaw.png',
  //     services: [
  //       {
  //         id: 1,
  //         name: 'Drink & Drug Driving',
  //         image: '/assets/img/traffic-offence/drugdriving.webp',
  //       },
  //       {
  //         id: 2,
  //         name: 'Licence Suspension Appeals',
  //         image: '/assets/img/traffic-offence/license.webp',
  //       },
  //       {
  //         id: 3,
  //         name: 'Speeding Fines',
  //         image: '/assets/img/traffic-offence/speeding.webp',
  //       },
  //       {
  //         id: 4,
  //         name: 'Dangerous Driving',
  //         image: '/assets/img/traffic-offence/dangerousdriving.webp',
  //       },
  //     ],
  //   },
  //   {
  //     id: 4,
  //     name: 'Criminal Law',
  //     icon: '/assets/img/criminallaw.png',
  //     services: [
  //       {
  //         id: 1,
  //         name: 'Assault & Violence Offences',
  //         image: '/assets/img/criminal_law/assault.webp',
  //       },
  //       {
  //         id: 2,
  //         name: 'Drug Offences',
  //         image: '/assets/img/criminal_law/drugoffence.webp',
  //       },
  //       {
  //         id: 3,
  //         name: 'Theft & Fraud',
  //         image: '/assets/img/criminal_law/theft.webp',
  //       },
  //       {
  //         id: 4,
  //         name: 'Bail Applications',
  //         image: '/assets/img/criminal_law/bail.webp',
  //       },
  //     ],
  //   },
  //   {
  //     id: 5,
  //     name: 'Civil Law',
  //     icon: '/assets/img/civillaw.png',
  //     services: [
  //       {
  //         id: 1,
  //         name: 'Contract Disputes',
  //         image: '/assets/img/property_law/property_settlement.webp',
  //       },
  //       {
  //         id: 2,
  //         name: 'Tort Claims',
  //         image: '/assets/img/property_law/leasing.webp',
  //       },
  //       {
  //         id: 3,
  //         name: 'Defamation Cases',
  //         image: '/assets/img/traffic-offence/license.webp',
  //       },
  //       {
  //         id: 4,
  //         name: 'Consumer Protection',
  //         image: '/assets/img/traffic-offence/speeding.webp',
  //       },
  //     ],
  //   },
  //   {
  //     id: 6,
  //     name: 'Taxation Law',
  //     icon: '/assets/img/taxlaw.png',
  //     services: [
  //       {
  //         id: 1,
  //         name: 'Tax Disputes & Litigation',
  //         image: '/assets/img/criminal_law/assault.webp',
  //       },
  //       {
  //         id: 2,
  //         name: 'GST & Income Tax Advisory',
  //         image: '/assets/img/criminal_law/drugoffence.webp',
  //       },
  //       {
  //         id: 3,
  //         name: 'Business Tax Compliance',
  //         image: '/assets/img/criminal_law/theft.webp',
  //       },
  //       {
  //         id: 4,
  //         name: 'Tax Planning & Structuring',
  //         image: '/assets/img/criminal_law/bail.webp',
  //       },
  //     ],
  //   },
  // ];

  const { data: categories } = useAllCategoriesQuery();

  console.log('categories', categories);
  return (
    <section className="section category-wise-services">
      <div className="container">
        <div className="section-heading">
          <h2 className="font-medium">Explore</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-7 gap-4 mt-20">
          {categories?.data?.length > 0 &&
            categories?.data?.map((category, i) => (
              <Link
                key={i}
                href={`/category/${category.slug}`}
                className="category-wise-service-item flex flex-col items-center text-center gap-3 capitalize"
              >
                <div className="icon w-16 h-16 border border-gray-200 rounded flex items-center justify-center p-2">
                  <img
                    src={category?.image}
                    alt={category.name}
                    className="w-full h-full"
                  />
                </div>
                <h5>{category.name}</h5>
              </Link>
            ))}
          {categories?.length > 0 && (
            <Link
              href="/services"
              className="category-wise-service-item flex flex-col items-center text-center gap-3"
            >
              <div className="icon w-16 h-16 border border-gray-200 rounded flex items-center justify-center">
                <Ellipsis className="text-gray-400" />
              </div>
              <h5>More Laws</h5>
            </Link>
          )}
        </div>
        <div className="space-y-10 mt-20">
          {categories?.data?.length > 0 &&
            categories?.data?.map((category, index) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-lg font-semibold">{category.name}</h4>
                  <Link
                    href={`/services/${category?.slug}`}
                    className="text-[#444] text-sm hover:underline"
                  >
                    View All
                  </Link>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {category?.serviceIds?.map((service, i) => (
                    <Link
                      key={i}
                      href={`/services/${service.id}`}
                      className="category-wise-service-item flex flex-col gap-3 border border-gray-200 rounded-lg"
                    >
                      <div className="icon w-full h-[200px]">
                        <img
                          src={
                            service.image ||
                            (category?.name === 'Family Law' &&
                              '/assets/img/familylaw/divorce.webp') ||
                            (category?.name === 'Business Law' &&
                              '/assets/img/property_law/property_settlement.webp')
                          }
                          alt={service.name}
                          className="rounded-t-lg w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex justify-between px-3 pb-2">
                        <h5 className="text-sm">{service.name}</h5>
                        <MoveRight className="text-[var(--primary-color)]" />
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
        </div>
      </div>
    </section>
  );
}
