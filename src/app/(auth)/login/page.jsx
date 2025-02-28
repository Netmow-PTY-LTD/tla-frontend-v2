"use client";
import React from "react";
import Image from "next/image";
import { Form, Formik, useField } from "formik";
import * as Yup from "yup";
import Link from "next/link";

export default function Login() {
  const TextInput = ({ label, ...props }) => {
    const [field, meta] = useField(props);
    return (
      <>
        <label
          htmlFor={props.id || props.name}
          className="tla-form-label mb-2 inline-block"
        >
          {label}
        </label>
        <input className="tla-form-control" {...field} {...props} />
        {meta.touched && meta.error ? (
          <div className="error mt-2 text-sm text-red-400">{meta.error}</div>
        ) : null}
      </>
    );
  };

  const Checkbox = ({ children, ...props }) => {
    const [field, meta] = useField({ ...props, type: "checkbox" });
    return (
      <div>
        <label className="checkbox-input flex gap-2 tla-form-label">
          <input type="checkbox" {...field} {...props} />
          {children}
        </label>
        {meta.touched && meta.error ? (
          <div className="error">{meta.error}</div>
        ) : null}
      </div>
    );
  };

  return (
    <section
      className="tla-auth-section"
      style={{ backgroundImage: `url('/assets/img/hero_bg.png')` }}
    >
      <div className="container">
        <div className="tla-auth-wrapper">
          <div className="tla-auth-box">
            <div className="flex flex-wrap items-center">
              <div className="hidden md:block md:w-1/3">
                <div className="tla-auth-image">
                  <Image
                    src="/assets/img/auth-login.png"
                    width={600}
                    height={751}
                    alt="Auth Image"
                  />
                </div>
              </div>
              <div className="w-full md:w-2/3">
                <div className="tla-auth-form auth-form-login">
                  <h2 className="tla-auth-title mb-2">
                    Explore the opportunities
                  </h2>
                  <p className="tla-auth-subtitle">
                    1000’s of local and remote clients & lawyers are already
                    waiting for your services
                  </p>
                  <h3 className="my-6">Login</h3>
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
                            label="Email"
                            name="email"
                            type="email"
                            placeholder="John@example.com"
                          />
                        </div>

                        <div className="mb-4">
                          <TextInput
                            label="Password"
                            name="password"
                            type="password"
                            placeholder="1234****"
                          />
                        </div>
                        <div className="flex flex-wrap justify-between gap-4 mb-8">
                          <div className="remember-me">
                            <Checkbox name="acceptedTerms">
                              Remember me
                            </Checkbox>
                          </div>
                          <div className="forget-password">
                            <Link href="#">Forgot Password?</Link>
                          </div>
                        </div>
                        <button
                          type="submit"
                          className="btn-auth-login"
                          disabled={isSubmitting}
                        >
                          Log In
                        </button>
                      </Form>
                    )}
                  </Formik>
                  <div className="tla-auth-footer">
                    <span>Offering a service? </span>
                    <Link href="/register">
                      <b>Register as a professional</b>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
