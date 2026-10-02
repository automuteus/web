import { ReactNode, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import styles from "./ResetPanel.module.css";
import shared from "../settings/SettingsView.module.css";

type Props = {
    title: string;
    /** What the reset does, shown before anything is pressed. */
    children: ReactNode;
    /** The button label, repeated on the final confirmation. */
    action: string;
    /** The warning shown on the confirmation step. */
    confirm: ReactNode;
    /** A word the user must type before the final button unlocks, for the resets that destroy the most. */
    typed?: string;
    /** The /api reset route, with its query. */
    url: string;
    ifMatch?: string;
    disabled?: boolean;
    /** Called with the response body and headers after the reset succeeded. */
    onReset: (body: unknown, headers: Headers) => void;
};

/** A reset behind a second, explicit step. The Go API decides who may reset; pages show this only to members
 * who can manage the server, so a 403 here means Discord no longer grants that. Remount it (with key) when the
 * server or player changes, so a half-finished confirmation never carries over to another target. */
export default function ResetPanel(props: Props) {
    const { t } = useTranslation("common");
    const [step, setStep] = useState<"idle" | "confirm" | "busy">("idle");
    const [typed, setTyped] = useState("");
    // The server's own message is shown as-is; our fallbacks are kept as keys so they follow the language.
    const [error, setError] = useState<{ server: string } | "failed" | "unreachable" | undefined>();
    const unlocked = !props.typed || typed.trim().toLowerCase() === props.typed.toLowerCase();

    async function reset() {
        if (!unlocked || step === "busy") return;
        setStep("busy");
        setError(undefined);
        try {
            const res = await fetch(props.url, {
                method: "POST",
                headers: { "Content-Type": "application/json", ...(props.ifMatch ? { "If-Match": props.ifMatch } : {}) },
                body: "{}",
                cache: "no-store",
            });
            const data: unknown = await res.json().catch(() => undefined);
            if (res.ok) {
                setStep("idle");
                setTyped("");
                props.onReset(data, res.headers);
                return;
            }
            const reply = data && typeof data === "object" ? data as { error?: unknown } : {};
            setError(typeof reply.error === "string" ? { server: reply.error } : "failed");
        } catch {
            setError("unreachable");
        }
        setStep("confirm");
    }

    const inputID = `reset-confirm-${props.action.replace(/[^a-z]+/gi, "-").toLowerCase()}`;
    return <section className={styles.panel} aria-label={props.title}>
        <div className={styles.text}>
            <h2>{props.title}</h2>
            <div className={styles.body}>{props.children}</div>
        </div>
        {step === "idle" ? <button type="button" className={`${shared.button} ${styles.danger}`} disabled={props.disabled} onClick={() => setStep("confirm")}>{t("resetPanel.open", { action: props.action })}</button> :
            <div className={styles.confirm} role="group" aria-label={t("resetPanel.confirmLabel", { action: props.action })}>
                <p className={styles.warning}><Trans t={t} i18nKey="resetPanel.warning" components={{ confirm: <>{props.confirm}</> }} /></p>
                {props.typed && <label className={styles.typed} htmlFor={inputID}><Trans t={t} i18nKey="resetPanel.typed" values={{ word: props.typed }} components={{ strong: <strong /> }} />
                    <input id={inputID} value={typed} autoComplete="off" spellCheck={false} disabled={step === "busy"} onChange={(e) => setTyped(e.target.value)} /></label>}
                {error && <p className={styles.error} role="alert">{typeof error === "object" ? error.server : error === "failed" ? t("resetPanel.error.failed") : t("resetPanel.error.unreachable")}</p>}
                <div className={styles.actions}>
                    <button type="button" className={shared.button} disabled={step === "busy"} onClick={() => { setStep("idle"); setTyped(""); setError(undefined); }}>{t("resetPanel.cancel")}</button>
                    <button type="button" className={`${shared.button} ${styles.danger}`} disabled={!unlocked || step === "busy" || props.disabled} onClick={reset}>{step === "busy" ? t("resetPanel.resetting") : props.action}</button>
                </div>
            </div>}
    </section>;
}
