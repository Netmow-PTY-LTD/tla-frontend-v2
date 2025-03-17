import React from "react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";

export default function TextArea({
  label,
  name,
  value,
  onChange,
  placeholder,
  control,
  ...props
}) {
  return (
    <>
      <FormField
        control={control}
        name={name}
        render={({ field }) => {
          const handleChange = (e) => {
            field.onChange(e);
            if (onChange) {
              onChange(e);
            }
          };
          return (
            <FormItem>
              <FormLabel>{label}</FormLabel>
              <FormControl>
                <Textarea
                  placeholder={placeholder}
                  {...field}
                  className="tla-form-textarea"
                  value={value || ""}
                  onChange={handleChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          );
        }}
      />
    </>
  );
}
