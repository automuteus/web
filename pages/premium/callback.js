import React from "react";
import Head from "next/head";

import { Row, Button } from "react-bootstrap";

import PaymentComplete from "../../components/payment-landing-page";
import Layout from "../../components/layout";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGem } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";

class SuccessPayment extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      color: "red",
      tierText: false,
    };

    this.getTier = this.getTier.bind(this);
  }
  getTier() {
    const tier = new URL(window.location.href).searchParams.get("tier");
    switch (tier) {
      case "1":
        this.setState({ color: "#71491E", tierText: "Bronze" });
        break;
      case "2":
        this.setState({ color: "#D6E0F0", tierText: "Silver" });
        break;
      case "3":
        this.setState({ color: "#F6F658", tierText: "Gold" });
        break;
    }
    console.log(tier);
  }

  componentDidMount() {
    this.getTier();
  }

  render() {
    return (
      <Layout>
        <div
          className="text-center"
          style={{
            flexDirection: "column",
            display: "flex",
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Head>
            {/* HTML Meta Tags */}
            <title> {this.state.tierText ? "Thank You!" : "Oopsies"} </title>
          </Head>

          <h1 style={{ fontSize: "3em" }} className="mb-4">
            {this.state.tierText
              ? `🎉 Your ${this.state.tierText} subscription was successful! ✨`
              : "（︶^︶）Seems like you didn't pay the price (* ￣︿￣)"}
          </h1>

          <Row lg={1} className="justify-content-center">
            {this.state.tierText && (
              <PaymentComplete title="Instructions" color={this.state.color}>
                <div>
                  <ul>
                    <p>
                      Type{" "}
                      <code
                        style={{
                          color: "#7289DA",
                          backgroundColor: "black",
                        }}
                      >
                        .au premium
                      </code>{" "}
                      in your server to check your premium status!
                    </p>
                  </ul>
                </div>
              </PaymentComplete>
            )}
            {!this.state.tierText && (
              <Link href="/premium">
                <Button className="btn btn-premium btn-lg">
                  <FontAwesomeIcon icon={faGem} size="lg" className="mr-2" />
                  Our Premium Tiers
                </Button>
              </Link>
            )}
          </Row>
        </div>
      </Layout>
    );
  }
}

export default SuccessPayment;
