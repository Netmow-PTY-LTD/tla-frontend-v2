import { z } from 'zod';

export const lawyerRegistrationStepTwoFormValidation = z
  .object({
    practiceWithin: z.boolean(),
    AreaZipcode: z.string().optional(),
    rangeInKm: z.any().optional(), // ← Accept any type for now, refine later
    practiceInternational: z.boolean(),
  })
  .superRefine((data, ctx) => {
    // Must select at least one option
    if (!data.practiceWithin && !data.practiceInternational) {
      ctx.addIssue({
        path: ['practiceWithin'],
        code: z.ZodIssueCode.custom,
        message: 'Please select at least one practice option.',
      });
    }

    // If practiceWithin is true, validate AreaZipcode and rangeInKm
    if (data.practiceWithin) {
      // AreaZipcode required and must match ObjectId format
      if (!data.AreaZipcode || data.AreaZipcode.trim() === '') {
        ctx.addIssue({
          path: ['AreaZipcode'],
          code: z.ZodIssueCode.custom,
          message: 'Area Zipcode is required.',
        });
      } else if (!/^[0-9a-fA-F]{24}$/.test(data.AreaZipcode)) {
        ctx.addIssue({
          path: ['AreaZipcode'],
          code: z.ZodIssueCode.custom,
          message: 'Invalid Zipcode ObjectId.',
        });
      }

      // rangeInKm required and must be valid number
      const parsedRange = Number(data.rangeInKm);
      if (
        data.rangeInKm === undefined ||
        data.rangeInKm === null ||
        data.rangeInKm === '' ||
        isNaN(parsedRange)
      ) {
        ctx.addIssue({
          path: ['rangeInKm'],
          code: z.ZodIssueCode.custom,
          message: 'Range is required.',
        });
      } else if (![1, 2, 10, 20, 50, 75, 100, 125, 150].includes(parsedRange)) {
        ctx.addIssue({
          path: ['rangeInKm'],
          code: z.ZodIssueCode.custom,
          message: 'Invalid range selection.',
        });
      }
    }
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
        message:
          'Phone number must be a valid Bangladeshi or Australian number (e.g., +8801712345678 or +61412345678)',
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
