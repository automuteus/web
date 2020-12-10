import React from "react";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera, faGem } from "@fortawesome/free-solid-svg-icons";
import { faDiscord } from "@fortawesome/free-brands-svg-icons";

import "./Home.css";
import ServerStats from "./ServerStats"

import crewmate from "../assets/img/svg/amus_crewmate_santa.svg";

import MetaTags from 'react-meta-tags';

class Home extends React.Component {
  render() {
    return (
      <div className="d-flex flex-lg-row flex-column align-items-center p-3" id="main-content">
          <MetaTags>
            <title>AutoMuteUs</title>
            <meta name="description" content="AutoMuteUs is a Discord Bot that collects Among Us game data to automatically mute/unmute players during games!" />
            <meta property="og:title" content="AutoMuteUs" />
            <meta property="og:image" content="/assets/img/logo_embed.png" />
            <meta property="og:color" content="#7289DA" />
          </MetaTags>
        <div id="home-text">
          <h2 className="title">Use AutoMuteUs for hands free muting</h2>
          <p className="subtitle">
            AutoMuteUs is a Discord Bot that collects Among Us game data to
            automatically mute/unmute players during games!
          </p>
          <div id="home-links">
            <Button
              href="https://add.automute.us/"
              className="btn btn-primary btn-lg"
            >
              <FontAwesomeIcon icon={faDiscord} size="lg" className="mr-2" />
              Add to Discord
            </Button>
            <Button
              href="https://github.com/denverquane/amonguscapture/releases/latest/download/AmongUsCapture.zip"
              className="btn btn-primary btn-lg"
            >
              <FontAwesomeIcon icon={faCamera} size="lg" className="mr-2" />
              Capture Software
            </Button>
            <Link to={"./premium"}>
              <Button className="btn btn-premium btn-lg">
                <FontAwesomeIcon icon={faGem} size="lg" className="mr-2" />
                AutoMuteUs Premium
              </Button>
            </Link>
          </div>

          <ServerStats />
        </div>
        <div id="home-crewmate">
          <object
            id="crewmate"
            alt=""
            type="image/svg+xml"
            data={crewmate}
            className="floating"
            aria-label="AutoMuteUs"
          ></object>
        </div>
      </div>
    );
  }
}

export default Home;