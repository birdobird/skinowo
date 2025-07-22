/**
 * Safely gets a string from a translation that might return string or string[]
 * @param translation The translation value (string | string[])
 * @param fallback Fallback string if translation is not found
 * @returns A string value
 */
export const getString = (translation: string | string[] | undefined, fallback: string = ''): string => {
  if (Array.isArray(translation)) {
    return translation[0] || fallback;
  }
  return translation || fallback;
};

/**
 * Creates a translation function that always returns a string
 * @param t The translation function
 * @returns A function that returns string
 */
export const createStringTranslator = (t: (key: string) => string | string[]) => {
  return (key: string, fallback: string = '') => {
    const result = t(key);
    return getString(result, fallback);
  };
};
