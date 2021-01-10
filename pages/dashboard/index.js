import React, { useState } from "react";
import Head from "next/head";
import { getSession } from "next-auth/client";

import {
  Button,
  Col,
  Container,
  Dropdown,
  Nav,
  OverlayTrigger,
  Row,
  Tooltip,
} from "react-bootstrap";

import * as util from "../../components/utility/client";
import Layout from "../../components/layout";
import GuildDropdown from "../../components/guild-dropdown";
import SigninRequired from "../../components/signin-required";
import { faPlus, faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";

export default function Premium({ session }) {
  const uid = session ? session.user.id : "";
  const [guildId, setGuildId] = useState(null);
  const [serverName, setServerName] = useState("Select Server");
  const { user_guilds, isLoading, isError } = util.listUserGuildsAdmin(uid);

  const handleGuildSelect = (key, e) => {
    setGuildId(key);
    setServerName(e.target.innerHTML);
    console.log(key);
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
        <Container className="" size="lg" fluid>
          <div className="page-header">
            <h1>Bot Dashboard</h1>
            <div className="d-flex align-items-center">
              <GuildDropdown
                isLoading={isLoading}
                isError={isError}
                serverName={serverName}
                guildList={user_guilds}
                onSelect={handleGuildSelect}
              />
              <div className="guild-invite-link text-right">
                <OverlayTrigger
                  placement="top"
                  delay={{ show: 100, hide: 0 }}
                  trigger={["hover", "focus"]}
                  overlay={
                    <Tooltip id={"bot-add-tooltip"}>
                      Invite Bot to Server
                    </Tooltip>
                  }
                >
                  <Button
                    onClick={() =>
                      util.popupCenter({
                        url: `https://discord.com/oauth2/authorize?client_id=753795015830011944&permissions=267746384&scope=bot&guild_id=${guildId}`,
                        title: "Add AutoMuteUs",
                        w: 400,
                        h: 600,
                      })
                    }
                    target="_blank"
                    className="ml-2"
                    disabled={guildId == null}
                  >
                    <FontAwesomeIcon icon={faPlus} />
                  </Button>
                </OverlayTrigger>
              </div>
            </div>
          </div>
          <div className="page-content">
            <Row>
              <Col xs={12} lg={2}>
                <Nav
                  variant="pills"
                  defaultActiveKey="dashboard/server"
                  className="flex-column dashboard-nav"
                >
                  <Nav.Link eventKey="/server">Server Details</Nav.Link>
                  <Nav.Link eventKey="Bot Settings">Link</Nav.Link>
                  <Nav.Link eventKey="Stats">Link</Nav.Link>
                </Nav>
              </Col>
              <Col xs={12} lg={10}>
                <pre>s</pre>
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
