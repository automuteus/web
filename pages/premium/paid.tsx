import React from "react";
import { useRouter } from "next/router";
import CheckoutReturn from "../../components/premium/CheckoutReturn";
import { returnOutcome } from "../../components/premium/checkout";

/** The return URL checkoutUrl asks PayPal for: ?guild=<id>, plus cancelled=1 when the buyer backed out. Pointed at
 * from a button's own return URL instead, it arrives bare and the outcome is unknown. */
export default function PaidPage(): React.ReactElement {
    const router = useRouter();
    return <CheckoutReturn outcome={returnOutcome(router.query, "paid")} />;
}
