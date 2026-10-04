import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTranslation } from "react-i18next";
import AppLayout from "../layout/AppLayout";
import { CHECKOUT_MESSAGE, CheckoutMessage, CheckoutOutcome, loadCheckout } from "./checkout";
import { validGuild } from "../../utils/functions";

interface Props {
    /** paid or cancelled when the URL says so (/premium/paid); unknown for the buttons' own return URL. */
    outcome: CheckoutOutcome;
}

/** Where PayPal sends the buyer after checkout. Normally this is the popup the premium page opened: it tells that page
 * the checkout finished and closes. When there is no opener (the popup was blocked and PayPal ran in the tab itself),
 * it stands on its own and links back to the premium page, which carries on from the query it is given. */
export default function CheckoutReturn({ outcome }: Props): React.ReactElement {
    const { t } = useTranslation("premium");
    const router = useRouter();
    const fromQuery = typeof router.query.guild === "string" && validGuild(router.query.guild) ? router.query.guild : undefined;
    // Without a server in the URL, the checkout this tab (or the window that opened it) started names one.
    const [guild, setGuild] = useState<string>();
    useEffect(() => {
        if (!router.isReady) return;
        setGuild(fromQuery ?? loadCheckout()?.guild);
    }, [router.isReady, fromQuery]);

    useEffect(() => {
        if (!router.isReady) return;
        const opener: Window | null = window.opener;
        if (!opener || opener.closed) return;
        const message: CheckoutMessage = { type: CHECKOUT_MESSAGE, guild: fromQuery, outcome };
        // Delivered only to our own origin; an opener that went elsewhere simply never hears it.
        opener.postMessage(message, window.location.origin);
        window.close();
    }, [router.isReady, fromQuery, outcome]);

    const query = { guild, ...(outcome === "paid" ? { paid: "1" } : outcome === "unknown" ? { returned: "1" } : {}) };
    const back = guild ? { pathname: "/premium", query } : "/premium";
    const text = {
        paid: { heading: t("paid.heading"), body: t("paid.body") },
        cancelled: { heading: t("paid.cancelled.heading"), body: t("paid.cancelled.body") },
        unknown: { heading: t("paid.unknown.heading"), body: t("paid.unknown.body") },
    }[outcome];

    return (
        <AppLayout title={t("paid.title")} theatric>
            <div className="d-flex flex-column flex-grow-1 align-items-center justify-content-center text-center p-3">
                <h1>{text.heading}</h1>
                <p className="subtitle">{text.body}</p>
                <Link href={back}>
                    <button className="btn btn-primary">
                        <FontAwesomeIcon icon={faArrowLeft} className="me-1" />{" "}
                        {t("paid.back")}
                    </button>
                </Link>
            </div>
        </AppLayout>
    );
}
