import React, { useCallback, useEffect, useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { Trans, useTranslation } from "react-i18next";
import { Alert, Button, Modal, Spinner } from "react-bootstrap";
import { Guild } from "../../types/Guild";

import { faDiscord } from "@fortawesome/free-brands-svg-icons";
import {
    faGamepad,
    faHeadset,
    faMedal,
    faRobot,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import * as util from "../../utils/functions";
import AppLayout from "../../components/layout/AppLayout";
import GuildSelect from "../../components/premium/GuildSelect";
import PremiumItem from "../../components/premium/PremiumItem";
import { premium_items } from "../../data/premium_items";
import PremiumPerk, { PerkId } from "../../components/premium/PremiumPerk";
import { GuildPremium, describePremium, parsePremium } from "../../components/premium/premium-status";
import {
    Checkout,
    POLL_EVERY,
    POLL_FOR,
    checkoutChannel,
    fingerprint,
    isCheckoutReport,
    loadCheckout,
    paymentApplied,
    saveCheckout,
} from "../../components/premium/checkout";
import { PremiumRecord, premiumActive } from "../../components/stats/guild-stats";

export default function PremiumPage() {
    const { t } = useTranslation("premium");
    const router = useRouter();
    const { data: session, status } = useSession();
    const [guild, setGuild] = useState<string>();
    const [open, setOpen] = useState<boolean>(false);
    // undefined = not loaded yet (or signed out); [] = signed in, nothing found
    const [guilds, setGuilds] = useState<Guild[] | undefined>();
    // The selected server's premium, keyed by server so a stale answer never shows under another one. Only
    // members can read it, so a server picked by ID the user is not in simply shows no status.
    const [premium, setPremium] = useState<{ guild: string; record: GuildPremium }>();
    // Bumped to fetch the selected server's premium again: on each poll while a checkout is pending, and whenever the
    // window regains focus, since the buyer has usually just closed PayPal.
    const [refresh, setRefresh] = useState(0);
    // The purchase being watched, if any; see components/premium/checkout.ts.
    const [checkout, setCheckout] = useState<Checkout>();
    // The buyer backed out at PayPal, which sent them back with cancelled=1.
    const [cancelled, setCancelled] = useState(false);
    const record = premium && premium.guild === guild ? premium.record : undefined;
    const active = record && premiumActive(record) ? record : undefined;
    const serverName = guilds?.find((g) => g.id === guild)?.name || t("thisServer");
    const summary = record && guild ? describePremium(record, serverName, t) : undefined;
    const signedIn = status === "authenticated";

    const updateCheckout = useCallback((next: Checkout | undefined) => {
        setCheckout(next);
        saveCheckout(next);
    }, []);

    // The buyer is back from PayPal (the popup said so, or the tab itself returned with ?paid=1 or ?returned=1): show
    // the paid-for server and start waiting for its premium to change. The record from before the purchase is the one
    // taken at departure, kept in sessionStorage in case this is a fresh page load.
    const returned = useCallback((paidGuild: string, outcome: "paid" | "unknown") => {
        setGuild(paidGuild);
        setCheckout((current) => {
            const base = current && current.guild === paidGuild ? current : loadCheckout(paidGuild) ?? { guild: paidGuild };
            const next: Checkout = { ...base, since: Date.now(), returned: outcome, done: undefined };
            saveCheckout(next);
            return next;
        });
    }, []);

    useEffect(() => {
        if (status !== "authenticated") {
            setGuilds(undefined);
            return;
        }

        let cancelled = false;
        fetch("/api/guilds")
            .then((res) => (res.ok ? res.json() : []))
            .catch(() => [])
            .then((g: Guild[]) => {
                if (!cancelled) setGuilds(g);
            });
        return () => {
            cancelled = true;
        };
    }, [status]);

    useEffect(() => {
        if (!signedIn || !guild || !util.validGuild(guild)) return;
        const controller = new AbortController();
        fetch(`/api/guild/premium?${new URLSearchParams({ guildID: guild })}`, { signal: controller.signal, cache: "no-store" })
            .then(async (res) => {
                if (!res.ok) return;
                const record = parsePremium(await res.json());
                if (!controller.signal.aborted) setPremium({ guild, record });
            })
            .catch(() => {});
        return () => controller.abort();
    }, [signedIn, guild, refresh]);

    useEffect(() => {
        const onFocus = () => setRefresh((n) => n + 1);
        window.addEventListener("focus", onFocus);
        return () => window.removeEventListener("focus", onFocus);
    }, []);

    // While a purchase is pending, poll for its server's premium (from departure, so a buyer who closes PayPal's
    // receipt without coming back still sees the result) and give up a while after the buyer's return. The wait ends
    // with a warning only when PayPal said the buyer paid; one who never came back, or came back without PayPal
    // saying how, most likely never paid, so that wait ends quietly.
    useEffect(() => {
        if (!signedIn || !checkout || checkout.done) return;
        const id = setInterval(() => {
            if (Date.now() - checkout.since > POLL_FOR) updateCheckout(checkout.returned === "paid" ? { ...checkout, done: "timeout" } : undefined);
            else setRefresh((n) => n + 1);
        }, POLL_EVERY);
        return () => clearInterval(id);
    }, [signedIn, checkout, updateCheckout]);

    useEffect(() => {
        if (!checkout || checkout.done || !premium || premium.guild !== checkout.guild) return;
        if (paymentApplied(checkout, premium.record, premiumActive(premium.record))) {
            updateCheckout({ ...checkout, done: "confirmed" });
        }
    }, [checkout, premium, updateCheckout]);

    useEffect(() => {
        if (!router.isReady) return;
        if (router.query.cancelled === "1") {
            // Nothing was bought, so nothing is waited for; the server, if known, is kept selected for another go.
            const saved = loadCheckout();
            updateCheckout(undefined);
            setCancelled(true);
            const target = router.query.guild && util.validGuild(router.query.guild) ? (router.query.guild as string) : saved?.guild;
            if (target) setGuild(target);
            return;
        }
        if (router.query.guild && util.validGuild(router.query.guild)) {
            if (router.query.paid === "1") {
                returned(router.query.guild as string, "paid");
            } else if (router.query.returned === "1") {
                returned(router.query.guild as string, "unknown");
            } else {
                setOpen(true);
                setGuild(router.query.guild as string);
            }
            return;
        }
        // Back on the page without PayPal sending them: its receipt page often waits for a "Return to Merchant" click,
        // and many just come back by hand instead. A checkout this tab started is picked up as a return PayPal said
        // nothing about, so the page says what it is waiting for and shows the payment when it lands.
        const saved = loadCheckout();
        if (saved) {
            setCheckout((current) => current ?? { ...saved, returned: saved.returned ?? "unknown", since: Date.now() });
            setGuild((current) => current ?? saved.guild);
        }
    }, [router.isReady, router.query.guild, router.query.paid, router.query.returned, router.query.cancelled, returned, updateCheckout]);

    // Remembers the server's premium as the buyer leaves, so its change is what confirms the payment.
    const handleCheckout = (target: string, tab: boolean) => {
        const before = premium && premium.guild === target ? fingerprint(premium.record) : undefined;
        setCancelled(false);
        updateCheckout({ guild: target, before, since: Date.now(), tab });
    };

    // The return page, in PayPal's tab, reports how the checkout went; this page is the one still in view.
    useEffect(() => {
        const channel = checkoutChannel();
        if (!channel) return;
        channel.onmessage = (event: MessageEvent) => {
            if (!isCheckoutReport(event.data)) return;
            const target = event.data.guild ?? checkout?.guild;
            if (!target) return;
            if (event.data.outcome === "cancelled") {
                updateCheckout(undefined);
                setCancelled(true);
                setGuild((current) => current ?? target);
                return;
            }
            returned(target, event.data.outcome);
        };
        return () => channel.close();
    }, [checkout?.guild, returned, updateCheckout]);

    const pendingText = () => {
        if (status === "unauthenticated") return t("checkout.pendingSignedOut", { server: serverName });
        if (checkout?.returned === "unknown") return t("checkout.pendingUnknown", { server: serverName });
        return t("checkout.pending", { server: serverName });
    };
    // While PayPal has a tab of its own, this page says so and keeps watching; its page often offers no way back.
    const checkoutNote = checkout && checkout.guild === guild && (checkout.returned || checkout.done || checkout.tab)
        ? checkout.done === "confirmed"
            ? { kind: "confirmed", message: t("checkout.confirmed", { server: serverName }) }
            : checkout.done === "timeout"
                ? { kind: "timeout" }
                : { kind: "pending", message: checkout.returned ? pendingText() : t("checkout.inProgress", { server: serverName }) }
        : cancelled
            ? { kind: "cancelled", message: t("checkout.cancelled") }
            : undefined;

    const handleGuildSelect = (key: string) => {
        router.push({
            query: {},
        });

        // A finished checkout's note is for the server it was about; a new choice starts clean.
        if (checkout?.done) updateCheckout(undefined);
        setCancelled(false);
        setGuild(key);
    };

    const closeModal = () => setOpen(false);

    return (
        <AppLayout
            title={t("meta.title")}
            metaImg="https://automute.us/images/logo_premium.png"
            metaDesc={t("meta.description")}
        >
            <div className="container pb-4">
                <h1>{t("heading")}</h1>
                <div className="subtitle">
                    {t("subtitle")}
                </div>

                {/* Premium is bought per server, so choosing one comes before the plans, where a browsing visitor
                    sees it rather than finding the buttons disabled. */}
                <div className="premium-server-picker mt-4">
                    <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3">
                        <div>
                            <h2 className="h5 mb-1">{t("picker.heading")}</h2>
                            <div className="text-light small mb-0">{t("picker.help")}</div>
                        </div>
                        {status === "unauthenticated" ? (
                            <button
                                onClick={() => signIn("discord")}
                                className="btn btn-premium btn-lg flex-shrink-0"
                            >
                                <FontAwesomeIcon icon={faDiscord} className="me-2" />
                                {t("signIn")}
                            </button>
                        ) : guilds ? (
                            <GuildSelect
                                guilds={guilds}
                                onSelect={handleGuildSelect}
                                selected={guild}
                                size="lg"
                            />
                        ) : (
                            <button className="btn btn-lg btn-secondary flex-shrink-0" disabled>
                                <Spinner
                                    animation="border"
                                    size="sm"
                                    className="me-2"
                                />
                                {t("loadingServers")}
                            </button>
                        )}
                    </div>
                    {signedIn && guilds && guilds.length > 0 && !guild && (
                        <div className="text-warning mt-3">{t("picker.none")}</div>
                    )}

                    {checkoutNote && (
                        <Alert
                            variant="transparent"
                            className={`mt-3 mb-0 ${checkoutNote.kind === "confirmed" ? "text-success" : checkoutNote.kind === "cancelled" ? "text-light" : "text-warning"}`}
                            style={{ background: "var(--darkest)" }}
                        >
                            {checkoutNote.kind === "pending" && <Spinner animation="border" size="sm" className="me-2" />}
                            {checkoutNote.kind === "timeout" ? (
                                <Trans
                                    t={t}
                                    i18nKey="checkout.slow"
                                    values={{ server: serverName }}
                                    components={{ form: <a href="https://forms.gle/pSy1GkUtQwZKdcNEA" target="_blank" className="intense" /> }}
                                />
                            ) : (
                                checkoutNote.message
                            )}
                        </Alert>
                    )}

                    {/* While a payment is being confirmed, the summary would only contradict the note above it. */}
                    {summary && checkoutNote?.kind !== "pending" && (
                        <Alert
                            variant="transparent"
                            className={`mt-3 mb-0 ${summary.kind === "active" ? "text-success" : summary.kind === "ending" ? "text-warning" : "text-light"}`}
                            style={{ background: "var(--darkest)" }}
                        >
                            <div>{summary.message}</div>
                            {active && (
                                <div className="text-warning mt-2">
                                    <Trans
                                        t={t}
                                        i18nKey="status.changingTiers"
                                        components={{ cancel: <a href="https://cancelprem.automute.us/" target="_blank" /> }}
                                    />
                                </div>
                            )}
                        </Alert>
                    )}
                </div>

                <div className="row row-cols-1 row-cols-md-3 g-3 mt-3 mb-3 justify-content-center">
                    {premium_items.map((item) => {
                        return (
                            <PremiumItem
                                key={item.paypalId}
                                {...item}
                                guildId={guild}
                                userId={session?.user?.id}
                                current={!!active && item.tier === active.tier}
                                onCheckout={handleCheckout}
                            />
                        );
                    })}
                </div>

                <div className="cancel-notice text-center">
                    <h6 className="text-danger">{t("cancel.heading")}</h6>
                    <div>
                        <Trans
                            t={t}
                            i18nKey="cancel.body"
                            components={{
                                manage: <a href="https://cancelprem.automute.us/" target="_blank" className="intense" />,
                                br: <br />,
                                form: <a href="https://forms.gle/pSy1GkUtQwZKdcNEA" target="_blank" className="intense" />,
                            }}
                        />
                    </div>
                </div>

                <h2 className="text-center">{t("perksHeading")}</h2>

                <div className="d-flex flex-row premium-perks">
                    {current_perks.map((perk) => {
                        return <PremiumPerk key={perk.perk} {...perk} />;
                    })}
                </div>
            </div>

            <Modal
                show={open}
                onHide={closeModal}
                backdrop="static"
                centered
                keyboard={false}
            >
                <Modal.Header className="bg-danger align-items-center justify-content-center">
                    <Modal.Title>{t("modal.title")}</Modal.Title>
                </Modal.Header>
                <Modal.Body className="text-center">
                    {t("modal.selected")}
                    <div
                        className="text-center p-2"
                        style={{ fontSize: "1.25rem" }}
                    >
                        <kbd className="bg-light text-dark">{guild}</kbd>
                    </div>
                    <div>
                        <strong>{t("modal.confirmPrompt")}</strong>
                    </div>
                    <div>
                        {t("modal.different")}
                    </div>
                    <small>
                        <a
                            href="https://support.discord.com/hc/en-us/articles/206346498-Where-can-I-find-my-User-Server-Message-ID-"
                            target="_blank"
                        >
                            {t("modal.findId")}
                        </a>
                    </small>
                </Modal.Body>
                <Modal.Footer className="align-items-center justify-content-center">
                    <Button variant="danger" onClick={closeModal}>
                        {t("modal.confirm")}
                    </Button>
                </Modal.Footer>
            </Modal>
        </AppLayout>
    );
}

// The perk cards in order; PremiumPerk looks up each one's text.
const current_perks: Array<{ perk: PerkId; icon: React.ReactNode }> = [
    { perk: "gameAccess", icon: <FontAwesomeIcon size="2x" className="mb-3" icon={faGamepad} /> },
    { perk: "stats", icon: <FontAwesomeIcon size="2x" className="mb-3" icon={faMedal} /> },
    { perk: "support", icon: <FontAwesomeIcon size="2x" className="mb-3" icon={faHeadset} /> },
    { perk: "mutingBots", icon: <FontAwesomeIcon size="2x" className="mb-3" icon={faRobot} /> },
];
