"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import TextInput from "@/components/form/TextInput";

const formSchema = z.object({
  email: z
    .string()
    .min(2, {
      message: "Email must be at least 2 characters.",
    })
    .email({
      message: "Please enter a valid email address.",
    }),
  password: z.string().min(4, {
    message: "Password must be at least 4 characters.",
  }),
});

export default function Login() {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (data) => {
    console.log(data); // Handle form submission
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
              {/* Image Section (Hidden on mobile) */}
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

              {/* Form Section */}
              <div className="w-full md:w-2/3">
                <div className="tla-auth-form tla-auth-form-login">
                  <h2 className="tla-auth-title mb-2 text-center">
                    Explore the opportunities
                  </h2>
                  <p className="tla-auth-subtitle text-center">
                    1000’s of local and remote clients & lawyers are already
                    waiting for your services
                  </p>
                  <h3 className="my-6 text-center">Login</h3>

                  {/* Form Wrapper */}
                  <Form {...form}>
                    <form
                      onSubmit={form.handleSubmit(onSubmit)}
                      className="space-y-6"
                    >
                      <TextInput
                        label="Email"
                        name="name"
                        placeholder="John@example.com"
                      />
                      <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="******"
                                {...field}
                                className="tla-form-control"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <button type="submit" className="btn-auth-login">
                        Submit
                      </button>
                    </form>
                  </Form>

                  {/* Footer with Register Link */}
                  <div className="tla-auth-footer text-center">
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
