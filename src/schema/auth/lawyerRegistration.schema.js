import { z } from 'zod';

export const lawyerRegistrationStepTwoFormValidation = z.object({
  practiceWithin: z.boolean(),
  AreaZipcode: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, 'Invalid Zipcode ObjectId'),
  rangeInKm: z
    .number({
      invalid_type_error: 'Please select a valid range',
      required_error: 'Range is required',
    })
    .refine((val) => [1, 2, 10, 20, 50, 75, 100, 125, 150].includes(val), {
      message: 'Invalid range selection',
    }),
  practiceInternational: z.boolean(),
});

export const lawyerRegistrationStepOneFormValidation = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters long')
    .max(50, 'Name must be less than 50 characters'),
});

const bdPhoneRegex = /^(?:\+88|88)?01[3-9]\d{8}$/;
const auPhoneRegex = /^(?:\+?61|0)[2-478]\d{8}$/;

export const lawyerRegistrationStepThreeFormValidation = z
  .object({
    email: z.string().email('Invalid email address'),
    phone: z
      .string()
      .min(1, 'Phone number is required')
      .refine((val) => bdPhoneRegex.test(val) || auPhoneRegex.test(val), {
        message: 'Phone number must be a valid Bangladeshi or Australian number (e.g., +8801712345678 or +61412345678)',
      }),

    password: z.string().min(6, 'Password must be at least 6 characters'),
    soloPractitioner: z.boolean(),
    companyTeam: z.boolean(),
    company_name: z.string().optional(),
    company_website: z.string().optional(),
    company_size: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.companyTeam) {
      if (!data.company_name || data.company_name.trim() === '') {
        ctx.addIssue({
          path: ['company_name'],
          code: z.ZodIssueCode.custom,
          message: 'Company name is required',
        });
      }

      if (!data.company_website || data.company_website.trim() === '') {
        ctx.addIssue({
          path: ['company_website'],
          code: z.ZodIssueCode.custom,
          message: 'Company website is required',
        });
      } else {
        // ✅ Validate the URL format
        const urlPattern = /^https?:\/\/[^\s$.?#].[^\s]*$/;
        if (!urlPattern.test(data.company_website)) {
          ctx.addIssue({
            path: ['company_website'],
            code: z.ZodIssueCode.custom,
            message: 'Company website must be a valid URL',
          });
        }
      }

      if (!data.company_size || data.company_size.trim() === '') {
        ctx.addIssue({
          path: ['company_size'],
          code: z.ZodIssueCode.custom,
          message: 'Company size is required',
        });
      }
    }
  });
