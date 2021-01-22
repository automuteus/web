import React from "react";
import { useRouter } from "next/router";

import { Navbar, Nav } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faDiscord,
  faGithub,
  faYoutube,
} from "@fortawesome/free-brands-svg-icons";
import Link from "next/link";

import { signIn, signOut, useSession } from "next-auth/client";
import {
  faCheckCircle,
  faCode,
  faHome,
  faTachometerAlt,
} from "@fortawesome/free-solid-svg-icons";
import styles from "./header.module.css";

const site_logo = "/assets/img/logo_animated_sm.gif";

export default function Header() {
  const router = useRouter();
  const [session, loading] = useSession();

  return (
    <Navbar
      as="header"
      variant="dark"
      expand="lg"
      className={`${styles.header}`}
    >
      <Navbar.Toggle aria-controls="primary-navbar-nav" />
      <Navbar.Brand className="d-none d-lg-inline-block">
        <img
          src={site_logo}
          className="align-top"
          alt="AutoMuteUs"
          width="50"
          height="50"
        />
      </Navbar.Brand>
      <Nav className="align-items-center flex-row order-lg-2">
        {loading && <Navbar.Text>Checking login...</Navbar.Text>}
        {!loading && !session && (
          <Nav.Link onClick={() => signIn("discord")}>
            <FontAwesomeIcon icon={faDiscord} size="lg" className="mr-2" />
            <span className="d-none d-sm-inline-block">Sign In</span>
          </Nav.Link>
        )}
        {!loading && session && (
          <>
            <Link href="/dashboard" passHref>
              <Nav.Link>
                <span className="d-block d-sm-none mr-1">
                  <FontAwesomeIcon
                    size="lg"
                    icon={faTachometerAlt}
                    className=""
                  />
                </span>
                <span className="d-none d-sm-block mr-1">Dashboard </span>
              </Nav.Link>
            </Link>
            <Navbar.Text as="div" className="user-logged-in">
              <img
                src={
                  session.user.image !== ""
                    ? session.user.image
                    : "https://upload.wikimedia.org/wikipedia/commons/9/90/Discord-512.webp"
                }
                alt={session.user.name}
                className="user-image mr-2"
              />
              <div className="user-details d-none d-sm-block">
                <div className="user-name">
                  {session.user.name}
                  {session.user.verified && (
                    <FontAwesomeIcon className="ml-2" icon={faCheckCircle} />
                  )}
                </div>
                <small className="user-signout" onClick={signOut}>
                  Sign Out
                </small>
              </div>
            </Navbar.Text>
          </>
        )}
      </Nav>

      <Navbar.Collapse id="primary-navbar-nav order-lg-1">
        <Nav className="mr-auto">
          {router.pathname !== "/" && (
            <Link href="/" passHref>
              <Nav.Link>
                <FontAwesomeIcon icon={faHome} fixedWidth className="mr-2" />
                Home
              </Nav.Link>
            </Link>
          )}
          <Nav.Link href="https://discord.gg/vwWXs8Z" target="_blank">
            <FontAwesomeIcon icon={faDiscord} fixedWidth className="mr-2" />
            Support Server
          </Nav.Link>
          <Link href="/commands" passHref>
            <Nav.Link>
              <FontAwesomeIcon icon={faCode} fixedWidth className="mr-2" />
              Commands
            </Nav.Link>
          </Link>
          <Nav.Link href="https://youtu.be/kO4cqMKV2yI">
            <FontAwesomeIcon icon={faYoutube} fixedWidth className="mr-2" />
            Tutorials
          </Nav.Link>
          <Nav.Link
            href="https://github.com/denverquane/automuteus"
            target="_blank"
          >
            <FontAwesomeIcon icon={faGithub} fixedWidth className="mr-2" />
            GitHub
          </Nav.Link>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}
