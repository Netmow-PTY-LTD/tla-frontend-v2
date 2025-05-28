'use client';
import MainLayout from '@/components/main/common/layout';
import Link from 'next/link';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Form } from '@/components/ui/form';
import TextInput from '@/components/form/TextInput';
import TextArea from '@/components/form/TextArea';

const formSchema = z.object({
  name: z.string().min(2, {
    message: 'Name is required and must be at least 2 characters.',
  }),
  email: z.string().email({
    message: 'Please enter a valid email address.',
  }),
  message: z.string().min(10, {
    message: 'Message must be at least 10 characters long.',
  }),
});

export default function ContactPage() {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      phone: '',
      email: '',
      message: '',
    },
  });

  const { control, handleSubmit, setValue } = form;

  const handleChange = (e) => {
    // Example of custom logic
    console.log(`Input changed for ${e.target.name}: ${e.target.value}`);
  };

  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <MainLayout>
      <section className="contact-section section">
        <div className="contact-top">
          <div className="container">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="contact-image">
                <img src="/assets/img/contact-image.png" alt="Contact Image" />
              </div>
              <div className="contact-form">
                <div className="contact-form-heading">
                  <h2>Contact Us – We're Here to Help!</h2>
                  <div className="contact-text">
                    Got a question? Need assistance? Whether you’re a client
                    looking for legal help or a lawyer seeking to grow your
                    practice, we’re here to support you every step of the way.
                  </div>
                </div>
                <Form {...form}>
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <TextInput
                      label="Name"
                      name="name"
                      control={control}
                      placeholder="Enter your name"
                      onChange={handleChange}
                    />
                    <TextInput
                      label="Email"
                      name="email"
                      control={control}
                      placeholder="Enter your email address"
                      onChange={handleChange}
                    />
                    <TextInput
                      label="Phone(Optional)"
                      name="phone"
                      control={control}
                      placeholder="Enter your phone number"
                      onChange={handleChange}
                    />
                    <TextArea
                      label="Message"
                      name="message"
                      control={control}
                      placeholder="Type your message here..."
                      onChange={handleChange}
                    />

                    <button type="submit" className="btn-auth-register">
                      Send Message
                    </button>
                  </form>
                </Form>
              </div>
            </div>
          </div>
        </div>
        <div className="contact-bottom">
          <section className="home-cta section">
            <div className="container">
              <div className="home-cta-content">
                <div className="flex flex-wrap">
                  <div className="w-full md:w-1/2 lg:w-5/12">
                    <div className="home-cta-text md:pr-5 lg:pr-20">
                      <h2>Take the Next Step – Get Legal Help Today!</h2>
                      <div className="contact-info">
                        <div className="address">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="25"
                            height="25"
                            viewBox="0 0 25 25"
                            fill="none"
                          >
                            <path
                              d="M17.8068 17.0799C16.8701 18.0165 14.9115 19.9752 13.5637 21.3229C12.7827 22.104 11.5176 22.1044 10.7365 21.3234C9.41224 19.9991 7.49149 18.0783 6.49305 17.0799C3.36885 13.9557 3.36885 8.89037 6.49305 5.76618C9.61724 2.64199 14.6826 2.64199 17.8068 5.76618C20.931 8.89037 20.931 13.9557 17.8068 17.0799Z"
                              stroke="#00C3C0"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M15.1499 11.423C15.1499 13.0799 13.8068 14.423 12.1499 14.423C10.493 14.423 9.1499 13.0799 9.1499 11.423C9.1499 9.76618 10.493 8.42303 12.1499 8.42303C13.8068 8.42303 15.1499 9.76618 15.1499 11.423Z"
                              stroke="#00C3C0"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                          <span>
                            Suite 8/3, Level 3/54 Jephson ST, Toowong QLD 4066,
                            Australia
                          </span>
                        </div>
                        <Link href="tel:0490 135 339">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="25"
                            height="25"
                            viewBox="0 0 25 25"
                            fill="none"
                          >
                            <path
                              d="M3.1499 5.42303C3.1499 4.31847 4.04533 3.42303 5.1499 3.42303H8.42914C8.85957 3.42303 9.24171 3.69846 9.37783 4.10681L10.8756 8.60025C11.033 9.07236 10.8193 9.58835 10.3742 9.8109L8.11691 10.9395C9.21915 13.3843 11.1887 15.3538 13.6334 16.456L14.762 14.1988C14.9846 13.7537 15.5006 13.5399 15.9727 13.6973L20.4661 15.1951C20.8745 15.3312 21.1499 15.7134 21.1499 16.1438V19.423C21.1499 20.5276 20.2545 21.423 19.1499 21.423H18.1499C9.86563 21.423 3.1499 14.7073 3.1499 6.42303V5.42303Z"
                              stroke="#00C3C0"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                          <span>0490 135 339</span>
                        </Link>
                        <Link href="mailto:info@thelawapp.com.au">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="25"
                            height="25"
                            viewBox="0 0 25 25"
                            fill="none"
                          >
                            <path
                              d="M16.1499 12.423C16.1499 10.2139 14.359 8.42303 12.1499 8.42303C9.94076 8.42303 8.1499 10.2139 8.1499 12.423C8.1499 14.6322 9.94076 16.423 12.1499 16.423C14.359 16.423 16.1499 14.6322 16.1499 12.423ZM16.1499 12.423V13.923C16.1499 15.3037 17.2692 16.423 18.6499 16.423C20.0306 16.423 21.1499 15.3037 21.1499 13.923V12.423C21.1499 7.45247 17.1205 3.42303 12.1499 3.42303C7.17934 3.42303 3.1499 7.45247 3.1499 12.423C3.1499 17.3936 7.17934 21.423 12.1499 21.423M16.6499 20.2173C15.23 21.0371 13.6795 21.426 12.1499 21.4245"
                              stroke="#00C3C0"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                          <span>info@thelawapp.com.au</span>
                        </Link>
                        <Link href="www.thelawapp.com.au" target="_blank">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="25"
                            height="25"
                            viewBox="0 0 25 25"
                            fill="none"
                          >
                            <path
                              d="M21.1499 12.423C21.1499 17.3936 17.1205 21.423 12.1499 21.423M21.1499 12.423C21.1499 7.45247 17.1205 3.42303 12.1499 3.42303M21.1499 12.423H3.1499M12.1499 21.423C7.17934 21.423 3.1499 17.3936 3.1499 12.423M12.1499 21.423C13.8068 21.423 15.1499 17.3936 15.1499 12.423C15.1499 7.45247 13.8068 3.42303 12.1499 3.42303M12.1499 21.423C10.493 21.423 9.1499 17.3936 9.1499 12.423C9.1499 7.45247 10.493 3.42303 12.1499 3.42303M3.1499 12.423C3.1499 7.45247 7.17934 3.42303 12.1499 3.42303"
                              stroke="#00C3C0"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                          <span>www.thelawapp.com.au</span>
                        </Link>
                      </div>
                    </div>
                    <div className="contact-social">
                      <Link href="#"></Link>
                    </div>
                  </div>
                  <div className="w-full md:w-1/2 lg:w-7/12">
                    <div className="home-cta-images">
                      <div className="cta-shape"></div>
                      <img
                        src="/assets/img/map.png"
                        alt="home cta"
                        className="cta-img-2"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </section>
    </MainLayout>
  );
}
