import Image from 'next/image';
import Link from 'next/link';

export default function HomeTestimonials() {
  return (
    <section
      className="home-testimonials"
      style={{ backgroundImage: `url('/assets/img/home-testimonials-bg.png')` }}
    >
      <div className="container">
        <div className="home-testimonials-hero">
          <div className="flex flex-wrap">
            <div className="w-full lg:w-4/12">
              <div className="feature-heading">
                <h3 className="section-subtitle">Our Testimonials</h3>
                <h2 className="section-title">
                  People Say About TLA – Real Stories, Real Impact
                </h2>
                <div className="feature-heading-text">
                  The Law App is changing the way people find legal help and how
                  lawyers grow their practice. Whether you’re a client in need
                  of expert advice or a lawyer looking to expand your reach, TLA
                  makes the process seamless, transparent, and efficient. <br />
                  <br />
                  <b>Ready to Experience the Difference?</b>
                </div>
                <div className="flex flex-wrap gap-2 mt-8">
                  <Link href="/register" className="btn-default btn-primary">
                    Post your first job
                  </Link>
                  <Link
                    href="/register"
                    className="btn-default btn-outline-black"
                  >
                    Join as Lawyer
                  </Link>
                </div>
              </div>
            </div>
            <div className="w-full lg:w-8/12 lg:pl-28">
              <div className="testimonial-images flex justify-between mt-10 lg:mt-0">
                <div className="mt-32 lg:mt-40">
                  <Image
                    src="/assets/img/testimonial-1.png"
                    alt="testimonial"
                    width={386}
                    height={325}
                  />
                </div>
                <div className="div">
                  <Image
                    src="/assets/img/testimonial-2.png"
                    alt="testimonial"
                    width={386}
                    height={325}
                    className="flex-shrink-0"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
