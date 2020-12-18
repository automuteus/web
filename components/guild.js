import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Button } from "react-bootstrap";

export default class Guild extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const guild = this.props.guild;
    const icon = `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png`;
    const abbr = guild.name.match(/\b\w/g).join("");
    const fs = 1.2 - Math.min(Math.max(abbr.length - 2, 0) * 0.1, 0.7) + "rem";

    return (
      <div className="guild-container">
        <div className="guild-icon">
          {guild.icon ? (
            <img src={icon} alt={guild.name} />
          ) : (
            <div className="guild-abbr" style={{ fontSize: fs }}>
              {abbr}
            </div>
          )}
        </div>
        <div className="guild-details">
          <strong>{guild.name}</strong>
        </div>
        <div className="guild-buttons ml-auto">
          <Button size="sm">
            <FontAwesomeIcon icon={faPlus} />{" "}
            Invite to Server
          </Button>
        </div>
      </div>
    );
  }
}
