import React from "react";

import styles from "./server-stats.module.css";

const StatsURL = "https://stats.automute.us/stats/api"
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
        guilds: json.totalGuilds,
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
      guilds,
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
        <div
          className={`home-stats-wrapper ${styles.home_stats}`}
        >
          <StatCard label="Servers" stat={guilds} loaded={isLoaded} />
          <StatCard label="Active Games" stat={activeGames} loaded={isLoaded} />
          <StatCard label="Users" stat={totalUsers} loaded={isLoaded} />
          <StatCard label="Games Muted" stat={totalGames} loaded={isLoaded} />
        </div>
      );
    }
  }
}

function StatCard(props) {
  return (
    <div className={`stat-card p-3 pb-0 ${styles.stat_card}`}>
      <div className={styles.stat_data}>
        <div className={props.loaded ? styles.fadeIn : styles.fadeOut}>
          {props.stat}
        </div>
      </div>
      <div className={styles.stat_label}>{props.label}</div>
    </div>
  );
}
