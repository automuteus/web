import { useEffect, useRef, useState } from "react";
import { Collapse } from "react-bootstrap";
import {
    faChevronDown,
    faGift,
    faPlusCircle,
    faSmileBeam,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTranslation } from "react-i18next";

import { Command, CommandArg } from "../../types/Command";
import ArgTable from "./ArgTable";
import CommandDescription from "./CommandDescription";
import { premium_icon } from "../../pages/commands";

interface Props {
    entry: Command;
    hashRoute: string;
    className?: string;
    parent?: Command;
    prefix?: string;
}

export default function CommandEntry(props: Props): React.ReactElement {
    const { entry, hashRoute, className, parent, prefix } = props;
    const { t } = useTranslation("commands");
    const [open, setOpen] = useState<boolean>(false);
    const commandRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setOpen(open === true || hashRoute === entry.command);
    }, [hashRoute]);

    const req_args = entry.arguments
        ? entry.arguments.filter((c) => c.level == "required")
        : [];
    const opt_args = entry.arguments
        ? entry.arguments.filter((c) => c.level == "optional")
        : [];

    return (
        <div
            className={`commandEntry ${className ?? ""}`.trim()}
            id={entry.command}
            ref={commandRef}
        >
            <div
                className={`commandEntryTitle d-flex flex-row align-items-center`}
                onClick={() => setOpen(open !== true)}
            >
                <div className={`entryLabel me-2`}>
                    <div className="entryLabelSummary">
                        <div className="entryLabelCommand bg-blurple-gradient">
                            {prefix}
                            {parent && parent.command + " "}
                            {entry.command}
                            {entry?.isPremium && (
                                <div className="text-premium me-2">
                                    {premium_icon}
                                </div>
                            )}
                        </div>

                        {entry.arguments && (
                            <div
                                className={`entryLabelArgs ${
                                    open ? "opacity-md-0" : ""
                                }`}
                            >
                                {req_args.length > 0 && (
                                    <span className="entryLabelArgsReq">
                                        {req_args.map((a) => (
                                            <code key={a.name}>{a.name}</code>
                                        ))}
                                    </span>
                                )}
                                {opt_args.length > 0 && (
                                    <span className="entryLabelArgsOpt">
                                        {<span className="optArgLabel">|</span>}
                                        <span
                                            className="optArgLabel"
                                            style={{ fontSize: "0.8rem" }}
                                        >
                                            {t("entry.optionalLabel")}
                                        </span>
                                        {opt_args.map((a: CommandArg) => (
                                            <code key={a.name}>{a.name}</code>
                                        ))}
                                    </span>
                                )}
                            </div>
                        )}

                        {entry.subcommands && (
                            <span className="entryLabelSubcommands">
                                {t("entry.subcommandCount", { count: entry.subcommands.length })}
                            </span>
                        )}
                    </div>
                    <div className={`entryLabelDescription`}>
                        {entry.description && (
                            <CommandDescription i18nKey={entry.description} />
                        )}
                    </div>
                </div>
                <div className="entryToggle ms-auto">
                    <FontAwesomeIcon
                        icon={faChevronDown}
                        style={{
                            transform: open ? "rotate(180deg)" : "",
                            transition: "150ms",
                        }}
                    />
                </div>
            </div>
            <Collapse in={open}>
                <div className="m-0 p-0">
                    <div className="commandEntryBody">
                        {entry.subcommands ? (
                            <>
                                <h5>{t("entry.subcommands")}</h5>
                                <div>
                                    {entry.subcommands.map((e) => (
                                        <CommandEntry
                                            entry={e}
                                            hashRoute={hashRoute}
                                            key={e.command}
                                            className="subcommand"
                                            parent={entry}
                                            prefix={prefix}
                                        />
                                    ))}
                                </div>
                            </>
                        ) : (
                            <>
                                <h5>{t("entry.arguments")}</h5>
                                <div className="mb-4">
                                    {(req_args.length || opt_args.length) >
                                        0 && <h6>{t("entry.required")}</h6>}
                                    <div>
                                        <ArgTable
                                            cmd={entry.command}
                                            args={req_args}
                                        />
                                    </div>
                                    {opt_args.length > 0 && (
                                        <>
                                            <br />
                                            <h6>{t("entry.optional")}</h6>
                                            <div>
                                                <ArgTable
                                                    cmd={entry.command}
                                                    args={opt_args}
                                                />
                                            </div>
                                        </>
                                    )}
                                </div>

                                {entry.example && (
                                    <>
                                        <h5>{t("entry.example")}</h5>
                                        <div className="">
                                            <div className="mock-chatbar">
                                                <div>
                                                    <FontAwesomeIcon
                                                        size="lg"
                                                        fontVariant="light"
                                                        icon={faPlusCircle}
                                                        className="icon-muted"
                                                    />
                                                </div>
                                                <div className="cmd-text">
                                                    {prefix}
                                                    {entry.example}
                                                </div>
                                                <div className="ms-auto d-none d-md-block">
                                                    <FontAwesomeIcon
                                                        size="lg"
                                                        fontVariant="light"
                                                        icon={faGift}
                                                        className="icon-muted me-0"
                                                    />
                                                    <FontAwesomeIcon
                                                        size="lg"
                                                        fontVariant="light"
                                                        icon={faSmileBeam}
                                                        className="icon-muted"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </Collapse>
        </div>
    );
}
