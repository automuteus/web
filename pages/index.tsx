import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDiscord } from "@fortawesome/free-brands-svg-icons";
import { faCamera, faCrown } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { useTranslation } from "react-i18next";

import AppLayout from "../components/layout/AppLayout";
import ServerStat from "../components/index/ServerStat";
import { ServerStats } from "../types/ServerStats";
import { popupCenter } from "../utils/functions";

import crewmate from "../public/images/svg/amus_crewmate_robo.svg";

const STATS_REFRESH_MS = 10_000;

export default function Home(): React.ReactElement {
    const { t } = useTranslation("home");
    // Fetched in the browser rather than at build time so the numbers are
    // always current and keep updating while the page is open.
    const [live, setLive] = useState<ServerStats | undefined>();

    useEffect(() => {
        let cancelled = false;
        const load = () =>
            fetch("/api/stats")
                .then((res) => (res.ok ? res.json() : undefined))
                .then((s: ServerStats | undefined) => {
                    if (!cancelled && s) setLive(s);
                })
                .catch(() => {});

        load();
        const timer = setInterval(load, STATS_REFRESH_MS);
        return () => {
            cancelled = true;
            clearInterval(timer);
        };
    }, []);

    const stats = [
        {
            stat: live?.totalGuilds,
            id: "Servers",
            base: 0,
            label: t("stats.servers"),
            format: "0a",
        },
        {
            stat: live?.activeGames,
            id: "Active Games",
            base: 0,
            label: t("stats.activeGames"),
            format: "0",
        },
        {
            stat: live?.totalUsers,
            id: "Users",
            base: 0,
            label: t("stats.users"),
            format: "0a",
        },
        {
            stat: live?.totalGames,
            id: "Games Muted",
            base: 262000,
            label: t("stats.gamesMuted"),
            format: "0.00a",
        },
    ];

    return (
        <AppLayout theatric>
            <div className="d-flex flex-md-row flex-column flex-grow-1 justify-content-between align-items-center">
                <div className="p-4">
                    <h1>{t("heading")}</h1>
                    <div className="subtitle mb-3">
                        {t("subtitle")}
                    </div>

                    <div id="home-links">
                        <button
                            onClick={() =>
                                popupCenter({
                                    url: "https://add.automute.us/",
                                    title: "Add AutoMuteUs",
                                    w: 400,
                                    h: 600,
                                })
                            }
                            className="btn btn-primary btn-lg mb-2 me-2 px-2 px-lg-5"
                        >
                            <FontAwesomeIcon
                                icon={faDiscord}
                                size="lg"
                                className="me-2"
                            />
                            {t("actions.addToDiscord")}
                        </button>
                        <a
                            href="https://github.com/automuteus/capture-install#readme"
                            className="btn btn-primary btn-lg mb-2 me-2 px-2 px-lg-5"
                        >
                            <FontAwesomeIcon
                                icon={faCamera}
                                size="lg"
                                className="me-2"
                            />
                            {t("actions.capture")}
                        </a>

                        <Link href="/premium">
                            <button className="btn btn-premium btn-lg mb-2 me-2 px-2 px-lg-5">
                                <FontAwesomeIcon
                                    icon={faCrown}
                                    size="lg"
                                    className="me-2"
                                />
                                {t("actions.premium")}
                            </button>
                        </Link>
                    </div>

                    <div id="home-stats">
                        {stats.map((v) => (
                            <ServerStat key={v.id} {...v} />
                        ))}
                    </div>
                </div>

                <div id="home-crewmate">
                    <object
                        id="crewmate"
                        type="image/svg+xml"
                        data={crewmate.src}
                        className="floating"
                        aria-label={t("crewmateLabel")}
                    />
                </div>
            </div>
        </AppLayout>
    );
}
