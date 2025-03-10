import React, { useState } from "react";
import { Field, Form, Formik } from "formik";
import * as Yup from "yup";
import Link from "next/link";
import TextInput from "../Form/TextInput";
import Image from "next/image";
import { popularServices } from "@/data/data";

export default function RegisterStepThree({ handleBack }) {
  const [isCompany, setIsCompany] = useState(false);
  const [selectedSize, setSelectedSize] = useState("");

  return (
    <>
      <div className="flex flex-wrap lg:flex-nowrap items-center">
        <div className="hidden lg:block lg:max-w-[602]">
          <div className="tla-auth-image">
            <Image
              src="/assets/img/auth-step3.png"
              width={602}
              height={751}
              alt="Auth Image"
            />
          </div>
        </div>
        <div className="w-full lg:w-7/12">
          <div className="tla-auth-form tla-auth-form-register">
            <h2 className="tla-auth-title mb-2">Some details about you</h2>
            <p className="tla-auth-subtitle mb-5">
              You’re just a few steps away from viewing our Family Law leads{" "}
            </p>
            <Formik
              initialValues={{
                username: "",
                email: "",
                phone: "",
              }}
              validationSchema={Yup.object({
                username: Yup.string().required("Username is required"),
                email: Yup.string()
                  .email("Invalid email address")
                  .required("Email is required"),
                phone: Yup.string().required("Phone is required"),
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
                      label="Username*"
                      name="name"
                      type="text"
                      placeholder="John Doe"
                    />
                  </div>
                  <div className="flex flex-wrap">
                    <div className="mb-4 w-full md:w-1/2 pr-1">
                      <TextInput
                        label="Email Address*"
                        name="email"
                        type="email"
                        placeholder="john@example.com"
                      />
                    </div>
                    <div className="mb-4 w-full md:w-1/2 pl-1">
                      <TextInput
                        label="Phone Number*"
                        name="phone"
                        type="text"
                        placeholder="0123456789"
                      />
                    </div>
                  </div>
                  <div className="mb-4">
                    <label className="flex gap-2">
                      <Field
                        type="radio"
                        name="picked"
                        value="solo"
                        onChange={() => setIsCompany(false)}
                      />
                      I will work as solo practitioner
                    </label>
                  </div>
                  <div className="mb-4">
                    <label className="flex gap-2">
                      <Field
                        type="radio"
                        name="picked"
                        value="company"
                        onChange={() => setIsCompany(!isCompany)}
                      />
                      I work with a company/team
                    </label>
                  </div>
                  {isCompany && (
                    <>
                      <div className="flex flex-wrap">
                        <div className="mb-4 w-full md:w-1/2 pr-1">
                          <TextInput
                            label="Company Name*"
                            name="company-name"
                            type="text"
                            placeholder="Company Name"
                          />
                        </div>
                        <div className="mb-4 w-full md:w-1/2 pl-1">
                          <TextInput
                            label="Company Website(Optional)"
                            name="com_website"
                            type="text"
                            placeholder="http://example.com"
                          />
                        </div>
                      </div>
                      <div className="company-size">
                        <label>Company Size, Team Members</label>
                        <div className="flex flex-wrap gap-2">
                          {["2-10", "11-50", "51-100", "100+"].map((size) => (
                            <button
                              type="button"
                              key={size}
                              onClick={() => setSelectedSize(size)}
                              className={`${
                                selectedSize === size ? "selected" : ""
                              }`}
                            >
                              {size}
                            </button>
                          ))}
                        </div>
                      </div>
                    </>
                  )}

                  <div className="flex flex-wrap justify-end gap-3 mt-10">
                    <button
                      type="submit"
                      className="btn-outline"
                      onClick={handleBack}
                    >
                      Back
                    </button>
                    <button type="submit" className="btn-auth-register">
                      Finish & See Leads
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </>
  );
}
