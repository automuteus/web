import { Guild } from "@prisma/client";
import { Dropdown } from "react-bootstrap";

interface Props extends Guild {
    unwrapped?: boolean;
}

export default function GuildEntry(props: Props): React.ReactElement {
    const { unwrapped, ...g } = props;
    let icon: React.ReactFragment;
    if (g.icon) {
        const ext = g.icon.startsWith("a_") ? "gif" : "webp";
        const img_src = `https://cdn.discordapp.com/icons/${g.id}/${g.icon}.${ext}`;
        icon = <img src={img_src} alt={g.name} />;
    } else {
        const abbr = (g.name.match(/\b\w/g) || ["?"]).join("");
        const fs =
            0.6 - Math.min(Math.max(abbr.length - 2, 0) * 0.1, 0.7) + "rem";
        icon = (
            <div className="guild-abbr" style={{ fontSize: fs }}>
                {abbr}
            </div>
        );
    }

    const inner = (
        <>
            <div className="guild-icon">{icon}</div>
            <span className={"guild-name"} title={g.name}>
                {g.name}
            </span>
        </>
    );

    if (unwrapped) {
        return inner;
    }

    return (
        <Dropdown.Item
            key={g.id}
            eventKey={g.id}
            className="guild-dropdown-item"
            title={g.name}
        >
            {inner}
        </Dropdown.Item>
    );
}
