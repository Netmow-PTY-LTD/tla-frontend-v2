// import React from 'react';
// import {
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from '@/components/ui/form';
// import { Textarea } from '@/components/ui/textarea';

// export default function TextArea({
//   label,
//   name,
//   value,
//   onChange,
//   placeholder,
//   control,
//   ...props
// }) {
//   return (
//     <>
//       <FormField
//         control={control}
//         name={name}
//         render={({ field }) => {
//           const handleChange = (e) => {
//             field.onChange(e);
//             if (onChange) {
//               onChange(e);
//             }
//           };
//           return (
//             <FormItem>
//               <FormLabel>{label}</FormLabel>
//               <FormControl>
//                 <Textarea
//                   rows={6}
//                   placeholder={placeholder}
//                   {...field}
//                   className="bg-white text-black placeholder:text-gray-400"
//                   value={value || ''}
//                   onChange={handleChange}
//                 />
//               </FormControl>
//               <FormMessage />
//             </FormItem>
//           );
//         }}
//       />
//     </>
//   );
// }

'use client';

import React from 'react';
import { useFormContext } from 'react-hook-form';
import clsx from 'clsx';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';

export default function TextareaInput({
  name,
  label,
  rows = 4,
  placeholder = '',
  disabled = false,
  textareaClassName = '',
  itemClassName = '',
  labelClassName = '',
}) {
  const { control } = useFormContext();

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={itemClassName}>
          {label && <FormLabel className={labelClassName}>{label}</FormLabel>}
          <FormControl>
            <Textarea
              {...field}
              rows={rows}
              placeholder={placeholder}
              disabled={disabled}
              className={clsx(
                'bg-white border-[#DCE2EA] text-black placeholder:text-[#a6a8ab] w-full ',
                textareaClassName
              )}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
