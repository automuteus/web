import React from "react";
import ReactTooltip from "react-tooltip";

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
        guilds:json.totalGuilds,
        activeGames: json.activeGames,
        totalGames: json.totalGames,
        totalUsers: json.totalUsers,
        totalGamesRounded: Math.round(json.totalGames / 1000) + "k",
        totalGuildsRounded: Math.round(json.totalGuilds / 1000) + "k",
        totalUsersRounded: Math.round(json.totalUsers / 1000) + "k",
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
      totalGuildsRounded,
      totalUsersRounded,
      totalGamesRounded,
    } = this.state;

    if (error) {
      return (
        <div
          id="home-stats"
          className={`home-stats-wrapper ${styles.home_stats}`}
        >
          
          <StatCard  label="Active Games" stat={"Very"} loaded={true} />
          <StatCard label="Servers" stat={"Such"} loaded={true} />
          <StatCard label="Users" stat={"Many"} loaded={true} />
          <StatCard label="Games Muted" stat={"Wow"} loaded={true} />
        </div>
      );
    } else {
      return (
        <div style={{cursor: "default"}} className={`home-stats-wrapper ${styles.home_stats}`}>
          <div data-tip={this.state.guilds} data-offset="{'bottom': 25}">
          <StatCard label="Servers" stat={totalGuildsRounded} loaded={isLoaded} />
          </div>
          <StatCard label="Active Games" stat={activeGames} loaded={isLoaded} />
          <div data-tip={this.state.totalUsers} data-offset="{'bottom': 25}">
          <StatCard label="Users" stat={totalUsersRounded} loaded={isLoaded} />
          </div>
          <div data-place="bottom" data-tip={this.state.totalGames} data-offset="{'top': 25}">
          <StatCard label="Games Muted" stat={totalGamesRounded} loaded={isLoaded} />
          </div>
          <ReactTooltip effect="solid" delayShow={500} />
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
