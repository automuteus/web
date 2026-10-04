import React from "react";
import { useRouter } from "next/router";
import CheckoutReturn from "../../components/premium/CheckoutReturn";

/** The return URL checkoutUrl asks PayPal for: ?guild=<id>, plus cancelled=1 when the buyer backed out. */
export default function PaidPage(): React.ReactElement {
    const router = useRouter();
    return <CheckoutReturn outcome={router.query.cancelled === "1" ? "cancelled" : "paid"} />;
}
