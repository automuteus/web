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
}

export default function HeaderLink(props: Props): React.ReactElement {
    const router = useRouter();

    return (
        <li
            className={`nav-item ${
                props.link === router.pathname ? "active" : ""
            }`}
        >
            <Link href={props.link}>
                <a className="nav-link" target={props?.newtab ? "_blank" : ""}>
                    {props.icon && (
                        <FontAwesomeIcon
                            icon={props.icon}
                            fixedWidth
                            size="1x"
                            className="me-2"
                        />
                    )}
                    {props.text}
                </a>
            </Link>
        </li>
    );
}
