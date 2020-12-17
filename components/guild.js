import React from "react";

export default class Guild extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const guild = this.props.guild;
    return (
      <div className="guild-container">
        <div className="guild-icon">
          <img
            onError={(e) => {
              let replacement = document.createElement('div');
              replacement.innerHTML = guild.name.match(/\b\w/g).join('')
              e.target.parentNode.replaceChild(replacement, e.target)
            }}
            src={`https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png`}
            alt={guild.name}
          />
        </div>
        <div className="guild-details">
          <strong>{guild.name}</strong>
        </div>
      </div>
    );
  }
}
