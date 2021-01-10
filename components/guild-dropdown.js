import { Dropdown } from "react-bootstrap";
import * as util from "./utility/client";

export default function GuildDropdown(props) {
  const { isLoading, isError, serverName, guildList, onSelect } = props;

  let guilds = null;
  if (Array.isArray(guildList)) {
    guilds = guildList.sort(util.compareGuilds).map((g) => {
      const icon = `https://cdn.discordapp.com/icons/${g.guilds.guild_id}/${
        g.guilds.icon
      }.png`;
      const abbr = g.guilds.name.match(/\b\w/g).join("");
      const fs =
        0.6 - Math.min(Math.max(abbr.length - 2, 0) * 0.1, 0.7) + "rem";
      return (
        <Dropdown.Item
          key={g.guild_id}
          eventKey={g.guild_id}
          className="guild-dropdown-item"
        >
          <div className="guild-icon">
            {g.guilds.icon ? (
              <img src={icon} alt={g.guilds.name} />
            ) : (
              <div className="guild-abbr" style={{ fontSize: fs }}>
                {abbr}
              </div>
            )}
          </div>

          <span>{g.guilds.name}</span>
        </Dropdown.Item>
      );
    });
  }

  return (
    <Dropdown onSelect={onSelect} className="guild-select">
      <Dropdown.Toggle
        variant="dark"
        className="guild-select-dropdown"
        dangerouslySetInnerHTML={{
          __html: !isLoading && !isError ? serverName : "Loading servers...",
        }}
        disabled={isLoading || isError}
      />

      <Dropdown.Menu>{guilds}</Dropdown.Menu>
    </Dropdown>
  );
}
