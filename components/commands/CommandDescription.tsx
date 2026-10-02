import { Children, ReactNode } from "react";
import { Trans, useTranslation } from "react-i18next";

/** Each piece of the sentence in its own <span>, as the page has always rendered descriptions. */
function SpanEach({ children }: { children?: ReactNode }) {
    return <>{Children.map(children, (child) => <span>{child}</span>)}</>;
}

/** A command or argument description from data/commands.tsx: `i18nKey` is under `command.` in the commands namespace. */
export default function CommandDescription({ i18nKey }: { i18nKey: string }) {
    const { t } = useTranslation("commands");
    return (
        <Trans
            t={t}
            i18nKey={i18nKey}
            parent={SpanEach}
            components={{ settingsLink: <a href="/settings" />, statsLink: <a href="/stats" /> }}
        />
    );
}
