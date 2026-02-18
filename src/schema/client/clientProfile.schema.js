import { validateAndNormalizePhone } from '@/helpers/phoneValidation';
import { safeJsonParse } from '@/helpers/safeJsonParse';
import Cookies from 'js-cookie';
import { z } from 'zod';

const cookieCountry = safeJsonParse(Cookies.get('countryObj'));
const defaultCountryCode = cookieCountry?.code;
const countryName = cookieCountry?.name || 'your country';

export const clientProfileSchema = z.object({
    name: z
        .string()
        .min(2, 'Name is required and must be at least 2 characters long')
        .max(50, 'Name must be less than 50 characters'),
    phone: z
        .string()
        .min(1, 'Phone number is required')
        .refine(
            (val) => {
                if (!val) return true;
                const { ok } = validateAndNormalizePhone(val, {
                    defaultCountry: defaultCountryCode,
                });
                return ok;
            },
            {
                message: `Phone number must be a valid number for ${countryName}`,
            }
        ),
    address: z.string().min(1, 'Address is required'),
});
