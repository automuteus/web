import { Guild } from "../../types/Guild";
import React from "react";
import { Dropdown } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import GuildEntry from "./GuildEntry";

interface Props {
    guilds: Array<Guild>;
    onSelect: (guildId: string) => void;
    /** The server currently chosen, however it was chosen (here, by URL, or by a finished checkout). */
    selected?: string;
    size?: "sm" | "lg";
}

export default function GuildSelect(props: Props): React.ReactElement {
    const { guilds, onSelect, selected, size } = props;
    const { t } = useTranslation("premium");
    const current = selected ? guilds.find((v) => v.id === selected) : undefined;

    if (guilds.length <= 0)
        return (
            <div className="d-flex align-items-center" title={t("guildSelect.reload")}><button className="btn btn-dark" disabled>{t("guildSelect.noServers")}</button></div>
        );

    return (
        <div className="d-flex align-items-center">
            <Dropdown className="guild-dropdown" onSelect={(key) => key && onSelect(key)}>
                <Dropdown.Toggle
                    variant="premium"
                    size={size}
                    className="text-sentence-case"
                >
                    {current ? (
                        <GuildEntry {...current} key={current.id} unwrapped />
                    ) : (
                        <span>{selected ? t("guildSelect.byId", { id: selected }) : t("guildSelect.prompt")}</span>
                    )}
                </Dropdown.Toggle>
                <Dropdown.Menu className="text-white shadow" align="end">
                    {[...guilds]
                        .sort((a, b) => (a.name <= b.name ? -1 : 1))
                        .map((g) => <GuildEntry {...g} key={g.id} />)}
                </Dropdown.Menu>
            </Dropdown>
        </div>
    );
}
