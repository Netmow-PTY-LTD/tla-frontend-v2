

"use client";
import { showErrorToast, showSuccessToast } from "@/components/common/toasts";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";


import {
  Combobox,
  ComboboxButton,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
} from "@headlessui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowLeft,
  Check,
  ChevronDown,
  Eye,
  EyeOff,
  Loader2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import z from "zod";


import Link from "next/link";
import { useGetZipCodeListQuery } from "@/store/features/public/publicApiService";
import { useGetCountryWiseServicesQuery } from "@/store/features/admin/servicesApiService";
import Cookies from "js-cookie";
import { useAuthUserInfoQuery } from "@/store/features/auth/authApiService";
import CountrySelect from "../../../_components/form/CountrySelect";
import ServiceSelector from "../../../_components/form/ServiceSelector";
import RangeSelector from "../../../_components/form/RangeSelector";
import { useEditLawyerUserMutation, useGetLawyerUserByIdQuery } from "@/store/features/marketing/marketing";
import { useParams } from "next/navigation";

const genderOptions = [
  { id: 1, label: "Male", value: "male" },
  { id: 2, label: "Female", value: "female" },
  { id: 3, label: "Other", value: "other" },
];

export const lawyerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").trim(),
  email: z.string().email("Invalid email address").trim(),
  phone: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .max(15, "Phone number can't exceed 15 digits")
    .regex(/^\+?[0-9\s-]+$/, "Invalid phone number format")
    .trim(),
  password: z.string().min(6, "Password must be at least 6 characters"),
  law_society_member_number: z.string().optional().or(z.literal("")), // allows empty string
  practising_certificate_number: z.string().optional().or(z.literal("")),
  gender: z.enum(["male", "female", "other"], {
    required_error: "Gender is required",
  }),
    services: z
      .array(z.string())
      .min(1, "At least one service specialization is required"),
  AreaZipcode: z.string().min(1, "Practicing area is required"),
  country:z.string(),
  rangeInKm: z
    .number()
    .min(1, "Range of area is required")
    .refine((val) => Number(val) > 0, {
      message: "Range of area must be greater than 0",
    }),
  practiceWithin: z.boolean().optional(),
  practiceInternationally: z.boolean().optional(),
  full_address: z.string().optional(),
});

export const editLawyerSchema = lawyerSchema.extend({
  password: z.string().optional(),
});

