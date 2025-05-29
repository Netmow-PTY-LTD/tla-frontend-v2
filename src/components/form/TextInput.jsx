// 'use client';

// import React from 'react';
// import {
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from '@/components/ui/form';
// import { Input } from '@/components/ui/input';

// export default function TextInput({
//   label,
//   name,
//   value,
//   onChange,
//   type,
//   placeholder,
//   control,
//   ...props
// }) {
//   return (
//     <FormField
//       {...props}
//       control={control}
//       name={name}
//       render={({ field }) => {
//         const handleChange = (e) => {
//           field.onChange(e);
//           if (onChange) {
//             onChange(e);
//           }
//         };

//         return (
//           <FormItem>
//             <FormLabel>{label}</FormLabel>
//             <FormControl>
//               <Input
//                 {...field}
//                 {...props}
//                 type={type || 'text'}
//                 placeholder={placeholder}
//                 value={field.value || ''}
//                 onChange={handleChange}
//                 className="bg-[#fff] border-[#DCE2EA] text-black placeholder:text-[#a6a8ab] h-[44px]"
//               />
//             </FormControl>
//             <FormMessage className="text-red" />
//           </FormItem>
//         );
//       }}
//     />
//   );
// }

'use client';

import React from 'react';
import { useFormContext } from 'react-hook-form';
import clsx from 'clsx'; // for conditional class merging
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

export default function TextInput({
  name,
  label,
  placeholder = '',
  type = 'text',
  disabled = false,
  inputClassName = '',
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
            <Input
              {...field}
              type={type}
              placeholder={placeholder}
              disabled={disabled}
              className={clsx(
                'bg-white border-[#DCE2EA] text-black placeholder:text-[#a6a8ab] h-[44px]',
                inputClassName
              )}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
