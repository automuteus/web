import React, { useState } from "react";
import Head from "next/head";
import { getSession, signIn } from "next-auth/client";
import { useRouter } from "next/router";

import {
  Badge,
  Button,
  Card,
  CardDeck,
  Container,
  Dropdown,
  Image,
  ListGroup,
  ListGroupItem,
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDiscord, faPaypal } from "@fortawesome/free-brands-svg-icons";
import {
  faCheckCircle,
  faGamepad,
  faLifeRing,
  faMedal,
  faRobot,
  faTimes,
  faTimesCircle,
} from "@fortawesome/free-solid-svg-icons";

import * as util from "../../components/utility/client";
import Layout from "../../components/layout";

const crewmate_brown = "/assets/img/crewmate_brown.png";
const crewmate_white = "/assets/img/crewmate_white.png";
const crewmate_yellow = "/assets/img/crewmate_yellow.png";
const crewmate_cyan = "/assets/img/crewmate_cyan.png";

const current_perks = [
  {
    perk: "Priority Game Access",
    description:
      "Always be able to make new games, even when the bot is under high load! ",
    icon: <FontAwesomeIcon size="2x" className="mb-3" icon={faGamepad} />,
  },
  {
    perk: "Stats and Leaderboards",
    description:
      "View Among Us stats and leaderboards for the players on your server!",
    icon: <FontAwesomeIcon size="2x" className="mb-3" icon={faMedal} />,
  },
  {
    perk: "General Support",
    description:
      "Access to Premium-only channels and chats in our official Discord!",
    icon: <FontAwesomeIcon size="2x" className="mb-3" icon={faLifeRing} />,
  },
  {
    perk: "Priority Muting Bots",
    description:
      "Issues requests alongside the main bot; this drastically improves the speed of mutes/deafens in your games",
    icon: <FontAwesomeIcon size="2x" className="mb-3" icon={faRobot} />,
  },
  {
    perk: "Premium Servers",
    description:
      "Get your premium AutoMuteUs bot status in multiple Discord servers!",
    icon: <FontAwesomeIcon size="2x" className="mb-3" icon={faDiscord} />,
  },
];

