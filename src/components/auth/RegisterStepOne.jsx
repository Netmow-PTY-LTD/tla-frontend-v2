import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { popularServices } from "@/data/data";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name is required and must be at least 2 characters.",
  }),
  // service: z.string().min(1, {
  //   message: "Service is required.",
  // }),
});

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

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      service: "",
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
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Your Name</FormLabel>
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
                <FormField
                  control={form.control}
                  name="service"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        What type of legal service you provide?
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Divorce Law"
                          {...field}
                          className="tla-form-control"
                          value={selectedService}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
              </form>
            </Form>
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
