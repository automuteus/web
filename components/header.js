import React from "react";
import Image from "next/image";

import { Navbar, Nav } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDiscord, faGithub } from "@fortawesome/free-brands-svg-icons";
import Link from "next/link";

import { signIn, signOut, useSession } from "next-auth/client";
import {
  faCheckCircle,
  faTachometerAlt,
} from "@fortawesome/free-solid-svg-icons";
import styles from "./header.module.css";

export default function Header() {
  const [session, loading] = useSession();

  // console.log(session);

  return (
    <Navbar
      as="header"
      variant="dark"
      expand="lg"
      className={`${styles.header}`}
    >
      <Navbar.Toggle aria-controls="primary-navbar-nav" />
      <Navbar.Brand>
        <Link href="/" passHref>
          <a>
            <img
              src="/assets/img/logo_embed.png"
              className="d-inline-block align-top"
              alt="AutoMuteUs"
              width="50"
              height="50"
            />
          </a>
        </Link>
      </Navbar.Brand>
      <Navbar.Collapse id="primary-navbar-nav">
        <Nav className="mr-auto">
          <Nav.Link href="https://discord.gg/vwWXs8Z" target="_blank">
            Discord Support Server
          </Nav.Link>
          <Nav.Link href="https://github.com/denverquane/automuteus#commands">
            Commands
          </Nav.Link>
          <Nav.Link href="https://youtu.be/kO4cqMKV2yI">Tutorials</Nav.Link>
          <Nav.Link
            href="https://github.com/denverquane/automuteus"
            target="_blank"
          >
            <FontAwesomeIcon icon={faGithub} size="lg" className="mr-2" />
            GitHub
          </Nav.Link>
        </Nav>
        <hr className="d-lg-none border border-white" />
        <Nav className="align-items-lg-center">
          {loading && <Navbar.Text>Checking login...</Navbar.Text>}
          {!loading && !session && (
            <Nav.Link
              onClick={() =>
                signIn("discord", {
                  callbackUrl: "http://localhost:3000/dashboard",
                })
              }
            >
              <FontAwesomeIcon icon={faDiscord} size="lg" className="mr-2" />
              Sign In
            </Nav.Link>
          )}
          {!loading && session && (
            <>
              <Link href="/dashboard" passHref>
                <Nav.Link>Dashboard</Nav.Link>
              </Link>
              <Navbar.Text as="div" className="user-logged-in">
                <img
                  src={session.user.image}
                  alt={session.user.name}
                  className="user-image mr-2"
                />
                <div className="user-details">
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
      </Navbar.Collapse>
    </Navbar>
  );
}
