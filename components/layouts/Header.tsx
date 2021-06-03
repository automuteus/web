import React from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import {
  faBars,
  faCheckCircle,
  faCode,
  faGem,
  faHome,
  faSignOutAlt,
} from "@fortawesome/free-solid-svg-icons";

import { faDiscord, faGithub } from "@fortawesome/free-brands-svg-icons";
import { Navbar } from "react-bootstrap";

interface Props {
  theatric?: boolean;
}
interface HeaderLink {
  text: string;
  link: string;
  icon?: IconProp;
  newtab?: boolean;
}

const logo: string = "/assets/img/logo_animated_sm.gif";
const navs: Array<HeaderLink> = [
  {
    text: "Home",
    link: "/",
    icon: faHome,
  },
  {
    text: "Premium",
    link: "/premium",
    icon: faGem,
  },
  {
    text: "Commands",
    link: "/commands",
    icon: faCode,
  },
  {
    text: "GitHub",
    link: "https://github.com/denverquane/automuteus",
    icon: faGithub,
    newtab: true,
  },
  {
    text: "Support Server",
    link: "https://discord.gg/vwWXs8Z",
    icon: faDiscord,
    newtab: true,
  },
];

const dash: HeaderLink = {
  text: "Dashboard",
  link: "/dashboard",
};

const Header = (): React.ReactElement => {
  const [session, loading] = useSession();

  return (
    <Navbar as="header" className={`mb-3`} expand="lg">
      <div className="container-fluid">
        <div className="navbar-brand d-none d-lg-inline-block">
          <img
            src={logo}
            alt="AutoMuteUs logo"
            className="align-top"
            width="50"
            height="50"
          />
        </div>

        <Navbar.Toggle aria-controls="site-nav" className="border-0 text-light">
          <FontAwesomeIcon icon={faBars} />
        </Navbar.Toggle>

        <div className="navbar-nav flex-row align-items-center order-lg-2">
          {loading ? (
            <div className="navbar-text text-white">
              <div className="spinner-grow mr-2" role="status">
                <span className="invisible">Checking login...</span>
              </div>
            </div>
          ) : !session ? (
            <li className="nav-item">
              <div className="nav-link" onClick={() => signIn("discord")}>
                <FontAwesomeIcon icon={faDiscord} size="lg" className="mr-2" />
                <span className="d-none d-sm-inline-block">Sign In</span>
              </div>
            </li>
          ) : (
            <>
              <HeaderLink {...dash} />
              <div className="navbar-text user-logged-in">
                <img
                  src={session.user.image ?? "assets/img/discord_placeholder.png"}
                  alt={session.user.name ?? "No username"}
                  className="user-image mr-2"
                />
                <div className="user-details d-none d-sm-block">
                  <div className="user-name">
                    {session.user.name}
                    {session.user.verified && (
                      <FontAwesomeIcon className="ml-2" icon={faCheckCircle} />
                    )}
                  </div>
                  <small className="user-signout" onClick={() => signOut()}>
                    Sign Out
                  </small>
                </div>
                <div className="d-block d-sm-none">
                  <small className="user-signout" onClick={() => signOut()}>
                    <FontAwesomeIcon
                      size="lg"
                      className="ml-1"
                      icon={faSignOutAlt}
                    />
                  </small>
                </div>
              </div>
            </>
          )}
        </div>

        <Navbar.Collapse id="primary-navbar-nav" className="order-lg-1">
          <ul className="navbar-nav mr-auto mb-2 mb-lg-0">
            {navs.map((v) => (
              <HeaderLink key={v.link} {...v} />
            ))}
          </ul>
        </Navbar.Collapse>
      </div>
    </Navbar>
  );
};

const HeaderLink = (props: HeaderLink): React.ReactElement => {
  const router = useRouter();

  return (
    <li
      className={`nav-item ${props.link === router.pathname ? "active" : ""}`}
    >
      <Link href={props.link}>
        <a className="nav-link" target={props?.newtab ? "_blank" : ""}>
          {props.icon && (
            <FontAwesomeIcon
              icon={props.icon}
              fixedWidth
              size="1x"
              className="mr-2"
            />
          )}
          {props.text}
        </a>
      </Link>
    </li>
  );
};

export default Header;
