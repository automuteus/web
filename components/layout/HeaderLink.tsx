import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export interface Props {
    text: string;
    link: string;
    icon?: IconProp;
    newtab?: boolean;
    /** Carry the server being viewed (?guild=) along, so moving between the per-server pages keeps it selected. */
    keepGuild?: boolean;
}

export default function HeaderLink(props: Props): React.ReactElement {
    const router = useRouter();
    const guild = router.query.guild;
    const href = props.keepGuild && typeof guild === "string" && /^[0-9]{17,20}$/.test(guild)
        ? { pathname: props.link, query: { guild } }
        : props.link;

    return (
        <li
            className={`nav-item ${
                props.link === router.pathname ? "active" : ""
            }`}
        >
            <Link
                href={href}
                className="nav-link"
                target={props.newtab ? "_blank" : undefined}
                rel={props.newtab ? "noopener noreferrer" : undefined}
            >
                {props.icon && (
                    <FontAwesomeIcon
                        icon={props.icon}
                        fixedWidth
                        size="1x"
                        className="me-2"
                    />
                )}
                {props.text}
            </Link>
        </li>
    );
}
