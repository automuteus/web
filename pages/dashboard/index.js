import React, { useState } from "react";
import Head from "next/head";
import { getSession } from "next-auth/client";

import { Container, Dropdown } from "react-bootstrap";

import * as util from "../../components/utility/client";
import Layout from "../../components/layout";
import GuildDropdown from "../../components/guild-dropdown";
import SigninRequired from "../../components/signin-required";

export default function Premium({ session }) {
  const uid = session ? session.user.id : "";
  const [serverName, setServerName] = useState("Select Server");
  const { user_guilds, isLoading, isError } = util.listUserGuilds(uid);

  const handleGuildSelect = (key, e) => {
    setServerName(e.target.innerHTML);
    console.log(key);
  };

  let guilds = null;
  if (session) {
    return (
      <Layout
        innerClassName="align-items-center justify-content-start flex-column"
        effect={false}
      >
        <Head>
          <title>AutoMuteUs Bot Dashboard</title>
          <meta
            name="description"
            content="Manage your AutoMuteUs bot installations."
          />
          <meta name="theme-color" content="#7289DA" />

          <meta itemProp="name" content="AutoMuteUs Premium" />
          <meta
            itemProp="description"
            content="Manage your AutoMuteUs bot installations."
          />
          <meta
            itemProp="image"
            content="http://automute.us/assets/img/logo_embed.png"
          />

          <meta property="og:url" content="http://automute.us/premium" />
          <meta property="og:type" content="website" />
          <meta property="og:title" content="AutoMuteUs Premium" />
          <meta
            property="og:description"
            content="Manage your AutoMuteUs bot installations."
          />
          <meta
            property="og:image"
            content="http://automute.us/assets/img/logo_embed.png"
          />

          <meta name="twitter:title" content="AutoMuteUs Premium" />
          <meta
            name="twitter:description"
            content="Manage your AutoMuteUs bot installations."
          />
          <meta
            name="twitter:image"
            content="http://automute.us/assets/img/logo_embed.png"
          />
        </Head>
        <Container className="" size="lg">
          <div className="page-header">
            <h1>Bot Dashboard</h1>
            <GuildDropdown
              isLoading={isLoading}
              isError={isError}
              serverName={serverName}
              guildList={user_guilds}
              onSelect={handleGuildSelect}
            />
          </div>
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
