// app/not-found.tsx
'use client';

import MainLayout from '@/components/main/common/layout';
import Image from 'next/image';
import Link from 'next/link';

export default function NotFound() {
  return (
    <MainLayout>
      <section className="min-h-screen flex justify-center items-center bg-[var(--secondary-color)]">
        <div className="flex flex-col justify-center items-center">
          <Image src="/assets/img/404.png" width={500} height={500} alt="404" />
          <h2 className="text-4xl font-black text-white uppercase">
            Page Not Found
          </h2>
          <Link
            href="/"
            className="btn-default mt-4 px-[20px] py-15px bg-[--primary-color] hover:bg-[--color-black] transition-all duration-300 ease-in-out text-sm font-semibold text-white uppercase"
          >
            Go Home
          </Link>
        </div>
      </section>
    </MainLayout>
  );
}
