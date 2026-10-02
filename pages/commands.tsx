import { Alert, Nav } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import * as data from "../data/commands";

import { faCrown } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import Link from "next/link";
import { Trans, useTranslation } from "react-i18next";
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
    const { t } = useTranslation("commands");
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
            title={t("page.title")}
            metaDesc={t("page.metaDescription")}
        >
            <div className={`container pb-4 commandsPage`}>
                <div className="d-block d-md-flex align-items-center justify-content-between">
                    <h1>{t("page.heading")}</h1>
                    <span className="entryLabelSubcommands">
                        {t("page.currentAsOf", { version: "v10.0.0" })}
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
                                            <h5>{t("page.generalCommands")}</h5>
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
                                            <h5 className="mt-3">{t("page.settings")}</h5>
                                        </Nav.Item>
                                        <Nav.Item className="commandMenu">
                                            <Nav.Link href="#settings-list">
                                                {t("page.managedOnWeb")}
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
                                <h3 id="commands-list">{t("page.generalCommands")}</h3>
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
                                <h3 id="settings-list">{t("page.settings")}</h3>
                                <Alert
                                    variant="transparent"
                                    className="text-light"
                                    style={{ background: "var(--dark)" }}
                                >
                                    <p className="mb-0">
                                        <Trans
                                            t={t}
                                            i18nKey="page.settingsMoved"
                                            components={{
                                                settingsLink: <Link href="/settings" />,
                                                code: <code />,
                                            }}
                                            values={{ command: "/settings" }}
                                        />
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
