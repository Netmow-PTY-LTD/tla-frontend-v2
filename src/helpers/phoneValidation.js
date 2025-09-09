// utils/phone.js
import { parsePhoneNumberFromString } from 'libphonenumber-js';

const DEFAULT_ALLOWED = [
  'AU',
  'GB',
  'US',
  'CA',
  'IR',
  'ZA',
  'NZ',
  'SG',
  'FR',
  'DE',
];

/**
 * Validate & normalize a phone number to E.164.
 * @param {string} rawInput - User-entered phone number
 * @param {object} options - Optional config
 * @param {string} [options.defaultCountry] - Fallback country if no + prefix
 * @param {string[]} [options.allowed] - List of allowed country codes (ISO-2)
 * @returns {object} { ok, e164?, country?, error? }
 */
export function validateAndNormalizePhone(rawInput, options = {}) {
  console.log('options', options);
  const defaultCountry = options?.defaultCountry;
  const input = (rawInput || '').trim();
  const allowed = ([defaultCountry] || DEFAULT_ALLOWED).filter(
    (v, i, a) => a.indexOf(v) === i
  );

  if (!input) return { ok: false, error: 'Phone is required' };

  // 1. Try parsing if it starts with "+"
  if (input.startsWith('+')) {
    const phone = parsePhoneNumberFromString(input);
    if (phone?.isValid()) {
      if (allowed.includes(phone.country)) {
        return { ok: true, e164: phone.number, country: phone.country };
      }
      return { ok: false, error: 'Country not allowed' };
    }
    return { ok: false, error: 'Invalid phone number' };
  }

  // 2. Try default country
  if (options.defaultCountry) {
    const phone = parsePhoneNumberFromString(input, options.defaultCountry);
    if (phone?.isValid()) {
      if (allowed.includes(phone.country)) {
        return { ok: true, e164: phone.number, country: phone.country };
      }
      return { ok: false, error: 'Country not allowed' };
    }
  }

  // 3. Try all allowed countries
  for (const country of allowed) {
    const phone = parsePhoneNumberFromString(input, country);
    if (phone?.isValid()) {
      return { ok: true, e164: phone.number, country: phone.country };
    }
  }

  return { ok: false, error: 'Invalid phone number' };
}
