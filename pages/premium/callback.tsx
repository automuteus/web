import React from "react";
import { useRouter } from "next/router";
import CheckoutReturn from "../../components/premium/CheckoutReturn";
import { returnOutcome } from "../../components/premium/checkout";

/** The old site's return URL (/premium/callback?tier=N), still set on PayPal buttons. PayPal sends payments and
 * cancellations alike here with nothing to tell them apart, so the outcome is unknown until the server's premium
 * changes. */
export default function CallbackPage(): React.ReactElement {
    const router = useRouter();
    return <CheckoutReturn outcome={returnOutcome(router.query, "unknown")} />;
}
