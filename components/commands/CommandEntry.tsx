import { v4 as uuid } from "uuid";
import { useEffect, useRef, useState } from "react";
import { Collapse } from "react-bootstrap";
import {
    faChevronDown,
    faGift,
    faPlusCircle,
    faSmileBeam,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { Command, CommandArg } from "../../types/Command";
import ArgTable from "./ArgTable";
import { premium_icon } from "../../pages/commands";
import { prefix } from "../../data/commands";

interface Props {
    entry: Command;
    hashRoute: string;
    className?: string;
    parent?: Command;
}

export default function CommandEntry(props: Props): React.ReactElement {
    const { entry, hashRoute, className, parent } = props;
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
                                    open ? "opacity-0" : ""
                                }`}
                            >
                                {req_args.length > 0 && (
                                    <span className="entryLabelArgsReq">
                                        {req_args.map((a) => (
                                            <code key={uuid()}>{a.name}</code>
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
                                            OPTIONAL
                                        </span>
                                        {opt_args.map((a: CommandArg) => (
                                            <code key={uuid()}>{a.name}</code>
                                        ))}
                                    </span>
                                )}
                            </div>
                        )}

                        {entry.subcommands && (
                            <span className="entryLabelSubcommands">
                                + {entry.subcommands.length} sub-commands
                            </span>
                        )}
                    </div>
                    <div className={`entryLabelDescription`}>
                        {entry.description &&
                            entry.description.map((e) => (
                                <span key={uuid()}>{e}</span>
                            ))}
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
                                <h5>Sub-commands</h5>
                                <div>
                                    {entry.subcommands.map((e) => (
                                        <CommandEntry
                                            entry={e}
                                            hashRoute={hashRoute}
                                            key={uuid()}
                                            className="subcommand"
                                            parent={entry}
                                        />
                                    ))}
                                </div>
                            </>
                        ) : (
                            <>
                                <h5>Arguments</h5>
                                <div className="mb-4">
                                    {(req_args.length || opt_args.length) >
                                        0 && <h6>Required</h6>}
                                    <div>
                                        <ArgTable
                                            cmd={entry.command}
                                            args={req_args}
                                        />
                                    </div>
                                    {opt_args.length > 0 && (
                                        <>
                                            <br />
                                            <h6>Optional</h6>
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
                                        <h5>Example</h5>
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
