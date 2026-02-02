import Image from 'next/image';
import Link from 'next/link';

export default function HomeCompanyCTA() {
    return (
        <section className="section overflow-hidden py-24 bg-white">
            <div className="container px-5 relative">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    {/* Left Content */}
                    <div className="flex flex-col gap-6 z-10">
                        <h2 className="text-4xl lg:text-5xl font-bold leading-tight text-slate-900">
                            List Your <span className="text-[#ff8602]">Law Firm</span> or <span className="text-[#ff8602]">Business Profile.</span>
                        </h2>
                        <p className="text-lg text-slate-600 font-medium">
                            Get More Clients, Faster.
                        </p>
                        <div className="flex flex-wrap gap-4 mt-2">
                            <Link
                                href={`${process.env.NEXT_PUBLIC_REDIRECT_URL}/register`}
                                target="_blank"
                                className="bg-[#ff8602] hover:bg-orange-600 text-white font-bold py-3 px-8 rounded-md transition-colors shadow-lg min-w-[140px] text-center"
                            >
                                Try now
                            </Link>
                            <Link
                                href={`${process.env.NEXT_PUBLIC_REDIRECT_URL}/login`}
                                target="_blank"
                                className="bg-[#00c3c0] hover:bg-teal-600 text-white font-bold py-3 px-8 rounded-md transition-colors shadow-lg min-w-[140px] text-center"
                            >
                                Log in
                            </Link>
                        </div>
                    </div>

                    {/* Right Visual Element */}
                    <div className="relative flex justify-center items-center h-[400px] lg:h-[500px]">
                        {/* Concentric Circles Background */}
                        <div className="absolute inset-0 flex justify-center items-center pointer-events-none">
                            <div className="absolute w-[300px] h-[300px] border border-orange-200 rounded-full"></div>
                            <div className="absolute w-[450px] h-[450px] border border-orange-100 rounded-full"></div>
                            <div className="absolute w-[650px] h-[650px] border border-orange-100 rounded-full"></div>
                            <div className="absolute w-[900px] h-[900px] border border-orange-100 rounded-full"></div>
                        </div>

                        {/* Circular Image Wrapper */}
                        <div className="relative w-64 h-64 lg:w-80 lg:h-80 rounded-full overflow-hidden border-8 border-white shadow-2xl z-10">
                            <Image
                                src="/assets/img/cta-img.webp"
                                alt="Classical Legal Building"
                                width={320}
                                height={320}
                                className="object-cover"
                                priority
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}