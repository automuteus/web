import { faGem, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Badge, Button } from "react-bootstrap";

export default class Guild extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const guild = this.props.guild;
    const icon = `https://cdn.discordapp.com/icons/${guild.guild_id}/${
      guild.icon
    }.png`;
    const abbr = guild.name.match(/\b\w/g).join("");
    const fs = 1.2 - Math.min(Math.max(abbr.length - 2, 0) * 0.1, 0.7) + "rem";
    let premium_color = null;
    let premium_text = null;
    switch (guild.premium) {
      case 1:
        premium_color = "#71491e";
        premium_text = "Bronze";
        break;
      case 2:
        premium_color = "#d6e0f0";
        premium_text = "Silver";
        break;
      case 3:
        premium_color = "#ffd700";
        premium_text = "Gold";
        break;
      case 4:
        premium_color = "#38fedc";
        premium_text = "Platinum";
        break;
    }

    return (
      <>
        <div className="guild-container">
          <div className="guild-icon">
            {guild.icon ? (
              <img
                src={icon}
                alt={guild.name}
                onError={(e) => {
                  e.target.onError = null;
                  e.currentTarget.parentElement.innerHTML = (
                    <div className="guild-abbr" style={{ fontSize: fs }}>
                      {abbr}
                    </div>
                  );
                }}
              />
            ) : (
              <div className="guild-abbr" style={{ fontSize: fs }}>
                {abbr}
              </div>
            )}
          </div>
          <div className="guild-details">
            {premium_color !== null ? (
              <>
                <FontAwesomeIcon
                  style={{ color: premium_color }}
                  fixedWidth
                  size="lg"
                  icon={faGem}
                />{" "}
                <strong>{guild.name}</strong>
              </>
            ) : (
              <strong>{guild.name}</strong>
            )}
          </div>
          {premium_color === null && (
            <div className="guild-buttons ml-auto">
              <Button size="sm">
                <FontAwesomeIcon icon={faPlus} /> Invite to Server
              </Button>
            </div>
          )}
        </div>
        {/* <pre style={{color: "white"}}>{JSON.stringify(guild, null, 2)}</pre> */}
      </>
    );
  }
}
