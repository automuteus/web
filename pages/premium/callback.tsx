import React from "react";
import CheckoutReturn from "../../components/premium/CheckoutReturn";

/** The return URL set on the PayPal buttons themselves, which overrides the one checkoutUrl asks for. PayPal sends
 * payments and cancellations alike here (the old site's /premium/callback?tier=N) with nothing to tell them apart, so
 * the outcome is unknown until the server's premium changes. */
export default function CallbackPage(): React.ReactElement {
    return <CheckoutReturn outcome="unknown" />;
}
