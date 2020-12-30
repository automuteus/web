import React, { useState } from "react";
import Head from "next/head";
import { getSession, signIn } from "next-auth/client";
import { useRouter } from "next/router";
import { motion } from "framer-motion";

import { Table, Image, Button, Form } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDiscord, faPaypal } from "@fortawesome/free-brands-svg-icons";
import { faCheckCircle, faTimes } from "@fortawesome/free-solid-svg-icons";

import Layout from "../components/layout";
import * as util from "../components/utility/client";

const crewmate_brown = "/assets/img/crewmate_brown.png";
const crewmate_white = "/assets/img/crewmate_white.png";
const crewmate_yellow = "/assets/img/crewmate_yellow.png";
const crewmate_cyan = "/assets/img/crewmate_cyan.png";

export default function Premium({ session }) {
  const router = useRouter();
  const [guild, setGuild] = useState(router.query.guild);
  let guilds = null;

  if (session) {
    const { user_guilds, isLoading, isError } = util.listUserGuilds(
      session.user.id
    );

    if (Array.isArray(user_guilds)) {
      guilds = user_guilds.sort(util.compareGuilds).map((g) => (
        <option key={g.guild_id} value={g.guild_id}>
          {g.guilds.name}
        </option>
      ));
    }
  }

  return (
    <Layout effect={true}>
      <Head>
        <title>AutoMuteUs Premium</title>
        <meta
          name="description"
          content="Avoid the game cap and more with AutoMuteUs Premium"
        />
        <meta name="theme-color" content="#7289DA" />

        <meta itemProp="name" content="AutoMuteUs Premium" />
        <meta
          itemProp="description"
          content="Avoid the game cap and more with AutoMuteUs Premium"
        />
        <meta
          itemProp="image"
          content="http://raw.githubusercontent.com/automuteus/react-web/main/public/assets/img/logo_premium.png"
        />

        <meta property="og:url" content="http://automute.us/premium" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="AutoMuteUs Premium" />
        <meta
          property="og:description"
          content="Avoid the game cap and more with AutoMuteUs Premium"
        />
        <meta
          property="og:image"
          content="http://raw.githubusercontent.com/automuteus/react-web/main/public/assets/img/logo_premium.png"
        />

        <meta name="twitter:title" content="AutoMuteUs Premium" />
        <meta
          name="twitter:description"
          content="Avoid the game cap and more with AutoMuteUs Premium"
        />
        <meta
          name="twitter:image"
          content="http://raw.githubusercontent.com/automuteus/react-web/main/public/assets/img/logo_premium.png"
        />
      </Head>
      <motion.div
        exit={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        initial={{ opacity: 0 }}
        className="d-flex flex-column flex-lg-row align-items-start justify-content-center"
      >
        <div className="premium-table-wrap">
          <h1>⭐ AutoMuteUs Premium ⭐</h1>
          <Table
            borderless
            striped
            responsive
            variant="dark"
            className="premium-table"
          >
            <thead>
              <tr>
                <th>
                  <div>
                    {session && (
                      <Form>
                        <Form.Group controlId="guild_select" className="mb-0">
                          <Form.Label>Select a Discord Server:</Form.Label>
                          <Form.Control
                            as="select"
                            custom
                            onChange={(e) => setGuild(e.target.value)}
                            defaultValue="0"
                          >
                            <option key="0" value="0" disabled>
                              - Server List -
                            </option>
                            {guilds}
                          </Form.Control>
                        </Form.Group>
                      </Form>
                    )}

                    {!session && (
                      <div className="text-center">
                        <strong>To get premium for your bot,</strong>

                        <div
                          className="d-block btn btn-primary mr-0 mt-2 mb-2"
                          onClick={() =>
                            signIn("discord", {
                              callbackUrl:
                                process.env.NEXTAUTH_URL + "/premium",
                            })
                          }
                        >
                          <FontAwesomeIcon
                            icon={faDiscord}
                            size="lg"
                            className="mr-2"
                          />
                          Sign In
                        </div>
                        <strong>or enter a Guild ID here</strong>
                        <Form.Group className="m-0 mt-2">
                          <Form.Control
                            type="text"
                            className="text-center guild-input"
                            placeholder="17-20 digit ID"
                            value={guild}
                            onChange={(e) => setGuild(e.target.value)}
                            minLength="17"
                            maxLength="20"
                          />
                        </Form.Group>
                      </div>
                    )}
                  </div>
                </th>
                <th>
                  <PremiumItem
                    icon={crewmate_brown}
                    title="Bronze"
                    color="#71491e"
                    pp_target="M8D39PF5ADGJW"
                    guild_id={guild}
                  />
                </th>
                <th>
                  <PremiumItem
                    icon={crewmate_white}
                    title="Silver"
                    color="#d6e0f0"
                    pp_target="CPZMEL7ZA6PHN"
                    guild_id={guild}
                  />
                </th>
                <th>
                  <PremiumItem
                    icon={crewmate_yellow}
                    title="Gold"
                    color="#ffd700"
                    pp_target="PYFCA7562KHB6"
                    guild_id={guild}
                  />
                </th>
              </tr>
            </thead>
            <tbody className="text-success">
              <FeatureRow
                title="Price"
                subtitle="Includes 50¢ PayPal txn fee"
                tier1={
                  <>
                    <strong>$ 1.50</strong>
                    <small> / month</small>
                  </>
                }
                tier2={
                  <>
                    <strong>$ 3.50</strong>
                    <small> / month</small>
                  </>
                }
                tier3={
                  <>
                    <strong>$ 5.50</strong>
                    <small> / month</small>
                  </>
                }
              />
              <FeatureRow
                title="Priority Game Access"
                subtitle="Always be able to make new games, even when the bot is under high load!"
                tier1={
                  <FontAwesomeIcon as="i" size="lg" icon={faCheckCircle} />
                }
                tier2={
                  <FontAwesomeIcon as="i" size="lg" icon={faCheckCircle} />
                }
                tier3={
                  <FontAwesomeIcon as="i" size="lg" icon={faCheckCircle} />
                }
              />
              <FeatureRow
                title="Stats and Leaderboards"
                subtitle="View Among Us stats and leaderboards for the players on your
                server!"
                tier1={
                  <FontAwesomeIcon as="i" size="lg" icon={faCheckCircle} />
                }
                tier2={
                  <FontAwesomeIcon as="i" size="lg" icon={faCheckCircle} />
                }
                tier3={
                  <FontAwesomeIcon as="i" size="lg" icon={faCheckCircle} />
                }
              />
              <FeatureRow
                title="Discord Role"
                subtitle={
                  <>
                    You'll receive the{" "}
                    <span className="badge badge-success badge-pill badge">
                      Supporter
                    </span>{" "}
                    role within the AutoMuteUs Discord!
                  </>
                }
                tier1={
                  <FontAwesomeIcon as="i" size="lg" icon={faCheckCircle} />
                }
                tier2={
                  <FontAwesomeIcon as="i" size="lg" icon={faCheckCircle} />
                }
                tier3={
                  <FontAwesomeIcon as="i" size="lg" icon={faCheckCircle} />
                }
              />
              <FeatureRow
                title="General Support"
                subtitle="Access to Premium-Only channels and chats in our Official Discord!"
                tier1=""
                tier2={
                  <FontAwesomeIcon as="i" size="lg" icon={faCheckCircle} />
                }
                tier3={
                  <FontAwesomeIcon as="i" size="lg" icon={faCheckCircle} />
                }
              />
              <FeatureRow
                title="Priority Muting Bots"
                subtitle=" Issues requests alongside the main bot; this drastically improves the speed of mutes/deafens in your games!"
                tier1=""
                tier2={
                  <>
                    <FontAwesomeIcon as="i" size="lg" icon={faTimes} />
                    <strong className="fa-lg"> 1</strong>
                  </>
                }
                tier3={
                  <>
                    <FontAwesomeIcon as="i" size="lg" icon={faTimes} />
                    <strong className="fa-lg"> 3</strong>
                  </>
                }
              />
              <FeatureRow
                title="Premium Servers"
                subtitle="Get your premium AutoMuteUs bot status in multiple servers!"
                tier1=""
                tier2=""
                tier3={
                  <>
                    <FontAwesomeIcon as="i" size="lg" icon={faTimes} />
                    <strong className="fa-lg"> 2</strong>
                  </>
                }
              />
            </tbody>
          </Table>
        </div>
        <div className="premium-table-wrap">
          <h1>💎 Donator Tier 💎</h1>

          <Table
            borderless
            striped
            responsive
            variant="dark"
            className="donation-table"
          >
            <thead>
              <tr>
                <th>
                  <PremiumItem
                    icon={crewmate_cyan}
                    title="Donation"
                    color="#38fedc"
                    pp_target="YM72RY5TF6WZU"
                    btn_text="Donate"
                    guild_id="donation"
                  />
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <h5>Chip in any amount you wish ❤️</h5>
                  <p>
                    You won't get any special bot privileges, but you will get
                    our thanks for making this Open Source Project possible!
                  </p>
                  <p>
                    Additionally, you will receive the{" "}
                    <span className="badge badge-success badge-pill badge">
                      Supporter
                    </span>{" "}
                    role in the AutoMuteUs Discord server.
                  </p>
                </td>
              </tr>
            </tbody>
          </Table>
        </div>
      </motion.div>
    </Layout>
  );
}

function FeatureRow(props) {
  return (
    <tr>
      <th>
        <h5>{props.title}</h5>
        <p>{props.subtitle}</p>
      </th>
      <td>{props.tier1}</td>
      <td>{props.tier2}</td>
      <td>{props.tier3}</td>
    </tr>
  );
}

function PremiumItem(props) {
  const guild_target = props.guild_id ? "&custom=" + props.guild_id : "";
  const valid = validGuild(props.guild_id);

  return (
    <div className="premium-item">
      <Image className="th-crewmate" src={props.icon} />
      <h4 style={{ color: props.color }}>{props.title}</h4>
      <div title={!valid ? "Please choose a server first" : ""}>
        <Button
          href={
            "https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=" +
            props.pp_target +
            guild_target
          }
          target="_blank"
          className="btn btn-premium m-0"
          disabled={!valid && props.guild_id !== "donation"}
        >
          <FontAwesomeIcon icon={faPaypal} size="lg" className="mr-2" />{" "}
          <span>{props.btn_text || "Select Tier"}</span>
        </Button>
      </div>
    </div>
  );
}

function validGuild(gid) {
  return !isNaN(gid) && gid !== 0 && gid.length >= 17 && gid.length <= 20;
}

export async function getServerSideProps(context) {
  const session = await getSession(context);

  return {
    props: { session },
  };
}
