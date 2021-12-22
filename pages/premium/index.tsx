import React, { useEffect, useState } from "react";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import { useRouter } from "next/router";
import { Button, Modal, OverlayTrigger, Tooltip } from "react-bootstrap";

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
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const crewmate_brown = "/assets/img/svg/crewmate_brown.svg";
const crewmate_white = "/assets/img/svg/crewmate_white.svg";
const crewmate_yellow = "/assets/img/svg/crewmate_yellow.svg";
const crewmate_cyan = "/assets/img/svg/crewmate_cyan.svg";

import Layout from "../../components/layouts/MainLayout";
import { Guild } from "../../utils/interfaces";
import * as util from "../../utils/functions";
import GuildSelect from "../../components/dashboard/GuildSelect";
import { Session } from "next-auth";
import useUserGuilds from "../../components/hooks/useUserGuilds";
interface Props {
  session: Session;
}

const PremiumPage = ({ session }: Props) => {
  const router = useRouter();
  const [guild, setGuild] = useState<string>();
  const [open, setOpen] = useState<boolean>(false);
  const guildQuery = session ? useUserGuilds(session) : null;
  let guilds: Guild[] = [];

  useEffect(() => {
    if (router.query.guild && util.validGuild(router.query.guild)) {
      setOpen(true);
      setGuild(router.query.guild as string);
    }
  }, [router.query.guild]);

  const handleGuildSelect = (key: any) => {
    router.push({
      query: {},
    });

    setGuild(key);
  };

  const closeModal = () => setOpen(false);

  if (guildQuery && guildQuery.isSuccess) guilds = guildQuery.data;

  return (
    <Layout>
      <div className="container pb-4">
        <div className="d-block d-md-flex align-items-center justify-content-between">
          <h1>AutoMuteUs Premium</h1>
          {session && guildQuery && (
            <GuildSelect
              guilds={guilds}
              loading={guildQuery.isLoading}
              error={guildQuery.isError}
              onSelect={handleGuildSelect}
            />
          )}
        </div>
        <div className="subtitle">
          Looking to upgrade your Among Us gameplay even further? Running into
          limitations with the bot while it's under high load? Consider
          AutoMuteUs premium to support the project as well as improve your
          muting experience!
        </div>

        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-2 row-cols-xl-4 g-3 mt-4 mb-3 justify-content-center">
          {premium_items.map((item) => {
            return (
              <PremiumItem key={item.paypalId} {...item} guildId={guild} />
            );
          })}
        </div>

        <div className="cancel-notice text-center">
          <h6 className="text-danger">Looking to cancel?</h6>
          <div>
            As per the email you received on purchase, you can{" "}
            <a
              href="https://cancelprem.automute.us/"
              target="_blank"
              className="intense"
            >
              manage your subscriptions via PayPal.
            </a>
            <br />
            If you checked out with a PayPal guest account, or otherwise need
            help,{" "}
            <a
              href="https://forms.gle/pSy1GkUtQwZKdcNEA"
              target="_blank"
              className="intense"
            >
              please use this form.
            </a>
          </div>
        </div>

        <h2 className="text-center">Premium Perks</h2>

        <div className="d-flex flex-row premium-perks">
          {current_perks.map((perk) => {
            return <PremiumPerk key={perk.perk} {...perk} />;
          })}
        </div>
      </div>

      <Modal
        show={open}
        onHide={closeModal}
        backdrop="static"
        centered
        keyboard={false}
      >
        <Modal.Header className="bg-danger align-items-center justify-content-center">
          <Modal.Title>Server ID Pre-selected</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          The server ID you've selected is:
          <div className="text-center p-2" style={{ fontSize: "1.25rem" }}>
            <kbd className="bg-light text-dark">{guild}</kbd>
          </div>
          <div>
            <strong>
              Please confirm that this is the server you want selected!
            </strong>
          </div>
          <div>
            If you'd prefer a different server, sign in and select from your
            joined servers list.
          </div>
          <small>
            <a
              href="https://support.discord.com/hc/en-us/articles/206346498-Where-can-I-find-my-User-Server-Message-ID-"
              target="_blank"
            >
              How do I find my server ID?
            </a>
          </small>
        </Modal.Body>
        <Modal.Footer className="align-items-center justify-content-center">
          <Button variant="danger" onClick={closeModal}>
            Confirm Server ID
          </Button>
        </Modal.Footer>
      </Modal>
    </Layout>
  );
};

const PremiumPerk = (props: {
  perk: string;
  description: string;
  icon: React.ReactFragment;
}): React.ReactElement => {
  const { perk, description, icon } = props;
  return (
    <div className="card text-center premium-perk-card">
      <div className="card-body">
        <div className="card-title">
          <div className="text-center text-premium">{icon}</div>
          <h5 className="text-blurple">{perk}</h5>
        </div>
        <div className="card-text">{description}</div>
      </div>
    </div>
  );
};

