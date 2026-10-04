import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Spinner } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import AppLayout from "../layout/AppLayout";
import { CheckoutOutcome, CheckoutReport, checkoutChannel, loadCheckout } from "./checkout";
import { validGuild } from "../../utils/functions";

interface Props {
    outcome: CheckoutOutcome;
}

/** Where PayPal sends the buyer after checkout, when it sends them anywhere. The server is named in the URL when the
 * link's own return URL was used, and otherwise comes from the checkout saved in this tab's sessionStorage.
 *
 * PayPal normally ran in a second tab, so the premium page is still open in the first: this page reports the outcome
 * to it over a BroadcastChannel and tells the buyer this tab can go (closing it when the browser allows). When PayPal
 * took over the only tab instead, the buyer goes straight on to the premium page, which shows the outcome and
 * watches for the payment. Only with nothing to go on does the page itself say what happened. */
export default function CheckoutReturn({ outcome }: Props): React.ReactElement {
    const { t } = useTranslation("premium");
    const router = useRouter();
    // Resolved once the router has the query: where this tab stands.
    const [state, setState] = useState<{ guild?: string; tab: boolean }>();

    useEffect(() => {
        if (!router.isReady) return;
        const fromQuery = typeof router.query.guild === "string" && validGuild(router.query.guild) ? router.query.guild : undefined;
        const saved = loadCheckout();
        setState({ guild: fromQuery ?? saved?.guild, tab: saved?.tab === true });
    }, [router.isReady, router.query.guild]);

    useEffect(() => {
        if (!state) return;
        if (state.tab) {
            const report: CheckoutReport = { outcome, guild: state.guild };
            const channel = checkoutChannel();
            channel?.postMessage(report);
            channel?.close();
            window.close();
            return;
        }
        // A cancellation goes on even with no server known: there is nothing to wait for, only a checkout to forget.
        const query = outcome === "cancelled"
            ? { ...(state.guild ? { guild: state.guild } : {}), cancelled: "1" }
            : state.guild ? { guild: state.guild, ...(outcome === "paid" ? { paid: "1" } : { returned: "1" }) } : undefined;
        if (query) router.replace({ pathname: "/premium", query });
        // router is stable across renders; only the destination matters.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [state, outcome]);

    const text = {
        paid: { heading: t("paid.heading"), body: t("paid.body") },
        cancelled: { heading: t("paid.cancelled.heading"), body: t("paid.cancelled.body") },
        unknown: { heading: t("paid.unknown.heading"), body: t("paid.unknown.body") },
    }[outcome];
    // Redirecting: nothing to read. Otherwise the page speaks for itself, and in PayPal's tab says the other one has
    // the news.
    const redirecting = state && !state.tab && (state.guild || outcome === "cancelled");

    return (
        <AppLayout title={t("paid.title")} theatric>
            <div className="d-flex flex-column flex-grow-1 align-items-center justify-content-center text-center p-3">
                {!state || redirecting ? (
                    <Spinner animation="border" />
                ) : (
                    <>
                        <h1>{text.heading}</h1>
                        <p className="subtitle">{state.tab ? t("paid.closeTab") : text.body}</p>
                        {!state.tab && (
                            <Link href="/premium">
                                <button className="btn btn-primary">
                                    <FontAwesomeIcon icon={faArrowLeft} className="me-1" />{" "}
                                    {t("paid.back")}
                                </button>
                            </Link>
                        )}
                    </>
                )}
            </div>
        </AppLayout>
    );
}
