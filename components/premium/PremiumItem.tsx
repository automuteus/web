import React, { useState } from "react";
import { faPaypal } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Modal, OverlayTrigger, Tooltip } from "react-bootstrap";
import { Trans, useTranslation } from "react-i18next";
import { validGuild } from "../../utils/functions";
import { PremiumItemPerk, usePerkText } from "./PremiumPerk";

/** Where PayPal sends the buyer afterwards: /premium/paid, which tells the premium page the checkout finished. */
export function checkoutReturnUrl(guildId: string, cancelled: boolean): string {
    const params = new URLSearchParams({ guild: guildId });
    if (cancelled) params.set("cancelled", "1");
    return `${window.location.origin}/premium/paid?${params}`;
}

/** The hosted button's checkout URL. custom carries the server and, when someone is signed in, their Discord user ID
 * as "<server>:<user>", which PayPal repeats on every notification for the subscription so the payment listener can
 * record who bought it. return and cancel_return bring the buyer back to the site (rm=1: by GET, with no payment
 * variables) instead of leaving them on PayPal's generic receipt; they only apply when the button has no return URL
 * of its own in PayPal, which otherwise wins and names neither the server nor the outcome. */
export function checkoutUrl(paypalId: string, guildId: string, userId?: string): string {
    const custom = userId && validGuild(userId) ? `${guildId}:${userId}` : guildId;
    const params = new URLSearchParams({ cmd: "_s-xclick", hosted_button_id: paypalId, custom, rm: "1" });
    params.set("return", checkoutReturnUrl(guildId, false));
    params.set("cancel_return", checkoutReturnUrl(guildId, true));
    return `https://www.paypal.com/cgi-bin/webscr?${params}`;
}

export type PremiumCard = "bronze" | "silver" | "gold";

/** A card as data/premium_items.tsx lists it; its text comes from the premium namespace. */
export interface PremiumItemData {
    card: PremiumCard;
    accentColor: string;
    paypalId: string;
    image: string;
    /** Shown as-is, e.g. "US$1.50"; the "/ month" around it is translated. */
    price: string;
    perks: Array<PremiumItemPerk>;
    /** The premium tier this card buys. */
    tier: number;
}

export interface Props extends PremiumItemData {
    guildId?: number | string;
    /** The signed-in buyer's Discord user ID, recorded with the subscription. */
    userId?: string;
    /** Whether the selected server already has this tier active. */
    current?: boolean;
    /** Called as the buyer leaves for PayPal, so the page can watch for the server's premium to change. */
    onCheckout?: (guildId: string) => void;
}

export default function PremiumItem(props: Props): React.ReactElement {
    const { t } = useTranslation("premium");
    const perkText = usePerkText();
    // Asks before starting a second subscription for a tier the server already has.
    const [confirming, setConfirming] = useState(false);
    // Buying is only possible once a server is chosen.
    const guildId = validGuild(props.guildId) ? String(props.guildId) : undefined;
    const cardTitle = {
        bronze: t("tier.bronze"),
        silver: t("tier.silver"),
        gold: t("tier.gold"),
    }[props.card];
    const buttonText = {
        bronze: t("card.bronze.button"),
        silver: t("card.silver.button"),
        gold: t("card.gold.button"),
    }[props.card];

    const checkout = () => {
        setConfirming(false);
        if (!guildId) return;
        // Remembered (in sessionStorage) before leaving, so the return page and the premium page can pick up the
        // purchase in this same tab. PayPal runs here rather than in a popup: a popup cannot reliably reach the page
        // that opened it, or close itself, once PayPal has had it.
        props.onCheckout?.(guildId);
        window.location.assign(checkoutUrl(props.paypalId, guildId, props.userId));
    };

    return (
        <div className="card text-center shadow premium-card m-2">
            <div className="card-body">
                <img src={props.image} />
                <div className="card-title font-weight-bold font-family-title d-flex flex-row justify-content-center align-items-center">
                    {/* The product name stays as is; the badge carries the translated tier. */}
                    {/* i18next-instrument-ignore-next-line */}
                    <span className="text-ellipsis">AutoMuteUs</span>{" "}
                    <div
                        style={{
                            backgroundColor: props.accentColor,
                            color: "black",
                        }}
                        className="badge ms-2"
                    >
                        {cardTitle}
                    </div>
                </div>
                {props.current && <div className="text-success small mb-1">{t("card.current")}</div>}
                <div className="mb-2" style={{ color: props.accentColor }}>
                    <Trans
                        t={t}
                        i18nKey="card.price"
                        values={{ price: props.price }}
                        components={{ strong: <strong />, small: <small /> }}
                    />
                </div>

                <OverlayTrigger
                    placement="bottom"
                    overlay={
                        <Tooltip id={`tooltip-${props.card}`}>
                            {guildId ? t("card.serverId", { id: guildId }) : t("card.chooseServer")}
                        </Tooltip>
                    }
                >
                    <span className="d-inline-block">
                        <button
                            className="btn btn-premium btn-sm"
                            disabled={!guildId}
                            style={guildId ? {} : { pointerEvents: "none" }}
                            onClick={() => (props.current ? setConfirming(true) : checkout())}
                        >
                            <FontAwesomeIcon icon={faPaypal} className="me-2" />
                            {buttonText}
                        </button>
                    </span>
                </OverlayTrigger>
                <Modal show={confirming} onHide={() => setConfirming(false)} centered>
                    <Modal.Header className="bg-warning text-dark align-items-center justify-content-center">
                        <Modal.Title>{t("rebuy.title", { tier: cardTitle })}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body className="text-center">
                        <div>{t("rebuy.body", { tier: cardTitle })}</div>
                        <div className="mt-2">{t("rebuy.wait")}</div>
                    </Modal.Body>
                    <Modal.Footer className="align-items-center justify-content-center">
                        <Button variant="secondary" onClick={() => setConfirming(false)}>
                            {t("rebuy.keep")}
                        </Button>
                        <Button variant="warning" onClick={checkout}>
                            <FontAwesomeIcon icon={faPaypal} className="me-2" />
                            {t("rebuy.anyway")}
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
            <ul className="list-group list-group-flush">
                {props.perks.map((v: PremiumItemPerk) => {
                    return (
                        <li className="list-group-item" key={v.perk}>
                            <div className="d-flex justify-content-between align-items-center">
                                <strong
                                    className="d-inline me-2 mb-0 font-family-title text-light text-ellipsis py-1"
                                    title={perkText[v.perk].title}
                                >
                                    {perkText[v.perk].title}
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