const PremiumItem = (props: PremiumItem) => {
  const guild_target = props.guildId ? "&custom=" + props.guildId : "";
  const valid = util.validGuild(props.guildId);
  const isDonation = props.cardTitle.toLowerCase() === "donation";
  const disabled = !valid && !isDonation;

  return (
    <div className="card text-center shadow premium-card m-2">
      <div className="card-body">
        <img src={props.image} />
        <div className="card-title font-weight-bold font-family-title d-flex flex-row justify-content-center align-items-center">
          <span className="text-ellipsis">AutoMuteUs</span>{" "}
          <div
            style={{ backgroundColor: props.accentColor, color: "black" }}
            className="badge ml-2"
          >
            {props.cardTitle}
          </div>
        </div>
        {props.price && (
          <div className="mb-2" style={{ color: props.accentColor }}>
            {props.price}
          </div>
        )}

        <OverlayTrigger
          placement="bottom"
          overlay={
            !isDonation ? (
              <Tooltip id={`tooltip-${props.cardTitle}`}>
                {disabled
                  ? "Please choose a server first"
                  : `Server ID: ${props.guildId}`}
              </Tooltip>
            ) : (
              <Tooltip id={`tooltip-${props.cardTitle}`}>Thank you! ♥</Tooltip>
            )
          }
        >
          <span className="d-inline-block">
            <button
              className="btn btn-premium btn-sm"
              disabled={disabled}
              style={disabled ? { pointerEvents: "none" } : {}}
              onClick={() =>
                util.popupCenter({
                  url:
                    "https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=" +
                    props.paypalId +
                    guild_target,
                  title: "AutoMuteUs Premium",
                  w: 400,
                  h: 600,
                })
              }
            >
              <FontAwesomeIcon icon={faPaypal} className="mr-2" />
              {props.buttonText}
            </button>
          </span>
        </OverlayTrigger>
        {props.description && (
          <div className="card-text">{props.description}</div>
        )}
      </div>
      <ul className="list-group list-group-flush">
        {props.perks &&
          props.perks.map((v: PremiumItemPerk) => {
            return (
              <li className="list-group-item" key={v.key}>
                <div className="d-flex justify-content-between align-items-center">
                  <strong
                    className="d-inline mr-2 mb-0 font-family-title text-light text-ellipsis py-1"
                    title={v.key}
                  >
                    {v.key}
                  </strong>
                  <span className="text-success">{v.value}</span>
                </div>
              </li>
            );
          })}
      </ul>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);
  return {
    props: { session },
  };
};

export default PremiumPage;

interface PremiumItem {
  cardTitle: string;
  accentColor: string;
  buttonText: string;
  paypalId: string;
  image: string;
  price?: React.ReactFragment;
  description?: React.ReactFragment;
  perks?: Array<PremiumItemPerk>;
  guildId?: number | string;
}

interface PremiumItemPerk {
  key: string;
  value: React.ReactElement;
}

const premium_items: Array<PremiumItem> = [
  {
    cardTitle: "Bronze",
    accentColor: "#71491e",
    buttonText: "Get Bronze",
    paypalId: "M8D39PF5ADGJW",
    image: crewmate_brown,
    price: (
      <>
        <strong>US$1.50</strong> <small>/ month</small>
      </>
    ),
    perks: [
      {
        key: "Priority Game Access",
        value: <FontAwesomeIcon icon={faCheckCircle} />,
      },
      {
        key: "Stats and Leaderboards",
        value: <FontAwesomeIcon icon={faCheckCircle} />,
      },
      {
        key: "Premium Support",
        value: <FontAwesomeIcon icon={faTimesCircle} className="text-muted" />,
      },
      {
        key: "Priority Muting Bots",
        value: <FontAwesomeIcon icon={faTimesCircle} className="text-muted" />,
      },
      {
        key: "Premium Servers",
        value: <FontAwesomeIcon icon={faTimesCircle} className="text-muted" />,
      },
    ],
  },
  {
    cardTitle: "Silver",
    accentColor: "#d6e0f0",
    buttonText: "Get Silver",
    paypalId: "CPZMEL7ZA6PHN",
    image: crewmate_white,
    price: (
      <>
        <strong>US$3.50</strong> <small>/ month</small>
      </>
    ),
    perks: [
      {
        key: "Priority Game Access",
        value: <FontAwesomeIcon icon={faCheckCircle} />,
      },
      {
        key: "Stats and Leaderboards",
        value: <FontAwesomeIcon icon={faCheckCircle} />,
      },
      {
        key: "Premium Support",
        value: <FontAwesomeIcon icon={faCheckCircle} />,
      },
      {
        key: "Priority Muting Bots",
        value: (
          <>
            <FontAwesomeIcon icon={faTimes} />
            <strong> 1</strong>
          </>
        ),
      },
      {
        key: "Premium Servers",
        value: <FontAwesomeIcon icon={faTimesCircle} className="text-muted" />,
      },
    ],
  },
  {
    cardTitle: "Gold",
    accentColor: "#ffd700",
    buttonText: "Get Gold",
    paypalId: "PYFCA7562KHB6",
    image: crewmate_yellow,
    price: (
      <>
        <strong>US$5.50</strong> <small>/ month</small>
      </>
    ),
    perks: [
      {
        key: "Priority Game Access",
        value: <FontAwesomeIcon icon={faCheckCircle} />,
      },
      {
        key: "Stats and Leaderboards",
        value: <FontAwesomeIcon icon={faCheckCircle} />,
      },
      {
        key: "Premium Support",
        value: <FontAwesomeIcon icon={faCheckCircle} />,
      },
      {
        key: "Priority Muting Bots",
        value: (
          <>
            <FontAwesomeIcon icon={faTimes} />
            <strong> 3</strong>
          </>
        ),
      },
      {
        key: "Premium Servers",
        value: (
          <>
            <FontAwesomeIcon icon={faTimes} />
            <strong className=""> 2</strong>
          </>
        ),
      },
    ],
  },
  {
    cardTitle: "Donation",
    accentColor: "#38fedc",
    buttonText: "Make Donation",
    paypalId: "YM72RY5TF6WZU",
    image: crewmate_cyan,
    description: (
      <div>
        <h6 className="text-blurple">Chip in any amount you wish ❤️</h6>
        <div>
          You won't get any special bot privileges, but you will get our thanks
          for making this Open Source project possible!
        </div>
      </div>
    ),
  },
];

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
    perk: "Premium Support",
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
