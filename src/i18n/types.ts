export interface Locale {
  code: string;
  name: string;
  rtl?: boolean;
}

export const locales: Locale[] = [
  { code: 'en', name: 'English', rtl: false },
  { code: 'zh', name: '中文', rtl: false },
  { code: 'ar', name: 'العربية', rtl: true },
] as const;

export type LocaleCode = (typeof locales)[number]['code'];
