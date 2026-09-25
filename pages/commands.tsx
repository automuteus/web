import { Alert, Nav } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import * as data from "../data/commands";

import { faCrown } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import Link from "next/link";
import AppLayout from "../components/layout/AppLayout";
import CommandEntry from "../components/commands/CommandEntry";
import { Command } from "../types/Command";

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
                        Current as of v10.0.0
                    </span>
                </div>

                        Current as of v10.0.0
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
                                        <Nav.Item className="commandMenu">
                                            <Nav.Link href="#settings-list">
                                                Managed on the web
                                            </Nav.Link>
                                        </Nav.Item>
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
                                        key={cmd.command}
                                        prefix={data.prefix}
                                    />
                                ))}
                            </div>

                            <div className="mt-4">
                                <h3 id="settings-list">Settings</h3>
                                <Alert
                                    variant="transparent"
                                    className="text-light"
                                    style={{ background: "var(--dark)" }}
                                >
                                    <p className="mb-0">
                                        Settings are no longer changed with
                                        commands. Open the{" "}
                                        <Link href="/settings">settings page</Link>{" "}
                                        and sign in with Discord to view and
                                        change them. The server owner and
                                        members with Administrator or Manage
                                        Server can make changes. In Discord,{" "}
                                        <code>/settings</code> links to the same
                                        page.
                                    </p>
                                </Alert>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
