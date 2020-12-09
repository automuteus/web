import React from "react";

import EffectToggle from "./EffectToggle"

import "./Footer.css"

import Snowfall from "react-snowfall";
import { faSnowflake } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default class Footer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      snowActive: true,
    };

    this.onToggle = this.onToggle.bind(this);
  }

  onToggle(e) {
    this.setState({
      snowActive: e.target.checked,
    });
  }

  render() {
    return (
      <footer className="text-right muted-snow">
        {this.state.snowActive && <Snowfall snowflakeCount={75} />}

        <EffectToggle
          name="snow-switch"
          init={this.snowActive}
          tooltip="Toggle snow"
          toggle={this.onToggle}
          label={<FontAwesomeIcon icon={faSnowflake} />}
        />
      </footer>
    );
  }
}
