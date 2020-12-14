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
        this.setState({ color: "#71491E", tierText: "Bronze subscription " });
        break;
      case "2":
        this.setState({ color: "#D6E0F0", tierText: "Silver subscription " });
        break;
      case "3":
        this.setState({ color: "#F6F658", tierText: "Gold subscription " });
        break;
      case "donor":
        this.setState({ color: "#38FEDC", tierText: "Donation" });
        break;
    }
  }

  componentDidMount() {
    this.getTier();
  }

  render() {
    return (
      console.log(this.state.tierText),
      (
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
                ? `🎉 Your ${this.state.tierText} was successful! ✨`
                : "（︶^︶）Seems like you didn't pay the price (* ￣︿￣)"}
            </h1>

            <Row lg={1} className="justify-content-center">
              {this.state.tierText && (
                <PaymentComplete
                  title="Instructions"
                  color={this.state.color}
                  footer={
                    <>
                      {" "}
                      <p style={{ lineHeight: "10px" }}>
                        Paypal will send a reciept to email linked to your
                        Paypal account soon!
                      </p>
                      <p style={{ lineHeight: "10px" }}>
                        {this.state.tierText == "Donation" ? (
                          ""
                        ) : (
                          <>
                            {" "}
                            This subscription may be canceled anytime on your{" "}
                            {
                              <a
                                href="https://www.paypal.com/myaccount/autopay/"
                                style={{ color: "#7289DA" }}
                              >
                                PayPal
                              </a>
                            }{" "}
                            account.{" "}
                            <p style={{ marginTop: "1.5em", color: "gray" }}>
                              <small>
                                This page does not qualify as evidence of
                                payment. Accessing this page will not trigger
                                any subscription.
                              </small>
                            </p>
                          </>
                        )}
                      </p>
                    </>
                  }
                >
                  <div>
                    <p style={{ textAlign: "center" }}>
                      {this.state.tierText == "Donation" ? (
                        "Keep being cool 😎"
                      ) : (
                        <>
                          {'Type '}
                          <code
                            style={{
                              color: "#7289DA",
                              backgroundColor: "black",
                              paddingRight: "5px",
                            }}
                          >
                            {this.state.tierText == "Donation"
                              ? ""
                              : ".au premium"}
                          </code>
                          {" in your server to check your premium status!"}{" "}
                        </>
                      )}
                    </p>
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
            <h3 style={{ fontSize: "0.75em" }} className="mb-4">
              {""}
            </h3>
          </div>
        </Layout>
      )
    );
  }
}

export default SuccessPayment;
