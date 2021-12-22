import { useState } from "react";
import { faDiscord } from "@fortawesome/free-brands-svg-icons";
import { faCamera, faGem } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";

import Layout from "../components/layouts/MainLayout";
import * as util from "../utils/functions";
import useServerStats from "../components/hooks/useServerStats";
import ServerStat from "../components/index/ServerStat";
import { Collapse } from "react-bootstrap";

const crewmate = "/assets/img/svg/amus_crewmate_robo.svg";

const IndexPage = () => {
  const [showDetails, _setShowDetails] = useState<boolean>(false);

  const serverStats = useServerStats();

  const stats = [
    {
      stat: serverStats.data?.totalGuilds,
      base: 0,
      label: "Servers",
    },
    {
      stat: serverStats.data?.activeGames,
      base: 0,
      label: "Active Games",
    },
    {
      stat: serverStats.data?.totalUsers,
      base: 0,
      label: "Users",
    },
    {
      stat: serverStats.data?.totalGames,
      base: 262000,
      label: "Games Muted",
    },
  ];

  return (
    <Layout theatric>
      <div className="d-flex flex-md-row flex-column flex-grow-1 justify-content-between align-items-center">
        <div className="p-4">
          <h1>Use AutoMuteUs for hands free muting</h1>
          <div className="subtitle mb-3">
            AutoMuteUs is a Discord Bot that collects Among Us game data to
            automatically mute/unmute players during games!
          </div>

          <div id="home-links">
            <button
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
            </button>
            <a
              href="https://github.com/automuteus/capture-install#readme"
              className="btn btn-primary btn-lg mb-2 mr-2 px-2 px-lg-5"
            >
              <FontAwesomeIcon icon={faCamera} size="lg" className="mr-2" />
              Capture Software
            </a>

            <Link href="/premium">
              <button className="btn btn-premium btn-lg mb-2 mr-2 px-2 px-lg-5">
                <FontAwesomeIcon icon={faGem} size="lg" className="mr-2" />
                AutoMuteUs Premium
              </button>
            </Link>
          </div>

          <div id="home-stats">
            {serverStats.isError || serverStats.error ? (
              <div className="py-4" style={{ opacity: 0.5 }}>
                Error connectiong to <kbd>galactus.automute.us</kbd>
              </div>
            ) : (
              stats.map((v) => <ServerStat key={v.label} {...v} />)
            )}
          </div>

          <Collapse in={showDetails}>
            <div id="bot-info">
              <div className="embed d-inline-grid shadow">
                <div className="embed-inner">
                  <div className="embed-title">Bot Info</div>
                  <div className="embed-fields grid-row-3">
                    <div className="embed-field grid-col-1-3">
                      <div className="embed-field-name">Version</div>
                      <div className="embed-field-value">
                        {serverStats.data?.version}
                      </div>
                    </div>
                    <div className="embed-field grid-col-2-3">
                      <div className="embed-field-name">Library</div>
                      <div className="embed-field-value">discordgo</div>
                    </div>
                    <div className="embed-field grid-col-3-3">
                      <div className="embed-field-name">Creator</div>
                      <div className="embed-field-value">Soup#4222</div>
                    </div>

                    <div className="embed-field grid-col-1-3">
                      <div className="embed-field-name">Guilds</div>
                      <div className="embed-field-value">
                        {serverStats.data?.totalGuilds}
                      </div>
                    </div>
                    <div className="embed-field grid-col-2-3">
                      <div className="embed-field-name">Active Games</div>
                      <div className="embed-field-value">
                        {serverStats.data?.activeGames}
                      </div>
                    </div>
                    <div className="embed-field grid-col-3-3"></div>

                    <div className="embed-field grid-col-1-3">
                      <div className="embed-field-name">Total Games</div>
                      <div className="embed-field-value">
                        {serverStats.data
                          ? serverStats.data.totalGames + 262000
                          : 0}
                      </div>
                    </div>
                    <div className="embed-field grid-col-2-3">
                      <div className="embed-field-name">Total Users</div>
                      <div className="embed-field-value">
                        {serverStats.data?.totalUsers}
                      </div>
                    </div>
                    <div className="embed-field grid-col-3-3"></div>
                  </div>
                  <div className="embed-footer"></div>
                </div>
              </div>
            </div>
          </Collapse>
        </div>

        <div id="home-crewmate">
          <object
            id="crewmate"
            type="image/svg+xml"
            data={crewmate}
            className="floating"
            aria-label="AutoMuteUs"
          />
        </div>
      </div>
    </Layout>
  );
};

export default IndexPage;
