import React, { useState } from "react";
import Head from "next/head";
import { getSession } from "next-auth/client";

import {
  Button,
  Col,
  Container,
  Nav,
  OverlayTrigger,
  Row,
  Tooltip,
} from "react-bootstrap";
import { faLink } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import * as util from "../../components/utility/client";
import Layout from "../../components/common/layout";
import SigninRequired from "../../components/common/signin-required";
import GuildDropdown from "../../components/common/guild-dropdown";

export default function Dashboard({ session }) {
  const uid = session ? session.user.id : "";
  const [guild, setGuild] = useState(null);
  const [serverName, setServerName] = useState("Select Server");
  const [guildA, guildALoading, guildAError] = util.listUserGuildsAdmin(uid);

  const handleGuildSelect = (key, e) => {
    setGuild(guildA.filter((g) => g.guild_id === key)[0]);
    setServerName(e.target.innerHTML);
  };

  if (session) {
    return (
      <Layout
        innerClassName="align-items-center justify-content-start flex-column"
        effect={false}
      >
        <Head>
          <title>Dashboard | AutoMuteUs</title>
        </Head>
        <Container className="d-flex flex-column flex-grow-1" size="lg" fluid>
          <Row xs={1} md={4} className="page-header mb-2 mb-lg-0">
            <Col>
              <h1>Bot Dashboard</h1>
            </Col>
            <Col>
              <div className="d-flex justify-content-start justify-content-sm-end align-items-center">
                <GuildDropdown
                  isLoading={guildALoading}
                  isError={guildAError}
                  serverName={serverName}
                  guildList={guildA}
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
                          url: `https://discord.com/oauth2/authorize?client_id=753795015830011944&permissions=267746384&scope=bot&guild_id=${guild.guild_id}`,
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
