import React from "react";
import Head from "next/head";
import Link from "next/link";

import { Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDiscord } from "@fortawesome/free-brands-svg-icons";
import { faCamera, faGem } from "@fortawesome/free-solid-svg-icons";

import Layout from "../components/common/layout";
import * as util from "../components/utility/client";
import ServerStats from "../components/common/server-stats";

const amus_crewmate = "/assets/img/svg/amus_crewmate_robo.svg";
export default class App extends React.Component {
  render() {
    return (
      <Layout
        className="theatric"
        effect={true}
        effectActive={true}
        innerClassName="flex-column flex-lg-row align-items-center"
      >
        <div id="home-text">
          <h2 className="title">Use AutoMuteUs for hands free muting</h2>
          <p className="subtitle">
            AutoMuteUs is a Discord Bot that collects Among Us game data to
            automatically mute/unmute players during games!
          </p>
          <div id="home-links">
            <Button
              onClick={() =>
                util.popupCenter({
                  url: "https://add.automute.us/",
                  title: "Add AutoMuteUs",
                  w: 400,
                  h: 600,
                })
              }
              className="btn btn-primary btn-lg mb-2 mr-2 px-2 px-lg-5"
            >
              <FontAwesomeIcon icon={faDiscord} size="lg" className="mr-2" />
              Add to Discord
            </Button>
            <Button
              href="https://github.com/automuteus/capture-install#readme"
              className="btn btn-primary btn-lg mb-2 mr-2 px-2 px-lg-5"
            >
              <FontAwesomeIcon icon={faCamera} size="lg" className="mr-2" />
              Capture Software
            </Button>

            <Link href="/premium">
              <Button className="btn btn-premium btn-lg mb-2 mr-2 px-2 px-lg-5">
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
            data={amus_crewmate}
            className="floating"
            aria-label="AutoMuteUs"
          />
        </div>
      </Layout>
    );
  }
}
