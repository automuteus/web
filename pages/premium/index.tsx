import React, { useEffect, useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { Alert, Button, Modal, Spinner } from "react-bootstrap";
import { Guild } from "../../types/Guild";

import { faDiscord } from "@fortawesome/free-brands-svg-icons";
import {
    faDatabase,
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
import PremiumPerk from "../../components/premium/PremiumPerk";
import { GuildPremium, describePremium, parsePremium } from "../../components/premium/premium-status";
import { PremiumRecord, premiumActive } from "../../components/stats/guild-stats";

export default function PremiumPage() {
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
    const serverName = guilds?.find((g) => g.id === guild)?.name || "This server";
    const summary = record && guild ? describePremium(record, serverName) : undefined;

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
            title="AutoMuteUs - Premium"
            metaImg="https://automute.us/images/logo_premium.png"
            metaDesc="AutoMuteUs Premium allows you to bypass Discord rate limits, track stats with leaderboards, and gain access to premium Discord support channels!"
        >
            <div className="container pb-4">
                <div className="d-block d-md-flex align-items-center justify-content-between">
                    <h1>AutoMuteUs Premium</h1>
                    {status === "unauthenticated" ? (
                        <button
                            onClick={() => signIn("discord")}
                            className="btn btn-sm btn-secondary"
                        >
                            Sign in to view your servers
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
                            Loading your servers
                        </button>
                    )}
                </div>
                <div className="subtitle">
                    Looking to upgrade your Among Us gameplay even further?
                    Running into limitations with the bot while it's under high
                    load? Consider AutoMuteUs premium to support the project as
                    well as improve your muting experience!
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
                                Each purchase starts a new PayPal subscription, so buying here won't replace the
                                current one, and its remaining days don't carry over. If you're changing tiers,{" "}
                                <a href="https://cancelprem.automute.us/" target="_blank">
                                    cancel the current subscription
                                </a>{" "}
                                first.
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
                    <h6 className="text-danger">Looking to cancel?</h6>
                    <div>
                        As per the email you received on purchase, you can{" "}
                        <a
                            href="https://cancelprem.automute.us/"
                            target="_blank"
                            className="intense"
                        >
                            manage your subscriptions via PayPal.
                        </a>
                        <br />
                        If you checked out with a PayPal guest account, or
                        otherwise need help,{" "}
                        <a
                            href="https://forms.gle/pSy1GkUtQwZKdcNEA"
                            target="_blank"
                            className="intense"
                        >
                            please use this form.
                        </a>
                    </div>
                </div>

                <h2 className="text-center">Premium Perks</h2>

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
                    <Modal.Title>Server ID Pre-selected</Modal.Title>
                </Modal.Header>
                <Modal.Body className="text-center">
                    The server ID you've selected is:
                    <div
                        className="text-center p-2"
                        style={{ fontSize: "1.25rem" }}
                    >
                        <kbd className="bg-light text-dark">{guild}</kbd>
                    </div>
                    <div>
                        <strong>
                            Please confirm that this is the server you want
                            selected!
                        </strong>
                    </div>
                    <div>
                        If you'd prefer a different server, sign in and select
                        from your joined servers list.
                    </div>
                    <small>
                        <a
                            href="https://support.discord.com/hc/en-us/articles/206346498-Where-can-I-find-my-User-Server-Message-ID-"
                            target="_blank"
                        >
                            How do I find my server ID?
                        </a>
                    </small>
                </Modal.Body>
                <Modal.Footer className="align-items-center justify-content-center">
                    <Button variant="danger" onClick={closeModal}>
                        Confirm Server ID
                    </Button>
                </Modal.Footer>
            </Modal>
        </AppLayout>
    );
}

const current_perks = [
    {
        perk: "Priority Game Access",
        description:
            "Always be able to make new games, even when the bot is under high load! ",
        icon: <FontAwesomeIcon size="2x" className="mb-3" icon={faGamepad} />,
    },
    {
        perk: "Stats and Leaderboards",
        description:
            "View Among Us stats and leaderboards for the players on your server!",
        icon: <FontAwesomeIcon size="2x" className="mb-3" icon={faMedal} />,
    },
    {
        perk: "Premium Support",
        description:
            "Access to Premium-only channels and chats in our official Discord!",
        icon: <FontAwesomeIcon size="2x" className="mb-3" icon={faHeadset} />,
    },
    {
        perk: "Priority Muting Bots",
        description:
            "Issues requests alongside the main bot; this drastically improves the speed of mutes/deafens in your games",
        icon: <FontAwesomeIcon size="2x" className="mb-3" icon={faRobot} />,
    },
    {
        perk: "Premium Servers",
        description:
            "Get your premium AutoMuteUs bot status in multiple Discord servers!",
        icon: <FontAwesomeIcon size="2x" className="mb-3" icon={faDiscord} />,
    },
    {
        perk: "Download Raw Data",
        description:
            "Download the raw data stored in AutoMuteUs's database!",
        icon: <FontAwesomeIcon size="2x" className="mb-3" icon={faDatabase} />,
    },
];
