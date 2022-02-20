import React from "react";
import { faPaypal } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { popupCenter, validGuild } from "../../utils/functions";
import { PremiumItemPerk } from "./PremiumPerk";

export interface Props {
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

export default function PremiumItem(props: Props): React.ReactElement {
    const guild_target = props.guildId ? "&custom=" + props.guildId : "";
    const valid = validGuild(props.guildId);
    const isDonation = props.cardTitle.toLowerCase() === "donation";
    const disabled = !valid && !isDonation;

    return (
        <div className="card text-center shadow premium-card m-2">
            <div className="card-body">
                <img src={props.image} />
                <div className="card-title font-weight-bold font-family-title d-flex flex-row justify-content-center align-items-center">
                    <span className="text-ellipsis">AutoMuteUs</span>{" "}
                    <div
                        style={{
                            backgroundColor: props.accentColor,
                            color: "black",
                        }}
                        className="badge ms-2"
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
                            <Tooltip id={`tooltip-${props.cardTitle}`}>
                                Thank you! ♥
                            </Tooltip>
                        )
                    }
                >
                    <span className="d-inline-block">
                        <button
                            className="btn btn-premium btn-sm"
                            disabled={disabled}
                            style={disabled ? { pointerEvents: "none" } : {}}
                            onClick={() =>
                                popupCenter({
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
                            <FontAwesomeIcon icon={faPaypal} className="me-2" />
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
                                        className="d-inline me-2 mb-0 font-family-title text-light text-ellipsis py-1"
                                        title={v.key}
                                    >
                                        {v.key}
                                    </strong>
                                    <span className="text-success">
                                        {v.value}
                                    </span>
                                </div>
                            </li>
                        );
                    })}
            </ul>
        </div>
    );
}
