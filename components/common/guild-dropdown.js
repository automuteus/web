import { faEllipsisH } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Dropdown } from "react-bootstrap";
import * as util from "../utility/client";
import s from "./guild-dropdown.module.css";

export default function GuildDropdown(props) {
  const { isLoading, isError, serverName, guildList, onSelect } = props;
  let guilds;
  if (Array.isArray(guildList)) {
    guilds = guildList.sort(util.compareGuilds).map((g) => {
      const abbr = g.guilds.name.match(/\b\w/g).join("");
      const fs =
        0.6 - Math.min(Math.max(abbr.length - 2, 0) * 0.1, 0.7) + "rem";
      let guild_icon = (
        <div className={s["guild-abbr"]} style={{ fontSize: fs }}>
          {abbr}
        </div>
      );

      if (g.guilds.icon) {
        const icon =
          g.guilds.icon + (g.guilds.icon.startsWith("a_") ? ".gif" : ".png");

        const icon_url = `https://cdn.discordapp.com/icons/${
          g.guilds.guild_id
        }/${icon}`;

        guild_icon = <img src={icon_url} alt={g.guilds.name} />;
      }

      return (
        <Dropdown.Item
          key={g.guild_id}
          eventKey={g.guild_id}
          className={`${s["guild-dropdown-item"]}`}
          title={g.guilds.name}
        >
          <div className={s["guild-icon"]}>{guild_icon}</div>
          <span className={s["guild-name"]} title={g.guilds.name}>{g.guilds.name}</span>
        </Dropdown.Item>
      );
    });
  }

  return (
    <Dropdown onSelect={onSelect} className={`${s["guild-select"]}`}>
      <Dropdown.Toggle
        variant="dark"
        className={s["guild-select-dropdown"]}
        disabled={isLoading || isError}
      >
        <span
          className={`ml-0 mr-auto pr-2 ${s["guild-dropdown-item"]} p-0`}
          dangerouslySetInnerHTML={{
            __html: !isLoading && !isError ? serverName : "Loading servers...",
          }}
        />
      </Dropdown.Toggle>

      <Dropdown.Menu>{guilds}</Dropdown.Menu>
    </Dropdown>
  );
}
