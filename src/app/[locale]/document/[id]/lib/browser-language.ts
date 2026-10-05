// Reader's own language when there's no explicit preference to go by.
export const getBrowserLanguage = (): string => {
  if (typeof navigator === "undefined" || !navigator.language) return "es";
  return navigator.language.split("-")[0].toLowerCase();
};
