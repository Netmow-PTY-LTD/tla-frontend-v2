export default function CallToAction({ title, paragraph, image }) {
  return (
    <section className="home-cta">
      <div className="container">
        <div className="home-cta-content">
          <div className="flex flex-wrap">
            <div className="w-full md:w-1/2 lg:w-5/12">
              <div className="home-cta-text md:pr-5 lg:pr-20">
                <h2>{title}</h2>
                <div className="cta-text">{paragraph}</div>
                <div className="home-cta-button flex gap-2">
                  <Link href="/register" className="btn-brand">
                    Join as Client
                  </Link>
                  <Link href="/register" className="btn-outline">
                    Join as Lawyer
                  </Link>
                </div>
              </div>
            </div>
            <div className="w-full md:w-1/2 lg:w-7/12">
              <div className="home-cta-images">
                <div className="cta-shape"></div>
                <img src={image} alt="home cta" className="cta-img-2" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
