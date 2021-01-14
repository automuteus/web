import React from "react";
import dynamic from "next/dynamic";
import EffectToggle from "./effect-toggle";

import styles from "./footer.module.css";

const Effect = dynamic(() => import("react-confetti"), { ssr: false });

export default class Footer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      effect: this.props.effect,
      effectActive: this.props.effectActive && this.props.effect,
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
        {this.state.effectActive && (
          <Effect
            numberOfPieces={75}
            opacity={0.65}
            gravity={0.05}
            initialVelocityX={5}
            initialVelocityY={20}
            run={this.state.effectActive}
          />
        )}

        {this.state.effect && (
          <EffectToggle
            name="effect-switch"
            init={this.state.effectActive}
            tooltip="Toggle confetti"
            toggle={this.onToggle}
            label={"🎉"}
          />
        )}
      </footer>
    );
  }
}
