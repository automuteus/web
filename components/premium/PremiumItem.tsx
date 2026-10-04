import React, { useState } from "react";
import { faPaypal } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Modal, OverlayTrigger, Tooltip } from "react-bootstrap";
import { Trans, useTranslation } from "react-i18next";
import { popupCenter, validGuild } from "../../utils/functions";
import { PremiumItemPerk, usePerkText } from "./PremiumPerk";

/** Where PayPal sends the buyer afterwards: /premium/paid, which tells the premium page the checkout finished. */
export function checkoutReturnUrl(guildId: string | undefined, cancelled: boolean): string {
    const params = new URLSearchParams();
    if (guildId) params.set("guild", guildId);
    if (cancelled) params.set("cancelled", "1");
    const query = params.toString();
    return `${window.location.origin}/premium/paid${query ? "?" + query : ""}`;
}

/** The hosted button's checkout URL. custom carries the server; return and cancel_return bring the buyer back to
 * the site (rm=1: by GET, with no payment variables) instead of leaving them on PayPal's generic receipt. A donation
 * still names the server for the ledger, but the return page must not promise it premium. */
export function checkoutUrl(paypalId: string, guildId: string | undefined, donation = false): string {
    const params = new URLSearchParams({ cmd: "_s-xclick", hosted_button_id: paypalId, rm: "1" });
    if (guildId) params.set("custom", guildId);
    const watched = donation ? undefined : guildId;
    params.set("return", checkoutReturnUrl(watched, false));
    params.set("cancel_return", checkoutReturnUrl(watched, true));
    return `https://www.paypal.com/cgi-bin/webscr?${params}`;
}

export type PremiumCard = "bronze" | "silver" | "gold" | "donation";

/** A card as data/premium_items.tsx lists it; its text comes from the premium namespace. */
export interface PremiumItemData {
    card: PremiumCard;
    accentColor: string;
    paypalId: string;
    image: string;
    /** Shown as-is, e.g. "US$1.50"; the "/ month" around it is translated. */
    price?: string;
    perks?: Array<PremiumItemPerk>;
    /** The premium tier this card buys; absent for donations. */
    tier?: number;
}

export interface Props extends PremiumItemData {
    guildId?: number | string;
    /** Whether the selected server already has this tier active. */
    current?: boolean;
    /** Called as the buyer leaves for PayPal, so the page can watch for the server's premium to change. */
    onCheckout?: (guildId: string | undefined) => void;
}

export default function PremiumItem(props: Props): React.ReactElement {
    const { t } = useTranslation("premium");
    const perkText = usePerkText();
    // Asks before starting a second subscription for a tier the server already has.
    const [confirming, setConfirming] = useState(false);
    const guildId = props.guildId ? String(props.guildId) : undefined;
    const valid = validGuild(props.guildId);
    const isDonation = props.card === "donation";
    const disabled = !valid && !isDonation;

    const checkout = () => {
        setConfirming(false);
        // Only a tier purchase changes the server's premium, so a donation is nothing for the page to wait on.
        props.onCheckout?.(isDonation ? undefined : guildId);
        const url = checkoutUrl(props.paypalId, guildId, isDonation);
        // The popup's window name, not shown.
        const popup = popupCenter({ url, title: "AutoMuteUs Premium", w: 400, h: 600 });
        // Popup blocked: check out in this tab instead; /premium/paid then links back here.
        if (!popup) window.location.assign(url);
    };
    const cardTitle = {
        bronze: t("tier.bronze"),
        silver: t("tier.silver"),
        gold: t("tier.gold"),
        donation: t("card.donation.title"),
    }[props.card];
    const buttonText = {
        bronze: t("card.bronze.button"),
        silver: t("card.silver.button"),
        gold: t("card.gold.button"),
        donation: t("card.donation.button"),
    }[props.card];

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
                {props.price && (
                    <div className="mb-2" style={{ color: props.accentColor }}>
                        <Trans
                            t={t}
                            i18nKey="card.price"
                            values={{ price: props.price }}
                            components={{ strong: <strong />, small: <small /> }}
                        />
                    </div>
                )}

                <OverlayTrigger
                    placement="bottom"
                    overlay={
                        !isDonation ? (
                            <Tooltip id={`tooltip-${props.card}`}>
                                {disabled
                                    ? t("card.chooseServer")
                                    : t("card.serverId", { id: props.guildId })}
                            </Tooltip>
                        ) : (
                            <Tooltip id={`tooltip-${props.card}`}>
                                {t("card.donation.thanks")}
                            </Tooltip>
                        )
                    }
                >
                    <span className="d-inline-block">
                        <button
                            className="btn btn-premium btn-sm"
                            disabled={disabled}
                            style={disabled ? { pointerEvents: "none" } : {}}
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
                {isDonation && (
                    <div className="card-text">
                        <div>
                            <h6 className="text-blurple">{t("card.donation.heading")}</h6>
                            <div>{t("card.donation.description")}</div>
                        </div>
                    </div>
                )}
            </div>
            <ul className="list-group list-group-flush">
                {props.perks &&
                    props.perks.map((v: PremiumItemPerk) => {
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
