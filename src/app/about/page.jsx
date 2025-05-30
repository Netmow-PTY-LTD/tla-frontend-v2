import Faq from '@/components/main/about/Faq';
import CallToAction from '@/components/main/CallToAction';
import MainLayout from '@/components/main/common/layout';
import SectionHeading from '@/components/main/home/SectionHeading';
import WorkingSteps from '@/components/main/WorkingSteps';
import Image from 'next/image';
import Link from 'next/link';

const AboutPage = () => {
  const sectionHeading = {
    subtitle: 'Who We Are?',
    title: 'The Law App – Transforming Legal Connections',
    paragraph:
      'The Law App is a cutting-edge legal services marketplace designed to help clients and lawyers connect effortlessly. We provide a smart, user-friendly platform where clients can post their legal needs and receive competitive offers from qualified lawyers.',
  };
  return (
    <MainLayout>
      <section className="about-section section">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div className="feature-heading lg:pr-20">
              <h3 className="section-subtitle">About TLA</h3>
              <h2 className="section-title">
                The Law App – Transforming Legal Connections
              </h2>
              <div className="feature-heading-text mb-3">
                <b>Making Legal Services Simple, Accessible & Efficient</b>{' '}
                <br /> <br />
                we believe that finding the right legal help should be easy,
                transparent, and stress-free. Whether you're a client seeking
                expert legal advice or a lawyer looking to grow your practice,
                our platform bridges the gap, making legal services more
                accessible than ever. <br /> <br />
                Our mission is to connect people with the right legal
                professionals in just a few clicks, ensuring quality legal
                assistance without the usual complexity.
              </div>
              <Link href="/register" className="btn-default btn-primary">
                Start TLA - Register Now
              </Link>
            </div>
            <div className="about-img">
              <Image
                src="/assets/img/about.png"
                alt="About Image"
                width={733}
                height={500}
              />
            </div>
          </div>
        </div>
      </section>
      <section className="about-showcase section">
        <div className="container">
          <SectionHeading
            title={sectionHeading.title}
            subtitle={sectionHeading.subtitle}
            paragraph={sectionHeading.paragraph}
          />
          <div className="w-full mt-5 lg:mt-10">
            <Image
              src={'/assets/img/showcase-main.png'}
              width={1190}
              height={576}
              className="showcase-main w-full"
              alt="Showcase"
            />
          </div>
        </div>
      </section>
      <section className="about-features section">
        <div className="container">
          <SectionHeading
            title="Why Choose The Law App?"
            subtitle="Features of TLA"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 my-5 lg:my-10">
            <div className="feature-item">
              <div className="feature-icon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="60"
                  height="60"
                  viewBox="0 0 60 60"
                  fill="none"
                >
                  <path
                    d="M28.0125 33C28.0687 32.625 28.125 32.25 28.125 31.875V25.125C28.125 21.6187 25.2562 18.75 21.75 18.75H17.25C13.725 18.75 10.875 21.6187 10.875 25.125V31.875C10.875 32.2688 10.9312 32.625 10.9875 33C5.41875 36.0938 1.875 41.9437 1.875 48.375V53.25C1.875 55.9312 4.06875 58.125 6.75 58.125H32.25C34.9312 58.125 37.125 55.9312 37.125 53.25V48.375C37.125 41.9437 33.5812 36.0938 28.0125 33ZM14.625 25.125C14.625 23.6812 15.8062 22.5 17.25 22.5H21.75C23.1937 22.5 24.375 23.6812 24.375 25.125V31.875C24.375 34.5562 22.1812 36.75 19.5 36.75C16.8187 36.75 14.625 34.5562 14.625 31.875V25.125ZM33.375 53.25C33.375 53.8687 32.8687 54.375 32.25 54.375H28.875V49.875C28.875 48.8438 28.0312 48 27 48C25.9687 48 25.125 48.8438 25.125 49.875V54.375H13.875V49.875C13.875 48.8438 13.0312 48 12 48C10.9688 48 10.125 48.8438 10.125 49.875V54.375H6.75C6.13125 54.375 5.625 53.8687 5.625 53.25V48.375C5.625 43.5187 8.19375 39.0562 12.2812 36.5625C13.8187 38.925 16.4812 40.5 19.5 40.5C22.5187 40.5 25.1812 38.925 26.7187 36.5625C30.8062 39.0562 33.375 43.5187 33.375 48.375V53.25Z"
                    fill="#0B1C2D"
                  />
                  <path
                    d="M44.0625 1.875C36.3 1.875 30 8.175 30 15.9375C30 23.7 36.3 30 44.0625 30C51.825 30 58.125 23.7 58.125 15.9375C58.125 8.175 51.825 1.875 44.0625 1.875ZM51.0187 13.6313L43.7437 20.9062C43.3687 21.2812 42.9 21.45 42.4125 21.45C41.925 21.45 41.4563 21.2625 41.0812 20.9062L37.1063 16.9312C36.375 16.2 36.375 15.0188 37.1063 14.2875C37.8375 13.5562 39.0188 13.5562 39.75 14.2875L42.4125 16.95L48.3563 11.0062C49.0875 10.275 50.2688 10.275 51 11.0062C51.7313 11.7375 51.7313 12.9188 51 13.65L51.0187 13.6313Z"
                    fill="#00C3C0"
                  />
                </svg>
              </div>
              <h4>Access to Trusted Lawyers</h4>
              <div className="feature-text">
                Connect with experienced and verified legal professionals.
              </div>
              <Image
                src={'/assets/img/feature-1.png'}
                width={234}
                height={234}
                alt="Feature 1"
              />
            </div>
            <div className="feature-item">
              <div className="feature-icon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="60"
                  height="60"
                  viewBox="0 0 60 60"
                  fill="none"
                >
                  <path
                    d="M28.0125 33C28.0687 32.625 28.125 32.25 28.125 31.875V25.125C28.125 21.6187 25.2562 18.75 21.75 18.75H17.25C13.725 18.75 10.875 21.6187 10.875 25.125V31.875C10.875 32.2688 10.9312 32.625 10.9875 33C5.41875 36.0938 1.875 41.9437 1.875 48.375V53.25C1.875 55.9312 4.06875 58.125 6.75 58.125H32.25C34.9312 58.125 37.125 55.9312 37.125 53.25V48.375C37.125 41.9437 33.5812 36.0938 28.0125 33ZM14.625 25.125C14.625 23.6812 15.8062 22.5 17.25 22.5H21.75C23.1937 22.5 24.375 23.6812 24.375 25.125V31.875C24.375 34.5562 22.1812 36.75 19.5 36.75C16.8187 36.75 14.625 34.5562 14.625 31.875V25.125ZM33.375 53.25C33.375 53.8687 32.8687 54.375 32.25 54.375H28.875V49.875C28.875 48.8438 28.0312 48 27 48C25.9687 48 25.125 48.8438 25.125 49.875V54.375H13.875V49.875C13.875 48.8438 13.0312 48 12 48C10.9688 48 10.125 48.8438 10.125 49.875V54.375H6.75C6.13125 54.375 5.625 53.8687 5.625 53.25V48.375C5.625 43.5187 8.19375 39.0562 12.2812 36.5625C13.8187 38.925 16.4812 40.5 19.5 40.5C22.5187 40.5 25.1812 38.925 26.7187 36.5625C30.8062 39.0562 33.375 43.5187 33.375 48.375V53.25Z"
                    fill="#0B1C2D"
                  />
                  <path
                    d="M44.0625 1.875C36.3 1.875 30 8.175 30 15.9375C30 23.7 36.3 30 44.0625 30C51.825 30 58.125 23.7 58.125 15.9375C58.125 8.175 51.825 1.875 44.0625 1.875ZM51.0187 13.6313L43.7437 20.9062C43.3687 21.2812 42.9 21.45 42.4125 21.45C41.925 21.45 41.4563 21.2625 41.0812 20.9062L37.1063 16.9312C36.375 16.2 36.375 15.0188 37.1063 14.2875C37.8375 13.5562 39.0188 13.5562 39.75 14.2875L42.4125 16.95L48.3563 11.0062C49.0875 10.275 50.2688 10.275 51 11.0062C51.7313 11.7375 51.7313 12.9188 51 13.65L51.0187 13.6313Z"
                    fill="#00C3C0"
                  />
                </svg>
              </div>
              <h4>Access to Trusted Lawyers</h4>
              <div className="feature-text">
                Connect with experienced and verified legal professionals.
              </div>
              <Image
                src={'/assets/img/feature-1.png'}
                width={234}
                height={234}
                alt="Feature 1"
              />
            </div>

            <div className="feature-item">
              <div className="feature-icon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="60"
                  height="60"
                  viewBox="0 0 60 60"
                  fill="none"
                >
                  <path
                    d="M28.0125 33C28.0687 32.625 28.125 32.25 28.125 31.875V25.125C28.125 21.6187 25.2562 18.75 21.75 18.75H17.25C13.725 18.75 10.875 21.6187 10.875 25.125V31.875C10.875 32.2688 10.9312 32.625 10.9875 33C5.41875 36.0938 1.875 41.9437 1.875 48.375V53.25C1.875 55.9312 4.06875 58.125 6.75 58.125H32.25C34.9312 58.125 37.125 55.9312 37.125 53.25V48.375C37.125 41.9437 33.5812 36.0938 28.0125 33ZM14.625 25.125C14.625 23.6812 15.8062 22.5 17.25 22.5H21.75C23.1937 22.5 24.375 23.6812 24.375 25.125V31.875C24.375 34.5562 22.1812 36.75 19.5 36.75C16.8187 36.75 14.625 34.5562 14.625 31.875V25.125ZM33.375 53.25C33.375 53.8687 32.8687 54.375 32.25 54.375H28.875V49.875C28.875 48.8438 28.0312 48 27 48C25.9687 48 25.125 48.8438 25.125 49.875V54.375H13.875V49.875C13.875 48.8438 13.0312 48 12 48C10.9688 48 10.125 48.8438 10.125 49.875V54.375H6.75C6.13125 54.375 5.625 53.8687 5.625 53.25V48.375C5.625 43.5187 8.19375 39.0562 12.2812 36.5625C13.8187 38.925 16.4812 40.5 19.5 40.5C22.5187 40.5 25.1812 38.925 26.7187 36.5625C30.8062 39.0562 33.375 43.5187 33.375 48.375V53.25Z"
                    fill="#0B1C2D"
                  />
                  <path
                    d="M44.0625 1.875C36.3 1.875 30 8.175 30 15.9375C30 23.7 36.3 30 44.0625 30C51.825 30 58.125 23.7 58.125 15.9375C58.125 8.175 51.825 1.875 44.0625 1.875ZM51.0187 13.6313L43.7437 20.9062C43.3687 21.2812 42.9 21.45 42.4125 21.45C41.925 21.45 41.4563 21.2625 41.0812 20.9062L37.1063 16.9312C36.375 16.2 36.375 15.0188 37.1063 14.2875C37.8375 13.5562 39.0188 13.5562 39.75 14.2875L42.4125 16.95L48.3563 11.0062C49.0875 10.275 50.2688 10.275 51 11.0062C51.7313 11.7375 51.7313 12.9188 51 13.65L51.0187 13.6313Z"
                    fill="#00C3C0"
                  />
                </svg>
              </div>
              <h4>Access to Trusted Lawyers</h4>
              <div className="feature-text">
                Connect with experienced and verified legal professionals.
              </div>
              <Image
                src={'/assets/img/feature-1.png'}
                width={234}
                height={234}
                alt="Feature 1"
              />
            </div>
            <div className="feature-item">
              <div className="feature-icon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="60"
                  height="60"
                  viewBox="0 0 60 60"
                  fill="none"
                >
                  <path
                    d="M28.0125 33C28.0687 32.625 28.125 32.25 28.125 31.875V25.125C28.125 21.6187 25.2562 18.75 21.75 18.75H17.25C13.725 18.75 10.875 21.6187 10.875 25.125V31.875C10.875 32.2688 10.9312 32.625 10.9875 33C5.41875 36.0938 1.875 41.9437 1.875 48.375V53.25C1.875 55.9312 4.06875 58.125 6.75 58.125H32.25C34.9312 58.125 37.125 55.9312 37.125 53.25V48.375C37.125 41.9437 33.5812 36.0938 28.0125 33ZM14.625 25.125C14.625 23.6812 15.8062 22.5 17.25 22.5H21.75C23.1937 22.5 24.375 23.6812 24.375 25.125V31.875C24.375 34.5562 22.1812 36.75 19.5 36.75C16.8187 36.75 14.625 34.5562 14.625 31.875V25.125ZM33.375 53.25C33.375 53.8687 32.8687 54.375 32.25 54.375H28.875V49.875C28.875 48.8438 28.0312 48 27 48C25.9687 48 25.125 48.8438 25.125 49.875V54.375H13.875V49.875C13.875 48.8438 13.0312 48 12 48C10.9688 48 10.125 48.8438 10.125 49.875V54.375H6.75C6.13125 54.375 5.625 53.8687 5.625 53.25V48.375C5.625 43.5187 8.19375 39.0562 12.2812 36.5625C13.8187 38.925 16.4812 40.5 19.5 40.5C22.5187 40.5 25.1812 38.925 26.7187 36.5625C30.8062 39.0562 33.375 43.5187 33.375 48.375V53.25Z"
                    fill="#0B1C2D"
                  />
                  <path
                    d="M44.0625 1.875C36.3 1.875 30 8.175 30 15.9375C30 23.7 36.3 30 44.0625 30C51.825 30 58.125 23.7 58.125 15.9375C58.125 8.175 51.825 1.875 44.0625 1.875ZM51.0187 13.6313L43.7437 20.9062C43.3687 21.2812 42.9 21.45 42.4125 21.45C41.925 21.45 41.4563 21.2625 41.0812 20.9062L37.1063 16.9312C36.375 16.2 36.375 15.0188 37.1063 14.2875C37.8375 13.5562 39.0188 13.5562 39.75 14.2875L42.4125 16.95L48.3563 11.0062C49.0875 10.275 50.2688 10.275 51 11.0062C51.7313 11.7375 51.7313 12.9188 51 13.65L51.0187 13.6313Z"
                    fill="#00C3C0"
                  />
                </svg>
              </div>
              <h4>Access to Trusted Lawyers</h4>
              <div className="feature-text">
                Connect with experienced and verified legal professionals.
              </div>
              <Image
                src={'/assets/img/feature-1.png'}
                width={234}
                height={234}
                alt="Feature 1"
              />
            </div>
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/register" className="btn-default btn-primary">
              Join as Lawyer - find client
            </Link>
            <Link href="/register" className="btn-default btn-outline-black">
              Join as Client - post cases
            </Link>
          </div>
        </div>
      </section>
      <WorkingSteps />
      <Faq />
      <section className="home-cta section">
        <div className="container">
          <div className="home-cta-content">
            <div className="flex flex-wrap">
              <div className="w-full md:w-1/2 lg:w-5/12">
                <div className="home-cta-text md:pr-5 lg:pr-20">
                  <h2>Take the Next Step – Get Legal Help Today!</h2>
                  <div className="cta-text">
                    <ul>
                      <li>
                        <b>For Clients: </b>Need help with family law? Post your
                        case and receive free bids from top-rated lawyers!
                      </li>
                      <li>
                        <b>For Lawyers: </b>Looking for clients in family law?
                        Join now and start receiving cases instantly!
                      </li>
                    </ul>
                  </div>
                  <div className="home-cta-button flex gap-2">
                    <Link href="/register" className="btn-default btn-primary">
                      Join as Client
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
              <div className="w-full md:w-1/2 lg:w-7/12">
                <div className="home-cta-images">
                  <div className="cta-shape"></div>
                  <img
                    src="/assets/img/cta-img.png"
                    alt="home cta"
                    className="cta-img-2"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default AboutPage;
