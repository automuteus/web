import { faDirections } from "@fortawesome/free-solid-svg-icons";
import React from "react";

import Layout from "../../components/layout";

class PaymentComplete extends React.Component {
  render() {
    return (
      <Layout>
        <div style={{ flexDirection: "column", display: "flex", width: "100%", justifyContent: "center", alignItems: "center"}}>
          <h1>🎉 Your subscription was successful! ✨</h1>
          <p>You can check the status of your premium with ".au premium"</p>
        </div>
      </Layout>
    );
  }
}

export default PaymentComplete;
