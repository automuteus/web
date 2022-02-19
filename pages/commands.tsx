import { v4 as uuid } from "uuid";
import { Alert, Nav } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import style from "../styles/commands.module.scss";

import * as data from "../data/commands.js";

import { faCrown } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import AppLayout from "../components/layout/AppLayout";
import CommandEntry from "../components/commands/CommandEntry";
import { Command } from "../types/Command";

const CommandsPage = () => {
    const commands = data.commands as Array<Command>;
    const settings = data.settings as Array<Command>;
    const premiumSettings = data.premiumSettings as Array<Command>;

    const settingsSorted = [...settings, ...premiumSettings].sort((a, b) =>
        a.command > b.command ? 1 : -1
    );

    const commandsSorted = commands.sort((a, b) =>
        a.command > b.command ? 1 : -1
    );

    const [hashRoute, setHashRoute] = useState<string>(
        typeof window !== "undefined"
            ? window.location.hash.replace("#", "")
            : ""
    );

    return (
        <AppLayout title="AutoMuteUs - Commands">
            <div className={`container pb-4 ${style.commandsPage}`}>
                <div className="d-block d-md-flex align-items-center justify-content-between">
                    <h1>Commands</h1>
                </div>

                <div className="row">
                    <div
                        className={`col-12 col-md-auto d-none d-lg-flex ${style.fixedCol}`}
                    >
                        <div className={`${style.sidebar}`}>
                            <div className="sticky-top">
                                <div className={`${style.sidebarBox}`}>
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
                                                className={style.commandMenu}
                                            >
                                                <Nav.Link
                                                    href={`#${cmd.command}`}
                                                    onSelect={() =>
                                                        setHashRoute(
                                                            cmd.command
                                                        )
                                                    }
                                                >
                                                    {cmd.command}
                                                </Nav.Link>
                                            </Nav.Item>
                                        ))}
                                        <Nav.Item>
                                            <h5 className="mt-3">Settings</h5>
                                        </Nav.Item>
                                        {settingsSorted.map((cmd) => (
                                            <Nav.Item
                                                key={`setting-${cmd.command}`}
                                                className={style.commandMenu}
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
                                                        <FontAwesomeIcon
                                                            icon={faCrown}
                                                            className="me-2"
                                                            style={{
                                                                fontSize:
                                                                    "0.9rem",
                                                            }}
                                                        />
                                                    )}{" "}
                                                    {cmd.command}
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
                                <h3 id="settings-list">General Commands</h3>
                                {commandsSorted.map((cmd) => (
                                    <CommandEntry
                                        entry={cmd}
                                        hashRoute={hashRoute}
                                        key={uuid()}
                                    />
                                ))}
                            </div>

                            <div className="mt-4">
                                <h3 id="settings-list">Settings</h3>
                                <Alert className="bg-dark">
                                    <p>
                                        Available configurable settings for the
                                        bot and how it displays your data.
                                        Access is controlled by appropriate
                                        settings listed.
                                    </p>
                                    <p className="mb-0">
                                        Click on a setting to expand more
                                        details about it. Entries listed with a{" "}
                                        <FontAwesomeIcon
                                            className="text-premium"
                                            icon={faCrown}
                                        />{" "}
                                        are for premium AutoMuteUs users only.
                                    </p>
                                </Alert>
                                {settingsSorted.map((cmd) => (
                                    <CommandEntry
                                        entry={cmd}
                                        hashRoute={hashRoute}
                                        key={uuid()}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
};

export default CommandsPage;
