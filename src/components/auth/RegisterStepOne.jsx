import React, { useState } from "react";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import Link from "next/link";
import TextInput from "../Form/TextInput";
import Image from "next/image";
import { popularServices } from "@/app/data/data";

export default function RegisterStepOne({ handleStep }) {
  const [selectedService, setSelectedService] = useState("");
  const [selectedServiceId, setSelectedServiceId] = useState("");

  const handleServiceClick = (id) => {
    setSelectedServiceId(id);
    if (id) {
      const serviceTitle = popularServices.find(
        (service) => service.id === id
      ).title;
      setSelectedService(serviceTitle);
    }
  };

  return (
    <>
      <div className="flex flex-wrap lg:flex-nowrap items-center">
        <div className="hidden lg:block lg:max-w-[602]">
          <div className="tla-auth-image">
            <Image
              src="/assets/img/auth-step1.png"
              width={602}
              height={751}
              alt="Auth Image"
            />
          </div>
        </div>
        <div className="w-full lg:w-7/12">
          <div className="tla-auth-form tla-auth-form-register">
            <h2 className="tla-auth-title mb-2">
              Expand your legal practice area
            </h2>
            <p className="tla-auth-subtitle mb-5">
              1000’s of local and remote clients are already waiting for your
              services
            </p>
            <Formik
              initialValues={{
                email: "",
                password: "",
              }}
              validationSchema={Yup.object({
                email: Yup.string()
                  .email("Invalid email address")
                  .required("Required"),
                password: Yup.string()
                  .min(4, "Password must be at least 4 characters")
                  .required("Password is required"),
              })}
              onSubmit={(values, { setSubmitting }) => {
                console.log(values);
                setSubmitting(true);
              }}
            >
              {({ isSubmitting }) => (
                <Form>
                  <div className="mb-4">
                    <TextInput
                      label="Your Name"
                      name="name"
                      type="text"
                      placeholder="John Doe"
                    />
                  </div>

                  <div className="mb-4">
                    <TextInput
                      label="What type of legal service you provide?"
                      name="selected-service"
                      type="text"
                      value={selectedService}
                      placeholder="Divorce Law"
                    />
                  </div>
                  <div className="popular-services mb-8">
                    <h4>Popular Law Services</h4>
                    <div className="flex flex-wrap gap-2 mt-4">
                      {popularServices?.map((service) => (
                        <div
                          className="w-full sm:w-1/2 md:w-1/4"
                          key={service.id}
                          onClick={() => handleServiceClick(service.id)}
                        >
                          <Link
                            href="#"
                            className={`service-box flex gap-2 items-center ${
                              selectedServiceId === service.id ? "selected" : ""
                            }`}
                          >
                            <Image
                              src={service.image}
                              width={50}
                              height={50}
                              className="object-cover rounded-md"
                              alt={service.title}
                            />
                            <h5 className="service-title">{service.title}</h5>
                          </Link>
                        </div>
                      ))}
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="btn-auth-register"
                    onClick={handleStep}
                  >
                    Get Started
                  </button>
                </Form>
              )}
            </Formik>
            <div className="tla-auth-footer">
              <span>Already have an account? </span>
              <Link href="/login">
                <b>Log In</b>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