export default function EditLawyer() {
  const [query, setQuery] = useState("");
  const [zipcode, setZipcode] = useState("");
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [postalCode, setPostalCode] = useState("");
  const [address, setAddress] = useState("");

  const router = useRouter();
  const { userId } = useParams();

  const { data: lawyerData, isLoading: isLawyerLoading } = useGetLawyerUserByIdQuery(userId, {
    skip: !userId,
  });



  const form = useForm({
    resolver: zodResolver(editLawyerSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
      law_society_member_number: "",
      practising_certificate_number: "",
      gender: "male",
      services: [],
      AreaZipcode: "",
      rangeInKm: 0,
      practiceWithin: false,
      practiceInternationally: false,
      full_address: "",
    },
  });

  React.useEffect(() => {
    if (lawyerData?.data) {
      const { profile, lawyerServiceMap, userData} = lawyerData.data;
      console.log("Fetched lawyer data:", lawyerServiceMap);
      if (profile) {
        form.setValue("name", profile.name);
        form.setValue("gender", profile.gender);
        form.setValue("law_society_member_number", profile.law_society_member_number);
        form.setValue("practising_certificate_number", profile.practising_certificate_number);
        form.setValue("full_address", profile.full_address);
      }
      form.setValue("email", userData.email);
      form.setValue("phone", userData.phone);
      if (lawyerServiceMap) {
         form.setValue("country", lawyerServiceMap.country);
         form.setValue("services", lawyerServiceMap.services);
         form.setValue("rangeInKm", Number(lawyerServiceMap.rangeInKm || 0)); 
         form.setValue("practiceWithin", lawyerServiceMap.practiceWithin);
         form.setValue("practiceInternationally", lawyerServiceMap.practiceInternationally);
         
         // Fix: Map from zipCode object in API response
         if (lawyerServiceMap.zipCode) {
              setAddress(lawyerServiceMap.zipCode.zipcode);
              setPostalCode(lawyerServiceMap.zipCode.postalCode);
              setLatitude(lawyerServiceMap.zipCode.latitude);
              setLongitude(lawyerServiceMap.zipCode.longitude);
              form.setValue("AreaZipcode", lawyerServiceMap.zipCode._id);
              if (lawyerServiceMap.zipCode.countryCode) {
                form.setValue("countryCode", lawyerServiceMap.zipCode.countryCode);
              }
         } else if (lawyerServiceMap.addressInfo) { 
              // Fallback for addressInfo if zipCode is missing (though API seems to use zipCode)
              setAddress(lawyerServiceMap.addressInfo.zipcode);
              setPostalCode(lawyerServiceMap.addressInfo.postalCode);
              setLatitude(lawyerServiceMap.addressInfo.latitude);
              setLongitude(lawyerServiceMap.addressInfo.longitude);
              form.setValue("AreaZipcode", lawyerServiceMap.zipCode?._id || lawyerServiceMap.addressInfo?._id); // Try to find ID
              if (lawyerServiceMap.addressInfo.countryCode) {
                 form.setValue("countryCode", lawyerServiceMap.addressInfo.countryCode);
              }
         }
      }
    }
  }, [lawyerData, form]);


    const token = Cookies.get('token');
        const { data: currentUser, isLoading: isCurrentUserLoading } =
          useAuthUserInfoQuery(undefined, {
            skip: !token,
          });



  // Watch country selection
  const countryId = useWatch({ control: form.control, name: 'country' });
  const countryCode = useWatch({ control: form.control, name: 'countryCode' });
 


  const { data: countryWiseServices } = useGetCountryWiseServicesQuery(
    countryId,
    {
      skip: !countryId, // Skip
    }
  );

  const paramsPayload = {
    countryId: countryId,
    search: query || "",
  };

  const { data: allZipCodes } = useGetZipCodeListQuery(paramsPayload, {
    skip: !countryId,
  });

  

  const filteredZipCodes =
    allZipCodes?.data?.filter((z) =>
      z.zipcode.toLowerCase().includes(query.toLowerCase())
    ) || [];





  const [updateLawyer, { isLoading: isUpdatingLawyerLoading }] =
    useEditLawyerUserMutation();

  const onSubmit = async (data) => {
    console.log("Form submitted", data);
  
    const {
      name,
      email,
      phone,
      password,
      gender,
      law_society_member_number,
      practising_certificate_number,
      AreaZipcode,
      rangeInKm,
      practiceWithin,
      practiceInternationally,
      services,
      full_address
      
    } = data;

    const payload = {
      userId,
      data: {
        email,
        phone,
        password: password || undefined, // Only send if provided
        role: "user",
        regUserType: "lawyer",
        profile: {
          name,
          profileType: "basic",
          gender,
          country: countryId,
          law_society_member_number,
          practising_certificate_number,
          full_address: full_address,
        },
        lawyerServiceMap: {
          services,
          rangeInKm,
          practiceWithin,
          practiceInternationally,
          isSoloPractitioner: false,
          country: countryId,
          addressInfo: {
            countryId: countryId,
            countryCode,
            zipcode: address,
            postalCode: postalCode,
            latitude: latitude,
            longitude: longitude,
          },
        },
      }
    };

    console.log("Submit payload:", payload);
    //  You can call API here to create a new lawyer

    try {
      const res = await updateLawyer(payload).unwrap();
      console.log("Lawyer updated successfully:", res);
      // Optionally, reset the form or show a success message
      if (res?.success) {
        showSuccessToast(res?.message || "Lawyer updated successfully!");
        form.reset();
        router.push("/marketing/lawyers");
      }
    } catch (error) {
      console.error("Error updating lawyer:", error);
      // Optionally, show an error message to the user
      showErrorToast(
        error?.message ||
          error?.data?.message ||
          "Failed to update lawyer. Please try again."
      );
    }



  };


  return (
    <div className="max-w-[1000px] mx-auto bg-white p-6 rounded-lg shadow-lg">
      <div className="w-full flex items-center gap-4 mb-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.back()}
          className="flex items-center gap-1 h-9 px-3"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </Button>
      </div>
      <div className="w-full">
        <h3 className="text-black font-semibold heading-lg">
          Edit Lawyer
        </h3>
        <p className="text-[#6e6e6e] mt-2 text-sm">
          Update the lawyer's profile information below.
        </p>
      </div>
      <div className="mt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="flex flex-wrap gap-y-6">
              <div className="w-full md:w-1/2 md:pr-2">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="John Doe"
                          className="h-[44px]"
                          {...field}
                          onChange={(e) => {
                            field.onChange(e);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="w-full md:w-1/2 md:pl-2">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="i.e. johndoe@gmail.com"
                          className="h-[44px]"
                          {...field}
                          onChange={(e) => {
                            field.onChange(e);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="w-full md:w-1/2 md:pr-2">
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="i.e +1 234 567 8901"
                          className="h-[44px]"
                          {...field}
                          onChange={(e) => {
                            field.onChange(e);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="w-full md:w-1/2 md:pl-2">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => {
                    const [showPassword, setShowPassword] = useState(false);

                    const togglePasswordVisibility = () => {
                      setShowPassword((prev) => !prev);
                    };

                    return (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type={showPassword ? "text" : "password"}
                              autoComplete="new-password"
                              placeholder="Enter your password"
                              {...field}
                              disabled
                              className="tla-form-control h-[44px] pr-10 bg-gray-50" // space for the icon
                              onChange={(e) => {
                                field.onChange(e);
                              }}
                            />
                            <button
                              type="button"
                              onClick={togglePasswordVisibility}
                              className="absolute top-1/2 right-2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                              tabIndex={-1}
                            >
                              {showPassword ? (
                                <EyeOff size={18} />
                              ) : (
                                <Eye size={18} />
                              )}
                            </button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
              </div>
              <div className="w-full md:w-1/2 md:pr-2">
                <FormField
                  control={form.control}
                  name="law_society_member_number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Law Society Member Number</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          className="tla-form-control h-[44px]"
                          onChange={(e) => {
                            field.onChange(e);
                          }}
                          placeholder="i.e. LSMN123456"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="w-full md:w-1/2 md:pl-2">
                <FormField
                  control={form.control}
                  name="practising_certificate_number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Practising Certificate Number</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          className="tla-form-control h-[44px]"
                          onChange={(e) => {
                            field.onChange(e);
                          }}
                          placeholder="i.e. PCN123456"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="w-full">
                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <div className="flex items-center">
                        <FormLabel className="w-1/6">Gender</FormLabel>
                        <div className="flex gap-6">
                          {genderOptions.map((option) => (
                            <label
                              key={option.value}
                              htmlFor={`gender-${option.value}`}
                              className="flex items-center gap-2 cursor-pointer group"
                            >
                              <input
                                type="radio"
                                id={`gender-${option.value}`}
                                value={option.value}
                                checked={field.value === option.value}
                                onChange={() => field.onChange(option.value)}
                                className="sr-only"
                              />
                              <div
                                className={`w-4 h-4 rounded-full border-2 border-[var(--primary-color)] flex items-center justify-center transition-all
                  ${
                    field.value === option.value
                      ? "bg-[var(--primary-color)]"
                      : "bg-transparent"
                  }`}
                              >
                                <div
                                  className={`w-1.5 h-1.5 rounded-full transition
                    ${
                      field.value === option.value
                        ? "bg-white"
                        : "bg-transparent"
                    }`}
                                />
                              </div>
                              <span className="text-sm text-gray-800">
                                {option.label}
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>
                      <FormMessage className="text-red-600" />
                    </FormItem>
                  )}
                />
              </div>



                  
                      <div className="w-full">
             
                  <CountrySelect form={form} name="country" />
              </div>

              <div className="w-full">
                <FormField
                  control={form.control}
                  name="full_address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Address</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter full address"
                          className="h-[44px]"
                          {...field}
                          onChange={(e) => {
                            field.onChange(e);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>





              <div className="w-full">
                <FormField
                  control={form.control}
                  name="AreaZipcode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Practicing Area</FormLabel>
                      <Combobox
                        value={field.value}
                        onChange={(val) => {
                          //console.log('val', val);
                          field.onChange(val);
                          setZipcode(val);
                          const selectedZipcode = allZipCodes?.data?.find(
                            (z) => z._id === val
                          );
                          if (selectedZipcode) {
                            setLatitude(selectedZipcode.latitude);
                            setLongitude(selectedZipcode.longitude);
                            setPostalCode(selectedZipcode.postalCode);
                            setAddress(selectedZipcode.zipcode);
                          }
                        }}
                      >
                        <div className="relative">
                          <ComboboxInput
                            className="border border-gray-300 rounded-md w-full h-[44px] px-4"
                            onChange={(event) => setQuery(event.target.value)}
                            displayValue={(val) => {
                              const found = allZipCodes?.data?.find(
                                (z) => z._id === val
                              );
                              return found?.zipcode || address || "";
                            }}
                            placeholder="Select a Zipcode"
                          />
                          <ComboboxButton className="absolute top-0 bottom-0 right-0 flex items-center pr-2">
                            <ChevronDown className="h-4 w-4 text-gray-500" />
                          </ComboboxButton>
                          {filteredZipCodes?.length > 0 && (
                            <ComboboxOptions className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-sm shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                              {filteredZipCodes?.slice(0, 10).map((item) => (
                                <ComboboxOption
                                  key={item._id}
                                  value={item._id}
                                  className={({ active }) =>
                                    cn(
                                      "cursor-pointer select-none relative py-2 pl-10 pr-4",
                                      active
                                        ? "bg-blue-100 text-blue-900"
                                        : "text-gray-900"
                                    )
                                  }
                                >
                                  {({ selected }) => (
                                    <>
                                      <span
                                        className={cn("block truncate", {
                                          "font-medium": selected,
                                          "font-normal": !selected,
                                        })}
                                      >
                                        {item.zipcode}
                                      </span>
                                      {selected && (
                                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-600">
                                          <Check className="h-4 w-4" />
                                        </span>
                                      )}
                                    </>
                                  )}
                                </ComboboxOption>
                              ))}
                            </ComboboxOptions>
                          )}
                        </div>
                      </Combobox>
                      <FormMessage className="text-red-600" />
                    </FormItem>
                  )}
                />
              </div>
              <div className="w-full">
                <RangeSelector form={form} name="rangeInKm" />
              </div>
           
                      <ServiceSelector
                      name="services"
                      services={countryWiseServices?.data || []}
                      hasError={form.formState.errors.services}
                      />


              <div className="w-full">
                <FormField
                  control={form.control}
                  name="practiceWithin"
                  render={({ field }) => (
                    <FormItem className="cursor-pointer flex items-center gap-3">
                      <FormControl>
                        <Checkbox
                          {...field}
                           checked={field.value}
                          onCheckedChange={(val) => {
                            field.onChange(val);
                          }}
                        />
                      </FormControl>
                      <FormLabel className="font-bold">
                        I will practice all over{" "}
                        {currentUser?.data?.firmProfileId?.contactInfo?.country
                          ?.name || ""}
                      </FormLabel>
                      <FormMessage className="text-red-600" />
                    </FormItem>
                  )}
                />
              </div>

              <div className="w-full">
                <FormField
                  control={form.control}
                  name="practiceInternationally"
                  render={({ field }) => (
                    <FormItem className="cursor-pointer flex items-center gap-3">
                      <FormControl>
                        <Checkbox
                          {...field}
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="font-bold">
                        I will practice internationally all over the world
                      </FormLabel>
                      <FormMessage className="text-red-600" />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Add more fields as necessary */}

            <div className="flex justify-between gap-4 items-center ">
              <Link
                href="/marketing/lawyers"
                className="text-sm flex items-center hover:underline bg-[#1da9a7] text-white px-4 py-2 rounded-md "
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                <span>Back to Lawyers List</span>
              </Link>
              <Button
                className="cursor-pointer mt-2 bg-[#1da9a7]"
                type="submit"
                disabled={isUpdatingLawyerLoading}
              >
                {isUpdatingLawyerLoading ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />{" "}
                    <span>Updating...</span>
                  </div>
                ) : (
                  "Update Lawyer"
                )}
              </Button>
             
            
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
