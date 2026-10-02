import { Guild } from "../../types/Guild";
import React, { BaseSyntheticEvent, useState } from "react";
import { Dropdown } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import GuildEntry from "./GuildEntry";

interface Props {
    guilds: Array<Guild>;
    onSelect: any;
    initial?: string | string[];
}

export default function GuildSelect(props: Props): React.ReactElement {
    const { guilds, onSelect, initial } = props;
    const { t } = useTranslation("premium");

    let g;
    if (guilds) g = guilds.find((v) => v.id === initial);

    // Whether the toggle prompts for a server; decided once, like the selection it stands in for.
    const [prompt] = useState<boolean>(!initial);
    // The picked entry's markup, copied into the toggle.
    const [btnText, setBtnText] = useState<string>();

    const handleSelect = (key: any, e: BaseSyntheticEvent) => {
        setBtnText((e.target as HTMLElement).innerHTML);
        onSelect(key);
    };

    if (guilds.length <= 0)
        return (
            <div className="d-flex align-items-center text-right mb-2 " title={t("guildSelect.reload")}><button className="btn btn-dark" disabled>{t("guildSelect.noServers")}</button></div>
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
                    ) : prompt ? (
                        <span>
                            <span>{t("guildSelect.prompt")}</span>
                        </span>
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