export default function Premium({ session }) {
  const router = useRouter();
  const [guild, setGuild] = useState(router.query.guild);
  const [serverName, setServerName] = useState("Select Server");

  const uid = session ? session.user.id : "";
  const { user_guilds, isLoading, isError } = util.listUserGuilds(uid);

  const handleGuildSelect = (key, e) => {
    console.log(e.target);
    setGuild(key);
    setServerName(e.target.innerHTML);
  };

  let guilds = null;
  if (session) {
    if (Array.isArray(user_guilds)) {
      guilds = user_guilds.sort(util.compareGuilds).map((g) => {
        const icon = `https://cdn.discordapp.com/icons/${g.guilds.guild_id}/${
          g.guilds.icon
        }.png`;
        const abbr = g.guilds.name.match(/\b\w/g).join("");
        const fs =
          0.8 - Math.min(Math.max(abbr.length - 2, 0) * 0.1, 0.7) + "rem";
        return (
          <Dropdown.Item
            key={g.guild_id}
            eventKey={g.guild_id}
            className="guild-dropdown-item"
          >
            <div className="guild-icon">
              {g.guilds.icon ? (
                <img src={icon} alt={g.guilds.name} />
              ) : (
                <div className="guild-abbr" style={{ fontSize: fs }}>
                  {abbr}
                </div>
              )}
            </div>

            <span>{g.guilds.name}</span>
          </Dropdown.Item>
        );
      });
    }
  }

  return (
    <Layout
      innerClassName="align-items-center justify-content-start flex-column"
      effect={false}
    >
      <Head>
        <title>Premium | AutoMuteUs</title>
        <meta
          name="description"
          content="Avoid the game cap and more with AutoMuteUs Premium"
        />

        <meta itemProp="name" content="Premium | AutoMuteUs" />
        <meta
          itemProp="description"
          content="Avoid the game cap and more with AutoMuteUs Premium"
        />
        <meta
          itemProp="image"
          content={`https://dev.automute.us/assets/img/logo_premium.png`}
        />

        <meta property="og:url" content={`https://dev.automute.us/premium`} />
        <meta property="og:title" content="Premium | AutoMuteUs" />
        <meta
          property="og:description"
          content="Avoid the game cap and more with AutoMuteUs Premium"
        />
        <meta
          property="og:image"
          content={`https://dev.automute.us/assets/img/logo_premium.png`}
        />

        <meta name="twitter:title" content="AutoMuteUs Premium" />
        <meta
          name="twitter:description"
          content="Avoid the game cap and more with AutoMuteUs Premium"
        />
        <meta
          name="twitter:image"
          content={`https://dev.automute.us/assets/img/logo_premium.png`}
        />
      </Head>
      <Container className="text-center" size="lg">
        <h1>AutoMuteUs Premium</h1>
        <p style={{ fontSize: "1.25em" }}>
          Looking to upgrade your Among Us gameplay even further? Running into
          limitations with the bot while it's under high load? Consider
          AutoMuteUs premium to support the project as well as improve your
          muting experience!
        </p>

        <div className="premium-guild-select">
          {session && (
            <Dropdown onSelect={handleGuildSelect}>
              <Dropdown.Toggle
                variant="dark"
                className="premium-guild-select-dropdown"
                dangerouslySetInnerHTML={{
                  __html:
                    !isLoading && !isError ? serverName : "Loading servers...",
                }}
                disabled={isLoading || isError}
              />

              <Dropdown.Menu>{guilds}</Dropdown.Menu>
            </Dropdown>
          )}

          {!session && (
            <div className="text-center">
              <span
                className="d-inline-block btn btn-primary m-2"
                onClick={() => signIn("discord")}
              >
                <FontAwesomeIcon icon={faDiscord} size="lg" className="mr-2" />
                Sign In
              </span>
              <strong>to get premium for your bot!</strong>
            </div>
          )}
        </div>

        <CardDeck className="mt-3 justify-content-center">
          <PremiumItem
            cardTitle="Bronze"
            accentColor="#71491e"
            buttonText="Get Bronze"
            paypalId="M8D39PF5ADGJW"
            guild_id={guild}
            image={crewmate_brown}
            price={
              <>
                <strong>US$1.50</strong> <small>/ month</small>
              </>
            }
            perks={{
              "Priority Game Access": <FontAwesomeIcon icon={faCheckCircle} />,
              "Stats and Leaderboards": (
                <FontAwesomeIcon icon={faCheckCircle} />
              ),
              "General Support": (
                <FontAwesomeIcon icon={faTimesCircle} className="text-muted" />
              ),
              "Priority Muting Bots": (
                <FontAwesomeIcon icon={faTimesCircle} className="text-muted" />
              ),
              "Premium Servers": (
                <FontAwesomeIcon icon={faTimesCircle} className="text-muted" />
              ),
            }}
          />
          <PremiumItem
            cardTitle="Silver"
            accentColor="#d6e0f0"
            buttonText="Get Silver"
            paypalId="CPZMEL7ZA6PHN"
            guild_id={guild}
            image={crewmate_white}
            price={
              <>
                <strong>US$3.50</strong> <small>/ month</small>
              </>
            }
            perks={{
              "Priority Game Access": <FontAwesomeIcon icon={faCheckCircle} />,
              "Stats and Leaderboards": (
                <FontAwesomeIcon icon={faCheckCircle} />
              ),
              "General Support": <FontAwesomeIcon icon={faCheckCircle} />,
              "Priority Muting Bots": (
                <>
                  <FontAwesomeIcon icon={faTimes} />
                  <strong className=""> 1</strong>
                </>
              ),
              "Premium Servers": (
                <FontAwesomeIcon icon={faTimesCircle} className="text-muted" />
              ),
            }}
          />
          <div className="w-100 d-none d-sm-block d-xl-none" />
          <PremiumItem
            cardTitle="Gold"
            accentColor="#ffd700"
            buttonText="Get Gold"
            paypalId="PYFCA7562KHB6"
            guild_id={guild}
            image={crewmate_yellow}
            price={
              <>
                <strong>US$5.50</strong> <small>/ month</small>
              </>
            }
            perks={{
              "Priority Game Access": <FontAwesomeIcon icon={faCheckCircle} />,
              "Stats and Leaderboards": (
                <FontAwesomeIcon icon={faCheckCircle} />
              ),
              "General Support": <FontAwesomeIcon icon={faCheckCircle} />,
              "Priority Muting Bots": (
                <>
                  <FontAwesomeIcon icon={faTimes} />
                  <strong className=""> 3</strong>
                </>
              ),
              "Premium Servers": (
                <>
                  <FontAwesomeIcon icon={faTimes} />
                  <strong className=""> 2</strong>
                </>
              ),
            }}
          />
          <PremiumItem
            cardTitle="Donation"
            accentColor="#38fedc"
            buttonText="Make Donation"
            paypalId="YM72RY5TF6WZU"
            guild_id={"donation"}
            image={crewmate_cyan}
            description={
              <div>
                <h6 className="text-blurple">Chip in any amount you wish ❤️</h6>
                <div>
                  You won't get any special bot privileges, but you will get our
                  thanks for making this Open Source project possible!
                </div>
              </div>
            }
          />
        </CardDeck>

        <h2 className="mb-3 mt-5">Premium Perks</h2>
        <div className="d-flex flex-row premium-perks">
          {current_perks.map((perk) => {
            return <PremiumPerk key={perk.perk} perk={perk} />;
          })}
        </div>
      </Container>
    </Layout>
  );
}

