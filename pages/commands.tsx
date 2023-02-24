import { v4 as uuid } from "uuid";
import { Alert, Badge, Nav } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import * as data from "../data/commands";

import { faCode, faCrown } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import AppLayout from "../components/layout/AppLayout";
import CommandEntry from "../components/commands/CommandEntry";
import { Command } from "../types/client/Command";

export const premium_icon = (
    <FontAwesomeIcon
        icon={faCrown}
        className="text-white bg-premium mx-1"
        style={{
            verticalAlign: "text-bottom",
            borderRadius: "50%",
            fontSize: ".65rem",
            padding: "0.35rem",
        }}
    />
);

export default function CommandsPage() {
    const commands = data.commands as Array<Command>;
    const settings = data.settings as Array<Command>;
    const premiumSettings = data.premiumSettings as Array<Command>;

    const settingsSorted = [...settings, ...premiumSettings]
        .sort((a, b) => (a.command > b.command ? 1 : -1))
        .filter((cmd) => !cmd.isDisabled);

    const commandsSorted = commands
        .sort((a, b) => (a.command > b.command ? 1 : -1))
        .filter((cmd) => !cmd.isDisabled);

    const [hashRoute, setHashRoute] = useState<string>(
        typeof window !== "undefined"
            ? window.location.hash.replace("#", "")
            : ""
    );

    return (
        <AppLayout
            title="AutoMuteUs - Commands"
            metaDesc="View all the available commands in the AutoMuteUs Discord muting bot."
        >
            <div className={`container pb-4 commandsPage`}>
                <div className="d-block d-md-flex align-items-center justify-content-between">
                    <h1>Commands</h1>
                    <span className="entryLabelSubcommands">
                        Current as of v7.0.4
                    </span>
                </div>

                <div className="row">
                    <div
                        className={`col-12 col-md-auto d-none d-lg-flex fixedCol`}
                    >
                        <div className="sidebar">
                            <div className="sticky-top">
                                <div className="sidebarBox">
                                    <Nav
                                        variant="pills"
                                        className="flex-column"
                                    >
                                        <Nav.Item>
                                            <h5>General Commands</h5>
                                        </Nav.Item>
                                        {commandsSorted.map((cmd) => (
                                            <Nav.Item
                                                key={`general-${cmd.command}`}
                                                className="commandMenu"
                                            >
                                                <Nav.Link
                                                    href={`#${cmd.command}`}
                                                    onSelect={() =>
                                                        setHashRoute(
                                                            cmd.command
                                                        )
                                                    }
                                                >
                                                    {cmd.isPremium && (
                                                        <>{premium_icon}</>
                                                    )}{" "}
                                                    <span
                                                        style={{
                                                            fontFamily:
                                                                "monospace",
                                                        }}
                                                    >
                                                        {cmd.command}
                                                    </span>
                                                </Nav.Link>
                                            </Nav.Item>
                                        ))}
                                        <Nav.Item>
                                            <h5 className="mt-3">Settings</h5>
                                        </Nav.Item>
                                        {settingsSorted.map((cmd) => (
                                            <Nav.Item
                                                key={`setting-${cmd.command}`}
                                                className="commandMenu"
                                            >
                                                <Nav.Link
                                                    href={`#${cmd.command}`}
                                                    onSelect={() =>
                                                        setHashRoute(
                                                            cmd.command
                                                        )
                                                    }
                                                >
                                                    {cmd.isPremium && (
                                                        <>{premium_icon}</>
                                                    )}{" "}
                                                    <span
                                                        style={{
                                                            fontFamily:
                                                                "monospace",
                                                        }}
                                                    >
                                                        {cmd.command}
                                                    </span>
                                                </Nav.Link>
                                            </Nav.Item>
                                        ))}
                                    </Nav>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col">
                        <div>
                            <div>
                                <h3 id="commands-list">General Commands</h3>
                                {commandsSorted.map((cmd) => (
                                    <CommandEntry
                                        entry={cmd}
                                        hashRoute={hashRoute}
                                        key={uuid()}
                                        prefix={data.prefix}
                                    />
                                ))}
                            </div>

                            <div className="mt-4">
                                <h3 id="settings-list">Settings</h3>
                                <Alert
                                    variant="transparent"
                                    className="text-light"
                                    style={{
                                        background: "var(--dark)",
                                        lineHeight: 1,
                                    }}
                                >
                                    <p>
                                        Available configurable settings for the
                                        bot and how it displays your data.
                                        Access is controlled by appropriate
                                        settings listed.
                                    </p>
                                    <p className="mb-0">
                                        Entries listed with a{premium_icon}are
                                        for premium AutoMuteUs users only.
                                    </p>
                                </Alert>
                                {settingsSorted.map((cmd) => {
                                    return (
                                        <CommandEntry
                                            entry={cmd}
                                            hashRoute={hashRoute}
                                            key={uuid()}
                                            prefix={data.prefix + data.sprefix}
                                        />
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
