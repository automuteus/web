import { Guild } from "@prisma/client";
import React, { BaseSyntheticEvent, useState } from "react";
import { Dropdown } from "react-bootstrap";
import GuildEntry from "./GuildEntry";

interface Props {
    guilds: Array<Guild>;
    onSelect: any;
    initial?: string | string[];
}

export default function GuildSelect(props: Props): React.ReactElement {
    const { guilds, onSelect, initial } = props;

    let g;
    if (guilds) g = guilds.find((v) => v.id === initial);

    const [btnText, setBtnText] = useState<string>(
        initial ? undefined : `<span>Select Server</span>`
    );

    const handleSelect = (key: any, e: BaseSyntheticEvent) => {
        setBtnText((e.target as HTMLElement).innerHTML);
        onSelect(key);
    };

    if (guilds.length <= 0)
        return (
            <div className="d-flex align-items-center text-right mb-2 " title="Try reloading the page."><button className="btn btn-dark" disabled>No servers found.</button></div>
        );

    return (
        <div className="d-flex align-items-center text-right mb-2 ">
            <Dropdown className="guild-dropdown" onSelect={handleSelect}>
                <Dropdown.Toggle
                    variant="premium"
                    className="text-sentence-case"
                >
                    {btnText ? (
                        <span
                            dangerouslySetInnerHTML={{
                                __html: btnText,
                            }}
                        ></span>
                    ) : (
                        g && <GuildEntry {...g} key={g.id} unwrapped />
                    )}
                </Dropdown.Toggle>
                <Dropdown.Menu className="text-white shadow" align="end">
                    {Array.isArray(guilds) &&
                        guilds.length > 0 &&
                        [...guilds]
                            .sort((a, b) => (a.name <= b.name ? -1 : 1))
                            .map((g) => <GuildEntry {...g} key={g.id} />)}
                </Dropdown.Menu>
            </Dropdown>
        </div>
    );
}
