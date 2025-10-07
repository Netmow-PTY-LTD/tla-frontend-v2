import { z } from 'zod';
import { validateAndNormalizePhone } from '@/helpers/phoneValidation';
import { safeJsonParse } from '@/helpers/safeJsonParse';
import Cookies from 'js-cookie';

// Get country from cookie
const cookieCountry = safeJsonParse(Cookies.get('countryObj'));
const defaultCountry = cookieCountry?.code; //


//  previoust schema for about section
// export const lawyerSettingAboutSchema = z.object({
//   name: z
//     .string({ invalid_type_error: 'Name must be a string' })
//     .min(1, { message: 'is required' }),
//   designation: z.string().optional(),
//   languages: z.array(z.string()).min(1, 'Please select at least one language'),
//   phone: z
//     .string({ invalid_type_error: 'phone must be a string' })
//     .min(1, { message: 'is required' }),
//   bio: z.string({ invalid_type_error: 'Bio must be a string' }),
//   gender: z.enum(['male', 'female', 'other'], {
//     required_error: 'is required',
//   }),
//   law_society_member_number: z.string().min(1, ' * required'),
//   practising_certificate_number: z.string().min(1, '* required'),
//   lawyerContactEmail: z
//     .string()
//     .trim()
//     .toLowerCase()
//     .email('Please enter a valid email address')
//     .optional()
//     .or(z.literal('')),
//   address: z.string({ invalid_type_error: 'Address must be a string' }),
//   companyLogo: z.any().optional(),
//   userProfileLogo: z.any().optional(),
//   companyName: z.string().optional(),
//   contactEmail: z
//     .string()
//     .trim()
//     .toLowerCase()
//     .email('Please enter a valid email address')
//     .optional()
//     .or(z.literal('')),
//   phoneNumber: z
//     .string()
//     .trim()
//     .refine(
//       (val) => {
//         if (!val) return true; // allow empty
//         const { ok } = validateAndNormalizePhone(val, { defaultCountry });
//         return ok;
//       },
//       {
//         message: `Phone number must be a valid number for ${cookieCountry?.name}`,
//       }
//     )
//     .or(z.literal(''))
//     .optional(),

//   website: z
//     .union([
//       z.string().url('Please enter valid website url'),
//       z.literal(''),
//       z.undefined(),
//     ])
//     .optional(),
//   companySize: z.string().default('self_employed'),
//   description: z.string().optional(),
//   yearsInBusiness: z
//     .union([z.string(), z.number()])
//     .refine((val) => !isNaN(Number(val)), {
//       message: 'Years in business must be a number',
//     })
//     .optional(),
//   location: z.object({
//     address: z.string().optional(),
//     hideFromProfile: z.boolean(),
//     locationReason: z.string().optional(),
//     // coordinates: z
//     //   .object({
//     //     lat: z.number({ invalid_type_error: 'Latitude must be a number' }),
//     //     lng: z.number({ invalid_type_error: 'Longitude must be a number' }),
//     //   })
//     //   .optional(),
//   }),
// });


export const lawyerSettingAboutSchema = z.object({
  name: z
    .string({ invalid_type_error: 'Name must be a string' })
    .min(1, { message: 'is required' }),

  designation: z.string().optional(),

  languages: z
    .array(z.string())
    .min(1, 'Please select at least one language'),

  phone: z
    .string({ invalid_type_error: 'Phone must be a string' })
    .min(1, { message: 'is required' }),

  bio: z.string({ invalid_type_error: 'Bio must be a string' }),

  gender: z.enum(['male', 'female', 'other'], {
    required_error: 'is required',
  }),

  law_society_member_number: z.string().min(1, ' * required'),

  practising_certificate_number: z.string().min(1, '* required'),

  lawyerContactEmail: z
    .string()
    .trim()
    .toLowerCase()
    .email('Please enter a valid email address')
    .optional()
    .or(z.literal('')),

  address: z.string({ invalid_type_error: 'Address must be a string' }),

  userProfileLogo: z.any().optional(),

  // location: z.object({
  //   address: z.string().optional(),
  //   hideFromProfile: z.boolean(),
  //   locationReason: z.string().optional(),
  // }),
});






export const videoUrlRegex = new RegExp(
  [
    // YouTube (watch, short, embed, youtu.be)
    '(https?:\\/\\/)?(www\\.)?(youtube\\.com\\/watch\\?v=|youtube\\.com\\/shorts\\/|youtube\\.com\\/embed\\/|youtu\\.be\\/)[\\w-]{11}',
    // Vimeo
    '(https?:\\/\\/)?(www\\.)?vimeo\\.com\\/\\d+',
    // Dailymotion
    '(https?:\\/\\/)?(www\\.)?dailymotion\\.com\\/video\\/\\w+',
    // Facebook (watch, video, story.php, video.php)
    '(https?:\\/\\/)?(www\\.)?facebook\\.com\\/(watch\\/\\?v=\\d+|story\\.php\\?story_fbid=\\d+|video\\.php\\?v=\\d+|.+\\/videos\\/\\d+)',
    // TikTok
    '(https?:\\/\\/)?(www\\.)?tiktok\\.com\\/@[\\w.-]+\\/video\\/\\d+',
    // Instagram (Reels/TV)
    '(https?:\\/\\/)?(www\\.)?instagram\\.com\\/(reel|tv)\\/[^/]+',
    // Twitch
    '(https?:\\/\\/)?(www\\.)?twitch\\.tv\\/videos\\/\\d+',
    // Loom
    '(https?:\\/\\/)?(www\\.)?loom\\.com\\/share\\/[^/]+',
    // Wistia
    '(https?:\\/\\/)?(fast\\.)?wistia\\.(com|net)\\/medias\\/[^/]+',
  ].join('|'),
  'i'
);

const ACCEPTED_FILE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'application/pdf',
];

const fileSchema = z
  .instanceof(File)
  .refine((file) => ACCEPTED_FILE_TYPES.includes(file.type), {
    message: 'Only .jpg, .jpeg, .png or .pdf files are allowed',
  });

export const lawyerSettingsMediaFormSchema = z.object({
  videos: z
    .array(
      z.object({
        url: z.string().regex(videoUrlRegex, {
          message: 'Please enter a valid video URL(YouTube, Vimeo, etc.)',
        }),
      })
    )
    .optional(),
  // photos: z.array(fileSchema),
  photos: z.any(),
});
