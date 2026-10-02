import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import resourcesToBackend from "i18next-resources-to-backend";
import { LANGUAGES } from "../components/settings/settings-edit";
import common from "../locales/en/common.json";
import home from "../locales/en/home.json";
import commands from "../locales/en/commands.json";
import premium from "../locales/en/premium.json";
import settings from "../locales/en/settings.json";
import stats from "../locales/en/stats.json";

/** The UI ships the same translations as the bot, so a language the bot speaks is one the site may speak. Crowdin
 * writes locales/<code>/<namespace>.json; a language whose files haven't arrived yet falls back to English. */
export const SUPPORTED = LANGUAGES.map((language) => language.code);
export const FALLBACK = "en";

/** A language for the UI from a Discord locale ("ja", "pt-BR", "zh-TW") or a manual choice. The region is kept
 * when the base language is supported, so dates and numbers still follow it; anything else is English. */
export function uiLanguage(locale: unknown): string {
    if (typeof locale !== "string" || !locale) return FALLBACK;
    const base = locale.split("-")[0].toLowerCase();
    return SUPPORTED.includes(base) ? locale : FALLBACK;
}

// English is bundled so the first render (and the server render) never waits on a request; other languages load
// on demand. Init is synchronous, which also lets the node tests render components without a provider.
i18n.use(initReactI18next)
    .use(resourcesToBackend((language: string, namespace: string) => import(`../locales/${language}/${namespace}.json`)))
    .init({
        lng: FALLBACK,
        fallbackLng: FALLBACK,
        supportedLngs: SUPPORTED,
        nonExplicitSupportedLngs: true,
        load: "languageOnly",
        ns: ["common", "home", "commands", "premium", "settings", "stats"],
        defaultNS: "stats",
        resources: { en: { common, home, commands, premium, settings, stats } },
        partialBundledLanguages: true,
        initAsync: false,
        // React escapes text already.
        interpolation: { escapeValue: false },
        react: { useSuspense: false },
    });

export default i18n;
