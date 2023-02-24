import { faDiscord, faGithub } from "@fortawesome/free-brands-svg-icons";
import {
    faBars,
    faBook, faCrown,
    faHome,
    faSignOutAlt
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { signIn, signOut, useSession } from "next-auth/react";
import React from "react";
import { Navbar } from "react-bootstrap";

// Local imports
import default_user from "../../public/images/discord_placeholder.png";
import site_logo from "../../public/images/logo_animated_sm.gif";
import HeaderLink, { Props as HeaderLinkProps } from "./HeaderLink";

const navs: Array<HeaderLinkProps> = [
    {
        text: "Home",
        link: "/",
        icon: faHome,
    },
    {
        text: "Premium",
        link: "/premium",
        icon: faCrown,
    },
    {
        text: "Docs",
        link: "/docs",
        icon: faBook,
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

export default function Header(): React.ReactElement {
    const { data: session, status } = useSession();

    let routeSection = (
        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            {navs.map((v) => (
                <HeaderLink key={v.link} {...v} />
            ))}
        </ul>
    );

    let userSection = null;

    if (status === "loading") {
        userSection = (
            <div className="navbar-text text-white">
                <div className="spinner-grow me-2" role="status">
                    <span className="invisible">Checking login...</span>
                </div>
            </div>
        );
    }

    if (!session) {
        userSection = (
            <li className="nav-item">
                <div className="nav-link" onClick={() => signIn("discord")}>
                    <FontAwesomeIcon
                        icon={faDiscord}
                        size="lg"
                        className="me-2"
                    />
                    <span className="d-none d-sm-inline-block">Sign In</span>
                </div>
            </li>
        );
    }

    if (session) {
        userSection = (
            <>
                {/* <HeaderLink {...dash} /> */}
                <div className="navbar-text user-logged-in">
                    <img
                        src={session.user.image ?? default_user.src}
                        alt={session.user.name ?? "<Unknown>"}
                        className="user-image me-2"
                    />
                    <div className="user-details d-none d-sm-block">
                        <div className="user-name">{session.user.name}</div>
                        <small
                            className="user-signout"
                            onClick={() => signOut()}
                        >
                            Sign Out
                        </small>
                    </div>
                    <div className="d-block d-sm-none">
                        <small
                            className="user-signout"
                            onClick={() => signOut()}
                        >
                            <FontAwesomeIcon
                                size="lg"
                                className="ms-1"
                                icon={faSignOutAlt}
                            />
                        </small>
                    </div>
                </div>
            </>
        );
    }

    return (
        <Navbar as="header" className={`mb-3`} expand="lg">
            <div className="container-fluid">
                <div className="navbar-brand ms-3 d-none d-lg-inline-block">
                    <img
                        src={site_logo.src}
                        alt="AutoMuteUs logo"
                        className="align-top"
                        width="50"
                        height="50"
                    />
                </div>

                <Navbar.Toggle
                    aria-controls="site-nav"
                    className="border-0 text-light"
                >
                    <FontAwesomeIcon icon={faBars} />
                </Navbar.Toggle>

                <div className="navbar-nav flex-row align-items-center order-lg-2">
                    {userSection}
                </div>

                <Navbar.Collapse id="primary-navbar-nav" className="order-lg-1">
                    {routeSection}
                </Navbar.Collapse>
            </div>
        </Navbar>
    );
}