function PremiumPerk(props) {
  const { perk, description, icon } = props.perk;
  return (
    <Card className="text-center premium-perk-card">
      <Card.Body>
        <Card.Title>
          <div className="text-center text-premium">{icon}</div>
          <h5 className="text-blurple">{perk}</h5>
        </Card.Title>
        <Card.Text>{description}</Card.Text>
      </Card.Body>
    </Card>
  );
}

function PremiumItem(props) {
  const guild_target = props.guild_id ? "&custom=" + props.guild_id : "";
  const valid = validGuild(props.guild_id);

  return (
    <Card className="text-center shadow premium-card">
      <Card.Body>
        <Image src={props.image} />
        <Card.Title className="font-weight-bold font-family-title d-flex flex-row justify-content-center align-items-center">
          <span className="text-ellipsis">AutoMuteUs</span>{" "}
          <Badge
            style={{ backgroundColor: props.accentColor, color: "black" }}
            className="ml-2"
          >
            {props.cardTitle}
          </Badge>
        </Card.Title>
        <span
          title={
            !valid && props.guild_id !== "donation"
              ? "Please choose a server first"
              : ""
          }
          className={
            !valid && props.guild_id !== "donation" ? "disabled-wrap" : ""
          }
        >
          <Button
            variant="premium"
            size="sm"
            href={
              "https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=" +
              props.paypalId +
              guild_target
            }
            disabled={!valid && props.guild_id !== "donation"}
          >
            <FontAwesomeIcon icon={faPaypal} className="mr-2" />
            {props.buttonText}
          </Button>
        </span>
        {props.description && (
          <Card.Text as="div">{props.description}</Card.Text>
        )}
      </Card.Body>
      <ListGroup className="list-group-flush">
        {props.perks &&
          Object.entries(props.perks).map(([perk, val]) => {
            return (
              <ListGroupItem key={perk}>
                <div className="d-flex justify-content-between align-items-center">
                  <strong
                    className="d-inline mr-2 mb-0 font-family-title text-ellipsis"
                    title={perk}
                  >
                    {perk}
                  </strong>
                  <span className="text-success">{val}</span>
                </div>
              </ListGroupItem>
            );
          })}
      </ListGroup>
    </Card>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);

  return {
    props: { session },
  };
}

function validGuild(gid) {
  return !isNaN(gid) && gid !== 0 && gid.length >= 17 && gid.length <= 20;
}
