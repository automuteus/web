import React, { useState } from "react";
import Head from "next/head";
import { getSession } from "next-auth/client";

import { Button, Container, Dropdown } from "react-bootstrap";

import * as util from "../../components/utility/client";
import Layout from "../../components/layout";
import GuildDropdown from "../../components/guild-dropdown";
import SigninRequired from "../../components/signin-required";
import { faPlus, faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

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
        <Container className="" size="lg">
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
                <Button
                  href={`https://discord.com/oauth2/authorize?client_id=753795015830011944&permissions=267746384&scope=bot&guild_id=${guildId}`}
                  target="_blank"
                  className="ml-2"
                  title="Invite bot to server"
                  disabled={guildId == null}
                >
                  <FontAwesomeIcon icon={faPlus} />
                </Button>
              </div>
            </div>
          </div>
          <pre>{guildId ?? "Select a guild to see ID"}</pre>
          <div className="page-content" />
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
