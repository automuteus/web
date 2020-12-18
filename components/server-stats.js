import React from "react";
import { OverlayTrigger, Row, Tooltip } from "react-bootstrap";

import styles from "./server-stats.module.css";

const StatsURL = "https://galactus.automute.us";

export default class ServerStats extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      guilds: 0,
      activeGames: 0,
      totalGames: 0,
      totalUsers: 0,
    };
  }

  async fetchData() {
    try {
      const response = await fetch(StatsURL);
      const json = await response.json();
      this.setState({
        isLoaded: true,
        totalGuilds: json.totalGuilds,
        activeGames: json.activeGames,
        totalGames: json.totalGames,
        totalUsers: json.totalUsers,
      });
    } catch (error) {
      this.setState({
        isLoaded: true,
        error,
      });
    }
  }

  componentDidMount() {
    this.fetchData();
    this.interval = setInterval(() => {
      this.fetchData();
    }, 7000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    const {
      error,
      isLoaded,
      totalGuilds,
      activeGames,
      totalGames,
      totalUsers,
    } = this.state;

    if (error) {
      return (
        <div
          id="home-stats"
          className={`home-stats-wrapper ${styles.home_stats}`}
        >
          <StatCard label="Active Games" stat={"Very"} loaded={true} />
          <StatCard label="Servers" stat={"Such"} loaded={true} />
          <StatCard label="Users" stat={"Many"} loaded={true} />
          <StatCard label="Games Muted" stat={"Wow"} loaded={true} />
        </div>
      );
    } else {
      return (
        <div className={`home-stats-wrapper ${styles.home_stats}`}>
          <Row xl={2} md={2} lg={2} sm={2} xs={1}>
            <StatCard
              label="Servers"
              stat={totalGuilds}
              loaded={isLoaded}
              rounded={true}
              placement="bottom"
            />
            <StatCard
              label="Active Games"
              stat={activeGames}
              loaded={isLoaded}
              rounded={false}
            />
            <StatCard
              label="Users"
              stat={totalUsers}
              loaded={isLoaded}
              rounded={true}
              placement="bottom"
            />
            <StatCard
              label="Games Muted"
              stat={totalGames}
              loaded={isLoaded}
              rounded={true}
              placement="bottom"
            />
          </Row>
        </div>
      );
    }
  }
}

function StatCard(props) {
  const content = (
    <div>
      <div className={styles.stat_data}>
        <div className={props.loaded ? styles.fadeIn : styles.fadeOut}>
          {props.rounded ? roundedThousands(props.stat) : props.stat}
        </div>
      </div>
      <div className={styles.stat_label}>{props.label}</div>
    </div>
  );

  const tooltip = (
    <OverlayTrigger
      placement={props.placement || "bottom"}
      delay={{ show: 100, hide: 0 }}
      trigger={["hover", "focus"]}
      overlay={<Tooltip id={props.label + "tooltip"}
      >{props.stat}</Tooltip>}
    >
      {content}
    </OverlayTrigger>
  );

  if (props.rounded) {
    return (
      <div className={`stat-card p-3 pb-0 ${styles.stat_card}`}>{tooltip}</div>
    );
  }

  return (
    <div className={`stat-card p-3 pb-0 ${styles.stat_card}`}>{content}</div>
  );
}

function roundedThousands(val) {
  return Math.round(val / 1000) + "k";
}
