import { z } from 'zod';

const bdPhoneRegex = /^(?:\+88|88)?01[3-9]\d{8}$/;
const auPhoneRegex = /^(?:\+?61|0)[2-478]\d{8}$/;

export const lawyerSettingAboutSchema = z.object({
  name: z
    .string({ invalid_type_error: 'Name must be a string' })
    .min(1, { message: 'Name is required' }),
  designation: z.string().optional(),
  phone: z
    .string({ invalid_type_error: 'phone must be a string' })
    .min(1, { message: 'Phone is required' }),
  bio: z.string({ invalid_type_error: 'Bio must be a string' }),
  lawyerContactEmail: z
    .string()
    .trim()
    .toLowerCase()
    .email('Please enter a valid email address')
    .optional()
    .or(z.literal('')),
  address: z.string({ invalid_type_error: 'Address must be a string' }),
  companyLogo: z.any().optional(),
  userProfileLogo: z.any().optional(),
  companyName: z.string().optional(),
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
      message: 'Phone number must be a valid number',
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
  companySize: z.string().default('self_employed'),
  description: z.string().optional(),
  yearsInBusiness: z
    .union([z.string(), z.number()])
    .refine((val) => !isNaN(Number(val)), {
      message: 'Years in business must be a number',
    })
    .optional(),
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
