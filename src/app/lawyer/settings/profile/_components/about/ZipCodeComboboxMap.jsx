"use client";

import React, { useState, useEffect, useMemo } from "react";
import {  useFormContext } from "react-hook-form";
import {
  Combobox,
  ComboboxInput,
  ComboboxOptions,
  ComboboxOption,
} from "@headlessui/react";
import { Check, Loader } from "lucide-react";
import { cn } from "@/lib/utils";

import {
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useGetZipCodeListQuery } from "@/store/features/public/publicApiService";

const ZipCodeComboboxMap = ({ name, countryId, disabled = false }) => {
  const { control } = useFormContext();
  const [query, setQuery] = useState("");

  const { data, isLoading } = useGetZipCodeListQuery({
    page: 1,
    limit: 10,
    search: query,
    countryId: countryId,
  });

  // ✅ transform API data → options
  const options = useMemo(() => {
    if (!data?.data) return [];
    return data.data.map((z) => ({
      value: z._id,
      label: `${z.zipcode}`, // adjust based on API response
    }));
  }, [data]);

  //console.log("options in zipcodecomboboxmap", options);

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        const mapQuery = field.value?.label || query; // 🔑 use label for map
        const mapSrc = mapQuery
          ? `https://maps.google.com/maps?q=${mapQuery}&t=&z=13&ie=UTF8&iwloc=&output=embed`
          : "";

          console.log('field',field);
        return (
          <FormItem>
            <FormLabel>Address</FormLabel>
            <Combobox
              value={field.value ?? null}
              onChange={(val) => field.onChange(val)}
            >
              <div className="relative">
                <ComboboxInput
                  className="bg-white border border-gray-300 rounded-md w-full h-[44px] px-4"
                  onChange={(e) => setQuery(e.target.value)}
                  displayValue={(val) => val?.label || ""}
                  placeholder="Select an Address"
                  autoComplete="off"
                  disabled={disabled}
                />

                {options?.length > 0 && (
                  <ComboboxOptions className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-sm shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    {options.map((item) => (
                      <ComboboxOption
                        key={item.value}
                        value={item} // 🔑 store object in form
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
                              {item.label}
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

            {/* Map */}
            <div className="w-full mt-5 h-[300px] overflow-hidden rounded-lg border">
              {mapSrc ? (
                <iframe
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  allowFullScreen
                  referrerPolicy="no-referrer-when-downgrade"
                  src={mapSrc}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-500">
                  Map preview
                </div>
              )}
            </div>
          </FormItem>
        );
      }}
    />
  );
};

export default ZipCodeComboboxMap;
