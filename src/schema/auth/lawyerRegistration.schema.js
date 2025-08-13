import { z } from 'zod';

export const lawyerRegistrationStepTwoFormValidation = z
  .object({
    practiceWithin: z.boolean().refine((val) => val === true, {
      message: 'This checkbox must be checked before proceeding.',
    }),
    AreaZipcode: z
      .string()
      .min(1, 'Address is required')
      .refine(
        (val) => /\b\d{4}\b/.test(val), // Check for Australian ZIP (e.g., 3000)
        {
          message:
            'Please provide a valid Australian address that includes a 4-digit postcode.',
        }
      ),
    rangeInKm: z.any().optional(),
    practiceInternational: z.boolean().optional(),
  })
  .superRefine((data, ctx) => {
    const parsedRange = Number(data.rangeInKm);

    // Only validate rangeInKm if practiceWithin is selected
    if (
      data.practiceWithin &&
      (data.rangeInKm === undefined ||
        data.rangeInKm === null ||
        data.rangeInKm === '' ||
        isNaN(parsedRange))
    ) {
      ctx.addIssue({
        path: ['rangeInKm'],
        code: z.ZodIssueCode.custom,
        message: 'Distance range (in km) is required.',
      });
    }
  });

export const lawyerRegistrationStepOneFormValidation = z.object({
  name: z
    .string()
    .min(2, 'is requird and  at least 2 characters long')
    .max(50, 'must be less than 50 characters'),
});

// const bdPhoneRegex = /^(?:\+88|88)?01[3-9]\d{8}$/;
const auPhoneRegex = /^(?:\+?61|0)[2-478]\d{8}$/;

export const lawyerRegistrationStepThreeFormValidation = z
  .object({
    email: z.string().email('Invalid email address'),
    phone: z
      .string()
      .min(1, 'is required')
      .refine((val) => auPhoneRegex.test(val), {
        message:
          'Phone number must be a valid Australian number (e.g. +61412345678)',
      }),

    password: z.string().min(6, 'Password must be at least 6 characters'),
    gender: z.enum(['male', 'female', 'other'], {
      required_error: 'is required',
    }),
    law_society_member_number: z.string().min(1, 'is Required'),
    practising_certificate_number: z.string().min(1, 'is Required'),

    soloPractitioner: z.boolean(),
    companyTeam: z.boolean(),
    company_name: z.string().optional(),
    company_website: z.string().optional(),
    company_size: z.string().optional(),
    agreement: z.boolean().refine((val) => val === true, {
      message: 'is Required',
    }),
  })
  .superRefine((data, ctx) => {
    if (data.companyTeam) {
      if (!data.company_name || data.company_name.trim() === '') {
        ctx.addIssue({
          path: ['company_name'],
          code: z.ZodIssueCode.custom,
          message: 'is required',
        });
      }

      if (!data.company_website || data.company_website.trim() === '') {
        ctx.addIssue({
          path: ['company_website'],
          code: z.ZodIssueCode.custom,
          message: 'is required',
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
          message: 'is required',
        });
      }
    }
  });
