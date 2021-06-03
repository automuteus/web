import { faExclamationCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { BaseSyntheticEvent, SyntheticEvent, useEffect, useState } from "react";
import { Dropdown } from "react-bootstrap";
import { Guild } from "../../utils/interfaces";

interface Props {
  guilds: Array<Guild>;
  onSelect: any;
  loading: boolean;
  error: boolean;
}

const GuildSelect = (props: Props): React.ReactElement => {
  const { guilds, loading, error, onSelect } = props;

  const [btnText, setBtnText] = useState<string>(
    `<span class="mr-2 text-muted">
            <em>Loading servers...</em>
          </span>`
  );

  const handleSelect = (key: any, e: BaseSyntheticEvent) => {
    setBtnText((e.target as HTMLElement).innerHTML);
    console.log((e.target as HTMLElement).innerHTML)
    onSelect(key);
  };

  useEffect(() => {
    if (error) {
      setBtnText(`<span class="mr-2 text-muted">
                    <strong>Unable to load servers!</strong>
                  </span>`);
    } else if (loading) {
      setBtnText(`<span class="mr-2 text-muted">
      <em>Loading servers...</em>
    </span>`);
    } else if (!loading) {
      setBtnText(`<span class="mr-2">
      Select Server
    </span>`);
    }
  }, [loading, error]);

  return (
    <Dropdown className="mb-2 guild-dropdown" onSelect={handleSelect}>
      {!error ? (
        <Dropdown.Toggle
          variant="premium"
          disabled={loading}
          className="text-sentence-case"
        >
          <span
            dangerouslySetInnerHTML={{
              __html: btnText,
            }}
          ></span>
        </Dropdown.Toggle>
      ) : (
        <div className="text-danger">
          <FontAwesomeIcon icon={faExclamationCircle} className="mr-2" />
          <strong>Unable to load servers!</strong>
        </div>
      )}
      <Dropdown.Menu className="text-white shadow" alignRight>
        {Array.isArray(guilds) &&
          guilds.length > 0 &&
          [...guilds]
            .sort((a, b) => (a.name <= b.name ? -1 : 1))
            .map((g) => <GuildEntry {...g} key={g.guild_id} />)}
      </Dropdown.Menu>
    </Dropdown>
  );
};

const GuildEntry = (props: Guild): React.ReactElement => {
  const g = props;
  let icon: React.ReactFragment;
  if (g.icon) {
    const ext = g.icon.startsWith("a_") ? "gif" : "webp";
    const img_src = `https://cdn.discordapp.com/icons/${g.guild_id}/${g.icon}.${ext}`;
    icon = <img src={img_src} alt={g.name} />;
  } else {
    const abbr = (g.name.match(/\b\w/g) || ["?"]).join("");
    const fs = 0.6 - Math.min(Math.max(abbr.length - 2, 0) * 0.1, 0.7) + "rem";
    icon = (
      <div className="guild-abbr" style={{ fontSize: fs }}>
        {abbr}
      </div>
    );
  }

  return (
    <Dropdown.Item
      key={g.guild_id}
      eventKey={g.guild_id}
      className="guild-dropdown-item"
      title={g.name}
    >
      <div className="guild-icon">{icon}</div>
      <span className={"guild-name"} title={g.name}>
        {g.name}
      </span>
    </Dropdown.Item>
  );
};

export default GuildSelect;
