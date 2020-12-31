// -------------- Snow Effects ------------ //
/*
import React from "react";
import dynamic from "next/dynamic";
import { faSnowflake } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import EffectToggle from "./effect-toggle";
import styles from "./footer.module.css";

const Snowfall = dynamic(() => import("react-snowfall"), { ssr: false });

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
      <footer className={`${styles.footer} ${styles.muted_snow} text-right`}>
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
*/

// ------------ New Years effects------------- //
import React from "react";
import dynamic from "next/dynamic";
import { faBacon } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import EffectToggle from "./effect-toggle";

import styles from "./footer.module.css";

const Effect = dynamic(() => import("react-confetti"), { ssr: false });

export default class Footer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      effectActive: true,
    };

    this.onToggle = this.onToggle.bind(this);
  }

  onToggle(e) {
    this.setState({
      effectActive: e.target.checked,
    });
  }
  render() {
    return (
      <footer className={`${styles.footer} ${styles.muted_effect} text-right`}>
        {this.state.effectActive && <Effect numberOfPieces={75} opacity={0.5} gravity={0.05} initialVelocityX={5} initialVelocityY={20} />}

        <EffectToggle
          name="confetti-switch"
          init={this.effectActive}
          tooltip="Toggle confetti"
          toggle={this.onToggle}
          label={"🎊"}
        />
      </footer>
    );
  }
}
