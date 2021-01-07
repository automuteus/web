import React from "react";
import Head from "next/head";

import { Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDiscord } from "@fortawesome/free-brands-svg-icons";
import { faCamera, faGem } from "@fortawesome/free-solid-svg-icons";

import Layout from "../components/layout";
import ServerStats from "../components/server-stats";
import Link from "next/link";

const amus_crewmate = "/assets/img/svg/amus_crewmate_2021.svg";
export default class App extends React.Component {
  render() {
    return (
      <Layout className="theatric" effect={true} effectActive={true} innerClassName="flex-column flex-lg-row align-items-center">
        <Head>
          {/* HTML Meta Tags */}
          <title>AutoMuteUs</title>
          <meta
            name="description"
            content="AutoMuteUs is a Discord Bot that collects Among Us game data to automatically mute/unmute players during games!"
          />
          <meta name="theme-color" content="#7289DA" />

          {/* Google / Search Engine Tags */}
          <meta itemProp="name" content="AutoMuteUs" />
          <meta
            itemProp="description"
            content="AutoMuteUs is a Discord Bot that collects Among Us game data to automatically mute/unmute players during games!"
          />
          <meta
            itemProp="image"
            content="http://raw.githubusercontent.com/automuteus/react-web/main/public/assets/img/logo_embed.png"
          />

          {/* Discord/Facebook Meta Tags */}
          <meta property="og:url" content="https://automute.us" />
          <meta property="og:type" content="website" />
          <meta property="og:title" content="AutoMuteUs" />
          <meta
            property="og:description"
            content="AutoMuteUs is a Discord Bot that collects Among Us game data to automatically mute/unmute players during games!"
          />
          <meta
            property="og:image"
            content="http://raw.githubusercontent.com/automuteus/react-web/main/public/assets/img/logo_embed.png"
          />

          {/* Twitter Meta Tags */}
          <meta name="twitter:title" content="AutoMuteUs" />
          <meta
            name="twitter:description"
            content="AutoMuteUs is a Discord Bot that collects Among Us game data to automatically mute/unmute players during games!"
          />
          <meta
            name="twitter:image"
            content="http://raw.githubusercontent.com/automuteus/react-web/main/public/assets/img/logo_embed.png"
          />
        </Head>
        <div id="home-text">
          <h2 className="title">Use AutoMuteUs for hands free muting</h2>
          <p className="subtitle">
            AutoMuteUs is a Discord Bot that collects Among Us game data to
            automatically mute/unmute players during games!
          </p>
          <div id="home-links">
            <Button
              href="https://add.automute.us/"
              className="btn btn-primary btn-lg mb-2 mr-2 px-2 px-lg-5"
            >
              <FontAwesomeIcon icon={faDiscord} size="lg" className="mr-2" />
              Add to Discord
            </Button>
            <Button
              href="https://github.com/denverquane/amonguscapture/releases/latest/download/AmongUsCapture.zip"
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
