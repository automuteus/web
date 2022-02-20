import React, { useEffect, useState } from "react";
import { GetServerSideProps } from "next";
import { getSession, signIn } from "next-auth/react";
import { useRouter } from "next/router";
import { Button, Modal } from "react-bootstrap";
import prisma from "../../lib/prisma";
import { Guild } from "@prisma/client";

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
import PremiumPerk from "../../components/premium/PremiumPerk";

export const getServerSideProps: GetServerSideProps = async (context) => {
    const userId = await getSession(context).then(
        (session: any) => session?.user?.id ?? undefined
    );

    let guilds: Guild[];
    if (userId) {
        const user = await prisma.user.findUnique({
            where: {
                id: userId,
            },
            include: {
                guilds: true,
            },
        });
        guilds = user ? user.guilds ?? [] : [];
    }

    return {
        props: { guilds },
    };
};

interface Props {
    guilds: Guild[];
}

export default function PremiumPage(props: Props) {
    const router = useRouter();
    const [guild, setGuild] = useState<string>();
    const [open, setOpen] = useState<boolean>(false);
    const { guilds } = props;

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
        <AppLayout>
            <div className="container pb-4">
                <div className="d-block d-md-flex align-items-center justify-content-between">
                    <h1>AutoMuteUs Premium</h1>
                    {guilds ? (
                        <GuildSelect
                            guilds={guilds}
                            onSelect={handleGuildSelect}
                            initial={router.query.guild}
                        />
                    ) : (
                        <button
                            onClick={() => signIn("discord")}
                            className="btn btn-sm btn-secondary"
                        >
                            Sign in to view your servers
                        </button>
                    )}
                </div>
                <div className="subtitle">
                    Looking to upgrade your Among Us gameplay even further?
                    Running into limitations with the bot while it's under high
                    load? Consider AutoMuteUs premium to support the project as
                    well as improve your muting experience!
                </div>

                <div className="row row-cols-1 row-cols-md-2 row-cols-lg-2 row-cols-xl-4 g-3 mt-4 mb-3 justify-content-center">
                    {premium_items.map((item) => {
                        return (
                            <PremiumItem
                                key={item.paypalId}
                                {...item}
                                guildId={guild}
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
];
