import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import i18n, { uiLanguage } from "../../utils/i18n";

/** Remembers a manual choice; a future language picker writes the same key. */
const STORAGE_KEY = "uiLanguage";

/** Picks the UI language after the first render (which is always English, matching the server render): a manual
 * choice first (?lng=ja sets it, ?lng= clears it), then the Discord client language from sign-in, then English. */
export default function LanguageSync(): null {
    const { data: session } = useSession();
    const router = useRouter();
    const query = router.query.lng;
    const discord = session?.user?.locale;

    useEffect(() => {
        if (typeof query === "string") {
            if (query) localStorage.setItem(STORAGE_KEY, query);
            else localStorage.removeItem(STORAGE_KEY);
        }
        const language = uiLanguage(localStorage.getItem(STORAGE_KEY) || discord);
        if (language !== i18n.language) i18n.changeLanguage(language);
    }, [query, discord]);

    useEffect(() => {
        const update = (language: string) => { document.documentElement.lang = language; };
        update(i18n.language);
        i18n.on("languageChanged", update);
        return () => i18n.off("languageChanged", update);
    }, []);

    return null;
}
