import Link from "next/link";

export default function HomeTestimonials () {
    return (
        <section className="home-testimonials" style={{backgroundImage: `url('/assets/img/home-testimonials-bg.png')`}}>
            <div className="container">
                <div className="home-testimonials-hero">
                    <div className="flex flex-wrap gap-10">
                        <div className="w-full lg:w-1/2">
                            <div className="feature-heading">
                                <h3>Our Testimonials</h3>
                                <h2>People Say About TLA – Real Stories, Real Impact</h2>
                                <div className="feature-heading-text">The Law App is changing the way people find legal
                                    help and how lawyers grow their practice. Whether you’re a client in need of expert
                                    advice or a lawyer looking to expand your reach, TLA makes the process seamless,
                                    transparent, and efficient. <br/><br/>

                                    <b>Ready to Experience the Difference?</b>

                                </div>
                                <div className="flex flex-wrap gap-2 mt-8">
                                    <Link href="/register" className="btn-brand">Post your first job</Link>
                                    <Link href="/register" className="btn-outline">Join as Lawyer</Link>
                                </div>
                            </div>
                        </div>
                        <div className="w-full lg:w-1/2">
                            <div className="testimonial-images">
                                
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
