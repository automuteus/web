import { v4 as uuid } from "uuid";
import { useEffect, useRef, useState } from "react";
import { Button, Collapse, Image } from "react-bootstrap";
import {
    faChevronDown,
    faCrown,
    faGift,
    faPlusCircle,
    faSmileBeam,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { Command } from "../../types/Command";
import ArgTable from "./ArgTable";

interface Props {
    entry: Command;
    hashRoute: string;
}

export default function CommandEntry(props: Props): React.ReactElement {
    const { entry, hashRoute } = props;
    const [open, setOpen] = useState<boolean>(false);
    const [imgOpen, setImgOpen] = useState(!entry.image);
    const commandRef = useRef<HTMLDivElement>(null);

    const executeScroll = () => {
        if (commandRef.current) commandRef.current.scrollIntoView();
    };

    useEffect(() => {
        setOpen(open === true || hashRoute === entry.command);
    }, [hashRoute]);

    const req_args = entry.arguments.filter((c) => c.level == "required");
    const opt_args = entry.arguments.filter((c) => c.level == "optional");

    return (
        <div className={`commandEntry`} id={entry.command} ref={commandRef}>
            <div
                className={`commandEntryTitle d-flex flex-row align-items-center`}
                onClick={() => setOpen(open !== true)}
            >
                <div className={`entryLabel me-2`}>{entry.command}</div>
                {entry?.isPremium && (
                    <div className="text-premium me-2">
                        <FontAwesomeIcon icon={faCrown} />
                    </div>
                )}
                <div className={`entryDescription ${open ? "d-none" : ""}`}>
                    {entry.description.map((e) => (
                        <span key={uuid()}>{e}</span>
                    ))}
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
            <Collapse in={open} onEntered={() => executeScroll()}>
                <div className="m-0 p-0">
                    <div className="commandEntryBody">
                        <h5>Description</h5>
                        <div className="mb-4">
                            {entry.description.map((e) => (
                                <span key={uuid()}>{e}</span>
                            ))}
                        </div>

                        <h5>Aliases</h5>
                        <div className="mb-4">
                            {entry.alias.length ? (
                                entry.alias.map((a) => (
                                    <code
                                        className="me-2"
                                        key={uuid()}
                                        title={`.au ${a}`}
                                        style={{ cursor: "default" }}
                                    >
                                        {a}
                                    </code>
                                ))
                            ) : (
                                <div className="text-muted">
                                    <em>None</em>
                                </div>
                            )}
                        </div>

                        <h5>Arguments</h5>
                        <div className="mb-4">
                            {(req_args.length || opt_args.length) > 0 && (
                                <h6>Required</h6>
                            )}
                            <div>
                                <ArgTable cmd={entry.command} args={req_args} />
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
                                <div className="cmd-text">{entry.example}</div>
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
                            {entry.image && (
                                <div className="text-center">
                                    <Button
                                        variant="secondary"
                                        size="sm"
                                        className="mt-2"
                                        onClick={() => setImgOpen(!imgOpen)}
                                        aria-controls={`${entry.command}-result`}
                                        aria-expanded={imgOpen}
                                    >
                                        Show output
                                    </Button>
                                    <Collapse in={imgOpen}>
                                        <div
                                            className="text-center pt-2"
                                            id={`${entry.command}-result`}
                                        >
                                            <Image
                                                src={`/assets/img/commands/${entry.command}_result.png`}
                                                rounded
                                                className="shadow"
                                                fluid
                                            />
                                        </div>
                                    </Collapse>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </Collapse>
        </div>
    );
}