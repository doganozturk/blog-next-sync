import { format } from "date-fns";
import { tr, enUS } from "date-fns/locale";

export enum Locale {
  tr = "tr",
  en = "en",
}

export const formatDate = (date: string, locale: Locale = Locale.en) => {
  const localeConfig = locale === Locale.tr ? tr : enUS;
  const pattern = locale === Locale.tr ? "d MMMM yyyy" : "MMMM d, yyyy";
  return format(new Date(date), pattern, { locale: localeConfig });
};
