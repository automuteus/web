import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Spinner } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import AppLayout from "../layout/AppLayout";
import { CheckoutOutcome, loadCheckout } from "./checkout";
import { validGuild } from "../../utils/functions";

interface Props {
    outcome: CheckoutOutcome;
}

/** Where PayPal sends the buyer after checkout, in the same tab they left from. The server is named in the URL when
 * the link's own return URL was used, and otherwise comes from the checkout saved in this tab's sessionStorage; with
 * one known, the buyer goes straight on to the premium page, which shows the outcome and watches for the payment.
 * Only when no server can be found (storage cleared, or the URL typed) does the page itself say what happened. */
export default function CheckoutReturn({ outcome }: Props): React.ReactElement {
    const { t } = useTranslation("premium");
    const router = useRouter();
    // undefined until looked up; null when there is nothing to go on
    const [guild, setGuild] = useState<string | null>();

    useEffect(() => {
        if (!router.isReady) return;
        const fromQuery = typeof router.query.guild === "string" && validGuild(router.query.guild) ? router.query.guild : undefined;
        setGuild(fromQuery ?? loadCheckout()?.guild ?? null);
    }, [router.isReady, router.query.guild]);

    const query = guild ? { guild, ...(outcome === "paid" ? { paid: "1" } : outcome === "unknown" ? { returned: "1" } : {}) } : undefined;

    useEffect(() => {
        if (query) router.replace({ pathname: "/premium", query });
        // router is stable across renders; only the destination matters.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [guild, outcome]);

    const text = {
        paid: { heading: t("paid.heading"), body: t("paid.body") },
        cancelled: { heading: t("paid.cancelled.heading"), body: t("paid.cancelled.body") },
        unknown: { heading: t("paid.unknown.heading"), body: t("paid.unknown.body") },
    }[outcome];

    return (
        <AppLayout title={t("paid.title")} theatric>
            <div className="d-flex flex-column flex-grow-1 align-items-center justify-content-center text-center p-3">
                {guild === null ? (
                    <>
                        <h1>{text.heading}</h1>
                        <p className="subtitle">{text.body}</p>
                        <Link href="/premium">
                            <button className="btn btn-primary">
                                <FontAwesomeIcon icon={faArrowLeft} className="me-1" />{" "}
                                {t("paid.back")}
                            </button>
                        </Link>
                    </>
                ) : (
                    <Spinner animation="border" />
                )}
            </div>
        </AppLayout>
    );
}
