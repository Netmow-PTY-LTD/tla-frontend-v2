import React, { useState } from "react";
import Image from "next/image";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
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
import { Checkbox } from "@/components/ui/checkbox";

const formSchema = z.object({
  username: z.string().min(2, {
    message: "Name is required and must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  phone: z.string().min(1, {
    message: "Phone must be at least 10 characters.",
  }),
});

export default function RegisterStepThree({ handleBack }) {
  const [isCompany, setIsCompany] = useState(false);
  const [selectedSize, setSelectedSize] = useState("2-10");

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
      phone: "",
    },
  });

  const onSubmit = (data) => {
    console.log(data);
  };

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
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username*</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="John Doe"
                          {...field}
                          className="tla-form-control"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex flex-wrap">
                  <div className="w-full md:w-1/2 md:pr-1">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email*</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="johndoe@gmail.com"
                              {...field}
                              className="tla-form-control"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="w-full md:w-1/2 md:pl-1">
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone*</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="phone number"
                              {...field}
                              className="tla-form-control"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Checkbox {...field} />
                      </FormControl>
                      <FormLabel className="ml-2 font-bold">
                        I will work as solo practitioner
                      </FormLabel>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Checkbox
                          {...field}
                          onClick={() => {
                            setIsCompany(!isCompany);
                          }}
                        />
                      </FormControl>
                      <FormLabel className="ml-2 font-bold">
                        I work with a company/team
                      </FormLabel>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {isCompany && (
                  <>
                    <div className="flex flex-wrap">
                      <div className="w-full md:w-1/2 md:pr-1">
                        <FormField
                          control={form.control}
                          name="company_name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Company Name*</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Company"
                                  {...field}
                                  className="tla-form-control"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="w-full md:w-1/2 md:pl-1">
                        <FormField
                          control={form.control}
                          name="company_website"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Company Website*</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="https://"
                                  {...field}
                                  className="tla-form-control"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
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
              </form>
            </Form>
          </div>
        </div>
      </div>
    </>
  );
}
