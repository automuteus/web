import React from "react";
import Image from "next/image";

import { Navbar, Nav } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDiscord, faGithub } from "@fortawesome/free-brands-svg-icons";
import Link from "next/link";

import { signIn, signOut, useSession } from "next-auth/client";
import { faSignOutAlt } from "@fortawesome/free-solid-svg-icons";

export default function Header() {
  const [session, loading] = useSession();

  return (
    <Navbar bg="transparent" variant="dark" expand="lg">
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
        <Nav>
          {!session && (
            <>
              <Nav.Link onClick={() => signIn('discord')}>
                <FontAwesomeIcon icon={faDiscord} size="lg" className="mr-2" />
                Sign In
              </Nav.Link>
            </>
          )}
          {session && (
            <>
              <Navbar.Text>{session.user.email}</Navbar.Text>
              <Nav.Link onClick={signOut}>
                <FontAwesomeIcon
                  icon={faSignOutAlt}
                  size="lg"
                  className="mr-2"
                />
                Sign Out
              </Nav.Link>
            </>
          )}
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}
