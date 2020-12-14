import React from "react";
import Head from "next/head";
import { motion } from "framer-motion";

import { Table, Image, Button } from "react-bootstrap";

import Layout from "../components/layout";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaypal } from "@fortawesome/free-brands-svg-icons";
import {
  faCheckCircle,
  faPlus,
  faPlusCircle,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";

const crewmate_brown = "/assets/img/crewmate_brown.png";
const crewmate_white = "/assets/img/crewmate_white.png";
const crewmate_yellow = "/assets/img/crewmate_yellow.png";
const crewmate_cyan = "/assets/img/crewmate_cyan.png";

class Premium extends React.Component {
  render() {
    return (
      <Layout effect={true}>
        <Head>
          {/* HTML Meta Tags */}
          <title>AutoMuteUs Premium</title>
          <meta
            name="description"
            content="Avoid the game cap and more with AutoMuteUs Premium"
          />
          <meta name="theme-color" content="#7289DA" />

          {/* Google / Search Engine Tag */}
          <meta itemProp="name" content="AutoMuteUs Premium" />
          <meta
            itemProp="description"
            content="Avoid the game cap and more with AutoMuteUs Premium"
          />
          <meta
            itemProp="image"
            content="http://raw.githubusercontent.com/automuteus/react-web/main/public/assets/img/logo_premium.png"
          />

          {/* Discord/Facebook Facebook Meta Tags */}
          <meta
            property="og:url"
            content="http://wolfhound.xyz:42069/premium"
          />
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

          {/* Twitter Meta Tags */}
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
            <Table borderless responsive variant="dark" className="premium-table">
              <thead>
                <tr>
                  <th></th>
                  <th>
                    <div className="premium-item">
                      <Image className="th-crewmate" src={crewmate_brown} />
                      <h4 style={{ color: "brown" }}>Bronze</h4>
                      <Button
                        href={
                          "https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=" +
                          "M8D39PF5ADGJW" +
                          "&custom=" +
                          "this.state.guild_id"
                        }
                        target="_blank"
                        className="btn btn-premium m-0"
                        onClick={this.getGuild}
                      >
                        <FontAwesomeIcon
                          icon={faPaypal}
                          size="lg"
                          className="mr-2"
                        />{" "}
                        Select Tier
                      </Button>
                    </div>
                  </th>
                  <th>
                    <div className="premium-item">
                      <Image className="th-crewmate" src={crewmate_white} />
                      <h4 style={{ color: "white" }}>Silver</h4>
                      <Button
                        href={
                          "https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=" +
                          "CPZMEL7ZA6PHN" +
                          "&custom=" +
                          "this.state.guild_id"
                        }
                        target="_blank"
                        className="btn btn-premium m-0"
                        onClick={this.getGuild}
                      >
                        <FontAwesomeIcon
                          icon={faPaypal}
                          size="lg"
                          className="mr-2"
                        />{" "}
                        Select Tier
                      </Button>
                    </div>
                  </th>
                  <th>
                    <div className="premium-item">
                      <Image className="th-crewmate" src={crewmate_yellow} />
                      <h4 style={{ color: "yellow" }}>Gold</h4>
                      <Button
                        href={
                          "https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=" +
                          "PYFCA7562KHB6" +
                          "&custom=" +
                          "this.state.guild_id"
                        }
                        target="_blank"
                        className="btn btn-premium m-0"
                        onClick={this.getGuild}
                      >
                        <FontAwesomeIcon
                          icon={faPaypal}
                          size="lg"
                          className="mr-2"
                        />{" "}
                        Select Tier
                      </Button>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="text-success">
                <tr>
                  <th>
                    <h5 className="mb-0">Price</h5>
                    <p>
                      <em>Includes 50¢ paypal processing fee</em>
                    </p>
                  </th>
                  <td>
                    <strong>$ 1.50</strong>
                    <small> / month</small>
                  </td>
                  <td>
                    <strong>$ 3.50</strong>
                    <small> / month</small>
                  </td>
                  <td>
                    <strong>$ 5.50</strong>
                    <small> / month</small>
                  </td>
                </tr>
                <tr>
                  <th>
                    <h5>Priority Game Access</h5>
                    <p>
                      Always be able to make new games, even when the bot is
                      under high load!
                    </p>
                  </th>
                  <td>
                    <FontAwesomeIcon as="i" size="lg" icon={faCheckCircle} />
                  </td>
                  <td>
                    <FontAwesomeIcon as="i" size="lg" icon={faCheckCircle} />
                  </td>
                  <td>
                    <FontAwesomeIcon as="i" size="lg" icon={faCheckCircle} />
                  </td>
                  <td></td>
                </tr>
                <tr>
                  <th>
                    <h5>Stats and Leaderboards</h5>
                    <p>
                      View Among Us stats and leaderboards for the players on
                      your server!
                    </p>
                  </th>
                  <td>
                    <FontAwesomeIcon as="i" size="lg" icon={faCheckCircle} />
                  </td>
                  <td>
                    <FontAwesomeIcon as="i" size="lg" icon={faCheckCircle} />
                  </td>
                  <td>
                    <FontAwesomeIcon as="i" size="lg" icon={faCheckCircle} />
                  </td>
                  <td></td>
                </tr>
                <tr>
                  <th>
                    <h5>Discord Role</h5>
                    <p>
                      You'll receive the <span className="badge badge-success badge-pill badge">Supporter</span> role within the AutoMuteUs Discord!
                    </p>
                  </th>
                  <td>
                    <FontAwesomeIcon as="i" size="lg" icon={faCheckCircle} />
                  </td>
                  <td>
                    <FontAwesomeIcon as="i" size="lg" icon={faCheckCircle} />
                  </td>
                  <td>
                    <FontAwesomeIcon as="i" size="lg" icon={faCheckCircle} />
                  </td>
                  <td></td>
                </tr>
                <tr>
                  <th>
                    <h5>General Support</h5>
                    <p>
                      Access to Premium-Only channels and chats in our Official
                      Discord!
                    </p>
                  </th>
                  <td></td>
                  <td>
                    <FontAwesomeIcon as="i" size="lg" icon={faCheckCircle} />
                  </td>
                  <td>
                    <FontAwesomeIcon as="i" size="lg" icon={faCheckCircle} />
                  </td>
                  <td></td>
                </tr>
                <tr>
                  <th>
                    <h5>Priority Muting Bots</h5>
                    <p>
                      Issues requests alongside the main bot; this drastically
                      improves the speed of mutes/deafens in your games!
                    </p>
                  </th>
                  <td>
                    <strong className="fa-lg"></strong>
                  </td>
                  <td>
                    <FontAwesomeIcon as="i" size="lg" icon={faTimes} />
                    <strong className="fa-lg"> 1</strong>
                  </td>
                  <td>
                    <FontAwesomeIcon as="i" size="lg" icon={faTimes} />
                    <strong className="fa-lg"> 3</strong>
                  </td>
                  <td></td>
                </tr>
                <tr>
                  <th>
                    <h5>Premium Servers</h5>
                    <p>
                      Get your premium AutoMuteUs bot status in multiple
                      servers!
                    </p>
                  </th>
                  <td>
                    <strong className="fa-lg"></strong>
                  </td>
                  <td>
                    <strong className="fa-lg"></strong>
                  </td>
                  <td>
                    <FontAwesomeIcon as="i" size="lg" icon={faTimes} />
                    <strong className="fa-lg"> 2</strong>
                  </td>
                  <td></td>
                </tr>
              </tbody>
            </Table>
          </div>
          <div className="premium-table-wrap">
            <h1>💎 Donator Tier 💎</h1>

            <Table borderless responsive variant="dark" className="donation-table">
              <thead>
                <tr>
                  <th>
                    <div className="premium-item">
                      <Image className="th-crewmate" src={crewmate_cyan} />
                      <h4 style={{ color: "cyan" }}>Donation</h4>
                      <Button
                        href={
                          "https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=" +
                          "YM72RY5TF6WZU" +
                          "&custom=" +
                          "this.state.guild_id"
                        }
                        target="_blank"
                        className="btn btn-premium m-0"
                        onClick={this.getGuild}
                      >
                        <FontAwesomeIcon
                          icon={faPaypal}
                          size="lg"
                          className="mr-2"
                        />{" "}
                        Donate
                      </Button>
                    </div>
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
                      Additionally, you will receive the <span className="badge badge-success badge-pill badge">Supporter</span> role in the
                      AutoMuteUs Discord server.
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
}

export default Premium;
