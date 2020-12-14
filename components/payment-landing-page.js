import React from "react";

import { Card, Col } from "react-bootstrap";

export default class PaymentComplete extends React.Component {
  render() {
    return (
      <Col className="mb-4">
        <Card
          className="text-center bg-dark text-white sub-card h-100"
          style={{ borderColor: this.props.color }}
        >
          <Card.Body>
            <Card.Title
              style={{
                justifyContent: "center",
                alignItems: "center",
                fontSize: "2.5em",
                color: this.props.color,
              }}
            >
              {this.props.title}
            </Card.Title>
            <Card.Text
              style={{ fontSize: "1.5em" }}
              className="text-left"
              as="div"
            >
              {this.props.children}
            </Card.Text>
          </Card.Body>
          <Card.Footer>
            <p>
              Paypal will send a reciept to email linked to your Paypal account soon!
              <br />
              This subscription can be canceled anytime on your{" "}
              <a href="https://paypal.com" style={{ color: "#7289DA" }}>PayPal</a> account.
            </p>
            <p>
              <small>
                This page does not qualify as evidence of payment. Accessing
                this page will not trigger any subscription.
              </small>
            </p>
          </Card.Footer>
        </Card>
      </Col>
    );
  }
}
