import React, { useState } from "react";
import Head from "next/head";
import { getSession } from "next-auth/client";

import {
  Badge,
  Button,
  Card,
  CardDeck,
  Col,
  Container,
  Image,
  Nav,
  OverlayTrigger,
  Row,
  Spinner,
  Tooltip,
} from "react-bootstrap";
import { faLink, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import * as util from "../../components/utility/client";
import Layout from "../../components/common/layout";
import SigninRequired from "../../components/common/signin-required";
import GuildDropdown from "../../components/common/guild-dropdown";

export default function Dashboard({ session }) {
  const uid = session ? session.user.id : "";
  const [guild, setGuild] = useState(null);
  const [serverName, setServerName] = useState("Select Server");
  const {
    userGuilds,
    userGuildsLoading,
    userGuildsError,
  } = util.listUserGuilds(uid);
  const {
    adminGuilds,
    adminGuildsLoading,
    adminGuildsError,
  } = util.listUserGuildsAdmin(uid);

  const handleGuildSelect = (key, e) => {
    setGuild(adminGuilds.filter((g) => g.guild_id === key)[0]);
    setServerName(e.target.innerHTML);
  };

  if (session) {
    return (
      <Layout
        innerClassName="align-items-center justify-content-start flex-column"
        effect={false}
      >
        <Head>
          <title>AutoMuteUs Bot Dashboard</title>
        </Head>
        <Container className="d-flex flex-column flex-grow-1" size="lg" fluid>
          <Row xs={1} md={4} className="page-header mb-2 mb-lg-0">
            <Col>
              <h1>Bot Dashboard</h1>
            </Col>
            <Col>
              <div className="d-flex justify-content-start justify-content-sm-end align-items-center">
                <GuildDropdown
                  isLoading={adminGuildsLoading}
                  isError={adminGuildsError}
                  serverName={serverName}
                  guildList={adminGuilds}
                  onSelect={handleGuildSelect}
                />
                <div className="guild-invite-link text-right">
                  <OverlayTrigger
                    placement="top"
                    delay={{ show: 100, hide: 0 }}
                    trigger={["hover", "focus"]}
                    overlay={
                      <Tooltip id={"bot-add-tooltip"}>Bot Invite Link</Tooltip>
                    }
                  >
                    <Button
                      onClick={() =>
                        util.popupCenter({
                          url: `https://discord.com/oauth2/authorize?client_id=753795015830011944&permissions=267746384&scope=bot&guild_id=${
                            guild.guild_id
                          }`,
                          title: "Add AutoMuteUs",
                          w: 400,
                          h: 600,
                        })
                      }
                      target="_blank"
                      className="ml-2"
                      disabled={guild == null}
                      title="Bot Invite Link"
                    >
                      <FontAwesomeIcon icon={faLink} />
                    </Button>
                  </OverlayTrigger>
                </div>
              </div>
            </Col>
          </Row>
          <div className="page-content d-flex flex-column flex-md-grow-1">
            <Row className="flex-grow-1">
              <Col xs={12} md={4} xl={2} className="d-flex flex-column mb-2">
                <Nav
                  variant="pills"
                  defaultActiveKey="overview"
                  className="flex-column dashboard-nav flex-grow-1"
                >
                  <Nav.Link eventKey="overview">
                    <div>Overview</div>
                    <div className="font-weight-normal d-none subtitle">
                      View a list of all your servers.
                    </div>
                  </Nav.Link>
                  <Nav.Link eventKey="details">
                    <div>Servers</div>
                    <div className="font-weight-normal d-none subtitle">
                      View general server information related to AutoMuteUs,
                      including premium status.
                    </div>
                  </Nav.Link>
                  <Nav.Link eventKey="settings">
                    <div>Bot Settings</div>
                    <div className="font-weight-normal d-none subtitle">
                      Configure your bot's settings, import and export
                      configurations, and share.
                    </div>
                  </Nav.Link>
                  <Nav.Link eventKey="stats">
                    <div>Stats</div>
                    <div className="font-weight-normal d-none subtitle">
                      View previous match stats and other related information.
                    </div>
                  </Nav.Link>
                </Nav>
              </Col>
              <Col className="d-none">
                {userGuildsLoading && !userGuildsError && (
                  <div className="d-flex flex-column align-items-center justify-content-center h-100">
                    <Spinner
                      animation="grow"
                      role="status"
                      style={{ width: "5em", height: "5em" }}
                    >
                      <span className="sr-only">Loading...</span>
                    </Spinner>
                    <h5 className="mt-3">Loading your guilds...</h5>
                  </div>
                )}
                {!userGuildsLoading && !userGuildsError && (
                  <div className="server-list">
                    <CardDeck>
                      {userGuilds.sort(util.compareGuilds).map((g, i) => {
                        return (
                          <>
                            <GuildCard guild={g} />
                            {(i + 1) % 2 == 0 && (
                              <div class="w-100 d-none d-sm-block d-md-none" />
                            )}
                            {(i + 1) % 3 == 0 && (
                              <div class="w-100 d-none d-sm-block d-lg-none" />
                            )}
                            {(i + 1) % 4 == 0 && (
                              <div class="w-100 d-none d-lg-block d-xl-none" />
                            )}
                            {(i + 1) % 5 == 0 && (
                              <div class="w-100 d-none d-xl-block" />
                            )}
                          </>
                        );
                      })}
                    </CardDeck>
                    <pre>{JSON.stringify(guild, null, 2)}</pre>
                  </div>
                )}
              </Col>
            </Row>
          </div>
        </Container>
      </Layout>
    );
  } else {
    return <SigninRequired />;
  }
}

export async function getServerSideProps(context) {
  const session = await getSession(context);

  return {
    props: { session },
  };
}

function GuildCard(props) {
  const { guild } = props;
  if (!guild) return <em>Select a guild to continue.</em>;

  const premiums = {
    0: { title: "Basic", bg: "#2f2f2f", color: "#bbbbbb" },
    1: { title: "Bronze", bg: "#71491e", color: "black" },
    2: { title: "Silver", bg: "#d6e0f0", color: "black" },
    3: { title: "Gold", bg: "#ffd700", color: "black" },
    4: { title: "Platinum", bg: "#38fedc", color: "black" },
  };

  const abbr = guild.guilds.name.match(/\b\w/g).join("");
  const fs = 2 - Math.min(Math.max(abbr.length - 2, 0) * 0.1, 0.7) + "rem";
  let guild_icon = (
    <div className="guild-abbr" style={{ fontSize: fs }}>
      {abbr}
    </div>
  );

  if (guild.guilds.icon) {
    const icon =
      guild.guilds.icon +
      (guild.guilds.icon.startsWith("a_") ? ".gif" : ".png");

    const icon_url = `https://cdn.discordapp.com/icons/${
      guild.guilds.guild_id
    }/${icon}`;

    guild_icon = <img src={icon_url} alt={guild.guilds.name} />;
  }

  return (
    <Card bg="dark" className="shadow mb-3">
      <Card.Body className="text-center">
        <div className="guild-icon ml-auto mr-auto mb-3">{guild_icon}</div>
        <Card.Title className="font-weight-bold font-family-title d-flex flex-column justify-content-center align-items-center">
          <span className="text-ellipsis" />
          <div className="mt-2" />
          <Badge
            style={{
              backgroundColor: premiums[guild.guilds.premium].bg,
              color: premiums[guild.guilds.premium].color,
            }}
            className="guild-badge"
          >
            {premiums[guild.guilds.premium].title}
          </Badge>
        </Card.Title>
      </Card.Body>
    </Card>
  );
}
