import React, { useEffect, useState } from "react";
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
import { PremiumRecord, premiumActive } from "../../components/stats/guild-stats";

export default function PremiumPage() {
    const { t } = useTranslation("premium");
    const router = useRouter();
    const { status } = useSession();
    const [guild, setGuild] = useState<string>();
    const [open, setOpen] = useState<boolean>(false);
    // undefined = not loaded yet (or signed out); [] = signed in, nothing found
    const [guilds, setGuilds] = useState<Guild[] | undefined>();
    // The selected server's premium, keyed by server so a stale answer never shows under another one. Only
    // members can read it, so a server picked by ID the user is not in simply shows no status.
    const [premium, setPremium] = useState<{ guild: string; record: GuildPremium }>();
    const record = premium && premium.guild === guild ? premium.record : undefined;
    const active = record && premiumActive(record) ? record : undefined;
    const serverName = guilds?.find((g) => g.id === guild)?.name || t("thisServer");
    const summary = record && guild ? describePremium(record, serverName, t) : undefined;

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
        if (status !== "authenticated" || !guild || !util.validGuild(guild)) return;
        const controller = new AbortController();
        fetch(`/api/guild/premium?${new URLSearchParams({ guildID: guild })}`, { signal: controller.signal, cache: "no-store" })
            .then(async (res) => {
                if (!res.ok) return;
                const record = parsePremium(await res.json());
                if (!controller.signal.aborted) setPremium({ guild, record });
            })
            .catch(() => {});
        return () => controller.abort();
    }, [status, guild]);

    useEffect(() => {
        if (router.query.guild && util.validGuild(router.query.guild)) {
            setOpen(true);
            setGuild(router.query.guild as string);
        }
    }, [router.query.guild]);

    const handleGuildSelect = (key: any) => {
        router.push({
            query: {},
        });

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
                <div className="d-block d-md-flex align-items-center justify-content-between">
                    <h1>{t("heading")}</h1>
                    {status === "unauthenticated" ? (
                        <button
                            onClick={() => signIn("discord")}
                            className="btn btn-sm btn-secondary"
                        >
                            {t("signIn")}
                        </button>
                    ) : guilds ? (
                        <GuildSelect
                            guilds={guilds}
                            onSelect={handleGuildSelect}
                            initial={router.query.guild}
                        />
                    ) : (
                        <button className="btn btn-sm btn-secondary" disabled>
                            <Spinner
                                animation="border"
                                size="sm"
                                className="me-2"
                            />
                            {t("loadingServers")}
                        </button>
                    )}
                </div>
                <div className="subtitle">
                    {t("subtitle")}
                </div>

                {summary && (
                    <Alert
                        variant="transparent"
                        className={`mt-3 mb-0 ${summary.kind === "active" ? "text-success" : summary.kind === "ending" ? "text-warning" : "text-light"}`}
                        style={{ background: "var(--dark)" }}
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

                <div className="row row-cols-1 row-cols-md-2 row-cols-lg-2 row-cols-xl-4 g-3 mt-4 mb-3 justify-content-center">
                    {premium_items.map((item) => {
                        return (
                            <PremiumItem
                                key={item.paypalId}
                                {...item}
                                guildId={guild}
                                current={!!active && item.tier === active.tier}
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
    { perk: "servers", icon: <FontAwesomeIcon size="2x" className="mb-3" icon={faDiscord} /> },
];
