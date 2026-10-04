import React, { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTranslation } from "react-i18next";
import AppLayout from "../../components/layout/AppLayout";
import { CHECKOUT_MESSAGE, CheckoutMessage } from "../../components/premium/checkout";
import { validGuild } from "../../utils/functions";

/** Where PayPal sends the buyer after checkout (see checkoutUrl). Normally this is the popup the premium page opened:
 * it tells that page the checkout finished and closes. When there is no opener (the popup was blocked and PayPal ran
 * in the tab itself), it stands on its own and links back to the premium page, which carries on from ?paid=1. */
export default function PaidPage(): React.ReactElement {
    const { t } = useTranslation("premium");
    const router = useRouter();
    const guild = typeof router.query.guild === "string" && validGuild(router.query.guild) ? router.query.guild : undefined;
    const cancelled = router.query.cancelled === "1";

    useEffect(() => {
        if (!router.isReady) return;
        const opener: Window | null = window.opener;
        if (!opener || opener.closed) return;
        const message: CheckoutMessage = { type: CHECKOUT_MESSAGE, guild, cancelled };
        // Delivered only to our own origin; an opener that went elsewhere simply never hears it.
        opener.postMessage(message, window.location.origin);
        window.close();
    }, [router.isReady, guild, cancelled]);

    const back = guild ? { pathname: "/premium", query: cancelled ? { guild } : { guild, paid: "1" } } : "/premium";
    const heading = cancelled ? t("paid.cancelled.heading") : guild ? t("paid.heading") : t("paid.donation.heading");
    const body = cancelled ? t("paid.cancelled.body") : guild ? t("paid.body") : t("paid.donation.body");

    return (
        <AppLayout title={t("paid.title")} theatric>
            <div className="d-flex flex-column flex-grow-1 align-items-center justify-content-center text-center p-3">
                <h1>{heading}</h1>
                <p className="subtitle">{body}</p>
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
