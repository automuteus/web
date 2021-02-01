import React from "react";

import styles from "./footer.module.css";


export default class Footer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      snowActive: false,
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
      <footer
        className={`${styles.footer} ${styles.muted_snow} text-right`}
      ></footer>
    );
  }
}
