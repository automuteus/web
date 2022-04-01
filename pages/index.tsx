import React, { useEffect } from "react";
import { GetStaticProps } from "next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDiscord } from "@fortawesome/free-brands-svg-icons";
import { faCamera, faCrown } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";

import AppLayout from "../components/layout/AppLayout";
import ServerStat from "../components/index/ServerStat";
import { ServerStats } from "../types/ServerStats";
import { popupCenter } from "../utils/functions";

import crewmate from "../public/images/svg/amus_crewmate_robo.svg";

export const getStaticProps: GetStaticProps = async () => {
    const route = "https://galactus.automute.us/";
    const stats = await fetch(route).then((res) => res.json());
    return {
        props: { stats },
        revalidate: 10,
    };
};

type Props = {
    stats: ServerStats;
};

export default function Home(props: Props): React.ReactElement {
    const stats = [
        {
            stat: props.stats.totalGuilds,
            base: 0,
            label: "Servers",
            format: "0a",
        },
        {
            stat: props.stats.activeGames,
            base: 0,
            label: "Active Games",
            format: "0",
        },
        {
            stat: props.stats.totalUsers,
            base: 0,
            label: "Users",
            format: "0a",
        },
        {
            stat: props.stats.totalGames,
            base: 262000,
            label: "Games Muted",
            format: "0.00a",
        },
    ];

    return (
        <AppLayout theatric>
            <div className="d-flex flex-md-row flex-column flex-grow-1 justify-content-between align-items-center">
                <div className="p-4">
                    <h1>Use AutoMuteUs for hands free muting</h1>
                    <div className="subtitle mb-3">
                        AutoMuteUs is a Discord Bot that collects Among Us game
                        data to automatically mute/unmute players during games!
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
                            Add to Discord
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
                            Capture Software
                        </a>

                        <Link href="/premium">
                            <button className="btn btn-premium btn-lg mb-2 me-2 px-2 px-lg-5">
                                <FontAwesomeIcon
                                    icon={faCrown}
                                    size="lg"
                                    className="me-2"
                                />
                                AutoMuteUs Premium
                            </button>
                        </Link>
                    </div>

                    <div id="home-stats">
                        {stats.map((v) => (
                            <ServerStat key={v.label} {...v} />
                        ))}
                    </div>
                </div>

                <div id="home-crewmate">
                    <object
                        id="crewmate"
                        type="image/svg+xml"
                        data={crewmate.src}
                        className="floating"
                        aria-label="AutoMuteUs"
                    />
                </div>
            </div>
        </AppLayout>
    );
}
