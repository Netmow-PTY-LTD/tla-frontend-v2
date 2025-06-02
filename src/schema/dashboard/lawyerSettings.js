import { z } from 'zod';

const bdPhoneRegex = /^(?:\+88|88)?01[3-9]\d{8}$/;
const auPhoneRegex = /^(?:\+?61|0)[2-478]\d{8}$/;

export const lawyerSettingAboutSchema = z.object({
  name: z.string({ invalid_type_error: 'Name must be a string' }),
  companyLogo: z.any().optional(),
  userProfileLogo: z.any().optional(),
  companyName: z.string(),
  contactEmail: z
    .string()
    .trim()
    .toLowerCase()
    .email('Please enter a valid email address')
    .optional()
    .or(z.literal('')),
  phoneNumber: z
    .string()
    .trim()
    .refine((val) => bdPhoneRegex.test(val) || auPhoneRegex.test(val), {
      message: 'Phone number must be a valid BD or AU number',
    })
    .or(z.literal(''))
    .optional(),

  website: z
    .union([
      z.string().url('Please enter valid website url'),
      z.literal(''),
      z.undefined(),
    ])
    .optional(),
  companySize: z.string().min(1, 'Company size is required'),
  description: z.string().optional(),
  yearsInBusiness: z
    .union([z.string(), z.number()])
    .refine((val) => !isNaN(Number(val)), {
      message: 'Years in business must be a number',
    }),
  location: z.object({
    address: z.string(),
    hideFromProfile: z.boolean(),
    locationReason: z.string().optional(),
    // coordinates: z
    //   .object({
    //     lat: z.number({ invalid_type_error: 'Latitude must be a number' }),
    //     lng: z.number({ invalid_type_error: 'Longitude must be a number' }),
    //   })
    //   .optional(),
  }),
});
